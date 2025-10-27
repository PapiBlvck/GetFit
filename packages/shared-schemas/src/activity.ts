import { z } from 'zod';

/**
 * Activity Log Schema - TDD Compliant
 * Matches the specification from GetFit.txt
 */
export const ActivityLogSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  type: z.enum(['steps', 'workout', 'yoga', 'run', 'cycle', 'swim', 'walk']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  duration: z.number().int().nonnegative().optional(),
  calories_burned: z.number().nonnegative().optional(),
  distance: z.number().nonnegative().optional(), // in kilometers
  source: z.enum(['manual', 'device']).default('manual'),
  notes: z.string().max(500).optional(),
});

export type ActivityLog = z.infer<typeof ActivityLogSchema>;

/**
 * Workout Session Schema
 * Detailed workout with exercises
 */
export const ExerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  sets: z.number().int().positive(),
  reps: z.number().int().positive().optional(),
  weightKg: z.number().nonnegative().optional(),
  duration: z.number().int().nonnegative().optional(), // in seconds
  rpe: z.number().min(1).max(10).optional(), // Rate of Perceived Exertion
  notes: z.string().max(200).optional(),
});

export const WorkoutSessionSchema = z.object({
  logId: z.string().min(1),
  userId: z.string().min(1),
  exercises: z.array(ExerciseSchema).min(1, 'At least one exercise is required'),
  total_sets: z.number().int().nonnegative(),
  total_reps: z.number().int().nonnegative().optional(),
  notes: z.string().max(1000).optional(),
  date: z.string(),
});

export type Exercise = z.infer<typeof ExerciseSchema>;
export type WorkoutSession = z.infer<typeof WorkoutSessionSchema>;

/**
 * Create Activity Input (without userId - added by server)
 */
export const CreateActivityInput = ActivityLogSchema.omit({ userId: true });
export type CreateActivityInput = z.infer<typeof CreateActivityInput>;

export const CreateWorkoutInput = WorkoutSessionSchema.omit({ userId: true, logId: true });
export type CreateWorkoutInput = z.infer<typeof CreateWorkoutInput>;

