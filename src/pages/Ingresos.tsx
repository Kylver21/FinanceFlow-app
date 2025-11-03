import React, { useState } from 'react';
import { IngresoForm, IngresoList } from '../features/ingresos';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';

export const Ingresos: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Ingresos</h1>
          <p className="text-sm md:text-base text-gray-600">Registra tus ingresos y fuentes de dinero</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto"
        >
          <Plus size={20} className="mr-2" />
          Nuevo Ingreso
        </Button>
      </div>

      <IngresoList />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ingresos"
      >
        <IngresoForm onSuccess={handleSuccess} />
      </Modal>
    </div>
  );
};
