import React, { useState, useCallback } from 'react';
import { Search, Filter, MapPin, Calendar, DollarSign, Truck } from 'lucide-react';
import LoadCard from './LoadCard';
import LoadFilters from './LoadFilters';

export interface Load {
  id: string;
  origin: string;
  destination: string;
  date: string;
  rate: number;
  distance: number;
  weight: number;
  equipment: string;
  broker: string;
}

const FindLoads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minRate: 0,
    maxRate: 10000,
    equipment: 'all',
    minWeight: 0,
    maxWeight: 45000,
  });

  // Simulated loads data - in real app this would come from an API
  const [loads] = useState<Load[]>([
    {
      id: '1',
      origin: 'Chicago, IL',
      destination: 'New York, NY',
      date: '2024-03-15',
      rate: 3500,
      distance: 789,
      weight: 25000,
      equipment: 'Dry Van',
      broker: 'TQL'
    },
    {
      id: '2',
      origin: 'Los Angeles, CA',
      destination: 'Phoenix, AZ',
      date: '2024-03-16',
      rate: 2800,
      distance: 373,
      weight: 32000,
      equipment: 'Reefer',
      broker: 'CH Robinson'
    },
    // Add more mock loads as needed
  ]);

  const filteredLoads = useCallback(() => {
    return loads.filter(load => {
      const matchesSearch = 
        load.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        load.destination.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilters = 
        load.rate >= filters.minRate &&
        load.rate <= filters.maxRate &&
        load.weight >= filters.minWeight &&
        load.weight <= filters.maxWeight &&
        (filters.equipment === 'all' || load.equipment === filters.equipment);

      return matchesSearch && matchesFilters;
    });
  }, [loads, searchTerm, filters]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Find Loads</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by city or state..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>
      </div>

      {showFilters && (
        <LoadFilters filters={filters} setFilters={setFilters} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLoads().map(load => (
          <LoadCard key={load.id} load={load} />
        ))}
      </div>
    </div>
  );
};

export default FindLoads;