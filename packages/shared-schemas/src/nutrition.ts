import { z } from 'zod';

/**
 * Nutrition Schemas
 */
export const MealSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(1).max(100),
  calories: z.number().nonnegative(),
  protein: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
  fats: z.number().nonnegative(),
  fiber: z.number().nonnegative().optional(),
  sugar: z.number().nonnegative().optional(),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  date: z.string(),
  time: z.string().optional(),
  servingSize: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export type Meal = z.infer<typeof MealSchema>;

export const CreateMealInput = MealSchema.omit({ userId: true });
export type CreateMealInput = z.infer<typeof CreateMealInput>;

/**
 * Water Intake Schema
 */
export const WaterIntakeSchema = z.object({
  userId: z.string().min(1),
  amount: z.number().positive(), // in liters
  date: z.string(),
  timestamp: z.number(),
});

export type WaterIntake = z.infer<typeof WaterIntakeSchema>;

