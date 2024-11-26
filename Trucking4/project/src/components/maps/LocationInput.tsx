import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import debounce from 'lodash/debounce';

interface Location {
  address: string;
  placeId?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface LocationInputProps {
  value: string;
  onChange: (location: Location, placeDetails?: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  className?: string;
  onError?: (error: string) => void;
  paired?: {
    location: Location;
    type: 'origin' | 'destination';
  };
}

const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
  onError,
  paired
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location>({ address: value });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize Google Maps
  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
      libraries: ['places'],
    });

    loader
      .load()
      .then(() => {
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error('Error loading Google Maps:', error);
      });
  }, []);

  // Enhanced error handling for geocoding
  const handlePlaceSelection = async (place: google.maps.places.PlaceResult) => {
    try {
      if (!place.geometry?.location) {
        throw new Error('Invalid address selected');
      }

      const newLocation: Location = {
        address: place.formatted_address || '',
        placeId: place.place_id,
        coordinates: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
      };

      setSelectedLocation(newLocation);
      onChange(newLocation, place);

      // If we have a paired location, calculate route
      if (paired?.location.coordinates) {
        await calculateRouteAndDistance(newLocation, paired.location);
      }

      setErrorMessage(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to process address';
      setErrorMessage(message);
      onError?.(message);
    }
  };

  // Calculate route and distance
  const calculateRouteAndDistance = async (loc1: Location, loc2: Location) => {
    if (!loc1.coordinates || !loc2.coordinates) return;

    try {
      // First get the route
      const directionsService = new google.maps.DirectionsService();
      const routeResponse = await directionsService.route({
        origin: loc1.coordinates,
        destination: loc2.coordinates,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      // Then get detailed distance info
      const distanceService = new google.maps.DistanceMatrixService();
      const distanceResponse = await distanceService.getDistanceMatrix({
        origins: [loc1.coordinates],
        destinations: [loc2.coordinates],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        avoidHighways: false,
        avoidTolls: false,
      });

      if (routeResponse.routes[0] && distanceResponse.rows[0]?.elements[0]) {
        const route = routeResponse.routes[0];
        const distance = distanceResponse.rows[0].elements[0].distance;
        const duration = distanceResponse.rows[0].elements[0].duration;

        // Emit route details to parent
        onChange(selectedLocation, undefined, {
          route,
          distance: distance.value / 1609.34, // Convert to miles
          duration: duration.value / 60, // Convert to minutes
          polyline: route.overview_polyline,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to calculate route';
      setErrorMessage(message);
      onError?.(message);
    }
  };

  // Setup autocomplete
  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        fields: ['formatted_address', 'geometry', 'place_id'],
        componentRestrictions: { country: ['us', 'ca'] }, // Allow US and Canada
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.geometry?.location) {
          handlePlaceSelection(place);
        }
      });
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, handlePlaceSelection]);

  // Maintain input value
  useEffect(() => {
    if (value !== selectedLocation.address) {
      setSelectedLocation({ address: value });
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSelectedLocation({ address: newValue });
    onChange({ address: newValue });
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={selectedLocation.address}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`${className} ${errorMessage ? 'border-red-500' : ''}`}
        autoComplete="off"
      />
      {errorMessage && (
        <div className="absolute -bottom-6 left-0 text-sm text-red-500">
          {errorMessage}
        </div>
      )}
      {!isLoaded && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent" />
        </div>
      )}
    </div>
  );
};

export default LocationInput;