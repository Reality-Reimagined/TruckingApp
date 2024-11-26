import React, { useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import { Search, Filter, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import LoadCard from './LoadCard';
import LoadFilters from './LoadFilters';

export interface Load {
  id: string;
  origin: string;
  destination: string;
  pickup_date: string;
  delivery_date: string;
  rate: number;
  distance: number;
  weight: number;
  equipment_type: string;
  description: string;
  status: string;
  company_id: string;
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

  // Fetch loads using react-query
  const { data: loads, isLoading, error } = useQuery<Load[]>(
    'loads',
    async () => {
      const { data, error } = await supabase
        .from('loads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    {
      refetchInterval: 5000, // Refetch every 5 seconds
    }
  );

  const filteredLoads = useCallback(() => {
    if (!loads) return [];
    
    return loads.filter(load => {
      const matchesSearch = 
        load.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        load.destination.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilters = 
        load.rate >= filters.minRate &&
        load.rate <= filters.maxRate &&
        load.weight >= filters.minWeight &&
        load.weight <= filters.maxWeight &&
        (filters.equipment === 'all' || load.equipment_type === filters.equipment);

      return matchesSearch && matchesFilters;
    });
  }, [loads, searchTerm, filters]);

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 p-4 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span>Error loading loads: {(error as Error).message}</span>
        </div>
      </div>
    );
  }

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
        {isLoading ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            Loading loads...
          </div>
        ) : filteredLoads().length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No loads found matching your criteria
          </div>
        ) : (
          filteredLoads().map(load => (
            <LoadCard key={load.id} load={load} />
          ))
        )}
      </div>
    </div>
  );
};

export default FindLoads;