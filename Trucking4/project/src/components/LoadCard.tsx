import React from 'react';
import { MapPin, Calendar, DollarSign, Truck, Trash } from 'lucide-react';
import type { Load } from './FindLoads';

interface LoadCardProps {
  load: Load;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onBook?: (id: string) => void;
  isOwner: boolean;
}

const LoadCard: React.FC<LoadCardProps> = ({ load, onDelete, onEdit, onBook, isOwner }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(load.id);
  };

  const handleBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBook) onBook(load.id);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (value == null) return '$0.00';
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatRatePerMile = (rate: number | null | undefined, distance: number | null | undefined) => {
    if (!rate || !distance || distance === 0) return '$0.00';
    const ratePerMile = rate / distance;
    return formatCurrency(ratePerMile);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Truck className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-gray-600">{load.equipment_type}</span>
        </div>
        {load.status && (
          <span className={`text-sm px-2 py-1 rounded-full ${
            load.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
            load.status === 'BOOKED' ? 'bg-blue-100 text-blue-800' :
            load.status === 'IN_TRANSIT' ? 'bg-purple-100 text-purple-800' :
            load.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {load.status.replace('_', ' ')}
          </span>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-gray-400 mt-1" />
          <div>
            <div className="font-medium">{load.origin}</div>
            <div className="text-gray-500 mt-1">{load.destination}</div>
            <div className="text-sm text-gray-400 mt-1">{load.distance || 0} miles</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <div>
            <div className="text-sm">
              Pickup: <span className="text-gray-900">{formatDate(load.pickup_date)}</span>
            </div>
            <div className="text-sm">
              Delivery: <span className="text-gray-900">{formatDate(load.delivery_date)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DollarSign className="w-5 h-5 text-gray-400" />
          <div>
            <span className="text-lg font-semibold text-gray-900">{formatCurrency(load.rate)}</span>
            <span className="text-sm text-gray-500 ml-2">
              ({formatRatePerMile(load.rate, load.distance)}/mile)
            </span>
          </div>
        </div>
      </div>

      {showActions && (
        <div className="mt-6 flex gap-3">
          {!isOwner && load.status === 'PENDING' && (
            <button
              onClick={() => onBook?.(load.id)}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Book Load
            </button>
          )}
          
          {isOwner && (
            <>
              <button
                onClick={() => onEdit?.(load.id)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete?.(load.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                title="Delete load"
              >
                <Trash className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default LoadCard;