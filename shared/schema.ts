import { pgTable, text, serial, numeric, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  lat: numeric("lat").notNull(),
  lng: numeric("lng").notNull(),
});

export const routes = pgTable("routes", {
  id: serial("id").primaryKey(),
  source: text("source").notNull(),
  destination: text("destination").notNull(),
  transportOptions: json("transport_options").$type<TransportOption[]>().notNull(),
  rideHailingOptions: json("ride_hailing_options").$type<RideHailingOption[]>().notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export type Location = typeof locations.$inferSelect;
export type InsertLocation = typeof locations.$inferInsert;

export type Route = typeof routes.$inferSelect;
export type InsertRoute = typeof routes.$inferInsert;

export const insertLocationSchema = createInsertSchema(locations);
export const insertRouteSchema = createInsertSchema(routes);

export type TransportOption = {
  type: 'bus' | 'metro' | 'train';
  duration: number; // in minutes
  fare: number;
  route: string[];
};

export type RideHailingOption = {
  type: 'bike' | 'auto' | 'car';
  provider: 'uber' | 'rapido' | 'ola';
  duration: number;
  fare: number;
};

export const searchRouteSchema = z.object({
  source: z.string().min(1, "Source location is required"),
  destination: z.string().min(1, "Destination location is required"),
});

export type SearchRoute = z.infer<typeof searchRouteSchema>;