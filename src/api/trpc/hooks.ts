import { useQuery } from '@tanstack/react-query';
import { db } from '../../../config/firebase.config';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit 
} from 'firebase/firestore';

// Activity hooks
export function useGetDailySummary(userId: string | undefined) {
  return useQuery({
    queryKey: ['activity', 'dailySummary', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required');
      
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch today's activities from Firestore
      const activitiesRef = collection(db, 'activities');
      const q = query(
        activitiesRef,
        where('userId', '==', userId),
        where('date', '==', today)
      );
      
      const snapshot = await getDocs(q);
      const activities = snapshot.docs.map(doc => doc.data());
      
      // Calculate totals
      const steps = activities.reduce((sum, a) => sum + (a.steps || 0), 0);
      const calories = activities.reduce((sum, a) => sum + (a.calories || 0), 0);
      const heartRate = activities.length > 0 
        ? Math.round(activities.reduce((sum, a) => sum + (a.avgHeartRate || 72), 0) / activities.length)
        : 72;
      
      return {
        steps: steps || 0,
        calories: calories || 0,
        heartRate: heartRate || 72,
        date: today
      };
    },
    enabled: !!userId,
    staleTime: 60 * 1000, // 1 minute
  });
}

// AI Coaching hooks
export function useGetCoachingAdvice(userId: string | undefined) {
  return useQuery({
    queryKey: ['ai', 'coachingAdvice', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required');
      
      // Fetch user's workout history to determine coaching advice
      const workoutsRef = collection(db, 'workouts');
      const q = query(
        workoutsRef,
        where('userId', '==', userId),
        orderBy('completedAt', 'desc'),
        limit(10)
      );
      
      const snapshot = await getDocs(q);
      const workouts = snapshot.docs.map(doc => doc.data());
      
      // Determine workout recommendation based on recent history
      const workoutTypes = workouts.map(w => w.type);
      const hasRecentChest = workoutTypes.some(t => 
        t === 'strength' || t === 'push'
      );
      
      // Generate personalized recommendation
      const recommendations = [
        { title: 'CHEST WORKOUT', duration: '5-8 MIN', type: 'strength' },
        { title: 'CARDIO BLAST', duration: '10-15 MIN', type: 'cardio' },
        { title: 'LEG DAY', duration: '8-12 MIN', type: 'strength' },
        { title: 'HIIT TRAINING', duration: '5-10 MIN', type: 'hiit' },
        { title: 'CORE STRENGTH', duration: '6-8 MIN', type: 'core' },
        { title: 'FULL BODY', duration: '12-15 MIN', type: 'full-body' }
      ];
      
      // Pick recommendation based on what they haven't done recently
      const recommendation = hasRecentChest 
        ? recommendations[1] 
        : recommendations[0];
      
      return {
        title: recommendation.title,
        duration: recommendation.duration,
        type: recommendation.type,
        description: `A personalized ${recommendation.type} workout designed just for you`
      };
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

