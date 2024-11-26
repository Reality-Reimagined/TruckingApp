import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface RouteMapProps {
  origin: {
    lat: number;
    lng: number;
  };
  destination: {
    lat: number;
    lng: number;
  };
  polyline?: string;
  className?: string;
}

const RouteMap: React.FC<RouteMapProps> = ({ origin, destination, polyline, className }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const routeRef = useRef<google.maps.Polyline | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
      libraries: ['places'],
    });

    loader.load().then(() => {
      if (!mapRef.current) return;

      // Initialize map
      const map = new google.maps.Map(mapRef.current, {
        zoom: 6,
        center: origin,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });
      mapInstanceRef.current = map;

      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Add markers
      const originMarker = new google.maps.Marker({
        position: origin,
        map,
        label: 'A',
        animation: google.maps.Animation.DROP,
      });

      const destinationMarker = new google.maps.Marker({
        position: destination,
        map,
        label: 'B',
        animation: google.maps.Animation.DROP,
      });

      markersRef.current = [originMarker, destinationMarker];

      // Fit bounds to show both markers
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(origin);
      bounds.extend(destination);
      map.fitBounds(bounds);

      // Draw route if polyline exists
      if (polyline) {
        if (routeRef.current) {
          routeRef.current.setMap(null);
        }

        const decodedPath = google.maps.geometry.encoding.decodePath(polyline);
        const route = new google.maps.Polyline({
          path: decodedPath,
          geodesic: true,
          strokeColor: '#4F46E5',
          strokeOpacity: 1.0,
          strokeWeight: 3,
        });

        route.setMap(map);
        routeRef.current = route;
      }
    });

    return () => {
      if (routeRef.current) {
        routeRef.current.setMap(null);
      }
      markersRef.current.forEach(marker => marker.setMap(null));
    };
  }, [origin, destination, polyline]);

  return (
    <div 
      ref={mapRef} 
      className={`w-full h-[300px] rounded-lg ${className}`}
    />
  );
};

export default RouteMap;