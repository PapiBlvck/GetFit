import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../../config/firebase.config.ts';
import type {
  User,
  Activity,
  Workout,
  Meal,
  WaterIntake,
  HealthMetric,
  Challenge,
  DailySummary,
} from '../types';

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  ACTIVITIES: 'activities',
  WORKOUTS: 'workouts',
  MEALS: 'meals',
  WATER_INTAKE: 'water_intake',
  HEALTH_METRICS: 'health_metrics',
  CHALLENGES: 'challenges',
  DAILY_SUMMARIES: 'daily_summaries',
} as const;

// Helper to convert Firestore timestamp to number
const timestampToNumber = (data: DocumentData): any => {
  const converted = { ...data };
  Object.keys(converted).forEach(key => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toMillis();
    }
  });
  return converted;
};

// ==================== USER OPERATIONS ====================

export const createUser = async (userId: string, userData: Partial<User>): Promise<User> => {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  const user: User = {
    id: userId,
    email: userData.email || '',
    displayName: userData.displayName || '',
    photoURL: userData.photoURL,
    createdAt: Date.now(),
    goals: userData.goals || {},
    settings: userData.settings || {
      units: 'metric',
      theme: 'dark',
      notifications: {
        workouts: true,
        meals: true,
        hydration: true,
        achievements: true,
        social: false,
      },
    },
    stats: {
      totalWorkouts: 0,
      totalCalories: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalDistance: 0,
    },
    friends: [], // Initialize empty friends array
  };
  
  await setDoc(userRef, user);
  return user;
};

export const getUser = async (userId: string): Promise<User | null> => {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    return null;
  }
  
  return timestampToNumber({ id: userSnap.id, ...userSnap.data() }) as User;
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<void> => {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  await updateDoc(userRef, updates);
};

// ==================== ACTIVITY OPERATIONS ====================

export const createActivity = async (userId: string, activityData: Omit<Activity, 'id' | 'userId' | 'createdAt'>): Promise<Activity> => {
  const activitiesRef = collection(db, COLLECTIONS.ACTIVITIES);
  const activityRef = doc(activitiesRef);
  
  const activity: Activity = {
    id: activityRef.id,
    userId,
    ...activityData,
    createdAt: Date.now(),
  };
  
  await setDoc(activityRef, activity);
  return activity;
};

export const getUserActivities = async (userId: string, limitCount = 50): Promise<Activity[]> => {
  const activitiesRef = collection(db, COLLECTIONS.ACTIVITIES);
  const q = query(
    activitiesRef,
    where('userId', '==', userId),
    orderBy('date', 'desc'),
    limit(limitCount)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => timestampToNumber({ id: doc.id, ...doc.data() }) as Activity);
};

export const deleteActivity = async (activityId: string): Promise<void> => {
  const activityRef = doc(db, COLLECTIONS.ACTIVITIES, activityId);
  await deleteDoc(activityRef);
};

// ==================== WORKOUT OPERATIONS ====================

export const createWorkout = async (userId: string, workoutData: Omit<Workout, 'id' | 'userId' | 'completedAt'>): Promise<Workout> => {
  const workoutsRef = collection(db, COLLECTIONS.WORKOUTS);
  const workoutRef = doc(workoutsRef);
  
  const workout: Workout = {
    id: workoutRef.id,
    userId,
    ...workoutData,
    completedAt: Date.now(),
  };
  
  await setDoc(workoutRef, workout);
  
  // Update user stats
  await updateUserStats(userId, { totalWorkouts: 1, totalCalories: workout.calories });
  
  return workout;
};

export const getUserWorkouts = async (userId: string, limitCount = 50): Promise<Workout[]> => {
  const workoutsRef = collection(db, COLLECTIONS.WORKOUTS);
  const q = query(
    workoutsRef,
    where('userId', '==', userId),
    orderBy('completedAt', 'desc'),
    limit(limitCount)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => timestampToNumber({ id: doc.id, ...doc.data() }) as Workout);
};

// ==================== MEAL OPERATIONS ====================

export const createMeal = async (userId: string, mealData: Omit<Meal, 'id' | 'userId' | 'createdAt'>): Promise<Meal> => {
  const mealsRef = collection(db, COLLECTIONS.MEALS);
  const mealRef = doc(mealsRef);
  
  const meal: Meal = {
    id: mealRef.id,
    userId,
    ...mealData,
    createdAt: Date.now(),
  };
  
  await setDoc(mealRef, meal);
  return meal;
};

export const getUserMeals = async (userId: string, date?: string, limitCount = 50): Promise<Meal[]> => {
  const mealsRef = collection(db, COLLECTIONS.MEALS);
  const constraints: QueryConstraint[] = [
    where('userId', '==', userId),
  ];
  
  if (date) {
    constraints.push(where('date', '==', date));
  }
  
  constraints.push(orderBy('createdAt', 'desc'));
  constraints.push(limit(limitCount));
  
  const q = query(mealsRef, ...constraints);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => timestampToNumber({ id: doc.id, ...doc.data() }) as Meal);
};

export const deleteMeal = async (mealId: string): Promise<void> => {
  const mealRef = doc(db, COLLECTIONS.MEALS, mealId);
  await deleteDoc(mealRef);
};

// ==================== WATER INTAKE OPERATIONS ====================

export const updateWaterIntake = async (userId: string, date: string, glasses: number): Promise<WaterIntake> => {
  const waterRef = doc(db, COLLECTIONS.WATER_INTAKE, `${userId}_${date}`);
  
  const waterIntake: WaterIntake = {
    id: `${userId}_${date}`,
    userId,
    glasses,
    date,
    updatedAt: Date.now(),
  };
  
  await setDoc(waterRef, waterIntake);
  return waterIntake;
};

export const getWaterIntake = async (userId: string, date: string): Promise<WaterIntake | null> => {
  const waterRef = doc(db, COLLECTIONS.WATER_INTAKE, `${userId}_${date}`);
  const waterSnap = await getDoc(waterRef);
  
  if (!waterSnap.exists()) {
    return null;
  }
  
  return timestampToNumber({ id: waterSnap.id, ...waterSnap.data() }) as WaterIntake;
};

// ==================== HEALTH METRICS OPERATIONS ====================

export const createHealthMetric = async (userId: string, metricData: Omit<HealthMetric, 'id' | 'userId' | 'createdAt'>): Promise<HealthMetric> => {
  const metricsRef = collection(db, COLLECTIONS.HEALTH_METRICS);
  const metricRef = doc(metricsRef);
  
  const metric: HealthMetric = {
    id: metricRef.id,
    userId,
    ...metricData,
    createdAt: Date.now(),
  };
  
  await setDoc(metricRef, metric);
  return metric;
};

export const getUserHealthMetrics = async (
  userId: string,
  type?: 'weight' | 'sleep' | 'mood' | 'heartRate',
  limitCount = 50
): Promise<HealthMetric[]> => {
  const metricsRef = collection(db, COLLECTIONS.HEALTH_METRICS);
  const constraints: QueryConstraint[] = [
    where('userId', '==', userId),
  ];
  
  if (type) {
    constraints.push(where('type', '==', type));
  }
  
  constraints.push(orderBy('date', 'desc'));
  constraints.push(limit(limitCount));
  
  const q = query(metricsRef, ...constraints);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => timestampToNumber({ id: doc.id, ...doc.data() }) as HealthMetric);
};

// ==================== CHALLENGE OPERATIONS ====================

export const createChallenge = async (userId: string, challengeData: Omit<Challenge, 'id' | 'createdBy' | 'createdAt' | 'participants'>): Promise<Challenge> => {
  const challengesRef = collection(db, COLLECTIONS.CHALLENGES);
  const challengeRef = doc(challengesRef);
  
  const challenge: Challenge = {
    id: challengeRef.id,
    ...challengeData,
    participants: [userId],
    createdBy: userId,
    createdAt: Date.now(),
  };
  
  await setDoc(challengeRef, challenge);
  return challenge;
};

export const getChallenges = async (limitCount = 20): Promise<Challenge[]> => {
  const challengesRef = collection(db, COLLECTIONS.CHALLENGES);
  const q = query(challengesRef, orderBy('createdAt', 'desc'), limit(limitCount));
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => timestampToNumber({ id: doc.id, ...doc.data() }) as Challenge);
};

export const joinChallenge = async (challengeId: string, userId: string): Promise<void> => {
  const challengeRef = doc(db, COLLECTIONS.CHALLENGES, challengeId);
  const challengeSnap = await getDoc(challengeRef);
  
  if (challengeSnap.exists()) {
    const challenge = challengeSnap.data() as Challenge;
    if (!challenge.participants.includes(userId)) {
      await updateDoc(challengeRef, {
        participants: [...challenge.participants, userId],
      });
    }
  }
};

// ==================== HELPER FUNCTIONS ====================

const updateUserStats = async (userId: string, statsUpdate: Partial<User['stats']>): Promise<void> => {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const user = userSnap.data() as User;
    const updatedStats = {
      ...user.stats,
      totalWorkouts: (user.stats.totalWorkouts || 0) + (statsUpdate.totalWorkouts || 0),
      totalCalories: (user.stats.totalCalories || 0) + (statsUpdate.totalCalories || 0),
      totalDistance: (user.stats.totalDistance || 0) + (statsUpdate.totalDistance || 0),
    };
    
    await updateDoc(userRef, { stats: updatedStats });
  }
};

// Get today's date in ISO format (YYYY-MM-DD)
export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Get formatted time (HH:MM AM/PM)
export const getCurrentTime = (): string => {
  return new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

// ==================== SOCIAL OPERATIONS ====================

/**
 * Fetch global leaderboard - Top 10 users by total workouts completed
 */
export const fetchLeaderboard = async (limitCount = 10): Promise<Array<{
  id: string;
  displayName: string;
  photoURL?: string;
  totalWorkouts: number;
  rank: number;
}>> => {
  try {
    const usersRef = collection(db, COLLECTIONS.USERS);
    const q = query(
      usersRef,
      orderBy('stats.totalWorkouts', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const leaderboard = querySnapshot.docs.map((doc, index) => {
      const userData = doc.data();
      return {
        id: doc.id,
        displayName: userData.displayName || 'Anonymous User',
        photoURL: userData.photoURL,
        totalWorkouts: userData.stats?.totalWorkouts || 0,
        rank: index + 1
      };
    });
    
    return leaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

/**
 * Fetch friends' recent activity - Recent workouts from user's friends
 */
export const fetchFriendsActivity = async (
  friendIds: string[], 
  limitCount = 5
): Promise<Array<{
  id: string;
  userName: string;
  userPhoto?: string;
  workoutTitle: string;
  workoutCategory: string;
  completedAt: number;
  calories: number;
  duration: number;
}>> => {
  try {
    // If no friends, return empty array
    if (!friendIds || friendIds.length === 0) {
      return [];
    }
    
    const workoutsRef = collection(db, COLLECTIONS.WORKOUTS);
    
    // Firestore 'in' query has a limit of 10 items, so we need to handle this
    const friendIdsToQuery = friendIds.slice(0, 10);
    
    const q = query(
      workoutsRef,
      where('userId', 'in', friendIdsToQuery),
      orderBy('completedAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    
    // Fetch user details for each workout
    const activities = await Promise.all(
      querySnapshot.docs.map(async (workoutDoc) => {
        const workoutData = workoutDoc.data();
        
        // Fetch the user who completed this workout
        const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, workoutData.userId));
        const userData = userDoc.exists() ? userDoc.data() : null;
        
        return {
          id: workoutDoc.id,
          userName: userData?.displayName || 'Unknown User',
          userPhoto: userData?.photoURL,
          workoutTitle: workoutData.title || 'Workout',
          workoutCategory: workoutData.category || 'General',
          completedAt: workoutData.completedAt || Date.now(),
          calories: workoutData.calories || 0,
          duration: workoutData.duration || 0
        };
      })
    );
    
    return activities;
  } catch (error) {
    console.error('Error fetching friends activity:', error);
    return [];
  }
};

/**
 * Add a friend by email or user ID
 */
export const addFriendByEmailOrId = async (
  currentUserId: string, 
  emailOrId: string
): Promise<{ success: boolean; message: string; friendUser?: any }> => {
  try {
    const usersRef = collection(db, COLLECTIONS.USERS);
    let targetUserDoc = null;
    
    // Try to find user by ID first
    const userByIdRef = doc(db, COLLECTIONS.USERS, emailOrId);
    const userByIdSnap = await getDoc(userByIdRef);
    
    if (userByIdSnap.exists()) {
      targetUserDoc = userByIdSnap;
    } else {
      // Try to find by email
      const emailQuery = query(usersRef, where('email', '==', emailOrId), limit(1));
      const emailQuerySnapshot = await getDocs(emailQuery);
      
      if (!emailQuerySnapshot.empty) {
        targetUserDoc = emailQuerySnapshot.docs[0];
      }
    }
    
    if (!targetUserDoc) {
      return { success: false, message: 'User not found. Please check the email or ID.' };
    }
    
    const targetUserId = targetUserDoc.id;
    
    // Don't allow adding yourself as a friend
    if (targetUserId === currentUserId) {
      return { success: false, message: 'You cannot add yourself as a friend.' };
    }
    
    // Get current user's data
    const currentUserRef = doc(db, COLLECTIONS.USERS, currentUserId);
    const currentUserSnap = await getDoc(currentUserRef);
    
    if (!currentUserSnap.exists()) {
      return { success: false, message: 'Current user not found.' };
    }
    
    const currentUserData = currentUserSnap.data();
    const currentFriends = currentUserData.friends || [];
    
    // Check if already friends
    if (currentFriends.includes(targetUserId)) {
      return { success: false, message: 'This user is already in your friends list.' };
    }
    
    // Add friend to the friends array
    await updateDoc(currentUserRef, {
      friends: [...currentFriends, targetUserId]
    });
    
    const targetUserData = targetUserDoc.data();
    
    return { 
      success: true, 
      message: `Successfully added ${targetUserData.displayName || 'user'} as a friend!`,
      friendUser: {
        id: targetUserId,
        displayName: targetUserData.displayName,
        photoURL: targetUserData.photoURL
      }
    };
  } catch (error) {
    console.error('Error adding friend:', error);
    return { success: false, message: 'An error occurred while adding friend. Please try again.' };
  }
};

/**
 * Get user's friends list with their details
 */
export const getUserFriends = async (userId: string): Promise<Array<{
  id: string;
  displayName: string;
  photoURL?: string;
  stats: UserStats;
}>> => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return [];
    }
    
    const userData = userSnap.data();
    const friendIds = userData.friends || [];
    
    if (friendIds.length === 0) {
      return [];
    }
    
    // Fetch friend details
    const friendPromises = friendIds.map(async (friendId: string) => {
      const friendRef = doc(db, COLLECTIONS.USERS, friendId);
      const friendSnap = await getDoc(friendRef);
      
      if (friendSnap.exists()) {
        const friendData = friendSnap.data();
        return {
          id: friendSnap.id,
          displayName: friendData.displayName || 'Unknown User',
          photoURL: friendData.photoURL,
          stats: friendData.stats || {
            totalWorkouts: 0,
            totalCalories: 0,
            currentStreak: 0,
            longestStreak: 0,
            totalDistance: 0
          }
        };
      }
      return null;
    });
    
    const friends = await Promise.all(friendPromises);
    return friends.filter(friend => friend !== null) as Array<{
      id: string;
      displayName: string;
      photoURL?: string;
      stats: UserStats;
    }>;
  } catch (error) {
    console.error('Error fetching user friends:', error);
    return [];
  }
};

