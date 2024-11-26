import React from 'react';
import { User, Truck, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileInfo = () => {
  const navigate = useNavigate();
  
  // This would typically come from your user context/state management
  const profileData = {
    driver: {
      name: 'John Doe',
      license: 'CDL-123456',
      phone: '(555) 123-4567',
    },
    vehicle: {
      truck: 'Peterbilt 579',
      trailer: 'Utility 3000R',
      dot: 'DOT-987654',
    },
    company: {
      name: 'ABC Trucking LLC',
      mc: 'MC-654321',
      address: '123 Trucking Way, Chicago, IL',
    },
  };

  const handleUpdateProfile = () => {
    navigate('/settings/profile');  // Adjust path based on your routing setup
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <User className="w-5 h-5" />
        Profile Information
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Driver Details</h3>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Name:</span> {profileData.driver.name}
            </div>
            <div className="text-sm">
              <span className="font-medium">License:</span> {profileData.driver.license}
            </div>
            <div className="text-sm">
              <span className="font-medium">Phone:</span> {profileData.driver.phone}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Vehicle Information</h3>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Truck:</span> {profileData.vehicle.truck}
            </div>
            <div className="text-sm">
              <span className="font-medium">Trailer:</span> {profileData.vehicle.trailer}
            </div>
            <div className="text-sm">
              <span className="font-medium">DOT Number:</span> {profileData.vehicle.dot}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Company Details</h3>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Name:</span> {profileData.company.name}
            </div>
            <div className="text-sm">
              <span className="font-medium">MC Number:</span> {profileData.company.mc}
            </div>
            <div className="text-sm">
              <span className="font-medium">Address:</span> {profileData.company.address}
            </div>
          </div>
        </div>

        <button 
          onClick={handleUpdateProfile}
          className="w-full mt-4 px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;