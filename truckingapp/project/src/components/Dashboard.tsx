import React from 'react';
import { Truck, Package, FileText, DollarSign, MessageSquare } from 'lucide-react';
import StatCard from './StatCard';
import LoadList from './LoadList';

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, Dispatcher</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          New Load
        </button>
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
        <button className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
          <MessageSquare className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;