import React, { useMemo } from 'react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { useFinanzas } from '../../context/FinanzasContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { getMonthName, getCurrentMonth, getCurrentYear, getMonthDateRange } from '../../utils/dateUtils';

export const ResumenMensual: React.FC = () => {
  const { gastos, categorias } = useFinanzas();

  const resumenPorCategoria = useMemo(() => {
    const currentMonth = getCurrentMonth();
    const currentYear = getCurrentYear();
    const { start, end } = getMonthDateRange(currentYear, currentMonth);

    const gastosDelMes = gastos.filter(
      (g) => g.fecha >= start && g.fecha <= end
    );

    const resumen = categorias
      .filter((c) => c.tipo === 'gasto')
      .map((categoria) => {
        const gastosCategoria = gastosDelMes.filter(
          (g) => g.categoria_id === categoria.id
        );
        const total = gastosCategoria.reduce((sum, g) => sum + g.monto, 0);
        return {
          categoria,
          total,
          cantidad: gastosCategoria.length,
        };
      })
      .filter((item) => item.total > 0)
      .sort((a, b) => b.total - a.total);

    const totalGastos = resumen.reduce((sum, item) => sum + item.total, 0);

    return { resumen, totalGastos };
  }, [gastos, categorias]);

  if (resumenPorCategoria.resumen.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900">
          Gastos por Categoría - {getMonthName(getCurrentMonth())}
        </h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {resumenPorCategoria.resumen.map((item) => {
            const porcentaje =
              (item.total / resumenPorCategoria.totalGastos) * 100;

            return (
              <div key={item.categoria.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {item.categoria.nombre}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(item.total)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${porcentaje}%`,
                      backgroundColor: item.categoria.color,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {item.cantidad} {item.cantidad === 1 ? 'gasto' : 'gastos'} •{' '}
                  {porcentaje.toFixed(1)}%
                </p>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};
