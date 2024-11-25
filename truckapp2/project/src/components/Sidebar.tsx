import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthProvider';
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
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Search, label: 'Find Loads', path: '/loads' },
    { icon: FileText, label: 'Documents', path: '/documents' },
    { icon: Truck, label: 'Fleet', path: '/fleet' },
    { icon: DollarSign, label: 'Invoices', path: '/invoices' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4">
        <div className="flex items-center gap-2 px-2 mb-8">
          <Truck className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">TruckFlow</span>
        </div>

        <div className="mb-8 px-2">
          <div className="text-sm text-gray-600">Logged in as:</div>
          <div className="font-medium text-gray-900">{profile?.full_name}</div>
          <div className="text-xs text-gray-500">{profile?.role}</div>
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
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-2 py-3 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;