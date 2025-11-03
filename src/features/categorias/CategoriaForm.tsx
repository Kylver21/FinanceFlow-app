import React, { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { useFinanzas } from '../../context/FinanzasContext';

interface CategoriaFormProps {
  onSuccess: () => void;
}

export const CategoriaForm: React.FC<CategoriaFormProps> = ({ onSuccess }) => {
  const { addCategoria } = useFinanzas();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'gasto' as 'ingreso' | 'gasto',
    icono: 'Circle',
    color: '#6366f1',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addCategoria({
        nombre: formData.nombre,
        tipo: formData.tipo,
        icono: formData.icono,
        color: formData.color,
      });
      onSuccess();
      setFormData({ nombre: '', tipo: 'gasto', icono: 'Circle', color: '#6366f1' });
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre"
        placeholder="Ej: Transporte, Sueldo"
        value={formData.nombre}
        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
        required
      />

      <Select
        label="Tipo"
        value={formData.tipo}
        onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
        options={[
          { value: 'gasto', label: 'Gasto' },
          { value: 'ingreso', label: 'Ingreso' },
        ]}
      />

      <Input
        label="Ícono (lucide-react)"
        placeholder="Ej: Bus, Wallet, Utensils"
        value={formData.icono}
        onChange={(e) => setFormData({ ...formData, icono: e.target.value })}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
        <input
          type="color"
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          className="w-12 h-10 p-0 border rounded"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Guardando...' : 'Crear Categoría'}
      </Button>
    </form>
  );
};
