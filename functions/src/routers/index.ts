import { router } from '../trpc';
import { activityRouter } from './activity';
import { goalsRouter } from './goals';
import { aiCoachingRouter } from './ai-coaching';

export const appRouter = router({
  activity: activityRouter,
  goals: goalsRouter,
  ai: aiCoachingRouter,
});

export type AppRouter = typeof appRouter;

