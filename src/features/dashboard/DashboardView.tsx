import React, { useMemo, useState } from 'react';
import { useFinanzas } from '../../context/FinanzasContext';
import { BalanceCard } from './BalanceCard';
import { ResumenMensual } from './ResumenMensual';
import { QuickGasto } from './QuickGasto';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateShort } from '../../utils/dateUtils';
import { AlertCircle, Pin } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Toggle } from '../../components/ui/Toggle';

export const DashboardView: React.FC = () => {
  const { ingresos, gastos, alertas, updateGasto } = useFinanzas();
  const [soloFijos, setSoloFijos] = useState(false);

  const totales = useMemo(() => {
    const totalIngresos = ingresos.reduce((sum, i) => sum + i.monto, 0);
    const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0);
    return { totalIngresos, totalGastos };
  }, [ingresos, gastos]);

  const alertasProximas = useMemo(() => {
    const hoy = new Date().getDate();
    return alertas
      .filter((a) => a.activa)
      .filter((a) => {
        const diasRestantes = a.dia_cobro >= hoy ? a.dia_cobro - hoy : 31 - hoy + a.dia_cobro;
        return diasRestantes <= 5;
      })
      .sort((a, b) => {
        const diasA = a.dia_cobro >= hoy ? a.dia_cobro - hoy : 31 - hoy + a.dia_cobro;
        const diasB = b.dia_cobro >= hoy ? b.dia_cobro - hoy : 31 - hoy + b.dia_cobro;
        return diasA - diasB;
      });
  }, [alertas]);

  const transaccionesRecientes = useMemo(() => {
    const todas = [
      ...ingresos.map((i) => ({ ...i, tipo: 'ingreso' as const })),
      ...gastos.map((g) => ({ ...g, tipo: 'gasto' as const })),
    ]
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    const filtradas = soloFijos
      ? todas.filter((t) => t.tipo === 'gasto' && (t as any).es_fijo)
      : todas;

    return filtradas.slice(0, 5);
  }, [ingresos, gastos, soloFijos]);

  const gastosFijos = useMemo(() => gastos.filter((g) => g.es_fijo), [gastos]);
  const totalGastosFijos = useMemo(
    () => gastosFijos.reduce((sum, g) => sum + g.monto, 0),
    [gastosFijos]
  );

  return (
    <div className="space-y-6">
      <BalanceCard
        totalIngresos={totales.totalIngresos}
        totalGastos={totales.totalGastos}
      />

      <QuickGasto />

      {alertasProximas.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="text-orange-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">
                Próximos Cobros
              </h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {alertasProximas.map((alerta) => {
                const hoy = new Date().getDate();
                const diasRestantes =
                  alerta.dia_cobro >= hoy
                    ? alerta.dia_cobro - hoy
                    : 31 - hoy + alerta.dia_cobro;

                const IconComponent = alerta.categorias?.icono
                  ? (Icons as any)[alerta.categorias.icono] || Icons.Circle
                  : Icons.Circle;

                return (
                  <div
                    key={alerta.id}
                    className="flex items-center justify-between p-3 bg-orange-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${alerta.categorias?.color}20` }}
                      >
                        <IconComponent
                          size={20}
                          style={{ color: alerta.categorias?.color }}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{alerta.nombre}</p>
                        <p className="text-sm text-gray-600">
                          {diasRestantes === 0
                            ? '¡Se cobra hoy!'
                            : `Se cobra en ${diasRestantes} ${diasRestantes === 1 ? 'día' : 'días'}`}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-orange-600">
                      {formatCurrency(alerta.monto)}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Gastos Fijos</h2>
            <span className="text-sm text-gray-600">
              Total mensual: <span className="font-semibold text-red-600">{formatCurrency(totalGastosFijos)}</span>
            </span>
          </div>
        </CardHeader>
        <CardBody>
          {gastosFijos.length === 0 ? (
            <p className="text-gray-500">Aún no marcaste gastos fijos. Puedes marcarlos desde aquí o desde la lista.</p>
          ) : (
            <div className="space-y-3">
              {gastosFijos.slice(0, 6).map((g) => {
                const IconComponent = g.categorias?.icono
                  ? (Icons as any)[g.categorias.icono] || Icons.Circle
                  : Icons.Circle;
                return (
                  <div key={g.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${g.categorias?.color}20` }}
                      >
                        <IconComponent size={20} style={{ color: g.categorias?.color }} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{g.descripcion}</p>
                        <p className="text-sm text-gray-500">{g.categorias?.nombre} • {formatDateShort(g.fecha)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-red-600">-{formatCurrency(g.monto)}</span>
                      <Toggle
                        checked={g.es_fijo}
                        onChange={async (checked) => {
                          try { await updateGasto(g.id, { es_fijo: checked }); } catch (e) { /* Error silenciado */ }
                        }}
                        label={g.es_fijo ? 'Fijo' : 'No fijo'}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResumenMensual />

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Transacciones Recientes</h2>
              <div className="flex items-center gap-3">
                <Toggle checked={soloFijos} onChange={setSoloFijos} label="Solo fijos" />
              </div>
            </div>
          </CardHeader>
          <CardBody>
            {transaccionesRecientes.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No hay transacciones recientes
              </p>
            ) : (
              <div className="space-y-3">
                {transaccionesRecientes.map((transaccion) => {
                  const IconComponent = transaccion.categorias?.icono
                    ? (Icons as any)[transaccion.categorias.icono] || Icons.Circle
                    : Icons.Circle;

                  return (
                    <div
                      key={transaccion.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{
                            backgroundColor: `${transaccion.categorias?.color}20`,
                          }}
                        >
                          <IconComponent
                            size={20}
                            style={{ color: transaccion.categorias?.color }}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {transaccion.descripcion}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDateShort(transaccion.fecha)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-semibold ${
                            transaccion.tipo === 'ingreso'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {transaccion.tipo === 'ingreso' ? '+' : '-'}
                          {formatCurrency(transaccion.monto)}
                        </span>
                        {transaccion.tipo === 'gasto' && (
                          <button
                            onClick={async () => {
                              try {
                                await updateGasto((transaccion as any).id, { es_fijo: !(transaccion as any).es_fijo });
                              } catch (e) { /* Error silenciado */ }
                            }}
                            className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${
                              (transaccion as any).es_fijo
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'text-gray-600 hover:bg-gray-100 border-gray-200'
                            }`}
                            title={(transaccion as any).es_fijo ? 'Marcar como no fijo' : 'Marcar como fijo'}
                          >
                            <Pin size={14} /> {(transaccion as any).es_fijo ? 'Fijo' : 'Marcar fijo'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
