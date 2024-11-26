import React from 'react';
import { X, MapPin, Calendar, DollarSign, Truck, Package, FileText, Phone, Mail, User } from 'lucide-react';
import type { Load } from './FindLoads';

interface LoadDetailsModalProps {
  load: Load;
  onClose: () => void;
  onBook?: (id: string) => void;
  onDelete?: (id: string) => void;
  isOwner: boolean;
}

const LoadDetailsModal: React.FC<LoadDetailsModalProps> = ({
  load,
  onClose,
  onBook,
  onDelete,
  isOwner,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleBook = () => {
    if (onBook) {
      onBook(load.id);
      onClose();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(load.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Load Details</h2>
              <p className="text-gray-500 mt-1">Review complete load information</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                load.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                load.status === 'BOOKED' ? 'bg-blue-100 text-blue-800' :
                load.status === 'IN_TRANSIT' ? 'bg-purple-100 text-purple-800' :
                load.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {load.status.replace('_', ' ')}
              </span>
            </div>

            {/* Route Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <div className="font-medium text-gray-900">Route Details</div>
                  <div className="mt-2 space-y-2">
                    <div>
                      <div className="text-sm text-gray-500">Origin</div>
                      <div className="font-medium">{load.origin}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Destination</div>
                      <div className="font-medium">{load.destination}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Total Distance: {load.distance} miles
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <div className="font-medium text-gray-900">Schedule</div>
                  <div className="mt-2 space-y-2">
                    <div>
                      <div className="text-sm text-gray-500">Pickup</div>
                      <div className="font-medium">{formatDate(load.pickup_date)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Delivery</div>
                      <div className="font-medium">{formatDate(load.delivery_date)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Load Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Rate Information</div>
                    <div className="mt-2 space-y-1">
                      <div className="text-xl font-semibold">${load.rate.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">
                        ${load.rate_per_mile.toFixed(2)}/mile
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Equipment Details</div>
                    <div className="mt-2 space-y-1">
                      <div className="font-medium">{load.equipment_type}</div>
                      <div className="text-sm text-gray-500">
                        Weight: {load.weight.toLocaleString()} lbs
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description and Instructions */}
            {(load.description || load.special_instructions) && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Additional Information</div>
                    <div className="mt-2 space-y-4">
                      {load.description && (
                        <div>
                          <div className="text-sm text-gray-500">Description</div>
                          <div className="mt-1">{load.description}</div>
                        </div>
                      )}
                      {load.special_instructions && (
                        <div>
                          <div className="text-sm text-gray-500">Special Instructions</div>
                          <div className="mt-1">{load.special_instructions}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Information */}
            {(load.contact_name || load.contact_phone || load.contact_email) && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Contact Information</div>
                    <div className="mt-2 space-y-2">
                      {load.contact_name && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span>{load.contact_name}</span>
                        </div>
                      )}
                      {load.contact_phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <a
                            href={`tel:${load.contact_phone}`}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            {load.contact_phone}
                          </a>
                        </div>
                      )}
                      {load.contact_email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <a
                            href={`mailto:${load.contact_email}`}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            {load.contact_email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-4">
            {!isOwner && load.status === 'PENDING' && (
              <button
                onClick={handleBook}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Book Load
              </button>
            )}
            {isOwner && load.status === 'PENDING' && (
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Load
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadDetailsModal;