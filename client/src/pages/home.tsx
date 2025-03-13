import { Card, CardContent } from "@/components/ui/card";
import SearchForm from "@/components/route-finder/search-form";
import RouteMap from "@/components/route-finder/route-map";
import TransportOptions from "@/components/route-finder/transport-options";
import { useState } from "react";
import type { Route } from "@shared/schema";

export default function Home() {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Public Transport Route Finder
        </h1>
        
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <Card>
              <CardContent className="p-6">
                <SearchForm onRouteFound={setSelectedRoute} />
              </CardContent>
            </Card>

            {selectedRoute && (
              <Card className="mt-8">
                <CardContent className="p-6">
                  <TransportOptions route={selectedRoute} />
                </CardContent>
              </Card>
            )}
          </div>

          <div className="h-[600px] lg:h-auto">
            <Card className="h-full">
              <CardContent className="p-6 h-full">
                <RouteMap route={selectedRoute} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
