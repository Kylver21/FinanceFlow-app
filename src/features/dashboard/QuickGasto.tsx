import React, { useMemo, useState } from 'react';
import { useFinanzas } from '../../context/FinanzasContext';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import * as Icons from 'lucide-react';

export const QuickGasto: React.FC = () => {
  const { categorias, gastos, addGasto } = useFinanzas();

  const categoriasGasto = useMemo(
    () => categorias.filter((c) => c.tipo === 'gasto'),
    [categorias]
  );

  const topCategorias = useMemo(() => {
    // Últimos 30 días
    const hoy = new Date();
    const hace30 = new Date(hoy);
    hace30.setDate(hoy.getDate() - 30);

    const recientes = gastos.filter((g) => new Date(g.fecha) >= hace30);

    const conteo = new Map<string, number>();
    const ultimoMontoPorCat = new Map<string, number>();
    const ultimoIndex = new Map<string, number>();

    recientes.forEach((g, idx) => {
      conteo.set(g.categoria_id, (conteo.get(g.categoria_id) || 0) + 1);
      // Guardar el último monto utilizado por categoría, considerando el índice más reciente
      if (!ultimoIndex.has(g.categoria_id) || idx > (ultimoIndex.get(g.categoria_id) as number)) {
        ultimoMontoPorCat.set(g.categoria_id, g.monto);
        ultimoIndex.set(g.categoria_id, idx);
      }
    });

    const items = categoriasGasto
      .map((c) => ({ c, count: conteo.get(c.id) || 0, lastMonto: ultimoMontoPorCat.get(c.id) }))
      .filter((x) => x.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return items;
  }, [gastos, categoriasGasto]);

  const [form, setForm] = useState({
    categoria_id: '',
    monto: '',
    descripcion: '',
    metodo_pago: 'efectivo' as 'efectivo' | 'yape' | 'plin' | 'tarjeta' | 'banco',
    veces: 1,
  });
  const [loading, setLoading] = useState(false);

  const handleQuickSelect = (categoriaId: string, defaultMonto?: number) => {
    const cat = categoriasGasto.find((c) => c.id === categoriaId);
    setForm((prev) => ({
      ...prev,
      categoria_id: categoriaId,
      descripcion: prev.descripcion || (cat?.nombre ?? ''),
      monto: prev.monto || (defaultMonto ? String(defaultMonto) : ''),
    }));
  };

  const canSubmit = form.categoria_id && form.monto && Number(form.monto) > 0 && form.veces >= 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    const base = {
      descripcion: form.descripcion || (categoriasGasto.find((c) => c.id === form.categoria_id)?.nombre ?? ''),
      monto: parseFloat(form.monto),
      categoria_id: form.categoria_id,
      fecha: new Date().toISOString().split('T')[0],
      es_fijo: false,
      metodo_pago: form.metodo_pago,
    } as const;

    try {
      const tasks: Promise<void>[] = [];
      for (let i = 0; i < Math.max(1, Math.min(form.veces, 10)); i++) {
        tasks.push(addGasto({ ...base } as any));
      }
      await Promise.all(tasks);
      // Reset parcial: dejamos categoría para repetir rápido
      setForm((prev) => ({ ...prev, monto: '', descripcion: '', veces: 1 }));
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Gasto rápido</h2>
          <p className="text-sm text-gray-600">Añade gastos diarios en segundos</p>
        </div>
      </CardHeader>
      <CardBody>
        {topCategorias.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {topCategorias.map(({ c, lastMonto }) => {
              const Icon = (Icons as any)[c.icono] || Icons.Circle;
              return (
                <button
                  key={c.id}
                  onClick={() => handleQuickSelect(c.id, lastMonto)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-100 text-sm"
                  title={`Usar ${c.nombre}${lastMonto ? ` • S/ ${lastMonto.toFixed(2)}` : ''}`}
                >
                  <span className="p-1 rounded" style={{ backgroundColor: `${c.color}20` }}>
                    <Icon size={16} style={{ color: c.color }} />
                  </span>
                  <span>{c.nombre}</span>
                  {lastMonto ? (
                    <span className="text-gray-600">S/ {lastMonto.toFixed(2)}</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="md:col-span-2">
            <Select
              label="Categoría"
              value={form.categoria_id}
              onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
              options={[
                { value: '', label: 'Selecciona una categoría' },
                ...categoriasGasto.map((c) => ({ value: c.id, label: c.nombre })),
              ]}
              required
            />
          </div>

          <Input
            label="Monto (S/.)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={form.monto}
            onChange={(e) => setForm({ ...form, monto: e.target.value })}
            required
          />

          <Input
            label="Descripción"
            placeholder="Ej: Pasaje"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />

          <Select
            label="Método"
            value={form.metodo_pago}
            onChange={(e) => setForm({ ...form, metodo_pago: e.target.value as any })}
            options={[
              { value: 'efectivo', label: 'Efectivo' },
              { value: 'yape', label: 'Yape' },
              { value: 'plin', label: 'Plin' },
              { value: 'tarjeta', label: 'Tarjeta' },
              { value: 'banco', label: 'Banca Móvil' },
            ]}
          />

          <Input
            label="Veces"
            type="number"
            min={1}
            max={10}
            value={form.veces}
            onChange={(e) => setForm({ ...form, veces: Math.max(1, Math.min(10, Number(e.target.value))) })}
          />

          <div className="md:col-span-5">
            <Button type="submit" disabled={!canSubmit || loading} className="w-full md:w-auto">
              {loading ? 'Agregando...' : 'Agregar gasto'}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
