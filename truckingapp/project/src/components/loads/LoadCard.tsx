import React from 'react';
import { MapPin, Calendar, DollarSign, Truck } from 'lucide-react';
import type { Load } from './FindLoads';

interface LoadCardProps {
  load: Load;
}

const LoadCard: React.FC<LoadCardProps> = ({ load }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Truck className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-gray-600">{load.equipment}</span>
        </div>
        <span className="text-sm text-gray-500">{load.broker}</span>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-gray-400 mt-1" />
          <div>
            <div className="font-medium">{load.origin}</div>
            <div className="text-gray-500 mt-1">{load.destination}</div>
            <div className="text-sm text-gray-400 mt-1">{load.distance} miles</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <span className="text-gray-600">{load.date}</span>
        </div>

        <div className="flex items-center gap-3">
          <DollarSign className="w-5 h-5 text-gray-400" />
          <span className="text-lg font-semibold text-gray-900">${load.rate.toLocaleString()}</span>
          <span className="text-sm text-gray-500">
            (${(load.rate / load.distance).toFixed(2)}/mile)
          </span>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Book Load
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Details
        </button>
      </div>
    </div>
  );
};

export default LoadCard;