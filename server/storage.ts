import { locations, routes, type Location, type InsertLocation, type Route, type InsertRoute, type TransportOption, type RideHailingOption } from "@shared/schema";

export interface IStorage {
  searchLocations(query: string): Promise<Location[]>;
  findRoutes(source: string, destination: string): Promise<Route | undefined>;
  saveRoute(route: InsertRoute): Promise<Route>;
}

export class MemStorage implements IStorage {
  private locations: Map<number, Location>;
  private routes: Map<number, Route>;
  private currentLocationId: number;
  private currentRouteId: number;

  constructor() {
    this.locations = new Map();
    this.routes = new Map();
    this.currentLocationId = 1;
    this.currentRouteId = 1;

    this.addMockData();
  }

  async searchLocations(query: string): Promise<Location[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.locations.values()).filter(location => 
      location.name.toLowerCase().includes(searchTerm)
    );
  }

  private calculateDistance(source: Location, destination: Location): number {
    // Simple mock distance calculation (in km)
    const lat1 = parseFloat(source.lat.toString());
    const lon1 = parseFloat(source.lng.toString());
    const lat2 = parseFloat(destination.lat.toString());
    const lon2 = parseFloat(destination.lng.toString());

    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  async findRoutes(source: string, destination: string): Promise<Route | undefined> {
    // Mock distance calculation using the first location that matches the names
    const sourceLocation = Array.from(this.locations.values()).find(l => l.name.includes(source));
    const destLocation = Array.from(this.locations.values()).find(l => l.name.includes(destination));

    if (!sourceLocation || !destLocation) return undefined;

    const distance = this.calculateDistance(sourceLocation, destLocation);

    // Generate mock transport options with realistic fares based on distance
    const transportOptions: TransportOption[] = [
      {
        type: 'bus',
        duration: Math.round(distance * 4), // 15 km/h average speed
        fare: Math.round(distance * 2), // ₹2 per km
        route: [source, 'Bus Stop A', 'Bus Stop B', destination]
      },
      {
        type: 'metro',
        duration: Math.round(distance * 2), // 30 km/h average speed
        fare: Math.round(10 + (distance * 2.5)), // Base fare ₹10 + ₹2.5 per km
        route: [source, 'Metro Station 1', 'Metro Station 2', destination]
      },
      {
        type: 'train',
        duration: Math.round(distance * 1.5), // 40 km/h average speed
        fare: Math.round(20 + (distance * 1.5)), // Base fare ₹20 + ₹1.5 per km
        route: [source, 'Railway Station 1', 'Railway Station 2', destination]
      }
    ];

    // Generate mock ride-hailing options
    const rideHailingOptions: RideHailingOption[] = [
      {
        type: 'bike',
        provider: 'rapido',
        duration: Math.round(distance * 2), // 30 km/h average speed
        fare: Math.round(20 + (distance * 6)) // Base fare ₹20 + ₹6 per km
      },
      {
        type: 'auto',
        provider: 'uber',
        duration: Math.round(distance * 2.5), // 24 km/h average speed
        fare: Math.round(30 + (distance * 11)) // Base fare ₹30 + ₹11 per km
      },
      {
        type: 'car',
        provider: 'uber',
        duration: Math.round(distance * 2), // 30 km/h average speed
        fare: Math.round(50 + (distance * 14)) // Base fare ₹50 + ₹14 per km
      }
    ];

    const route: Route = {
      id: this.currentRouteId++,
      source,
      destination,
      transportOptions,
      rideHailingOptions,
      timestamp: new Date()
    };

    this.routes.set(route.id, route);
    return route;
  }

  async saveRoute(route: InsertRoute): Promise<Route> {
    const newRoute = { ...route, id: this.currentRouteId++ };
    this.routes.set(newRoute.id, newRoute);
    return newRoute;
  }

  private addMockData() {
    const mockLocations: InsertLocation[] = [
      { name: "Central Station", lat: "28.6304", lng: "77.2177" },
      { name: "Airport Terminal 3", lat: "28.5562", lng: "77.1000" },
      { name: "City Center Mall", lat: "28.6139", lng: "77.2090" },
      { name: "Tech Park", lat: "28.6129", lng: "77.2295" },
      { name: "University Campus", lat: "28.6519", lng: "77.2315" }
    ];

    mockLocations.forEach(location => {
      const newLocation = { ...location, id: this.currentLocationId++ };
      this.locations.set(newLocation.id, newLocation);
    });
  }
}

export const storage = new MemStorage();