import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, DollarSign, Calendar, MapPin, Package, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import LocationInput from '../maps/LocationInput';

interface LoadFormData {
  origin: string;
  destination: string;
  pickupDate: string;
  deliveryDate: string;
  rate: string;
  weight: string;
  equipmentType: string;
  description: string;
  distance: number;
}

const PostLoad = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<LoadFormData>({
    origin: '',
    destination: '',
    pickupDate: '',
    deliveryDate: '',
    rate: '',
    weight: '',
    equipmentType: 'Dry Van',
    description: '',
    distance: 0,
  });

  useEffect(() => {
    const fetchOrCreateCompany = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data: companies } = await supabase
          .from('companies')
          .select('id')
          .eq('user_id', user.id)
          .single();

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
  }, []);

  const calculateDistance = async (origin: string, destination: string) => {
    if (!origin || !destination) return;

    const service = new google.maps.DistanceMatrixService();
    
    try {
      const response = await new Promise<google.maps.DistanceMatrixResponse>((resolve, reject) => {
        service.getDistanceMatrix(
          {
            origins: [origin],
            destinations: [destination],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.IMPERIAL,
          },
          (result, status) => {
            if (status === 'OK') {
              resolve(result);
            } else {
              reject(new Error('Failed to calculate distance'));
            }
          }
        );
      });

      const distance = response.rows[0]?.elements[0]?.distance?.value;
      if (distance) {
        // Convert meters to miles and round to nearest whole number
        const miles = Math.round(distance * 0.000621371);
        setFormData(prev => ({ ...prev, distance: miles }));
      }
    } catch (err) {
      console.error('Error calculating distance:', err);
      setError('Failed to calculate distance between locations');
    }
  };

  const handleLocationChange = async (
    field: 'origin' | 'destination',
    value: string,
    placeDetails?: google.maps.places.PlaceResult
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Only calculate distance if both origin and destination are set
    const updatedFormData = {
      ...formData,
      [field]: value,
    };

    if (updatedFormData.origin && updatedFormData.destination) {
      await calculateDistance(updatedFormData.origin, updatedFormData.destination);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) {
      setError('Company setup required before posting loads');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: dbError } = await supabase.from('loads').insert([
        {
          company_id: companyId,
          origin: formData.origin,
          destination: formData.destination,
          pickup_date: formData.pickupDate,
          delivery_date: formData.deliveryDate,
          rate: parseFloat(formData.rate),
          weight: parseFloat(formData.weight),
          equipment_type: formData.equipmentType,
          status: 'PENDING',
          description: formData.description,
          distance: formData.distance,
        },
      ]);

      if (dbError) throw dbError;
      navigate('/loads');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Post a Load</h1>
        <p className="text-gray-600 mt-1">Create a new load posting for carriers</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Origin
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <LocationInput
                  value={formData.origin}
                  onChange={(value, place) => handleLocationChange('origin', value, place)}
                  placeholder="Enter origin city"
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <LocationInput
                  value={formData.destination}
                  onChange={(value, place) => handleLocationChange('destination', value, place)}
                  placeholder="Enter destination city"
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {formData.distance > 0 && (
              <div className="col-span-2">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-700">
                    Estimated distance: {formData.distance} miles
                    {formData.rate && (
                      <span className="ml-2">
                        (${(parseFloat(formData.rate) / formData.distance).toFixed(2)}/mile)
                      </span>
                    )}
                  </p>
                </div>
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
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Additional details about the load..."
            />
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