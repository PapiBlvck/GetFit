import { z } from 'zod';

/**
 * GPS Route Schema - TDD Compliant
 * For tracking runs, cycles, walks with GPS
 */
export const RouteSchema = z.object({
  logId: z.string().min(1),
  userId: z.string().min(1),
  start_time: z.string(),
  end_time: z.string(),
  geojson_path: z.string().url(), // Cloud Storage URL
  distance: z.number().nonnegative(), // in kilometers
  elevation_gain: z.number().nonnegative().optional(), // in meters
  avg_pace: z.number().nonnegative().optional(), // min/km
  max_speed: z.number().nonnegative().optional(), // km/h
  metadata: z.object({
    weather: z.string().optional(),
    temperature: z.number().optional(),
    surface_type: z.enum(['road', 'trail', 'track', 'treadmill']).optional(),
  }).optional(),
});

export type Route = z.infer<typeof RouteSchema>;

/**
 * GeoJSON Structure (simplified)
 */
export const GeoPointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  elevation: z.number().optional(),
  timestamp: z.number().optional(),
});

export const GeoJSONSchema = z.object({
  type: z.literal('LineString'),
  coordinates: z.array(z.tuple([z.number(), z.number(), z.number().optional()])),
  properties: z.record(z.unknown()).optional(),
});

export type GeoPoint = z.infer<typeof GeoPointSchema>;
export type GeoJSON = z.infer<typeof GeoJSONSchema>;

