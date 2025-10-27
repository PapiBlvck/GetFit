/**
 * GetFit Cloud Functions
 * tRPC API endpoints for backend operations
 */
import { initializeApp } from 'firebase-admin/app';
import { onRequest } from 'firebase-functions/v2/https';
import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import { appRouter } from './routers';
import { createContext } from './trpc';

// Initialize Firebase Admin
initializeApp();

// tRPC HTTP handler
const trpcHandler = createHTTPHandler({
  router: appRouter,
  createContext,
  onError: ({ path, error }) => {
    console.error(`tRPC Error on ${path}:`, error);
  },
});

// Main tRPC endpoint
export const trpc = onRequest(
  {
    cors: true,
    memory: '512MiB',
    timeoutSeconds: 60,
  },
  async (req, res) => {
    await trpcHandler(req, res);
  }
);

// Scheduled function for daily coaching advice generation
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { getFirestore } from 'firebase-admin/firestore';

export const generateDailyCoaching = onSchedule('0 6 * * *', async () => {
  const db = getFirestore();
  
  // Get all active users
  const usersSnapshot = await db.collection('users')
    .where('settings.notifications', '==', true)
    .limit(1000)
    .get();
  
  console.log(`Generating coaching for ${usersSnapshot.size} users`);
  
  // Generate coaching advice for each user
  // This would trigger the AI coaching router internally
  
  return { success: true, usersProcessed: usersSnapshot.size };
});

// Health check endpoint
export const health = onRequest((req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: Date.now() });
});

