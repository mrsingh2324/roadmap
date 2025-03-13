import { useState } from 'react';
import { Clock, IndianRupee, Bus, Train, Car, Bike } from 'lucide-react';

export default function TransportOptions({ route }) {
  const [sortBy, setSortBy] = useState("fastest");

  const sortedPublicOptions = [...route.transportOptions].sort((a, b) => {
    if (sortBy === "fastest") {
      return a.duration - b.duration;
    }
    return a.fare - b.fare;
  });

  const sortedRideOptions = [...route.rideHailingOptions].sort((a, b) => {
    if (sortBy === "fastest") {
      return a.duration - b.duration;
    }
    return a.fare - b.fare;
  });

  // Calculate average fares and savings
  const avgPublicFare = route.transportOptions.reduce((sum, opt) => sum + opt.fare, 0) / route.transportOptions.length;
  const avgRideFare = route.rideHailingOptions.reduce((sum, opt) => sum + opt.fare, 0) / route.rideHailingOptions.length;
  const fareDifference = avgRideFare - avgPublicFare;
  const savePercentage = Math.round((fareDifference / avgRideFare) * 100);

  const getTransportIcon = (type) => {
    switch (type) {
      case "bus": return <Bus className="h-5 w-5" />;
      case "metro":
      case "train": return <Train className="h-5 w-5" />;
      case "car": return <Car className="h-5 w-5" />;
      case "bike": return <Bike className="h-5 w-5" />;
      case "auto": return <Car className="h-5 w-5 rotate-45" />;
      default: return <Bus className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Fare Comparison Summary */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">Fare Comparison</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Average Public Transport Fare</p>
            <p className="font-medium">₹{Math.round(avgPublicFare)}</p>
          </div>
          <div>
            <p className="text-gray-600">Average Ride-Hailing Fare</p>
            <p className="font-medium">₹{Math.round(avgRideFare)}</p>
          </div>
        </div>
        <div className="mt-2 p-2 bg-green-50 rounded-md">
          <p className="text-sm font-medium text-green-700">
            Save approximately {savePercentage}% (₹{Math.round(fareDifference)}) by using public transport
          </p>
        </div>
      </div>

      {/* Transport Options Tabs */}
      <div className="space-y-4">
        <div className="flex gap-4 border-b">
          <button
            className={`pb-2 px-4 ${sortBy === "fastest" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
            onClick={() => setSortBy("fastest")}
          >
            Fastest Routes
          </button>
          <button
            className={`pb-2 px-4 ${sortBy === "cheapest" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
            onClick={() => setSortBy("cheapest")}
          >
            Cheapest Routes
          </button>
        </div>

        {/* Public Transport Options */}
        <div>
          <h3 className="font-semibold mb-3">Public Transport Options</h3>
          <div className="space-y-3">
            {sortedPublicOptions.map((option, index) => (
              <div key={`public-${index}`} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getTransportIcon(option.type)}
                    <div>
                      <h4 className="font-semibold capitalize">{option.type}</h4>
                      <div className="text-sm text-gray-600">
                        via {option.route.join(" → ")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {option.duration} mins
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                      <IndianRupee className="h-3 w-3" />
                      {option.fare}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ride-Hailing Options */}
        <div>
          <h3 className="font-semibold mb-3">Ride-Hailing Options</h3>
          <div className="space-y-3">
            {sortedRideOptions.map((option, index) => (
              <div key={`ride-${index}`} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getTransportIcon(option.type)}
                    <div>
                      <h4 className="font-semibold capitalize">
                        {option.provider} {option.type}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {option.duration} mins
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                      <IndianRupee className="h-3 w-3" />
                      {option.fare}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
