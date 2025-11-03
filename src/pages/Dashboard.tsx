import React, { useState, useMemo, useEffect } from 'react';
import { useFinanzas } from '../context/FinanzasContext';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { AlertaNotification } from '../components/ui/AlertaNotification';
import { IngresoForm } from '../features/ingresos/IngresoForm';
import { GastoForm } from '../features/gastos/GastoForm';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDateShort } from '../utils/dateUtils';
import { Plus, TrendingUp, TrendingDown, Wallet, Trash2, Target, PiggyBank } from 'lucide-react';
import * as Icons from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { ingresos, gastos, deleteIngreso, deleteGasto } = useFinanzas();
  const [modalType, setModalType] = useState<'ingreso' | 'gasto' | null>(null);
  const [mostrarBienvenida, setMostrarBienvenida] = useState(false);
  const [mostrarAlertas, setMostrarAlertas] = useState(true);

  // Cargar estado de bienvenida específico por usuario
  useEffect(() => {
    if (user?.id) {
      const key = `finanzas_bienvenida_vista_${user.id}`;
      const yaVisto = localStorage.getItem(key);
      setMostrarBienvenida(!yaVisto);
    }
  }, [user?.id]);

  // Calcular totales mensuales
  const totales = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const ingresosMes = ingresos.filter((ing) => {
      const fecha = new Date(ing.fecha);
      return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
    });

    const gastosMes = gastos.filter((gasto) => {
      const fecha = new Date(gasto.fecha);
      return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
    });

    const totalIngresos = ingresosMes.reduce((sum, i) => sum + i.monto, 0);
    const totalGastos = gastosMes.reduce((sum, g) => sum + g.monto, 0);
    const balance = totalIngresos - totalGastos;
    const porcentajeGastado = totalIngresos > 0 ? (totalGastos / totalIngresos) * 100 : 0;

    return { totalIngresos, totalGastos, balance, porcentajeGastado };
  }, [ingresos, gastos]);

  // Gastos por categoría
  const gastosPorCategoria = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const gastosMes = gastos.filter((gasto) => {
      const fecha = new Date(gasto.fecha);
      return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
    });

    const grouped = gastosMes.reduce((acc, gasto) => {
      const catNombre = gasto.categorias?.nombre || 'Otro';
      if (!acc[catNombre]) {
        acc[catNombre] = { total: 0, count: 0 };
      }
      acc[catNombre].total += gasto.monto;
      acc[catNombre].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    return Object.entries(grouped)
      .map(([nombre, data]) => ({ nombre, ...data }))
      .sort((a, b) => b.total - a.total);
  }, [gastos]);

  // Transacciones recientes (últimas 10)
  const transaccionesRecientes = useMemo(() => {
    const todas = [
      ...ingresos.map((i) => ({ ...i, tipo: 'ingreso' as const })),
      ...gastos.map((g) => ({ ...g, tipo: 'gasto' as const })),
    ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    return todas.slice(0, 10);
  }, [ingresos, gastos]);

  const cerrarBienvenida = () => {
    if (user?.id) {
      const key = `finanzas_bienvenida_vista_${user.id}`;
      localStorage.setItem(key, 'true');
    }
    setMostrarBienvenida(false);
  };

  const handleDelete = async (tipo: 'ingreso' | 'gasto', id: string) => {
    if (window.confirm(`¿Estás seguro de eliminar este ${tipo}?`)) {
      try {
        if (tipo === 'ingreso') {
          await deleteIngreso(id);
        } else {
          await deleteGasto(id);
        }
      } catch (error) {
        console.error(`Error deleting ${tipo}:`, error);
      }
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Bienvenida */}
      {mostrarBienvenida && (
        <Card className="bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white border-0 shadow-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-white/10"></div>
          <div className="p-6 md:p-8 relative">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold mb-3 flex items-center gap-2">
                  ¡Bienvenido a MiFinanzas!
                  <span className="text-3xl">💰</span>
                </h2>
                <p className="text-blue-50 text-sm md:text-base mb-6 max-w-2xl">
                  Tu compañero para gestionar tus finanzas personales de manera simple y efectiva. 
                  Controla gastos, registra ingresos y analiza tu situación financiera.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm md:text-base">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Target className="flex-shrink-0" size={20} />
                    </div>
                    <span className="font-medium">Controla gastos</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <PiggyBank className="flex-shrink-0" size={20} />
                    </div>
                    <span className="font-medium">Registra ingresos</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <TrendingUp className="flex-shrink-0" size={20} />
                    </div>
                    <span className="font-medium">Analiza finanzas</span>
                  </div>
                </div>
              </div>
              <button
                onClick={cerrarBienvenida}
                className="text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all text-sm font-semibold backdrop-blur-sm border border-white/30 hover:scale-105"
              >
                Entendido
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Notificaciones de alertas próximas */}
      {mostrarAlertas && (
        <AlertaNotification onDismiss={() => setMostrarAlertas(false)} />
      )}

      {/* Resumen financiero */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <div className="p-4 md:p-6 bg-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600 font-medium">Ingresos Mensuales</span>
              <div className="p-2.5 bg-emerald-100 rounded-lg">
                <TrendingUp size={20} className="text-emerald-600" />
              </div>
            </div>
            <p className="text-3xl md:text-4xl font-bold text-emerald-600">
              {formatCurrency(totales.totalIngresos)}
            </p>
          </div>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <div className="p-4 md:p-6 bg-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600 font-medium">Gastos Mensuales</span>
              <div className="p-2.5 bg-red-100 rounded-lg">
                <TrendingDown size={20} className="text-red-600" />
              </div>
            </div>
            <p className="text-3xl md:text-4xl font-bold text-red-600">
              {formatCurrency(totales.totalGastos)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {totales.porcentajeGastado.toFixed(1)}% de tus ingresos
            </p>
          </div>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <div className="p-4 md:p-6 bg-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600 font-medium">Balance</span>
              <div className={`p-2.5 rounded-lg ${totales.balance >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
                <Wallet size={20} className={totales.balance >= 0 ? 'text-blue-600' : 'text-orange-600'} />
              </div>
            </div>
            <p className={`text-3xl md:text-4xl font-bold ${totales.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
              {formatCurrency(totales.balance)}
            </p>
          </div>
        </Card>
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setModalType('ingreso')}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>Agregar Ingreso</span>
        </button>
        <button
          onClick={() => setModalType('gasto')}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>Agregar Gasto</span>
        </button>
      </div>

      {/* Gastos por categoría */}
      {gastosPorCategoria.length > 0 && (
        <Card className="border-0 shadow-md">
          <div className="p-4 md:p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Gastos por Categoría</h3>
            <div className="space-y-4">
              {gastosPorCategoria.slice(0, 5).map((cat, index) => {
                const porcentaje = totales.totalGastos > 0 ? (cat.total / totales.totalGastos) * 100 : 0;
                const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
                return (
                  <div key={cat.nombre}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {cat.nombre} <span className="text-gray-400">({cat.count})</span>
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {formatCurrency(cat.total)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ 
                          width: `${porcentaje}%`,
                          backgroundColor: colors[index % colors.length]
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{porcentaje.toFixed(1)}% del total</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Transacciones recientes */}
      <Card className="border-0 shadow-md">
        <div className="p-4 md:p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Todas las Transacciones</h3>
          {transaccionesRecientes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">No hay transacciones registradas</p>
              <p className="text-sm">Comienza agregando tus ingresos y gastos</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transaccionesRecientes.map((transaccion) => {
                const IconComponent = transaccion.categorias?.icono
                  ? (Icons as any)[transaccion.categorias.icono] || Icons.Circle
                  : Icons.Circle;

                return (
                  <div
                    key={transaccion.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className="p-2 rounded-lg flex-shrink-0"
                        style={{
                          backgroundColor: `${transaccion.categorias?.color || '#gray'}20`,
                        }}
                      >
                        <IconComponent
                          size={20}
                          style={{ color: transaccion.categorias?.color || '#gray' }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {transaccion.descripcion}
                        </p>
                        <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500">
                          <span className="truncate">{transaccion.categorias?.nombre || 'Sin categoría'}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{formatDateShort(transaccion.fecha)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <span
                        className={`text-lg font-bold ${
                          transaccion.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {transaccion.tipo === 'ingreso' ? '+' : '-'}
                        {formatCurrency(transaccion.monto)}
                      </span>
                      <button
                        onClick={() => handleDelete(transaccion.tipo, transaccion.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Modales */}
      <Modal
        isOpen={modalType === 'ingreso'}
        onClose={() => setModalType(null)}
        title="Agregar Ingreso"
      >
        <IngresoForm onSuccess={() => setModalType(null)} />
      </Modal>

      <Modal
        isOpen={modalType === 'gasto'}
        onClose={() => setModalType(null)}
        title="Agregar Gasto"
      >
        <GastoForm onSuccess={() => setModalType(null)} />
      </Modal>
    </div>
  );
};
