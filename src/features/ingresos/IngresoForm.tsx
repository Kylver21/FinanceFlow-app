import React, { useState } from 'react';
import { useFinanzas } from '../../context/FinanzasContext';

interface IngresoFormProps {
  onSuccess: () => void;
}

export const IngresoForm: React.FC<IngresoFormProps> = ({ onSuccess }) => {
  const { categorias, addIngreso } = useFinanzas();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    descripcion: '',
    monto: '',
    categoria_id: '',
    fecha: new Date().toISOString().split('T')[0],
    es_recurrente: false,
    frecuencia: 'mensual',
  });

  const categoriasIngreso = categorias.filter((c) => c.tipo === 'ingreso');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.descripcion || !formData.monto) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setLoading(true);

    try {
      const ingresoData: any = {
        descripcion: formData.descripcion.trim(),
        monto: parseFloat(formData.monto),
        categoria_id: formData.categoria_id || undefined,
        fecha: formData.fecha,
        es_recurrente: formData.frecuencia !== 'una_vez',
        frecuencia: formData.frecuencia !== 'una_vez' ? (formData.frecuencia as any) : null,
      };
      await addIngreso(ingresoData);
      
      // Resetear formulario
      setFormData({
        descripcion: '',
        monto: '',
        categoria_id: '',
        fecha: new Date().toISOString().split('T')[0],
        es_recurrente: false,
        frecuencia: 'mensual',
      });
      
      onSuccess();
    } catch (error) {
      alert('Error al guardar el ingreso. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Calcular total mensual basado en frecuencia
  const calcularTotalMensual = () => {
    if (!formData.monto || !formData.es_recurrente) return 0;
    const monto = parseFloat(formData.monto);
    
    switch (formData.frecuencia) {
      case 'semanal':
        return monto * 4;
      case 'quincenal':
        return monto * 2;
      case 'mensual':
        return monto;
      default:
        return monto;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Header con total mensual */}
      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total mensual:</span>
          <span className="text-xl sm:text-2xl font-bold text-green-600">
            S/ {calcularTotalMensual().toFixed(2)}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="Descripción (ej: Sueldo)"
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
          required
        />
      </div>

      <div className="space-y-2">
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Monto"
          value={formData.monto}
          onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="relative">
          <select
            value={formData.frecuencia || 'mensual'}
            onChange={(e) => {
              const frecuencia = e.target.value;
              setFormData({ 
                ...formData, 
                frecuencia,
                es_recurrente: frecuencia !== 'una_vez'
              });
            }}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white text-gray-900 cursor-pointer"
          >
            <option value="una_vez">Una sola vez</option>
            <option value="semanal">Semanal</option>
            <option value="quincenal">Quincenal</option>
            <option value="mensual">Mensual</option>
            <option value="anual">Anual</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Categoría (opcional)
        </label>
        {categoriasIngreso.length === 0 ? (
          <div className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
            <p className="font-medium mb-1">⚠️ No hay categorías de ingreso</p>
            <p className="text-xs">Puedes guardar el ingreso sin categoría o ir a "Categorías" para crear una.</p>
          </div>
        ) : null}
        <div className="relative">
          <select
            value={formData.categoria_id}
            onChange={(e) => {
              setFormData({ ...formData, categoria_id: e.target.value });
            }}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white text-gray-900 cursor-pointer"
          >
            <option value="">Sin categoría</option>
            {categoriasIngreso.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        {categoriasIngreso.length > 0 && (
          <p className="text-xs text-gray-500">
            {categoriasIngreso.length} categoría{categoriasIngreso.length !== 1 ? 's' : ''} disponible{categoriasIngreso.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-black hover:bg-gray-800 text-white px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          type="button"
          onClick={onSuccess}
          className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2.5 rounded-lg font-medium transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};
