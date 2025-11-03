import React from 'react';
import { Card, CardBody } from '../../components/ui/Card';
import { formatCurrency } from '../../utils/formatCurrency';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface BalanceCardProps {
  totalIngresos: number;
  totalGastos: number;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  totalIngresos,
  totalGastos,
}) => {
  const balance = totalIngresos - totalGastos;
  const porcentajeGastado = totalIngresos > 0 ? (totalGastos / totalIngresos) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ingresos</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(totalIngresos)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Gastos</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(totalGastos)}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingDown className="text-red-600" size={24} />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Balance</p>
              <p
                className={`text-2xl font-bold ${
                  balance >= 0 ? 'text-blue-600' : 'text-orange-600'
                }`}
              >
                {formatCurrency(balance)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Gastado: {porcentajeGastado.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Wallet className="text-blue-600" size={24} />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
