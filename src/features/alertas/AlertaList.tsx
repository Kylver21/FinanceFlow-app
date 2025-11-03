import React, { useMemo } from 'react';
import { useFinanzas } from '../../context/FinanzasContext';
import { Card } from '../../components/ui/Card';
import { formatCurrency } from '../../utils/formatCurrency';
import { Trash2, BellOff, Bell, AlertCircle, Clock } from 'lucide-react';
import * as Icons from 'lucide-react';

export const AlertaList: React.FC = () => {
  const { alertas, deleteAlerta, updateAlerta } = useFinanzas();

  const alertasOrdenadas = useMemo(() => {
    const hoy = new Date().getDate();
    return [...alertas].sort((a, b) => {
      const diasHastaA = a.dia_cobro >= hoy ? a.dia_cobro - hoy : 31 - hoy + a.dia_cobro;
      const diasHastaB = b.dia_cobro >= hoy ? b.dia_cobro - hoy : 31 - hoy + b.dia_cobro;
      return diasHastaA - diasHastaB;
    });
  }, [alertas]);

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta alerta?')) {
      try {
        await deleteAlerta(id);
      } catch (error) {
      }
    }
  };

  const toggleAlerta = async (id: string, activa: boolean) => {
    try {
      await updateAlerta(id, { activa: !activa });
    } catch (error) {
    }
  };

  const getDiasRestantes = (diaCobro: number) => {
    const hoy = new Date().getDate();
    if (diaCobro >= hoy) {
      return diaCobro - hoy;
    }
    return 31 - hoy + diaCobro;
  };

  if (alertas.length === 0) {
    return (
      <Card className="p-6 border-0 shadow-md">
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Bell className="text-gray-400" size={32} />
          </div>
          <p className="text-gray-600 font-medium">
            No hay alertas configuradas
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Crea alertas para tus pagos recurrentes
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {alertasOrdenadas.map((alerta) => {
        const IconComponent = alerta.categorias?.icono
          ? (Icons as any)[alerta.categorias.icono] || Icons.Circle
          : Icons.Circle;
        const diasRestantes = getDiasRestantes(alerta.dia_cobro);
        
        // Determinar el estilo según los días restantes
        let alertStyle = '';
        let alertIcon = null;
        
        if (alerta.activa && diasRestantes === 0) {
          alertStyle = 'border-2 border-red-500 bg-red-50';
          alertIcon = <AlertCircle className="text-red-600" size={20} />;
        } else if (alerta.activa && diasRestantes <= 3) {
          alertStyle = 'border-2 border-orange-500 bg-orange-50';
          alertIcon = <Clock className="text-orange-600" size={20} />;
        } else if (alerta.activa && diasRestantes <= 7) {
          alertStyle = 'border-2 border-yellow-400 bg-yellow-50';
          alertIcon = <Clock className="text-yellow-600" size={20} />;
        }

        return (
          <Card 
            key={alerta.id} 
            className={`p-4 border-0 shadow-md hover:shadow-lg transition-all ${alertStyle}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className="p-2 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: `${alerta.categorias?.color}20` }}
                >
                  <IconComponent
                    size={24}
                    style={{ color: alerta.categorias?.color }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {alerta.nombre}
                    </h3>
                    {alertIcon}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-600 mt-1">
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                      {alerta.categorias?.nombre || 'Sin categoría'}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                      Día {alerta.dia_cobro}
                    </span>
                    {alerta.activa && diasRestantes <= 7 && (
                      <span 
                        className={`px-2 py-0.5 rounded-full font-medium ${
                          diasRestantes === 0
                            ? 'bg-red-100 text-red-700'
                            : diasRestantes <= 3
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {diasRestantes === 0
                          ? '¡Hoy es el pago!'
                          : diasRestantes === 1
                          ? '¡Mañana!'
                          : `En ${diasRestantes} días`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                <span className="text-base md:text-lg font-bold text-gray-900">
                  {formatCurrency(alerta.monto)}
                </span>
                <button
                  onClick={() => toggleAlerta(alerta.id, alerta.activa)}
                  className={`p-2 rounded-lg transition-all ${
                    alerta.activa
                      ? 'text-blue-600 hover:bg-blue-50'
                      : 'text-gray-400 hover:bg-gray-100'
                  }`}
                  title={alerta.activa ? 'Desactivar alerta' : 'Activar alerta'}
                >
                  {alerta.activa ? <Bell size={20} /> : <BellOff size={20} />}
                </button>
                <button
                  onClick={() => handleDelete(alerta.id)}
                  className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all"
                  title="Eliminar alerta"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
