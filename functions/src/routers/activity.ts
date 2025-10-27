import { z } from 'zod';
import { router, authedProcedure } from '../trpc';
import { 
  ActivityLogSchema,
  CreateActivityInput,
  WorkoutSessionSchema,
  CreateWorkoutInput
} from '@getfit/shared-schemas';
import { TRPCError } from '@trpc/server';

export const activityRouter = router({
  // Log a new activity
  logActivity: authedProcedure
    .input(CreateActivityInput)
    .mutation(async ({ ctx, input }) => {
      const activityData = {
        ...input,
        userId: ctx.auth.uid,
        createdAt: Date.now(),
      };
      
      const ref = await ctx.db.collection('activityLogs').add(activityData);
      
      // Update user stats
      await updateUserStats(ctx.db, ctx.auth.uid, {
        calories: input.calories_burned || 0,
        steps: input.type === 'steps' ? (input.duration || 0) * 100 : 0, // Estimate
      });
      
      return { id: ref.id, ...activityData };
    }),
  
  // Get daily summary
  getDailySummary: authedProcedure
    .input(z.object({ date: z.string() }))
    .query(async ({ ctx, input }) => {
      const snapshot = await ctx.db
        .collection('activityLogs')
        .where('userId', '==', ctx.auth.uid)
        .where('date', '==', input.date)
        .get();
      
      let totalSteps = 0;
      let totalCalories = 0;
      let totalWorkouts = 0;
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        totalCalories += data.calories_burned || 0;
        if (data.type === 'steps') {
          totalSteps += (data.duration || 0) * 100;
        }
        if (data.type === 'workout') {
          totalWorkouts++;
        }
      });
      
      return {
        steps: totalSteps,
        calories: totalCalories,
        workouts: totalWorkouts,
        date: input.date,
      };
    }),
  
  // Log workout session
  logWorkout: authedProcedure
    .input(CreateWorkoutInput)
    .mutation(async ({ ctx, input }) => {
      // First create activity log
      const activityRef = await ctx.db.collection('activityLogs').add({
        userId: ctx.auth.uid,
        type: 'workout',
        date: input.date,
        duration: input.duration,
        calories_burned: input.calories,
        source: 'manual',
        createdAt: Date.now(),
      });
      
      // Then create detailed workout session
      const workoutData = {
        ...input,
        userId: ctx.auth.uid,
        logId: activityRef.id,
        createdAt: Date.now(),
      };
      
      const workoutRef = await ctx.db.collection('workoutSessions').add(workoutData);
      
      // Update user stats
      await updateUserStats(ctx.db, ctx.auth.uid, {
        workouts: 1,
        calories: input.calories || 0,
        steps: (input.duration || 0) * 2, // Rough estimate
      });
      
      return { id: workoutRef.id, ...workoutData };
    }),
  
  // Get activity history
  getHistory: authedProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
      limit: z.number().int().positive().max(100).default(50),
    }))
    .query(async ({ ctx, input }) => {
      const snapshot = await ctx.db
        .collection('activityLogs')
        .where('userId', '==', ctx.auth.uid)
        .where('date', '>=', input.startDate)
        .where('date', '<=', input.endDate)
        .orderBy('date', 'desc')
        .limit(input.limit)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    }),
});

// Helper function to update user stats
async function updateUserStats(
  db: FirebaseFirestore.Firestore,
  userId: string,
  updates: { workouts?: number; calories?: number; steps?: number }
) {
  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();
  
  if (!userDoc.exists) return;
  
  const currentStats = userDoc.data()?.stats || {};
  
  const newStats = {
    totalWorkouts: (currentStats.totalWorkouts || 0) + (updates.workouts || 0),
    totalCalories: (currentStats.totalCalories || 0) + (updates.calories || 0),
    totalSteps: (currentStats.totalSteps || 0) + (updates.steps || 0),
    currentStreak: currentStats.currentStreak || 0,
    longestStreak: currentStats.longestStreak || 0,
    lastActivityDate: new Date().toISOString().split('T')[0],
  };
  
  await userRef.update({ stats: newStats });
}

