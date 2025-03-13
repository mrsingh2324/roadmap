import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchRouteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/locations/search", async (req, res) => {
    try {
      const query = z.string().parse(req.query.q);
      const locations = await storage.searchLocations(query);
      res.json(locations);
    } catch (error) {
      res.status(400).json({ message: "Invalid query parameter" });
    }
  });

  app.post("/api/routes/search", async (req, res) => {
    try {
      const { source, destination } = searchRouteSchema.parse(req.body);
      const route = await storage.findRoutes(source, destination);
      
      if (!route) {
        res.status(404).json({ message: "No routes found" });
        return;
      }
      
      res.json(route);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Failed to find routes" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
