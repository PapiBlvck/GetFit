import { z } from 'zod';

/**
 * Time Series Schemas - TDD Compliant
 * For HR, Sleep, Weight tracking
 */
export const TimeSeriesPointSchema = z.object({
  t: z.number(), // timestamp (Unix epoch)
  v: z.number(), // value
});

export const TimeSeriesSchema = z.object({
  userId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  data_type: z.enum(['HR', 'Sleep', 'Weight', 'BloodPressure', 'Glucose']),
  value: z.array(TimeSeriesPointSchema),
  metadata: z.record(z.unknown()).optional(),
});

export type TimeSeriesPoint = z.infer<typeof TimeSeriesPointSchema>;
export type TimeSeries = z.infer<typeof TimeSeriesSchema>;

/**
 * Sleep Tracking
 */
export const SleepDataSchema = z.object({
  userId: z.string().min(1),
  date: z.string(),
  duration: z.number().nonnegative(), // in minutes
  quality: z.number().min(1).max(5), // 1-5 stars
  stages: z.object({
    deep: z.number().nonnegative().optional(),
    light: z.number().nonnegative().optional(),
    rem: z.number().nonnegative().optional(),
    awake: z.number().nonnegative().optional(),
  }).optional(),
  startTime: z.string(),
  endTime: z.string(),
});

export type SleepData = z.infer<typeof SleepDataSchema>;

/**
 * Heart Rate Data
 */
export const HeartRateDataSchema = z.object({
  userId: z.string().min(1),
  timestamp: z.number(),
  bpm: z.number().int().min(30).max(220),
  context: z.enum(['resting', 'active', 'workout', 'recovery']).optional(),
});

export type HeartRateData = z.infer<typeof HeartRateDataSchema>;

