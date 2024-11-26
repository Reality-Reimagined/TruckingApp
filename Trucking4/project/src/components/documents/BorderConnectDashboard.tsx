import React, { useState } from 'react';
import { Switch } from '@headlessui/react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface BorderConnectDashboardProps {
  parsedData: any;
  profileData: any;
  onSubmit: (data: any) => void;
}

const BorderConnectDashboard: React.FC<BorderConnectDashboardProps> = ({
  parsedData,
  profileData,
  onSubmit,
}) => {
  const [mode, setMode] = useState<'ACE' | 'ACI'>('ACE');
  const [formData, setFormData] = useState(parsedData || {});

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">BorderConnect Dashboard</h2>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${mode === 'ACE' ? 'text-blue-600' : 'text-gray-500'}`}>ACE</span>
          <Switch
            checked={mode === 'ACI'}
            onChange={(checked) => setMode(checked ? 'ACI' : 'ACE')}
            className={`${
              mode === 'ACI' ? 'bg-blue-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
          >
            <span className="sr-only">Enable ACI mode</span>
            <span
              className={`${
                mode === 'ACI' ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
          <span className={`text-sm ${mode === 'ACI' ? 'text-blue-600' : 'text-gray-500'}`}>ACI</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Trip Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Trip Information</h3>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Trip Number"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.tripNumber || ''}
              onChange={(e) => handleInputChange('trip', 'tripNumber', e.target.value)}
            />
            <input
              type="text"
              placeholder={mode === 'ACE' ? 'US Port of Arrival' : 'Port of Entry'}
              className="w-full px-3 py-2 border rounded-md"
              value={formData.portOfArrival || ''}
              onChange={(e) => handleInputChange('trip', 'portOfArrival', e.target.value)}
            />
            <input
              type="datetime-local"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.estimatedArrivalDateTime || ''}
              onChange={(e) => handleInputChange('trip', 'estimatedArrivalDateTime', e.target.value)}
            />
          </div>
        </div>

        {/* Shipment Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Shipment Details</h3>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Commodity Description"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.shipment?.commodity || ''}
              onChange={(e) => handleInputChange('shipment', 'commodity', e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Quantity"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.shipment?.quantity || ''}
                onChange={(e) => handleInputChange('shipment', 'quantity', e.target.value)}
              />
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={formData.shipment?.quantityUnit || ''}
                onChange={(e) => handleInputChange('shipment', 'quantityUnit', e.target.value)}
              >
                <option value="">Select Unit</option>
                <option value="BOX">Box</option>
                <option value="PALLET">Pallet</option>
                <option value="CASE">Case</option>
              </select>
            </div>
          </div>
        </div>

        {/* Additional sections can be added based on mode */}
        {/* ... */}

        <div className="col-span-2">
          <button
            onClick={() => onSubmit(formData)}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit to BorderConnect
          </button>
        </div>
      </div>
    </div>
  );
};

export default BorderConnectDashboard; 