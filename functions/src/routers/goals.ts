import { z } from 'zod';
import { router, authedProcedure } from '../trpc';
import { GoalSchema, CreateGoalInput, UpdateGoalInput } from '@getfit/shared-schemas';
import { TRPCError } from '@trpc/server';

export const goalsRouter = router({
  // Create a new goal
  createGoal: authedProcedure
    .input(CreateGoalInput)
    .mutation(async ({ ctx, input }) => {
      const goalData = {
        ...input,
        userId: ctx.auth.uid,
        current_value: 0,
        status: 'active',
        createdAt: Date.now(),
      };
      
      const ref = await ctx.db.collection('goals').add(goalData);
      
      return { id: ref.id, ...goalData };
    }),
  
  // Get user's active goals
  getActiveGoals: authedProcedure
    .query(async ({ ctx }) => {
      const snapshot = await ctx.db
        .collection('goals')
        .where('userId', '==', ctx.auth.uid)
        .where('status', '==', 'active')
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    }),
  
  // Update goal progress
  updateGoalProgress: authedProcedure
    .input(z.object({
      goalId: z.string(),
      progress: z.number().nonnegative(),
    }))
    .mutation(async ({ ctx, input }) => {
      const goalRef = ctx.db.collection('goals').doc(input.goalId);
      const goalDoc = await goalRef.get();
      
      if (!goalDoc.exists) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Goal not found' });
      }
      
      const goalData = goalDoc.data();
      if (goalData?.userId !== ctx.auth.uid) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Not your goal' });
      }
      
      const newValue = (goalData.current_value || 0) + input.progress;
      const isCompleted = newValue >= goalData.target_value;
      
      await goalRef.update({
        current_value: newValue,
        status: isCompleted ? 'completed' : 'active',
        updatedAt: Date.now(),
      });
      
      return {
        id: input.goalId,
        current_value: newValue,
        completed: isCompleted,
      };
    }),
  
  // Update goal
  updateGoal: authedProcedure
    .input(z.object({
      goalId: z.string(),
      updates: z.object({
        target_value: z.number().nonnegative().optional(),
        status: z.enum(['active', 'completed', 'paused', 'failed']).optional(),
        title: z.string().min(1).max(100).optional(),
        description: z.string().max(500).optional(),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      const goalRef = ctx.db.collection('goals').doc(input.goalId);
      const goalDoc = await goalRef.get();
      
      if (!goalDoc.exists) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Goal not found' });
      }
      
      const goalData = goalDoc.data();
      if (goalData?.userId !== ctx.auth.uid) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Not your goal' });
      }
      
      await goalRef.update({
        ...input.updates,
        updatedAt: Date.now(),
      });
      
      return { id: input.goalId, ...input.updates };
    }),
  
  // Delete goal
  deleteGoal: authedProcedure
    .input(z.object({ goalId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const goalRef = ctx.db.collection('goals').doc(input.goalId);
      const goalDoc = await goalRef.get();
      
      if (!goalDoc.exists) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Goal not found' });
      }
      
      const goalData = goalDoc.data();
      if (goalData?.userId !== ctx.auth.uid) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Not your goal' });
      }
      
      await goalRef.delete();
      
      return { success: true };
    }),
});

