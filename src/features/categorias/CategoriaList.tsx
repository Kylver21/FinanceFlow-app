import React from 'react';
import { useFinanzas } from '../../context/FinanzasContext';
import { Card, CardBody } from '../../components/ui/Card';
import { Trash2 } from 'lucide-react';
import * as Icons from 'lucide-react';

export const CategoriaList: React.FC = () => {
  const { categorias, deleteCategoria } = useFinanzas();

  const grouped = {
    ingreso: categorias.filter((c) => c.tipo === 'ingreso'),
    gasto: categorias.filter((c) => c.tipo === 'gasto'),
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        '¿Eliminar categoría? Los registros relacionados quedarán sin categoría.'
      )
    ) {
      try {
        await deleteCategoria(id);
      } catch (e) {
        console.error('Error deleting categoria:', e);
      }
    }
  };

  const Section: React.FC<{ title: string; items: typeof categorias }> = ({
    title,
    items,
  }) => (
    <Card>
      <CardBody>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        {items.length === 0 ? (
          <p className="text-gray-500">No hay categorías</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {items.map((c) => {
              const Icon = (Icons as any)[c.icono] || Icons.Circle;
              return (
                <li
                  key={c.id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${c.color}20` }}
                    >
                      <Icon size={20} style={{ color: c.color }} />
                    </div>
                    <span className="font-medium text-gray-800">{c.nombre}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </CardBody>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Section title="Categorías de Gastos" items={grouped.gasto} />
      <Section title="Categorías de Ingresos" items={grouped.ingreso} />
    </div>
  );
};
