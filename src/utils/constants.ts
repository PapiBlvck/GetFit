// App Constants
export const APP_NAME = 'GetFit';
export const APP_VERSION = '1.0.0';

// API Endpoints
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'getfit_auth_token',
  USER_PREFERENCES: 'getfit_user_preferences',
  THEME: 'getfit_theme',
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  FULL: 'MMMM dd, yyyy HH:mm',
} as const;

// Workout Constants
export const WORKOUT_TYPES = [
  'Strength Training',
  'Cardio',
  'Flexibility',
  'Sports',
  'Other',
] as const;

// Meal Types
export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

// Goal Types
export const GOAL_TYPES = ['weight', 'workout', 'nutrition', 'custom'] as const;

// Validation Constants
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 500,
} as const;



