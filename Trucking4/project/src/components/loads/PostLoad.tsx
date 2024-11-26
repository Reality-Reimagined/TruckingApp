import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, DollarSign, Calendar, MapPin, Package, AlertCircle, Info } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import LocationInput from '../maps/LocationInput';
import { useAuthStore } from '../../store/authStore';
import RouteMap from '../maps/RouteMap';

interface LoadFormData {
  origin: string;
  originLat: number | null;
  originLng: number | null;
  destination: string;
  destinationLat: number | null;
  destinationLng: number | null;
  pickupDate: string;
  deliveryDate: string;
  rate: string;
  weight: string;
  equipmentType: string;
  description: string;
  specialInstructions: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  distance: number;
  ratePerMile: number;
}

const PostLoad = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [routeDetails, setRouteDetails] = useState<{
    distance: number;
    duration: number;
    polyline?: string;
  } | null>(null);
  
  const [formData, setFormData] = useState<LoadFormData>({
    origin: '',
    originLat: null,
    originLng: null,
    destination: '',
    destinationLat: null,
    destinationLng: null,
    pickupDate: '',
    deliveryDate: '',
    rate: '',
    weight: '',
    equipmentType: 'Dry Van',
    description: '',
    specialInstructions: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    distance: 0,
    ratePerMile: 0,
  });

  useEffect(() => {
    const fetchOrCreateCompany = async () => {
      try {
        if (!user) throw new Error('Not authenticated');

        const { data: companies, error: fetchError } = await supabase
          .from('companies')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

        if (companies) {
          setCompanyId(companies.id);
        } else {
          const { data: newCompany, error: createError } = await supabase
            .from('companies')
            .insert([
              {
                name: 'Default Company',
                user_id: user.id,
              },
            ])
            .select('id')
            .single();

          if (createError) throw createError;
          if (newCompany) setCompanyId(newCompany.id);
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchOrCreateCompany();
  }, [user]);

  const handleLocationChange = (
    field: 'origin' | 'destination',
    location: Location,
    placeDetails?: google.maps.places.PlaceResult,
    routeInfo?: RouteInfo
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: location.address,
      [`${field}Lat`]: location.coordinates?.lat || null,
      [`${field}Lng`]: location.coordinates?.lng || null,
    }));

    if (routeInfo) {
      setRouteDetails({
        distance: routeInfo.distance,
        duration: routeInfo.duration,
        polyline: routeInfo.polyline,
      });

      // Update rate per mile if rate exists
      if (formData.rate) {
        const ratePerMile = parseFloat(formData.rate) / routeInfo.distance;
        setFormData(prev => ({
          ...prev,
          distance: routeInfo.distance,
          ratePerMile: parseFloat(ratePerMile.toFixed(2)),
        }));
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updates = { [name]: value };
      
      // Recalculate rate per mile when rate changes
      if (name === 'rate' && prev.distance > 0) {
        const rate = parseFloat(value);
        updates.ratePerMile = rate > 0 ? parseFloat((rate / prev.distance).toFixed(2)) : 0;
      }
      
      return { ...prev, ...updates };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: newLoad, error } = await supabase
        .from('loads')
        .insert([
          {
            ...formData,
            user_id: user?.id,
            status: 'PENDING',
            created_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();

      if (error) throw error;

      navigate('/loads');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            <LocationInput
              value={formData.origin}
              onChange={(loc, place, route) => handleLocationChange('origin', loc, place, route)}
              placeholder="Enter origin address"
              paired={formData.destination ? {
                location: {
                  address: formData.destination,
                  coordinates: {
                    lat: formData.destinationLat!,
                    lng: formData.destinationLng!,
                  }
                },
                type: 'destination'
              } : undefined}
              onError={setError}
            />

            <LocationInput
              value={formData.destination}
              onChange={(loc, place, route) => handleLocationChange('destination', loc, place, route)}
              placeholder="Enter destination address"
              paired={formData.origin ? {
                location: {
                  address: formData.origin,
                  coordinates: {
                    lat: formData.originLat!,
                    lng: formData.originLng!,
                  }
                },
                type: 'origin'
              } : undefined}
              onError={setError}
            />

            {formData.originLat && formData.originLng && 
             formData.destinationLat && formData.destinationLng && (
              <div className="mt-6">
                <RouteMap
                  origin={{ lat: formData.originLat, lng: formData.originLng }}
                  destination={{ lat: formData.destinationLat, lng: formData.destinationLng }}
                  polyline={routeDetails?.polyline}
                  className="border border-gray-200"
                />
                {routeDetails && (
                  <div className="mt-2 flex gap-4 text-sm text-gray-600">
                    <div>Distance: {Math.round(routeDetails.distance)} miles</div>
                    <div>Duration: {Math.round(routeDetails.duration)} minutes</div>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="datetime-local"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="datetime-local"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rate (USD)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  name="rate"
                  value={formData.rate}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (lbs)
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipment Type
              </label>
              <div className="relative">
                <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="equipmentType"
                  value={formData.equipmentType}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="Dry Van">Dry Van</option>
                  <option value="Reefer">Reefer</option>
                  <option value="Flatbed">Flatbed</option>
                  <option value="Step Deck">Step Deck</option>
                  <option value="Box Truck">Box Truck</option>
                  <option value="Power Only">Power Only</option>
                </select>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Provide details about the load..."
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions
              </label>
              <textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="Any special requirements or instructions..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Name
              </label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post Load'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostLoad;