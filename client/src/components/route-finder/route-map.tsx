import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import type { Route } from "@shared/schema";

declare global {
  interface Window {
    google: typeof google;
  }
}

interface RouteMapProps {
  route: Route | null;
}

export default function RouteMap({ route }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg", // Temporary API key for development
      version: "weekly",
      libraries: ["places"]
    });

    loader.load()
      .then(() => {
        if (!mapRef.current) return;

        const defaultCenter = { lat: 28.6139, lng: 77.2090 }; // Default to city center
        const mapOptions: google.maps.MapOptions = {
          center: defaultCenter,
          zoom: 12,
          styles: [
            {
              featureType: "transit",
              elementType: "labels.icon",
              stylers: [{ visibility: "on" }],
            },
          ],
        };

        googleMapRef.current = new window.google.maps.Map(mapRef.current, mapOptions);
        setMapLoaded(true);
      })
      .catch((err) => {
        setError("Failed to load Google Maps. Please try again later.");
        console.error("Google Maps loading error:", err);
      });
  }, []);

  useEffect(() => {
    if (!route || !mapLoaded || !googleMapRef.current) return;

    // Clear existing markers and routes
    googleMapRef.current.data.forEach((feature) => {
      googleMapRef.current?.data.remove(feature);
    });

    // Add markers for source and destination
    const bounds = new window.google.maps.LatLngBounds();
    const sourcePoint = new window.google.maps.LatLng(28.6139, 77.2090); // Mock coordinates
    const destPoint = new window.google.maps.LatLng(28.6304, 77.2177); // Mock coordinates

    bounds.extend(sourcePoint);
    bounds.extend(destPoint);

    new window.google.maps.Marker({
      position: sourcePoint,
      map: googleMapRef.current,
      title: route.source,
      label: "A",
    });

    new window.google.maps.Marker({
      position: destPoint,
      map: googleMapRef.current,
      title: route.destination,
      label: "B",
    });

    googleMapRef.current.fitBounds(bounds);
  }, [route, mapLoaded]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div ref={mapRef} className="w-full h-full rounded-lg" />
  );
}