import React, { useState, useMemo } from 'react';
import { AlertaForm, AlertaList } from '../features/alertas';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Plus, BellRing, Calendar, TrendingUp } from 'lucide-react';
import { useFinanzas } from '../context/FinanzasContext';
import { formatCurrency } from '../utils/formatCurrency';

export const Alertas: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { gastos, alertas, addAlerta } = useFinanzas();

  // Obtener gastos fijos que no tienen alerta creada
  const gastosFijosSinAlerta = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filtrar gastos fijos del mes actual
    const gastosFijos = gastos.filter((gasto) => {
      const fecha = new Date(gasto.fecha);
      return (
        gasto.es_fijo &&
        fecha.getMonth() === currentMonth &&
        fecha.getFullYear() === currentYear
      );
    });

    // Filtrar los que no tienen alerta
    return gastosFijos.filter((gasto) => {
      const tieneAlerta = alertas.some(
        (alerta) =>
          alerta.nombre.toLowerCase() === gasto.descripcion.toLowerCase() ||
          alerta.categoria_id === gasto.categoria_id
      );
      return !tieneAlerta;
    });
  }, [gastos, alertas]);

  const handleSuccess = () => {
    setIsModalOpen(false);
  };

  const handleCreateAlertaFromGasto = async (gasto: any) => {
    try {
      const fecha = new Date(gasto.fecha);
      const diaCobro = fecha.getDate();

      await addAlerta({
        nombre: gasto.descripcion,
        monto: gasto.monto,
        dia_cobro: diaCobro,
        categoria_id: gasto.categoria_id || '',
        activa: true,
        ultima_alerta: null,
      });
    } catch (error) {
      alert('Error al crear la alerta');
    }
  };

  // Calcular estadísticas
  const estadisticas = useMemo(() => {
    const alertasActivas = alertas.filter((a) => a.activa).length;
    const totalMensual = alertas
      .filter((a) => a.activa)
      .reduce((sum, a) => sum + a.monto, 0);
    const proximasAlertas = alertas.filter((a) => {
      if (!a.activa) return false;
      const hoy = new Date().getDate();
      const diasRestantes = a.dia_cobro >= hoy ? a.dia_cobro - hoy : 31 - hoy + a.dia_cobro;
      return diasRestantes <= 7;
    }).length;

    return { alertasActivas, totalMensual, proximasAlertas };
  }, [alertas]);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Alertas de Pagos
          </h1>
          <p className="text-gray-600 text-sm md:text-base mt-1">
            Gestiona tus pagos recurrentes y suscripciones
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
        >
          <Plus size={20} className="mr-2" />
          Nueva Alerta
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BellRing className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Alertas Activas</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.alertasActivas}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Mensual</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(estadisticas.totalMensual)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Próximos 7 días</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.proximasAlertas}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Sugerencias de gastos fijos sin alerta */}
      {gastosFijosSinAlerta.length > 0 && (
        <Card className="p-4 md:p-6 border-2 border-blue-200 bg-blue-50">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <BellRing className="text-blue-600" size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-blue-900 mb-2">
                💡 Gastos Fijos Detectados
              </h3>
              <p className="text-sm text-blue-800 mb-4">
                Encontramos {gastosFijosSinAlerta.length} gasto{gastosFijosSinAlerta.length !== 1 ? 's' : ''} fijo{gastosFijosSinAlerta.length !== 1 ? 's' : ''} sin alerta.
                ¿Quieres crear alertas automáticas?
              </p>
              <div className="space-y-2">
                {gastosFijosSinAlerta.map((gasto) => (
                  <div
                    key={gasto.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {gasto.descripcion}
                      </p>
                      <p className="text-sm text-gray-600">
                        {gasto.categorias?.nombre || 'Sin categoría'} • {formatCurrency(gasto.monto)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCreateAlertaFromGasto(gasto)}
                      className="ml-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex-shrink-0"
                    >
                      Crear Alerta
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Lista de alertas configuradas */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Alertas Configuradas
        </h2>
        <AlertaList />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Agregar Alerta Personalizada"
      >
        <AlertaForm onSuccess={handleSuccess} />
      </Modal>
    </div>
  );
};
