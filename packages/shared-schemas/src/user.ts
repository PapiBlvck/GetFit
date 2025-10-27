import { z } from 'zod';

/**
 * User Profile Schema - TDD Compliant
 */
export const UserProfileSchema = z.object({
  uid: z.string().min(1),
  email: z.string().email(),
  displayName: z.string().min(1).max(100).optional(),
  role: z.enum(['user', 'admin', 'coach']).default('user'),
  settings: z.object({
    units: z.enum(['metric', 'imperial']).default('metric'),
    theme: z.enum(['light', 'dark', 'auto']).default('auto'),
    notifications: z.boolean().default(true),
    language: z.string().default('en'),
  }).optional(),
  target_goals: z.object({
    daily_steps: z.number().int().positive().default(10000),
    daily_calories: z.number().int().positive().default(2000),
    weekly_workouts: z.number().int().positive().default(3),
    target_weight: z.number().nonnegative().optional(),
  }).optional(),
  device_ids: z.array(z.string()).default([]),
  profile: z.object({
    age: z.number().int().min(13).max(120).optional(),
    weight: z.number().nonnegative().optional(), // in kg
    height: z.number().nonnegative().optional(), // in cm
    gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional(),
    activity_level: z.enum(['sedentary', 'light', 'moderate', 'active', 'very-active']).optional(),
  }).optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

/**
 * User Stats Schema
 */
export const UserStatsSchema = z.object({
  totalWorkouts: z.number().int().nonnegative().default(0),
  totalCalories: z.number().nonnegative().default(0),
  totalSteps: z.number().int().nonnegative().default(0),
  totalDistance: z.number().nonnegative().default(0), // in km
  currentStreak: z.number().int().nonnegative().default(0),
  longestStreak: z.number().int().nonnegative().default(0),
  lastActivityDate: z.string().optional(),
});

export type UserStats = z.infer<typeof UserStatsSchema>;

