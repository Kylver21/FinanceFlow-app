import React, { useState } from 'react';
import { useFinanzas } from '../../context/FinanzasContext';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';

interface AlertaFormProps {
  onSuccess: () => void;
}

export const AlertaForm: React.FC<AlertaFormProps> = ({ onSuccess }) => {
  const { categorias, addAlerta } = useFinanzas();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    monto: '',
    dia_cobro: '',
    categoria_id: '',
    activa: true,
  });

  const categoriasGasto = categorias.filter((c) => c.tipo === 'gasto');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addAlerta({
        nombre: formData.nombre,
        monto: parseFloat(formData.monto),
        dia_cobro: parseInt(formData.dia_cobro),
        categoria_id: formData.categoria_id,
        activa: formData.activa,
        ultima_alerta: null,
      });
      onSuccess();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre de la Suscripción"
        placeholder="Ej: Netflix, Spotify"
        value={formData.nombre}
        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
        required
      />

      <Input
        label="Monto Mensual (S/.)"
        type="number"
        step="0.01"
        min="0"
        placeholder="0.00"
        value={formData.monto}
        onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
        required
      />

      <Input
        label="Día de Cobro"
        type="number"
        min="1"
        max="31"
        placeholder="1-31"
        value={formData.dia_cobro}
        onChange={(e) => setFormData({ ...formData, dia_cobro: e.target.value })}
        required
      />

      <Select
        label="Categoría"
        value={formData.categoria_id}
        onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
        options={[
          { value: '', label: 'Selecciona una categoría' },
          ...categoriasGasto.map((c) => ({ value: c.id, label: c.nombre })),
        ]}
        required
      />

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Guardando...' : 'Agregar Alerta'}
      </Button>
    </form>
  );
};
