import React, { useMemo } from 'react';
import { useFinanzas } from '../../context/FinanzasContext';
import { Card } from '../../components/ui/Card';
import { formatCurrency } from '../../utils/formatCurrency';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ReportesViewProps {
  onBack?: () => void;
}

export const ReportesView: React.FC<ReportesViewProps> = () => {
  const { ingresos, gastos } = useFinanzas();

  // Calcular totales mensuales
  const { totalIngresos, totalGastos, balance, tasaAhorro } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const ingresosMensuales = ingresos.filter((ing) => {
      const fecha = new Date(ing.fecha);
      return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
    });

    const gastosMensuales = gastos.filter((gasto) => {
      const fecha = new Date(gasto.fecha);
      return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
    });

    const totalIng = ingresosMensuales.reduce((sum, ing) => sum + ing.monto, 0);
    const totalGas = gastosMensuales.reduce((sum, gasto) => sum + gasto.monto, 0);
    const bal = totalIng - totalGas;
    const tasa = totalIng > 0 ? ((bal / totalIng) * 100).toFixed(1) : '0.0';

    return {
      totalIngresos: totalIng,
      totalGastos: totalGas,
      balance: bal,
      tasaAhorro: tasa,
    };
  }, [ingresos, gastos]);

  // Agrupar gastos por categoría
  const gastosPorCategoria = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const gastosMensuales = gastos.filter((gasto) => {
      const fecha = new Date(gasto.fecha);
      return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
    });

    const grouped = gastosMensuales.reduce((acc, gasto) => {
      const catNombre = gasto.categorias?.nombre || 'Sin categoría';
      if (!acc[catNombre]) {
        acc[catNombre] = { monto: 0, count: 0 };
      }
      acc[catNombre].monto += gasto.monto;
      acc[catNombre].count += 1;
      return acc;
    }, {} as Record<string, { monto: number; count: number }>);

    return Object.entries(grouped)
      .map(([nombre, data]) => ({
        nombre,
        monto: data.monto,
        count: data.count,
      }))
      .sort((a, b) => b.monto - a.monto);
  }, [gastos]);

  // Separar gastos fijos y variables
  const { gastosFijos, gastosVariables } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const gastosMensuales = gastos.filter((gasto) => {
      const fecha = new Date(gasto.fecha);
      return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
    });

    const fijos = gastosMensuales.filter((g) => g.es_fijo);
    const variables = gastosMensuales.filter((g) => !g.es_fijo);

    return {
      gastosFijos: fijos.reduce((sum, g) => sum + g.monto, 0),
      gastosVariables: variables.reduce((sum, g) => sum + g.monto, 0),
    };
  }, [gastos]);

  // Resumen de ingresos
  const resumenIngresos = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const ingresosMensuales = ingresos.filter((ing) => {
      const fecha = new Date(ing.fecha);
      return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
    });

    return ingresosMensuales.map((ing) => ({
      descripcion: ing.descripcion,
      frecuencia: ing.frecuencia || 'biweekly',
      monto: ing.monto,
    }));
  }, [ingresos]);

  // Resumen de gastos
  const resumenGastos = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const gastosMensuales = gastos.filter((gasto) => {
      const fecha = new Date(gasto.fecha);
      return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
    });

    return gastosMensuales.map((gasto) => ({
      descripcion: gasto.descripcion,
      categoria: gasto.categorias?.nombre || 'Sin categoría',
      tipo: gasto.es_fijo ? 'fijo' : 'variable',
      monto: gasto.monto,
    }));
  }, [gastos]);

  // Recomendación financiera
  const recomendacion = useMemo(() => {
    const tasaNum = parseFloat(tasaAhorro);
    if (tasaNum >= 20) {
      return {
        titulo: 'Buen control financiero',
        mensaje: `Estás ahorrando más del 20% de tus ingresos. Continúa así y considera invertir tus ahorros.`,
        color: 'bg-green-50 border-green-200',
        textColor: 'text-green-800',
        titleColor: 'text-green-900',
      };
    } else if (tasaNum >= 10) {
      return {
        titulo: 'Control financiero aceptable',
        mensaje: `Estás ahorrando el ${tasaAhorro}% de tus ingresos. Intenta reducir gastos innecesarios para aumentar tu ahorro.`,
        color: 'bg-yellow-50 border-yellow-200',
        textColor: 'text-yellow-800',
        titleColor: 'text-yellow-900',
      };
    } else if (tasaNum > 0) {
      return {
        titulo: 'Atención requerida',
        mensaje: `Solo estás ahorrando el ${tasaAhorro}% de tus ingresos. Revisa tus gastos y establece un presupuesto más estricto.`,
        color: 'bg-orange-50 border-orange-200',
        textColor: 'text-orange-800',
        titleColor: 'text-orange-900',
      };
    } else {
      return {
        titulo: 'Situación crítica',
        mensaje: `Tus gastos superan tus ingresos. Es urgente reducir gastos o buscar ingresos adicionales.`,
        color: 'bg-red-50 border-red-200',
        textColor: 'text-red-800',
        titleColor: 'text-red-900',
      };
    }
  }, [tasaAhorro]);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Reportes y Análisis
        </h1>
        <p className="text-gray-600 text-sm md:text-base mt-1">
          Análisis detallado de tus finanzas del mes actual
        </p>
      </div>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 md:p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-sm text-gray-600 mb-2 font-medium">Ingresos Mensuales</h3>
          <p className="text-2xl md:text-3xl font-bold text-emerald-600">
            {formatCurrency(totalIngresos)}
          </p>
        </Card>

        <Card className="p-4 md:p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-sm text-gray-600 mb-2 font-medium">Gastos Mensuales</h3>
          <p className="text-2xl md:text-3xl font-bold text-red-600">
            {formatCurrency(totalGastos)}
          </p>
        </Card>

        <Card className="p-4 md:p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-sm text-gray-600 mb-2 font-medium">Balance</h3>
          <p
            className={`text-2xl md:text-3xl font-bold ${
              balance >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {formatCurrency(balance)}
          </p>
        </Card>

        <Card className="p-4 md:p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-sm text-gray-600 mb-2 font-medium">Tasa de Ahorro</h3>
          <p className="text-2xl md:text-3xl font-bold text-purple-600">
            {tasaAhorro}%
          </p>
        </Card>
      </div>

      {/* Gastos Fijos vs Variables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-4 md:p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-sm text-gray-600 mb-2 font-medium">Gastos Fijos</h3>
          <p className="text-xl md:text-2xl font-bold text-blue-600">
            {formatCurrency(gastosFijos)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {totalGastos > 0 ? ((gastosFijos / totalGastos) * 100).toFixed(1) : '0.0'}% del total
          </p>
        </Card>

        <Card className="p-4 md:p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-sm text-gray-600 mb-2 font-medium">Gastos Variables</h3>
          <p className="text-xl md:text-2xl font-bold text-orange-600">
            {formatCurrency(gastosVariables)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {totalGastos > 0 ? ((gastosVariables / totalGastos) * 100).toFixed(1) : '0.0'}% del total
          </p>
        </Card>
      </div>

      {/* Gráfico de gastos por categoría */}
      <Card className="p-4 md:p-6 border-0 shadow-md">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
          Gastos por Categoría
        </h2>
        {gastosPorCategoria.length > 0 ? (
          <div className="w-full h-[300px] md:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={gastosPorCategoria}
                margin={{ top: 10, right: 10, left: 10, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="nombre" 
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  tickFormatter={(value) => `S/ ${value}`}
                  width={60}
                />
                <Tooltip 
                  formatter={(value: number, _name: string, props: any) => [
                    `${formatCurrency(value)}`,
                    `${props.payload.count} ${props.payload.count === 1 ? 'gasto' : 'gastos'}`
                  ]}
                  labelFormatter={(label) => `Categoría: ${label}`}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Bar 
                  dataKey="monto" 
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={60}
                >
                  {gastosPorCategoria.map((_entry, index) => {
                    const colors = [
                      '#ef4444', // red
                      '#f59e0b', // orange
                      '#8b5cf6', // purple
                      '#ec4899', // pink
                      '#3b82f6', // blue
                      '#14b8a6', // teal
                      '#10b981', // green
                      '#6366f1', // indigo
                    ];
                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={colors[index % colors.length]}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No hay gastos registrados este mes
          </p>
        )}
      </Card>

      {/* Resumen de ingresos y gastos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Resumen de Ingresos */}
        <Card className="p-4 md:p-6 border-0 shadow-md">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
            Resumen de Ingresos
          </h2>
          {resumenIngresos.length > 0 ? (
            <div className="space-y-3">
              {resumenIngresos.map((ing, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm md:text-base font-medium text-gray-900 truncate">
                      {ing.descripcion}
                    </p>
                    <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                      {ing.frecuencia === 'semanal'
                        ? 'Semanal'
                        : ing.frecuencia === 'quincenal'
                        ? 'Quincenal'
                        : ing.frecuencia === 'mensual'
                        ? 'Mensual'
                        : 'Único'}
                    </span>
                  </div>
                  <span className="text-base md:text-lg font-bold text-emerald-600 ml-2">
                    {formatCurrency(ing.monto)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No hay ingresos registrados este mes
            </p>
          )}
        </Card>

        {/* Resumen de Gastos */}
        <Card className="p-4 md:p-6 border-0 shadow-md">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
            Resumen de Gastos
          </h2>
          {resumenGastos.length > 0 ? (
            <div className="space-y-3">
              {resumenGastos.slice(0, 5).map((gasto, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm md:text-base font-medium text-gray-900 truncate">
                      {gasto.descripcion}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                        {gasto.categoria}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        gasto.tipo === 'fijo' 
                          ? 'bg-indigo-100 text-indigo-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {gasto.tipo === 'fijo' ? 'Fijo' : 'Variable'}
                      </span>
                    </div>
                  </div>
                  <span className="text-base md:text-lg font-bold text-red-600 ml-2">
                    {formatCurrency(gasto.monto)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No hay gastos registrados este mes
            </p>
          )}
        </Card>
      </div>

      {/* Recomendaciones financieras */}
      <Card
        className={`p-4 md:p-6 border-2 ${recomendacion.color}`}
      >
        <h2 className={`text-lg md:text-xl font-bold mb-3 ${recomendacion.titleColor}`}>
          Recomendaciones Financieras
        </h2>
        <div className={recomendacion.textColor}>
          <p className="font-semibold text-base md:text-lg mb-2">
            {recomendacion.titulo}
          </p>
          <p className="text-sm md:text-base">{recomendacion.mensaje}</p>
        </div>
      </Card>
    </div>
  );
};
