import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  FileText,
  Truck,
  DollarSign,
  MessageSquare,
  Settings,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Search, label: 'Find Loads', path: '/loads' },
    { icon: FileText, label: 'Documents', path: '/documents' },
    { icon: Truck, label: 'Fleet', path: '/fleet' },
    { icon: DollarSign, label: 'Invoices', path: '/invoices' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4">
        <div className="flex items-center gap-2 px-2 mb-8">
          <Truck className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">TruckFlow</span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="flex items-center gap-3 px-2 py-3 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-gray-200">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-2 py-3 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
        <button className="flex items-center gap-3 px-2 py-3 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors w-full">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;