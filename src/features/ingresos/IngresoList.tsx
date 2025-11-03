import React, { useMemo, useState } from 'react';
import { useFinanzas } from '../../context/FinanzasContext';
import { Card, CardBody } from '../../components/ui/Card';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateShort } from '../../utils/dateUtils';
import { Trash2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Select } from '../../components/ui/Select';

export const IngresoList: React.FC = () => {
  const { ingresos, categorias, deleteIngreso } = useFinanzas();
  const [categoriaId, setCategoriaId] = useState('');

  const categoriasIngreso = useMemo(
    () => categorias.filter((c) => c.tipo === 'ingreso'),
    [categorias]
  );

  const filtered = useMemo(
    () => (categoriaId ? ingresos.filter((i) => i.categoria_id === categoriaId) : ingresos),
    [ingresos, categoriaId]
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este ingreso?')) {
      try {
        await deleteIngreso(id);
      } catch (error) {
        console.error('Error deleting ingreso:', error);
      }
    }
  };

  if (ingresos.length === 0) {
    return (
      <Card>
        <CardBody>
          <p className="text-center text-gray-500 py-8">No hay ingresos registrados</p>
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
            ...categoriasIngreso.map((c) => ({ value: c.id, label: c.nombre })),
          ]}
        />
      </div>

      {filtered.map((ingreso) => {
        const IconComponent = ingreso.categorias?.icono
          ? (Icons as any)[ingreso.categorias.icono] || Icons.Circle
          : Icons.Circle;

        return (
          <Card key={ingreso.id}>
            <CardBody className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className="p-2 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: `${ingreso.categorias?.color}20` }}
                >
                  <IconComponent
                    size={24}
                    style={{ color: ingreso.categorias?.color }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{ingreso.descripcion}</h3>
                  <div className="flex flex-wrap items-center gap-1 text-xs sm:text-sm text-gray-500">
                    <span className="truncate">{ingreso.categorias?.nombre}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{formatDateShort(ingreso.fecha)}</span>
                    {ingreso.es_recurrente && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-xs font-medium">
                          {ingreso.frecuencia}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3">
                <span className="text-lg sm:text-xl font-semibold text-green-600">
                  {formatCurrency(ingreso.monto)}
                </span>
                <button
                  onClick={() => handleDelete(ingreso.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                  aria-label="Eliminar ingreso"
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
