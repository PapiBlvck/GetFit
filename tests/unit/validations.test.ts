import { describe, it, expect } from 'vitest';
import {
  createMealSchema,
  createActivitySchema,
  createWorkoutSchema,
  userProfileSchema,
} from '@lib/validations';

describe('Validation Schemas', () => {
  describe('createMealSchema', () => {
    it('should validate a valid meal', () => {
      const validMeal = {
        name: 'Chicken Salad',
        calories: 350,
        protein: 30,
        carbs: 20,
        fats: 15,
        mealType: 'lunch',
        date: '2024-01-15',
      };

      const result = createMealSchema.safeParse(validMeal);
      expect(result.success).toBe(true);
    });

    it('should reject meal with negative calories', () => {
      const invalidMeal = {
        name: 'Bad Meal',
        calories: -100,
        protein: 30,
        carbs: 20,
        fats: 15,
        mealType: 'lunch',
        date: '2024-01-15',
      };

      const result = createMealSchema.safeParse(invalidMeal);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('calories');
      }
    });

    it('should reject meal with invalid meal type', () => {
      const invalidMeal = {
        name: 'Test Meal',
        calories: 300,
        protein: 20,
        carbs: 30,
        fats: 10,
        mealType: 'invalid',
        date: '2024-01-15',
      };

      const result = createMealSchema.safeParse(invalidMeal);
      expect(result.success).toBe(false);
    });

    it('should require name field', () => {
      const invalidMeal = {
        calories: 300,
        protein: 20,
        carbs: 30,
        fats: 10,
        mealType: 'lunch',
        date: '2024-01-15',
      };

      const result = createMealSchema.safeParse(invalidMeal);
      expect(result.success).toBe(false);
    });
  });

  describe('createActivitySchema', () => {
    it('should validate a valid activity', () => {
      const validActivity = {
        type: 'run',
        distance: 5.0,
        duration: 1800,
        calories: 400,
        date: '2024-01-15',
      };

      const result = createActivitySchema.safeParse(validActivity);
      expect(result.success).toBe(true);
    });

    it('should reject activity with negative duration', () => {
      const invalidActivity = {
        type: 'run',
        distance: 5.0,
        duration: -100,
        calories: 400,
        date: '2024-01-15',
      };

      const result = createActivitySchema.safeParse(invalidActivity);
      expect(result.success).toBe(false);
    });

    it('should accept activity without optional fields', () => {
      const minimalActivity = {
        type: 'walk',
        duration: 600,
        date: '2024-01-15',
      };

      const result = createActivitySchema.safeParse(minimalActivity);
      expect(result.success).toBe(true);
    });
  });

  describe('createWorkoutSchema', () => {
    it('should validate a valid workout', () => {
      const validWorkout = {
        name: 'Morning Strength',
        exercises: [
          {
            name: 'Bench Press',
            sets: 3,
            reps: 10,
            weight: 80,
          },
        ],
        duration: 3600,
        calories: 300,
        date: '2024-01-15',
      };

      const result = createWorkoutSchema.safeParse(validWorkout);
      expect(result.success).toBe(true);
    });

    it('should require at least one exercise', () => {
      const invalidWorkout = {
        name: 'Empty Workout',
        exercises: [],
        duration: 3600,
        calories: 300,
        date: '2024-01-15',
      };

      const result = createWorkoutSchema.safeParse(invalidWorkout);
      expect(result.success).toBe(false);
    });
  });

  describe('userProfileSchema', () => {
    it('should validate a complete user profile', () => {
      const validProfile = {
        displayName: 'John Doe',
        age: 30,
        weight: 75,
        height: 180,
        goals: ['weight-loss', 'strength'],
        activityLevel: 'moderate',
      };

      const result = userProfileSchema.safeParse(validProfile);
      expect(result.success).toBe(true);
    });

    it('should reject profile with invalid age', () => {
      const invalidProfile = {
        displayName: 'John Doe',
        age: 5, // Too young
        weight: 75,
        height: 180,
      };

      const result = userProfileSchema.safeParse(invalidProfile);
      expect(result.success).toBe(false);
    });
  });
});

