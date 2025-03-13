import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, IndianRupee, Bus, Train, Car, Bike } from "lucide-react";
import type { Route, TransportOption, RideHailingOption } from "@shared/schema";

interface TransportOptionsProps {
  route: Route;
}

export default function TransportOptions({ route }: TransportOptionsProps) {
  const [sortBy, setSortBy] = useState<"fastest" | "cheapest">("fastest");

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

  // Calculate average fares
  const avgPublicFare = route.transportOptions.reduce((sum, opt) => sum + opt.fare, 0) / route.transportOptions.length;
  const avgRideFare = route.rideHailingOptions.reduce((sum, opt) => sum + opt.fare, 0) / route.rideHailingOptions.length;
  const fareDifference = avgRideFare - avgPublicFare;
  const savePercentage = Math.round((fareDifference / avgRideFare) * 100);

  const getTransportIcon = (type: TransportOption["type"] | RideHailingOption["type"]) => {
    switch (type) {
      case "bus":
        return <Bus className="h-5 w-5" />;
      case "metro":
      case "train":
        return <Train className="h-5 w-5" />;
      case "car":
        return <Car className="h-5 w-5" />;
      case "bike":
        return <Bike className="h-5 w-5" />;
      case "auto":
        return <Car className="h-5 w-5 rotate-45" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Fare Comparison Summary */}
      <Card className="bg-primary/5">
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2">Fare Comparison</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Average Public Transport Fare</p>
              <p className="font-medium">₹{Math.round(avgPublicFare)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Average Ride-Hailing Fare</p>
              <p className="font-medium">₹{Math.round(avgRideFare)}</p>
            </div>
          </div>
          <div className="mt-2 p-2 bg-primary/10 rounded-md">
            <p className="text-sm font-medium">
              Save approximately {savePercentage}% (₹{Math.round(fareDifference)}) by using public transport
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="fastest" onValueChange={(v) => setSortBy(v as "fastest" | "cheapest")}>
        <TabsList className="mb-4">
          <TabsTrigger value="fastest">Fastest Routes</TabsTrigger>
          <TabsTrigger value="cheapest">Cheapest Routes</TabsTrigger>
        </TabsList>

        <TabsContent value={sortBy}>
          <div className="space-y-6">
            {/* Public Transport Options */}
            <div>
              <h3 className="font-semibold mb-3">Public Transport Options</h3>
              <div className="space-y-3">
                {sortedPublicOptions.map((option, index) => (
                  <Card key={`public-${index}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getTransportIcon(option.type)}
                          <div>
                            <h3 className="font-semibold capitalize">{option.type}</h3>
                            <div className="text-sm text-muted-foreground">
                              via {option.route.join(" → ")}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {option.duration} mins
                          </Badge>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <IndianRupee className="h-3 w-3" />
                            {option.fare}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Ride-Hailing Options */}
            <div>
              <h3 className="font-semibold mb-3">Ride-Hailing Options</h3>
              <div className="space-y-3">
                {sortedRideOptions.map((option, index) => (
                  <Card key={`ride-${index}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getTransportIcon(option.type)}
                          <div>
                            <h3 className="font-semibold capitalize">
                              {option.provider} {option.type}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {option.duration} mins
                          </Badge>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <IndianRupee className="h-3 w-3" />
                            {option.fare}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}