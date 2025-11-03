import React, { useMemo, useState } from 'react';
import { useFinanzas } from '../../context/FinanzasContext';
import { Card, CardBody } from '../../components/ui/Card';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateShort } from '../../utils/dateUtils';
import { Trash2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Select } from '../../components/ui/Select';

export const GastoList: React.FC = () => {
  const { gastos, categorias, deleteGasto } = useFinanzas();
  const [categoriaId, setCategoriaId] = useState('');

  const categoriasGasto = useMemo(
    () => categorias.filter((c) => c.tipo === 'gasto'),
    [categorias]
  );

  const filtered = useMemo(
    () => (categoriaId ? gastos.filter((g) => g.categoria_id === categoriaId) : gastos),
    [gastos, categoriaId]
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este gasto?')) {
      try {
        await deleteGasto(id);
      } catch (error) {
        console.error('Error deleting gasto:', error);
      }
    }
  };

  if (gastos.length === 0) {
    return (
      <Card>
        <CardBody>
          <p className="text-center text-gray-500 py-8">No hay gastos registrados</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="max-w-xs">
        <Select
          label="Filtrar por categoría"
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          options={[
            { value: '', label: 'Todas las categorías' },
            ...categoriasGasto.map((c) => ({ value: c.id, label: c.nombre })),
          ]}
        />
      </div>

      {filtered.map((gasto) => {
        const IconComponent = gasto.categorias?.icono
          ? (Icons as any)[gasto.categorias.icono] || Icons.Circle
          : Icons.Circle;

        return (
          <Card key={gasto.id}>
            <CardBody className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className="p-2 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: `${gasto.categorias?.color}20` }}
                >
                  <IconComponent size={24} style={{ color: gasto.categorias?.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{gasto.descripcion}</h3>
                  <div className="flex flex-wrap items-center gap-1 text-xs sm:text-sm text-gray-500">
                    <span className="truncate">{gasto.categorias?.nombre || 'Sin categoría'}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{formatDateShort(gasto.fecha)}</span>
                    {gasto.es_fijo && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                          Variable
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3">
                <span className="text-lg sm:text-xl font-semibold text-red-600">
                  {formatCurrency(gasto.monto)}
                </span>
                <button
                  onClick={() => handleDelete(gasto.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                  aria-label="Eliminar gasto"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
};
