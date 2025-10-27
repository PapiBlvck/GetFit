# 🔥 Backend Quick Reference

## Import Statements

```typescript
// Authentication
import { useAuth } from '../contexts/AuthContext';

// Data hooks
import { 
  useMeals, 
  useWaterIntake, 
  useHealthMetrics,
  useActivities,
  useWorkouts,
  useChallenges,
  getTodayDate,
  getCurrentTime
} from '../hooks/useFirestore';

// Validation
import { 
  createMealSchema,
  createActivitySchema,
  createWorkoutSchema,
  createWeightEntrySchema,
  createSleepEntrySchema,
  createMoodEntrySchema
} from '../lib/validations';

// Types
import type { Meal, Activity, Workout } from '../types';
```

---

## Common Patterns

### 1. Get Current User

```typescript
const { currentUser } = useAuth();

// Always check if user is logged in
if (!currentUser) {
  return <div>Please log in</div>;
}
```

### 2. Fetch Data

```typescript
// Meals for today
const { meals, loading, error } = useMeals(currentUser?.uid, getTodayDate());

// All activities
const { activities, loading } = useActivities(currentUser?.uid);

// Weight metrics only
const { metrics, loading } = useHealthMetrics(currentUser?.uid, 'weight');
```

### 3. Create Data

```typescript
const { addMeal } = useMeals(currentUser?.uid);

const handleAddMeal = async () => {
  try {
    // Validate first
    const mealData = createMealSchema.parse({
      type: 'breakfast',
      name: 'Oatmeal',
      calories: 300,
      date: getTodayDate(),
      time: getCurrentTime(),
    });

    // Then save
    await addMeal(mealData);
    alert('Meal added!');
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to add meal');
  }
};
```

### 4. Update Data

```typescript
const { updateWater } = useWaterIntake(currentUser?.uid);

const handleWaterClick = async (glasses: number) => {
  await updateWater(glasses);
};
```

### 5. Delete Data

```typescript
const { removeMeal } = useMeals(currentUser?.uid);

const handleDelete = async (mealId: string) => {
  if (confirm('Delete this meal?')) {
    await removeMeal(mealId);
  }
};
```

### 6. Show Loading State

```typescript
if (loading) {
  return <div className="loading">Loading...</div>;
}

// Or with skeleton
if (loading) {
  return (
    <div className="skeleton">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="skeleton-item" />
      ))}
    </div>
  );
}
```

### 7. Handle Errors

```typescript
const [error, setError] = useState<string | null>(null);

try {
  await addMeal(data);
  setError(null); // Clear error on success
} catch (err) {
  setError(err instanceof Error ? err.message : 'An error occurred');
}

// Display error
{error && (
  <div className="error-banner">{error}</div>
)}
```

---

## Hook Reference

### `useAuth()`
```typescript
const { 
  currentUser,      // Firebase user object
  loading,          // Auth loading state
  signup,           // (email, password) => Promise<User>
  login,            // (email, password) => Promise<User>
  logout,           // () => Promise<void>
  signInWithGoogle, // () => Promise<User>
  resetPassword,    // (email) => Promise<void>
  updateUserProfile // (updates) => Promise<void>
} = useAuth();
```

### `useMeals(userId, date?)`
```typescript
const { 
  meals,         // Meal[]
  loading,       // boolean
  error,         // string | null
  addMeal,       // (data) => Promise<Meal>
  removeMeal,    // (id) => Promise<void>
  refreshMeals   // () => Promise<void>
} = useMeals(currentUser?.uid, getTodayDate());
```

### `useWaterIntake(userId, date?)`
```typescript
const { 
  waterIntake,        // { glasses: number, date: string } | null
  loading,            // boolean
  error,              // string | null
  updateWater,        // (glasses) => Promise<WaterIntake>
  refreshWaterIntake  // () => Promise<void>
} = useWaterIntake(currentUser?.uid);
```

### `useHealthMetrics(userId, type?)`
```typescript
// type: 'weight' | 'sleep' | 'mood' | 'heartRate' | undefined

const { 
  metrics,         // HealthMetric[]
  loading,         // boolean
  error,           // string | null
  addWeightEntry,  // (data) => Promise<HealthMetric>
  addSleepEntry,   // (data) => Promise<HealthMetric>
  addMoodEntry,    // (data) => Promise<HealthMetric>
  refreshMetrics   // () => Promise<void>
} = useHealthMetrics(currentUser?.uid, 'weight');
```

### `useActivities(userId)`
```typescript
const { 
  activities,        // Activity[]
  loading,           // boolean
  error,             // string | null
  addActivity,       // (data) => Promise<Activity>
  refreshActivities  // () => Promise<void>
} = useActivities(currentUser?.uid);
```

### `useWorkouts(userId)`
```typescript
const { 
  workouts,        // Workout[]
  loading,         // boolean
  error,           // string | null
  addWorkout,      // (data) => Promise<Workout>
  refreshWorkouts  // () => Promise<void>
} = useWorkouts(currentUser?.uid);
```

### `useChallenges()`
```typescript
const { 
  challenges,        // Challenge[]
  loading,           // boolean
  error,             // string | null
  addChallenge,      // (userId, data) => Promise<Challenge>
  refreshChallenges  // () => Promise<void>
} = useChallenges();
```

---

## Validation Schemas

### Meal

```typescript
createMealSchema.parse({
  type: 'breakfast', // 'breakfast' | 'lunch' | 'dinner' | 'snack'
  name: 'Oatmeal',
  calories: 300,
  protein: 10,      // optional
  carbs: 50,        // optional
  fats: 5,          // optional
  date: '2025-01-15',
  time: '8:00 AM',
  image: 'https://...' // optional
});
```

### Activity

```typescript
createActivitySchema.parse({
  type: 'run', // 'run' | 'walk' | 'cycle' | 'swim' | 'other'
  distance: 5.2,   // km
  duration: 1800,  // seconds
  calories: 400,
  date: '2025-01-15'
});
```

### Workout

```typescript
createWorkoutSchema.parse({
  title: 'Morning HIIT',
  category: 'HIIT',
  difficulty: 'Intermediate', // 'Beginner' | 'Intermediate' | 'Advanced'
  duration: 30,    // minutes
  calories: 300,
  exercises: [     // optional
    {
      name: 'Burpees',
      sets: 3,
      reps: 15,
      duration: 30,  // optional
      weightKg: 10   // optional
    }
  ],
  notes: 'Great workout!' // optional
});
```

### Weight Entry

```typescript
createWeightEntrySchema.parse({
  value: 72.5,
  unit: 'kg', // 'kg' | 'lbs'
  date: '2025-01-15',
  notes: 'Morning weight' // optional
});
```

### Sleep Entry

```typescript
createSleepEntrySchema.parse({
  value: 7.5,      // hours
  quality: 'Good', // 'Excellent' | 'Good' | 'Fair' | 'Poor' (optional)
  date: '2025-01-15',
  notes: 'Slept well' // optional
});
```

### Mood Entry

```typescript
createMoodEntrySchema.parse({
  value: 'Great', // 'Great' | 'Good' | 'Okay' | 'Down' | 'Stressed'
  date: '2025-01-15',
  notes: 'Feeling good!' // optional
});
```

---

## Utility Functions

```typescript
// Get today's date in ISO format (YYYY-MM-DD)
const today = getTodayDate();
// => "2025-01-15"

// Get current time (e.g., "3:45 PM")
const now = getCurrentTime();
// => "3:45 PM"
```

---

## Complete Component Example

```typescript
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMeals, getTodayDate, getCurrentTime } from '../hooks/useFirestore';
import { createMealSchema } from '../lib/validations';

const NutritionPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { meals, addMeal, removeMeal, loading } = useMeals(
    currentUser?.uid, 
    getTodayDate()
  );
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddMeal = async () => {
    if (!currentUser) {
      setError('Please log in');
      return;
    }

    try {
      const mealData = createMealSchema.parse({
        type: 'breakfast',
        name: mealName,
        calories: parseInt(calories),
        date: getTodayDate(),
        time: getCurrentTime(),
      });

      await addMeal(mealData);
      
      // Reset form
      setMealName('');
      setCalories('');
      setIsModalOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to add meal');
    }
  };

  if (loading) {
    return <div>Loading meals...</div>;
  }

  return (
    <div>
      <h1>Nutrition</h1>
      
      {error && <div className="error">{error}</div>}

      {meals.map(meal => (
        <div key={meal.id}>
          <h3>{meal.name}</h3>
          <p>{meal.calories} cal • {meal.time}</p>
          <button onClick={() => removeMeal(meal.id)}>Delete</button>
        </div>
      ))}

      <button onClick={() => setIsModalOpen(true)}>
        Add Meal
      </button>

      {isModalOpen && (
        <div className="modal">
          <input
            value={mealName}
            onChange={e => setMealName(e.target.value)}
            placeholder="Meal name"
          />
          <input
            type="number"
            value={calories}
            onChange={e => setCalories(e.target.value)}
            placeholder="Calories"
          />
          <button onClick={handleAddMeal}>Add</button>
          <button onClick={() => setIsModalOpen(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default NutritionPage;
```

---

## Testing in Browser Console

```javascript
// Check if user is logged in
console.log('User:', useAuth().currentUser);

// Check Firestore connection
import { db } from '../config/firebase.config';
console.log('Firestore:', db);

// Test validation
import { createMealSchema } from '../lib/validations';
const result = createMealSchema.safeParse({
  type: 'breakfast',
  name: 'Test',
  calories: 300,
  date: '2025-01-15',
  time: '8:00 AM'
});
console.log('Valid:', result.success);
```

---

## Common Errors & Solutions

| Error | Solution |
|-------|----------|
| `currentUser is null` | User not logged in - check auth state |
| `Missing permissions` | Deploy Firestore security rules |
| `Validation failed` | Check Zod schema - use `.safeParse()` to debug |
| `Document not found` | Verify userId matches authenticated user |
| `Network error` | Check Firebase config in `.env.local` |

---

## Best Practices

1. ✅ Always validate input with Zod before saving
2. ✅ Check `currentUser` before making requests
3. ✅ Show loading states during async operations
4. ✅ Handle errors gracefully with try/catch
5. ✅ Use `getTodayDate()` for consistent date formatting
6. ✅ Refresh data after mutations for consistency
7. ✅ Keep API keys in `.env.local` (never commit)
8. ✅ Use TypeScript types for type safety

---

**Ready to integrate?** Check `DEPLOYMENT_CHECKLIST.md` for step-by-step instructions!

