import { z } from 'zod';
import { router, authedProcedure } from '../trpc';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const aiCoachingRouter = router({
  // Get personalized coaching advice
  getCoachingAdvice: authedProcedure
    .input(z.object({
      weekData: z.object({
        workouts: z.number().int().nonnegative(),
        totalCalories: z.number().nonnegative(),
        totalSteps: z.number().int().nonnegative(),
        averageSleep: z.number().nonnegative(),
        goals: z.array(z.object({
          type: z.string(),
          progress: z.number(),
          target: z.number(),
        })),
      }),
      userProfile: z.object({
        age: z.number().optional(),
        weight: z.number().optional(),
        activityLevel: z.string().optional(),
        goals: z.array(z.string()).optional(),
      }).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Check cache first
        const cacheKey = `coaching_${ctx.auth.uid}_${new Date().toISOString().split('T')[0]}`;
        const cachedAdvice = await getCachedAdvice(ctx.db, cacheKey);
        
        if (cachedAdvice) {
          return { advice: cachedAdvice, cached: true };
        }
        
        // Generate new advice using OpenAI
        const prompt = generateCoachingPrompt(input);
        
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are Francine, an expert AI fitness coach. Provide personalized, encouraging, and actionable fitness advice based on user data. Be specific, motivating, and focus on sustainable progress. Keep responses concise (150-200 words).`,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 300,
          temperature: 0.7,
        });
        
        const advice = completion.choices[0].message.content || 'Keep up the great work! Stay consistent with your routine.';
        
        // Cache the advice for the day
        await cacheAdvice(ctx.db, cacheKey, advice);
        
        return { advice, cached: false };
      } catch (error) {
        console.error('OpenAI error:', error);
        
        // Fallback to rule-based advice
        return {
          advice: generateFallbackAdvice(input.weekData),
          cached: false,
          fallback: true,
        };
      }
    }),
  
  // Get quick tips
  getQuickTip: authedProcedure
    .input(z.object({
      category: z.enum(['workout', 'nutrition', 'recovery', 'motivation']),
    }))
    .query(async ({ ctx, input }) => {
      const tips = {
        workout: [
          'Focus on compound movements like squats and deadlifts for maximum efficiency.',
          'Progressive overload is key - gradually increase weight or reps each week.',
          'Don\'t skip warm-ups! 5-10 minutes can prevent injuries.',
        ],
        nutrition: [
          'Aim for 1.6-2.2g of protein per kg of body weight for muscle growth.',
          'Hydration matters! Drink water before, during, and after workouts.',
          'Pre-workout carbs fuel performance; post-workout protein aids recovery.',
        ],
        recovery: [
          'Sleep is when muscles grow. Aim for 7-9 hours nightly.',
          'Active recovery (light walks, yoga) can speed up muscle repair.',
          'Don\'t train the same muscle groups on consecutive days.',
        ],
        motivation: [
          'Small consistent actions beat perfect plans. Show up today!',
          'Track your progress weekly - seeing improvement is motivating!',
          'Find a workout buddy or join online communities for accountability.',
        ],
      };
      
      const categoryTips = tips[input.category];
      const randomTip = categoryTips[Math.floor(Math.random() * categoryTips.length)];
      
      return { tip: randomTip, category: input.category };
    }),
});

// Helper functions
function generateCoachingPrompt(input: any): string {
  const { weekData, userProfile } = input;
  
  return `
User's Weekly Summary:
- Workouts completed: ${weekData.workouts}
- Total calories burned: ${weekData.totalCalories}
- Total steps: ${weekData.totalSteps}
- Average sleep: ${weekData.averageSleep} hours

Goals Progress:
${weekData.goals.map((g: any) => `- ${g.type}: ${((g.progress / g.target) * 100).toFixed(1)}% complete`).join('\n')}

${userProfile ? `User Profile:
- Age: ${userProfile.age || 'N/A'}
- Weight: ${userProfile.weight || 'N/A'} kg
- Activity Level: ${userProfile.activityLevel || 'N/A'}
- Goals: ${userProfile.goals?.join(', ') || 'General fitness'}` : ''}

Based on this data, provide personalized coaching advice including:
1. Recognition of achievements
2. Specific recommendations for improvement
3. One actionable tip for next week
`.trim();
}

function generateFallbackAdvice(weekData: any): string {
  const { workouts, totalCalories, totalSteps } = weekData;
  
  if (workouts === 0) {
    return "Let's get started! Even a 20-minute workout can make a difference. Choose something you enjoy and commit to 3 sessions this week.";
  }
  
  if (workouts < 3) {
    return `You completed ${workouts} workout${workouts > 1 ? 's' : ''} this week! To see better results, aim for 3-4 sessions weekly. You're building a great foundation!`;
  }
  
  if (workouts >= 3 && totalSteps < 50000) {
    return `Excellent workout consistency with ${workouts} sessions! Consider adding more daily movement - aim for 10,000 steps daily to boost overall health.`;
  }
  
  return `Outstanding work! ${workouts} workouts, ${totalCalories.toLocaleString()} calories burned, and ${totalSteps.toLocaleString()} steps. You're on fire! Keep this momentum while ensuring adequate rest and recovery.`;
}

async function getCachedAdvice(
  db: FirebaseFirestore.Firestore,
  cacheKey: string
): Promise<string | null> {
  try {
    const doc = await db.collection('coaching_cache').doc(cacheKey).get();
    
    if (doc.exists) {
      const data = doc.data();
      const expiresAt = data?.expiresAt || 0;
      
      if (Date.now() < expiresAt) {
        return data?.advice || null;
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

async function cacheAdvice(
  db: FirebaseFirestore.Firestore,
  cacheKey: string,
  advice: string
): Promise<void> {
  try {
    await db.collection('coaching_cache').doc(cacheKey).set({
      advice,
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });
  } catch (error) {
    console.error('Failed to cache advice:', error);
  }
}

