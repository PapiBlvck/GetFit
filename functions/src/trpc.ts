/**
 * tRPC Context and Initialization
 */
import { initTRPC, TRPCError } from '@trpc/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

export interface Context {
  auth?: {
    uid: string;
    email?: string;
  };
  db: FirebaseFirestore.Firestore;
}

export async function createContext(req: any): Promise<Context> {
  const db = getFirestore();
  
  // Extract auth token from request
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return { db };
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    return {
      auth: {
        uid: decodedToken.uid,
        email: decodedToken.email,
      },
      db,
    };
  } catch (error) {
    console.error('Auth verification failed:', error);
    return { db };
  }
}

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Authenticated procedure - requires valid user
export const authedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.auth) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }
  
  return next({
    ctx: {
      ...ctx,
      auth: ctx.auth,
    },
  });
});

