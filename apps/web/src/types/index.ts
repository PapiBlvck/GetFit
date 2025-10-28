// User types
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: number;
  goals: UserGoals;
  settings: UserSettings;
  stats: UserStats;
  friends?: string[]; // Array of friend user IDs
}

export interface UserGoals {
  dailySteps?: number;
  weeklyWorkouts?: number;
  dailyCalories?: number;
  dailyWater?: number;
  targetWeight?: number;
}

export interface UserSettings {
  units: 'metric' | 'imperial';
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    workouts: boolean;
    meals: boolean;
    hydration: boolean;
    achievements: boolean;
    social: boolean;
  };
}

export interface UserStats {
  totalWorkouts: number;
  totalCalories: number;
  currentStreak: number;
  longestStreak: number;
  totalDistance: number;
}

// Activity types
export interface Activity {
  id: string;
  userId: string;
  type: 'run' | 'walk' | 'cycle' | 'swim' | 'other';
  distance: number;
  duration: number; // in seconds
  calories: number;
  date: string; // ISO date
  createdAt: number;
}

// Workout types
export interface Workout {
  id: string;
  userId: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // in minutes
  calories: number;
  exercises?: WorkoutExercise[];
  completedAt: number;
  notes?: string;
}

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps?: number;
  duration?: number; // seconds
  weightKg?: number;
}

// Nutrition types
export interface Meal {
  id: string;
  userId: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  date: string; // ISO date
  time: string;
  image?: string;
  createdAt: number;
}

export interface WaterIntake {
  id: string;
  userId: string;
  glasses: number; // out of 8
  date: string; // ISO date
  updatedAt: number;
}

// Health types
export interface HealthMetric {
  id: string;
  userId: string;
  type: 'weight' | 'sleep' | 'mood' | 'heartRate';
  value: number | string;
  date: string; // ISO date
  createdAt: number;
  notes?: string;
}

export interface WeightEntry extends HealthMetric {
  type: 'weight';
  value: number; // in kg or lbs
  unit: 'kg' | 'lbs';
}

export interface SleepEntry extends HealthMetric {
  type: 'sleep';
  value: number; // hours
  quality?: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

export interface MoodEntry extends HealthMetric {
  type: 'mood';
  value: 'Great' | 'Good' | 'Okay' | 'Down' | 'Stressed';
}

// Social types
export interface Challenge {
  id: string;
  name: string;
  description: string;
  participants: string[]; // user IDs
  daysLeft: number;
  progress: number;
  createdBy: string;
  createdAt: number;
}

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: number;
}

// Daily Summary type
export interface DailySummary {
  id: string;
  userId: string;
  date: string; // ISO date
  stats: {
    steps: number;
    calories: number;
    workouts: number;
    water: number;
    sleepHours: number;
  };
  goals: {
    stepsTarget: number;
    caloriesTarget: number;
    waterTarget: number;
  };
  updatedAt: number;
}
