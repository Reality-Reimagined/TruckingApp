import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Package, FileText, DollarSign, MessageSquare, ChevronDown } from 'lucide-react';
import StatCard from './StatCard';
import LoadList from './LoadList';

const Dashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, Dispatcher</p>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            New Load
            <ChevronDown className="w-4 h-4" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/loads/post');
                }}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
              >
                Post a Load
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/loads');
                }}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
              >
                Find a Load
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Loads"
          value="12"
          icon={<Truck className="w-6 h-6" />}
          trend="+2 from yesterday"
          trendUp={true}
        />
        <StatCard
          title="Available Loads"
          value="48"
          icon={<Package className="w-6 h-6" />}
          trend="+5 new loads"
          trendUp={true}
        />
        <StatCard
          title="Pending Documents"
          value="3"
          icon={<FileText className="w-6 h-6" />}
          trend="2 urgent"
          trendUp={false}
        />
        <StatCard
          title="Revenue (MTD)"
          value="$45,280"
          icon={<DollarSign className="w-6 h-6" />}
          trend="+12% vs last month"
          trendUp={true}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Loads</h2>
        <LoadList />
      </div>

      <div className="fixed bottom-6 right-6">
        <button 
          onClick={() => navigate('/support')}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;