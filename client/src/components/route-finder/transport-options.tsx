import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, IndianRupee, Bus, Train, Car } from "lucide-react";
import type { Route, TransportOption } from "@shared/schema";

interface TransportOptionsProps {
  route: Route;
}

export default function TransportOptions({ route }: TransportOptionsProps) {
  const [sortBy, setSortBy] = useState<"fastest" | "cheapest">("fastest");

  const sortedOptions = [...route.transportOptions].sort((a, b) => {
    if (sortBy === "fastest") {
      return a.duration - b.duration;
    }
    return a.fare - b.fare;
  });

  const getTransportIcon = (type: TransportOption["type"]) => {
    switch (type) {
      case "bus":
        return <Bus className="h-5 w-5" />;
      case "metro":
      case "train":
        return <Train className="h-5 w-5" />;
      case "cab":
        return <Car className="h-5 w-5" />;
    }
  };

  return (
    <div>
      <Tabs defaultValue="fastest" onValueChange={(v) => setSortBy(v as "fastest" | "cheapest")}>
        <TabsList className="mb-4">
          <TabsTrigger value="fastest">Fastest Routes</TabsTrigger>
          <TabsTrigger value="cheapest">Cheapest Routes</TabsTrigger>
        </TabsList>

        <TabsContent value={sortBy}>
          <div className="space-y-4">
            {sortedOptions.map((option, index) => (
              <Card key={index}>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
