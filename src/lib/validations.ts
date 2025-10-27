import { z } from 'zod';

// User schemas
export const userGoalsSchema = z.object({
  dailySteps: z.number().int().positive().optional(),
  weeklyWorkouts: z.number().int().positive().optional(),
  dailyCalories: z.number().positive().optional(),
  dailyWater: z.number().int().min(1).max(20).optional(),
  targetWeight: z.number().positive().optional(),
});

export const userSettingsSchema = z.object({
  units: z.enum(['metric', 'imperial']).default('metric'),
  theme: z.enum(['light', 'dark', 'auto']).default('dark'),
  notifications: z.object({
    workouts: z.boolean().default(true),
    meals: z.boolean().default(true),
    hydration: z.boolean().default(true),
    achievements: z.boolean().default(true),
    social: z.boolean().default(false),
  }),
});

export const createUserSchema = z.object({
  email: z.string().email(),
  displayName: z.string().min(1).max(100),
  photoURL: z.string().url().optional(),
  goals: userGoalsSchema.optional(),
  settings: userSettingsSchema.optional(),
});

// Activity schemas
export const createActivitySchema = z.object({
  type: z.enum(['run', 'walk', 'cycle', 'swim', 'other']),
  distance: z.number().nonnegative(),
  duration: z.number().int().positive(),
  calories: z.number().nonnegative(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

// Workout schemas
export const workoutExerciseSchema = z.object({
  name: z.string().min(1).max(100),
  sets: z.number().int().positive(),
  reps: z.number().int().positive().optional(),
  duration: z.number().int().positive().optional(),
  weightKg: z.number().nonnegative().optional(),
});

export const createWorkoutSchema = z.object({
  title: z.string().min(1).max(200),
  category: z.string().min(1),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  duration: z.number().int().positive(),
  calories: z.number().nonnegative(),
  exercises: z.array(workoutExerciseSchema).optional(),
  notes: z.string().max(1000).optional(),
});

// Nutrition schemas
export const createMealSchema = z.object({
  type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  name: z.string().min(1).max(200),
  calories: z.number().positive(),
  protein: z.number().nonnegative().optional(),
  carbs: z.number().nonnegative().optional(),
  fats: z.number().nonnegative().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string(),
  image: z.string().url().optional(),
});

export const updateWaterIntakeSchema = z.object({
  glasses: z.number().int().min(0).max(20),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

// Health schemas
export const createWeightEntrySchema = z.object({
  value: z.number().positive(),
  unit: z.enum(['kg', 'lbs']).default('kg'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().max(500).optional(),
});

export const createSleepEntrySchema = z.object({
  value: z.number().min(0).max(24),
  quality: z.enum(['Excellent', 'Good', 'Fair', 'Poor']).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().max(500).optional(),
});

export const createMoodEntrySchema = z.object({
  value: z.enum(['Great', 'Good', 'Okay', 'Down', 'Stressed']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().max(500).optional(),
});

// Challenge schemas
export const createChallengeSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  daysLeft: z.number().int().positive(),
});

// Type exports
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;
export type CreateMealInput = z.infer<typeof createMealSchema>;
export type UpdateWaterIntakeInput = z.infer<typeof updateWaterIntakeSchema>;
export type CreateWeightEntryInput = z.infer<typeof createWeightEntrySchema>;
export type CreateSleepEntryInput = z.infer<typeof createSleepEntrySchema>;
export type CreateMoodEntryInput = z.infer<typeof createMoodEntrySchema>;
export type CreateChallengeInput = z.infer<typeof createChallengeSchema>;

