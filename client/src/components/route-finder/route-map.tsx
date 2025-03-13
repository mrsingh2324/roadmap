import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import type { Route } from "@shared/schema";
import { LatLngExpression } from "leaflet";

interface RouteMapProps {
  route: Route | null;
}

export default function RouteMap({ route }: RouteMapProps) {
  // Default center coordinates (Delhi)
  const defaultCenter: LatLngExpression = [28.6139, 77.2090];
  const defaultZoom = 12;

  const [sourcePoint, setSourcePoint] = useState<LatLngExpression | null>(null);
  const [destPoint, setDestPoint] = useState<LatLngExpression | null>(null);

  useEffect(() => {
    if (route) {
      // For demo, using mock coordinates
      setSourcePoint([28.6139, 77.2090]);
      setDestPoint([28.6304, 77.2177]);
    }
  }, [route]);

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {sourcePoint && (
        <Marker position={sourcePoint}>
          <Popup>{route?.source}</Popup>
        </Marker>
      )}

      {destPoint && (
        <Marker position={destPoint}>
          <Popup>{route?.destination}</Popup>
        </Marker>
      )}

      {sourcePoint && destPoint && (
        <Polyline
          positions={[sourcePoint, destPoint]}
          color="blue"
          weight={3}
          opacity={0.7}
        />
      )}
    </MapContainer>
  );
}