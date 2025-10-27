import { z } from 'zod';

/**
 * Goal Schema - TDD Compliant
 */
export const GoalSchema = z.object({
  userId: z.string().min(1),
  type: z.enum(['Daily', 'Weekly', 'Steps', 'Calories', 'Workouts', 'Weight', 'Custom']),
  target_value: z.number().nonnegative(),
  current_value: z.number().nonnegative().default(0),
  status: z.enum(['active', 'completed', 'paused', 'failed']).default('active'),
  startDate: z.string(),
  endDate: z.string().optional(),
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export type Goal = z.infer<typeof GoalSchema>;

/**
 * Goal Progress Update
 */
export const GoalProgressSchema = z.object({
  goalId: z.string().min(1),
  progress: z.number().nonnegative(),
  date: z.string(),
});

export type GoalProgress = z.infer<typeof GoalProgressSchema>;

/**
 * Create Goal Input
 */
export const CreateGoalInput = GoalSchema.omit({ userId: true, current_value: true, status: true });
export type CreateGoalInput = z.infer<typeof CreateGoalInput>;

/**
 * Update Goal Input
 */
export const UpdateGoalInput = GoalSchema.partial().required({ userId: true });
export type UpdateGoalInput = z.infer<typeof UpdateGoalInput>;

