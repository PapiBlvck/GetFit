import { useState, useEffect } from 'react';
import {
  createUser,
  getUser,
  updateUser,
  createActivity,
  getUserActivities,
  createWorkout,
  getUserWorkouts,
  createMeal,
  getUserMeals,
  deleteMeal,
  updateWaterIntake,
  getWaterIntake,
  createHealthMetric,
  getUserHealthMetrics,
  createChallenge,
  getChallenges,
  getTodayDate,
  getCurrentTime,
} from '../services/firestore.service';
import type {
  User,
  Activity,
  Workout,
  Meal,
  WaterIntake,
  HealthMetric,
  Challenge,
} from '../types';
import type {
  CreateActivityInput,
  CreateWorkoutInput,
  CreateMealInput,
  CreateWeightEntryInput,
  CreateSleepEntryInput,
  CreateMoodEntryInput,
} from '../lib/validations';

// ==================== USER HOOKS ====================

export const useUser = (userId: string | null) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUser(userId);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const updateUserData = async (updates: Partial<User>) => {
    if (!userId) return;
    try {
      await updateUser(userId, updates);
      setUser(prev => prev ? { ...prev, ...updates } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      throw err;
    }
  };

  return { user, loading, error, updateUser: updateUserData };
};

// ==================== ACTIVITY HOOKS ====================

export const useActivities = (userId: string | null) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getUserActivities(userId);
      setActivities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [userId]);

  const addActivity = async (activityData: CreateActivityInput) => {
    if (!userId) return;
    try {
      const newActivity = await createActivity(userId, activityData);
      setActivities(prev => [newActivity, ...prev]);
      return newActivity;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create activity');
      throw err;
    }
  };

  return { activities, loading, error, addActivity, refreshActivities: fetchActivities };
};

// ==================== WORKOUT HOOKS ====================

export const useWorkouts = (userId: string | null) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkouts = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getUserWorkouts(userId);
      setWorkouts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workouts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [userId]);

  const addWorkout = async (workoutData: CreateWorkoutInput) => {
    if (!userId) return;
    try {
      const newWorkout = await createWorkout(userId, workoutData);
      setWorkouts(prev => [newWorkout, ...prev]);
      return newWorkout;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create workout');
      throw err;
    }
  };

  return { workouts, loading, error, addWorkout, refreshWorkouts: fetchWorkouts };
};

// ==================== MEAL HOOKS ====================

export const useMeals = (userId: string | null, date?: string) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeals = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getUserMeals(userId, date);
      setMeals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch meals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, [userId, date]);

  const addMeal = async (mealData: CreateMealInput) => {
    if (!userId) return;
    try {
      const newMeal = await createMeal(userId, mealData);
      setMeals(prev => [newMeal, ...prev]);
      return newMeal;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create meal');
      throw err;
    }
  };

  const removeMeal = async (mealId: string) => {
    try {
      await deleteMeal(mealId);
      setMeals(prev => prev.filter(m => m.id !== mealId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete meal');
      throw err;
    }
  };

  return { meals, loading, error, addMeal, removeMeal, refreshMeals: fetchMeals };
};

// ==================== WATER INTAKE HOOKS ====================

export const useWaterIntake = (userId: string | null, date: string = getTodayDate()) => {
  const [waterIntake, setWaterIntake] = useState<WaterIntake | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWaterIntake = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getWaterIntake(userId, date);
      setWaterIntake(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch water intake');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaterIntake();
  }, [userId, date]);

  const updateWater = async (glasses: number) => {
    if (!userId) return;
    try {
      const updated = await updateWaterIntake(userId, date, glasses);
      setWaterIntake(updated);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update water intake');
      throw err;
    }
  };

  return { waterIntake, loading, error, updateWater, refreshWaterIntake: fetchWaterIntake };
};

// ==================== HEALTH METRICS HOOKS ====================

export const useHealthMetrics = (
  userId: string | null,
  type?: 'weight' | 'sleep' | 'mood' | 'heartRate'
) => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getUserHealthMetrics(userId, type);
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [userId, type]);

  const addWeightEntry = async (data: CreateWeightEntryInput) => {
    if (!userId) return;
    try {
      const entry = await createHealthMetric(userId, {
        type: 'weight',
        value: data.value,
        date: data.date,
        notes: data.notes,
      });
      setMetrics(prev => [entry, ...prev]);
      return entry;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add weight entry');
      throw err;
    }
  };

  const addSleepEntry = async (data: CreateSleepEntryInput) => {
    if (!userId) return;
    try {
      const entry = await createHealthMetric(userId, {
        type: 'sleep',
        value: data.value,
        date: data.date,
        notes: data.notes,
      });
      setMetrics(prev => [entry, ...prev]);
      return entry;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add sleep entry');
      throw err;
    }
  };

  const addMoodEntry = async (data: CreateMoodEntryInput) => {
    if (!userId) return;
    try {
      const entry = await createHealthMetric(userId, {
        type: 'mood',
        value: data.value,
        date: data.date,
        notes: data.notes,
      });
      setMetrics(prev => [entry, ...prev]);
      return entry;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add mood entry');
      throw err;
    }
  };

  return {
    metrics,
    loading,
    error,
    addWeightEntry,
    addSleepEntry,
    addMoodEntry,
    refreshMetrics: fetchMetrics,
  };
};

// ==================== CHALLENGE HOOKS ====================

export const useChallenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const data = await getChallenges();
      setChallenges(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch challenges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const addChallenge = async (userId: string, challengeData: Omit<Challenge, 'id' | 'createdBy' | 'createdAt' | 'participants'>) => {
    try {
      const newChallenge = await createChallenge(userId, challengeData);
      setChallenges(prev => [newChallenge, ...prev]);
      return newChallenge;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create challenge');
      throw err;
    }
  };

  return { challenges, loading, error, addChallenge, refreshChallenges: fetchChallenges };
};

// ==================== UTILITY HOOKS ====================

export { getTodayDate, getCurrentTime };

