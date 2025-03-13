import { useState } from 'react';
import SearchForm from '../components/route-finder/search-form';
import RouteMap from '../components/route-finder/route-map';
import TransportOptions from '../components/route-finder/transport-options';

export default function Home() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Public Transport Route Finder
        </h1>
        
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <SearchForm onRouteFound={setSelectedRoute} />
            </div>

            {selectedRoute && (
              <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
                <TransportOptions route={selectedRoute} />
              </div>
            )}
          </div>

          <div className="h-[600px] lg:h-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 h-full">
              <RouteMap route={selectedRoute} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
