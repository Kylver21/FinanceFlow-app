import React, { useState } from 'react';
import { CategoriaForm, CategoriaList } from '../features/categorias';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';

export const Categorias: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
          <p className="text-gray-600">Administra tus categorías para ingresos y gastos</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Nueva Categoría
        </Button>
      </div>

      <CategoriaList />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Agregar Categoría"
      >
        <CategoriaForm onSuccess={handleSuccess} />
      </Modal>
    </div>
  );
};
