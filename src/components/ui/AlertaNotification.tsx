import React, { useMemo } from 'react';
import { useFinanzas } from '../../context/FinanzasContext';
import { Card } from '../ui/Card';
import { Bell, X } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

interface AlertaNotificationProps {
  onDismiss?: () => void;
}

export const AlertaNotification: React.FC<AlertaNotificationProps> = ({ onDismiss }) => {
  const { alertas } = useFinanzas();

  const alertasProximas = useMemo(() => {
    const hoy = new Date().getDate();
    
    return alertas
      .filter((alerta) => {
        if (!alerta.activa) return false;
        const diasRestantes = alerta.dia_cobro >= hoy 
          ? alerta.dia_cobro - hoy 
          : 31 - hoy + alerta.dia_cobro;
        return diasRestantes <= 3;
      })
      .sort((a, b) => {
        const diasA = a.dia_cobro >= hoy ? a.dia_cobro - hoy : 31 - hoy + a.dia_cobro;
        const diasB = b.dia_cobro >= hoy ? b.dia_cobro - hoy : 31 - hoy + b.dia_cobro;
        return diasA - diasB;
      });
  }, [alertas]);

  if (alertasProximas.length === 0) {
    return null;
  }

  const getDiasRestantes = (diaCobro: number) => {
    const hoy = new Date().getDate();
    return diaCobro >= hoy ? diaCobro - hoy : 31 - hoy + diaCobro;
  };

  return (
    <Card className="p-4 border-2 border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 shadow-lg">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
          <Bell className="text-orange-600 animate-pulse" size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-orange-900">
              🔔 Pagos Próximos
            </h3>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="Cerrar"
              >
                <X size={20} />
              </button>
            )}
          </div>
          <p className="text-sm text-orange-800 mb-3">
            Tienes {alertasProximas.length} pago{alertasProximas.length !== 1 ? 's' : ''} próximo{alertasProximas.length !== 1 ? 's' : ''}:
          </p>
          <div className="space-y-2">
            {alertasProximas.map((alerta) => {
              const diasRestantes = getDiasRestantes(alerta.dia_cobro);
              return (
                <div
                  key={alerta.id}
                  className="flex items-center justify-between p-2 bg-white rounded-lg border border-orange-200"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {alerta.nombre}
                    </p>
                    <p className="text-xs text-gray-600">
                      {diasRestantes === 0 
                        ? '¡Hoy!' 
                        : diasRestantes === 1 
                        ? '¡Mañana!' 
                        : `En ${diasRestantes} días (Día ${alerta.dia_cobro})`}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-orange-700 ml-2 flex-shrink-0">
                    {formatCurrency(alerta.monto)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};
