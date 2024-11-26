import React from 'react';
import { MapPin, Calendar, DollarSign } from 'lucide-react';

const LoadList = () => {
  const loads = [
    {
      id: 1,
      pickup: 'Chicago, IL',
      delivery: 'New York, NY',
      date: '2024-03-15',
      rate: '3,500',
      status: 'In Transit',
      statusColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 2,
      pickup: 'Los Angeles, CA',
      delivery: 'Phoenix, AZ',
      date: '2024-03-16',
      rate: '2,800',
      status: 'Pending',
      statusColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 3,
      pickup: 'Miami, FL',
      delivery: 'Atlanta, GA',
      date: '2024-03-17',
      rate: '2,200',
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-800'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loads.map((load) => (
              <tr key={load.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <MapPin className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{load.pickup}</div>
                      <div className="text-sm text-gray-500">{load.delivery}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{load.date}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-900">${load.rate}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${load.statusColor}`}>
                    {load.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoadList;