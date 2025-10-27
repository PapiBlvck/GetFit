/**
 * Database Seeding Script for GetFit App
 * 
 * This script populates Firestore with sample data for testing and development.
 * 
 * Usage:
 * 1. Make sure you're authenticated with a test user
 * 2. Update the USER_ID constant with your test user ID
 * 3. Run: npx ts-node src/scripts/seedDatabase.ts
 */

import {
  createUser,
  createActivity,
  createWorkout,
  createMeal,
  updateWaterIntake,
  createHealthMetric,
  createChallenge,
} from '../services/firestore.service';

// Replace with your test user ID
const USER_ID = 'test-user-123';
const USER_EMAIL = 'test@getfit.app';
const USER_NAME = 'Test User';

const getTodayDate = () => new Date().toISOString().split('T')[0];
const getDateDaysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // 1. Create User
    console.log('📝 Creating user...');
    await createUser(USER_ID, {
      email: USER_EMAIL,
      displayName: USER_NAME,
      goals: {
        dailySteps: 10000,
        weeklyWorkouts: 5,
        dailyCalories: 2000,
        dailyWater: 8,
        targetWeight: 70,
      },
      settings: {
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
    });
    console.log('✅ User created\n');

    // 2. Create Activities (last 7 days)
    console.log('🏃 Creating activities...');
    const activities = [
      { type: 'run' as const, distance: 5.2, duration: 1920, calories: 380, days: 0 },
      { type: 'walk' as const, distance: 3.1, duration: 2700, calories: 180, days: 1 },
      { type: 'cycle' as const, distance: 15.8, duration: 3300, calories: 520, days: 2 },
      { type: 'run' as const, distance: 4.5, duration: 1680, calories: 320, days: 3 },
      { type: 'walk' as const, distance: 2.8, duration: 2280, calories: 150, days: 4 },
    ];

    for (const activity of activities) {
      await createActivity(USER_ID, {
        type: activity.type,
        distance: activity.distance,
        duration: activity.duration,
        calories: activity.calories,
        date: getDateDaysAgo(activity.days),
      });
    }
    console.log(`✅ Created ${activities.length} activities\n`);

    // 3. Create Workouts
    console.log('💪 Creating workouts...');
    const workouts = [
      {
        title: 'Morning Yoga Flow',
        category: 'Yoga',
        difficulty: 'Beginner' as const,
        duration: 30,
        calories: 120,
        exercises: [
          { name: 'Sun Salutation', sets: 3, reps: 10 },
          { name: 'Warrior Pose', sets: 2, duration: 60 },
        ],
      },
      {
        title: 'HIIT Cardio Burn',
        category: 'HIIT',
        difficulty: 'Advanced' as const,
        duration: 20,
        calories: 300,
        exercises: [
          { name: 'Burpees', sets: 4, reps: 15 },
          { name: 'Mountain Climbers', sets: 4, reps: 20 },
          { name: 'Jump Squats', sets: 4, reps: 15 },
        ],
      },
      {
        title: 'Full Body Blast',
        category: 'Strength',
        difficulty: 'Intermediate' as const,
        duration: 45,
        calories: 400,
        exercises: [
          { name: 'Push-ups', sets: 3, reps: 15 },
          { name: 'Squats', sets: 3, reps: 20, weightKg: 20 },
          { name: 'Lunges', sets: 3, reps: 12 },
        ],
      },
    ];

    for (const workout of workouts) {
      await createWorkout(USER_ID, workout);
    }
    console.log(`✅ Created ${workouts.length} workouts\n`);

    // 4. Create Meals (today)
    console.log('🍽️ Creating meals...');
    const meals = [
      {
        type: 'breakfast' as const,
        name: 'Oatmeal with Berries',
        calories: 320,
        protein: 12,
        carbs: 54,
        fats: 8,
        date: getTodayDate(),
        time: '8:00 AM',
        image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=200&h=150&fit=crop&auto=format',
      },
      {
        type: 'lunch' as const,
        name: 'Grilled Chicken Salad',
        calories: 450,
        protein: 35,
        carbs: 25,
        fats: 22,
        date: getTodayDate(),
        time: '12:30 PM',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=150&fit=crop&auto=format',
      },
      {
        type: 'snack' as const,
        name: 'Greek Yogurt',
        calories: 180,
        protein: 15,
        carbs: 20,
        fats: 5,
        date: getTodayDate(),
        time: '3:00 PM',
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=150&fit=crop&auto=format',
      },
      {
        type: 'dinner' as const,
        name: 'Salmon with Vegetables',
        calories: 500,
        protein: 40,
        carbs: 35,
        fats: 25,
        date: getTodayDate(),
        time: '7:00 PM',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=150&fit=crop&auto=format',
      },
    ];

    for (const meal of meals) {
      await createMeal(USER_ID, meal);
    }
    console.log(`✅ Created ${meals.length} meals\n`);

    // 5. Update Water Intake
    console.log('💧 Setting water intake...');
    await updateWaterIntake(USER_ID, getTodayDate(), 6);
    console.log('✅ Water intake set to 6 glasses\n');

    // 6. Create Health Metrics
    console.log('❤️ Creating health metrics...');
    
    // Weight entries (last 5 days)
    const weights = [73.2, 73.0, 72.8, 72.7, 72.5];
    for (let i = 0; i < weights.length; i++) {
      await createHealthMetric(USER_ID, {
        type: 'weight',
        value: weights[i],
        date: getDateDaysAgo(4 - i),
      });
    }

    // Sleep entries (last 7 days)
    const sleepHours = [7.5, 8.0, 6.5, 7.0, 8.5, 7.5, 7.0];
    for (let i = 0; i < sleepHours.length; i++) {
      await createHealthMetric(USER_ID, {
        type: 'sleep',
        value: sleepHours[i],
        date: getDateDaysAgo(6 - i),
      });
    }

    // Mood entry (today)
    await createHealthMetric(USER_ID, {
      type: 'mood',
      value: 'Great',
      date: getTodayDate(),
    });

    console.log('✅ Created health metrics (weight, sleep, mood)\n');

    // 7. Create Challenges
    console.log('🏆 Creating challenges...');
    const challenges = [
      {
        name: '10K Steps Challenge',
        description: 'Walk 10,000 steps every day for a week!',
        daysLeft: 3,
        progress: 75,
      },
      {
        name: '30 Day Yoga Journey',
        description: 'Complete a yoga session every day for 30 days.',
        daysLeft: 12,
        progress: 60,
      },
      {
        name: 'Plank Challenge',
        description: 'Hold a plank for 2 minutes every day!',
        daysLeft: 7,
        progress: 85,
      },
    ];

    for (const challenge of challenges) {
      await createChallenge(USER_ID, challenge);
    }
    console.log(`✅ Created ${challenges.length} challenges\n`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - 1 user created`);
    console.log(`   - ${activities.length} activities`);
    console.log(`   - ${workouts.length} workouts`);
    console.log(`   - ${meals.length} meals`);
    console.log(`   - 1 water intake entry`);
    console.log(`   - ${weights.length} weight entries`);
    console.log(`   - ${sleepHours.length} sleep entries`);
    console.log(`   - 1 mood entry`);
    console.log(`   - ${challenges.length} challenges`);
    console.log('\n✅ You can now test your app with this data!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seeding function
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedDatabase };

