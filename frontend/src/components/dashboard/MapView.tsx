import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fixing the default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// TODO: Django API Integration
// - Fetch asset locations from /api/assets/locations
// - Implement real-time location updates using Django Channels
// - Endpoints needed:
//   * GET /api/assets/locations
//   * GET /api/assets/geofences
//   * WebSocket: ws://domain/ws/assets/location-updates/

interface Turbine {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

interface MapViewProps {
  // Add your props here if needed
}

export const MapView: React.FC<MapViewProps> = () => {
  // Placeholder data for 10 turbines
  const turbines: Turbine[] = [
    { id: 1, name: 'Turbine 1', latitude: 37.7749, longitude: -122.4194 },
    { id: 2, name: 'Turbine 2', latitude: 34.0522, longitude: -118.2437 },
    { id: 3, name: 'Turbine 3', latitude: 40.7128, longitude: -74.006 },
    { id: 4, name: 'Turbine 4', latitude: 41.8781, longitude: -87.6298 },
    { id: 5, name: 'Turbine 5', latitude: 29.7604, longitude: -95.3698 },
    { id: 6, name: 'Turbine 6', latitude: 39.9526, longitude: -75.1652 },
    { id: 7, name: 'Turbine 7', latitude: 33.4484, longitude: -112.074 },
    { id: 8, name: 'Turbine 8', latitude: 29.4241, longitude: -98.4936 },
    { id: 9, name: 'Turbine 9', latitude: 32.7157, longitude: -117.1611 },
    { id: 10, name: 'Turbine 10', latitude: 32.7767, longitude: -96.797 },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-lg font-semibold text-foreground">Asset Locations</h2>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full rounded-md border overflow-hidden">
          <MapContainer
            center={[56.7749, -122.4194]}
            zoom={4}
            className="h-full w-full"
            attributionControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {turbines.map((turbine) => (
              <Marker key={turbine.id} position={[turbine.latitude, turbine.longitude]}>
                <Popup>
                  <div className="p-2">
                    <h3 className="text-sm font-semibold">{turbine.name}</h3>
                    <p className="text-sm text-muted-foreground">ID: {turbine.id}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapView;