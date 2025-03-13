import { locations, routes, type Location, type InsertLocation, type Route, type InsertRoute, type TransportOption } from "@shared/schema";

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

    // Add some mock locations
    this.addMockData();
  }

  async searchLocations(query: string): Promise<Location[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.locations.values()).filter(location => 
      location.name.toLowerCase().includes(searchTerm)
    );
  }

  async findRoutes(source: string, destination: string): Promise<Route | undefined> {
    // Generate mock transport options
    const transportOptions: TransportOption[] = [
      {
        type: 'bus',
        duration: 60,
        fare: 30,
        route: [source, 'Bus Stop A', 'Bus Stop B', destination]
      },
      {
        type: 'metro',
        duration: 45,
        fare: 50,
        route: [source, 'Metro Station 1', 'Metro Station 2', destination]
      },
      {
        type: 'train',
        duration: 90,
        fare: 100,
        route: [source, 'Railway Station 1', 'Railway Station 2', destination]
      },
      {
        type: 'cab',
        duration: 40,
        fare: 400,
        route: [source, destination]
      }
    ];

    const route: Route = {
      id: this.currentRouteId++,
      source,
      destination,
      transportOptions,
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
