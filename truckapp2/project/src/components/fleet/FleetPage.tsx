import React from 'react';
import { Truck, Calendar, AlertCircle, Settings, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface Vehicle {
  id: string;
  number: string;
  type: string;
  status: 'active' | 'maintenance' | 'inactive';
  driver: string;
  location: string;
  lastMaintenance: Date;
  nextMaintenance: Date;
}

const FleetPage = () => {
  const vehicles: Vehicle[] = [
    {
      id: '1',
      number: 'TRK-001',
      type: 'Peterbilt 579',
      status: 'active',
      driver: 'John Doe',
      location: 'Chicago, IL',
      lastMaintenance: new Date('2024-02-15'),
      nextMaintenance: new Date('2024-03-15'),
    },
    {
      id: '2',
      number: 'TRK-002',
      type: 'Freightliner Cascadia',
      status: 'maintenance',
      driver: 'Jane Smith',
      location: 'Detroit, MI',
      lastMaintenance: new Date('2024-01-20'),
      nextMaintenance: new Date('2024-03-20'),
    },
  ];

  const getStatusColor = (status: Vehicle['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fleet Management</h1>
          <p className="text-gray-600">Manage and monitor your vehicles</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 text-green-600 mb-4">
            <Truck className="w-5 h-5" />
            <h3 className="font-semibold">Active Vehicles</h3>
          </div>
          <p className="text-3xl font-bold">8</p>
          <p className="text-sm text-gray-500">Out of 10 total vehicles</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 text-yellow-600 mb-4">
            <Settings className="w-5 h-5" />
            <h3 className="font-semibold">In Maintenance</h3>
          </div>
          <p className="text-3xl font-bold">1</p>
          <p className="text-sm text-gray-500">Scheduled maintenance</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <AlertCircle className="w-5 h-5" />
            <h3 className="font-semibold">Alerts</h3>
          </div>
          <p className="text-3xl font-bold">2</p>
          <p className="text-sm text-gray-500">Require attention</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Vehicle Fleet</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Maintenance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{vehicle.number}</div>
                      <div className="text-sm text-gray-500">{vehicle.type}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                      {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{vehicle.driver}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                      {vehicle.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-gray-900">
                        Next: {format(vehicle.nextMaintenance, 'MMM d, yyyy')}
                      </div>
                      <div className="text-gray-500">
                        Last: {format(vehicle.lastMaintenance, 'MMM d, yyyy')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FleetPage;