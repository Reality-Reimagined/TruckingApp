import React, { useState } from 'react';
import { Shield, Key, Smartphone, History } from 'lucide-react';

const SecuritySettings = () => {
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  return (
    <div className="space-y-6">
      {/* Password Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Key className="w-5 h-5" />
          Password
        </h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          Two-Factor Authentication
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500">
                Add an extra layer of security to your account
              </p>
            </div>
            <button
              onClick={() => setShowTwoFactor(!showTwoFactor)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {showTwoFactor ? 'Disable' : 'Enable'}
            </button>
          </div>
          {showTwoFactor && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Scan this QR code with your authenticator app to enable 2FA
              </p>
              {/* Add QR code component here */}
            </div>
          )}
        </div>
      </div>

      {/* Login History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <History className="w-5 h-5" />
          Login History
        </h2>
        <div className="space-y-4">
          {[
            {
              device: 'Chrome on Windows',
              location: 'Chicago, IL',
              time: '2 hours ago',
              status: 'success',
            },
            {
              device: 'Mobile App on iPhone',
              location: 'Chicago, IL',
              time: '1 day ago',
              status: 'success',
            },
            {
              device: 'Firefox on MacOS',
              location: 'Milwaukee, WI',
              time: '3 days ago',
              status: 'failed',
            },
          ].map((login, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{login.device}</p>
                <p className="text-sm text-gray-500">
                  {login.location} • {login.time}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  login.status === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {login.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;