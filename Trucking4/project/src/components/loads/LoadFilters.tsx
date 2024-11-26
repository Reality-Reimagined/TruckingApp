import React from 'react';
import { Truck } from 'lucide-react';

interface FiltersProps {
  filters: {
    minRate: number;
    maxRate: number;
    equipment: string;
    minWeight: number;
    maxWeight: number;
    status: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    minRate: number;
    maxRate: number;
    equipment: string;
    minWeight: number;
    maxWeight: number;
    status: string;
  }>>;
}

const LoadFilters: React.FC<FiltersProps> = ({ filters, setFilters }) => {
  const equipmentTypes = ['all', 'Dry Van', 'Reefer', 'Flatbed', 'Step Deck', 'Box Truck', 'Power Only'];
  const statusTypes = ['all', 'PENDING', 'BOOKED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rate Range
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={filters.minRate}
              onChange={(e) => setFilters(prev => ({ ...prev, minRate: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Min"
            />
            <span>-</span>
            <input
              type="number"
              value={filters.maxRate}
              onChange={(e) => setFilters(prev => ({ ...prev, maxRate: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Max"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Equipment Type
          </label>
          <select
            value={filters.equipment}
            onChange={(e) => setFilters(prev => ({ ...prev, equipment: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {equipmentTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Equipment' : type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weight Range (lbs)
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={filters.minWeight}
              onChange={(e) => setFilters(prev => ({ ...prev, minWeight: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Min"
            />
            <span>-</span>
            <input
              type="number"
              value={filters.maxWeight}
              onChange={(e) => setFilters(prev => ({ ...prev, maxWeight: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Max"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statusTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Status' : type.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default LoadFilters;