import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useMeals, useWaterIntake, getTodayDate, getCurrentTime } from '../hooks/useFirestore';
import { createMealSchema } from '../lib/validations';
import type { Meal as FirestoreMeal } from '../types';

const Nutrition: React.FC = () => {
  const { currentUser } = useAuth();
  const toast = useToast();
  const { meals: firestoreMeals, addMeal, removeMeal, loading: mealsLoading } = useMeals(currentUser?.uid, getTodayDate());
  const { waterIntake, updateWater, loading: waterLoading } = useWaterIntake(currentUser?.uid);
  
  const [mealType, setMealType] = useState('breakfast');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert Firestore meals to display format
  const meals = firestoreMeals || [];

  // Calculate daily totals from meals
  const dailyTotals = meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + (meal.protein || 0),
    carbs: acc.carbs + (meal.carbs || 0),
    fats: acc.fats + (meal.fats || 0),
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const dailyGoals = {
    calories: { current: dailyTotals.calories, target: 2000 },
    protein: { current: dailyTotals.protein, target: 120 },
    carbs: { current: dailyTotals.carbs, target: 200 },
    fats: { current: dailyTotals.fats, target: 60 }
  };

  const handleAddMeal = async () => {
    if (!currentUser) {
      toast.error('You must be logged in to add meals');
      setError('You must be logged in to add meals');
      return;
    }

    if (mealName.trim() && mealCalories) {
      try {
        // Validate input
        const mealData = createMealSchema.parse({
          type: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
          name: mealName,
          calories: parseInt(mealCalories),
          date: getTodayDate(),
          time: getCurrentTime(),
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=150&fit=crop&auto=format',
        });

        // Add to Firestore
        await addMeal(mealData);
        
        // Reset form
        setMealName('');
        setMealCalories('');
        setIsModalOpen(false);
        setError(null);
        toast.success(`${mealName} added successfully!`);
      } catch (err) {
        console.error('Failed to add meal:', err);
        const errorMsg = 'Failed to add meal. Please try again.';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    }
  };

  const handleDeleteMeal = async (id: string) => {
    try {
      await removeMeal(id);
      setError(null);
      toast.success('Meal deleted successfully');
    } catch (err) {
      console.error('Failed to delete meal:', err);
      const errorMsg = 'Failed to delete meal. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleWaterUpdate = async (glasses: number) => {
    if (!currentUser) {
      const errorMsg = 'You must be logged in to track water intake';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    try {
      await updateWater(glasses);
      setError(null);
      if (glasses === 8) {
        toast.success('🎉 Congratulations! Daily water goal achieved!');
      } else {
        toast.success(`Water intake updated: ${glasses} glass${glasses !== 1 ? 'es' : ''}`);
      }
    } catch (err) {
      console.error('Failed to update water:', err);
      const errorMsg = 'Failed to update water intake. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  // Show loading state
  if (mealsLoading || waterLoading) {
    return (
      <div className="nutrition-page">
        <div className="page-header">
          <h1>Nutrition Tracker</h1>
          <p>Loading your nutrition data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nutrition-page">
      <div className="page-header">
        <h1>Nutrition Tracker</h1>
        <p>Track your daily intake and hit your macros</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-banner" style={{
          background: 'rgba(255, 0, 0, 0.1)',
          border: '1px solid rgba(255, 0, 0, 0.3)',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1rem',
          color: '#ff3366'
        }}>
          {error}
        </div>
      )}

      {/* Daily Progress */}
      <div className="nutrition-summary">
        <div className="calorie-ring">
          <div className="ring-chart">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="#4f46e5" 
                strokeWidth="8"
                strokeDasharray={`${(dailyGoals.calories.current / dailyGoals.calories.target) * 283} 283`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="ring-center">
              <h2>{dailyGoals.calories.current}</h2>
              <p>of {dailyGoals.calories.target}</p>
            </div>
          </div>
          <p className="ring-label">Calories</p>
        </div>

        <div className="macros-grid">
          <div className="macro-card">
            <h4>Protein</h4>
            <div className="macro-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill protein" 
                  style={{ width: `${(dailyGoals.protein.current / dailyGoals.protein.target) * 100}%` }}
                ></div>
              </div>
              <span>{dailyGoals.protein.current}g / {dailyGoals.protein.target}g</span>
            </div>
          </div>

          <div className="macro-card">
            <h4>Carbs</h4>
            <div className="macro-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill carbs" 
                  style={{ width: `${(dailyGoals.carbs.current / dailyGoals.carbs.target) * 100}%` }}
                ></div>
              </div>
              <span>{dailyGoals.carbs.current}g / {dailyGoals.carbs.target}g</span>
            </div>
          </div>

          <div className="macro-card">
            <h4>Fats</h4>
            <div className="macro-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill fats" 
                  style={{ width: `${(dailyGoals.fats.current / dailyGoals.fats.target) * 100}%` }}
                ></div>
              </div>
              <span>{dailyGoals.fats.current}g / {dailyGoals.fats.target}g</span>
            </div>
          </div>
        </div>
      </div>

      {/* Meal Logger */}
      <section className="meal-logger">
        <div className="section-header">
          <h2>Today's Meals</h2>
          <button className="btn-primary" onClick={() => setIsScannerOpen(true)}>
            📷 Scan Barcode
          </button>
        </div>

        <div className="meal-tabs">
          {['breakfast', 'lunch', 'dinner', 'snack'].map(type => (
            <button
              key={type}
              className={`meal-tab ${mealType === type ? 'active' : ''}`}
              onClick={() => setMealType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="meals-list">
          {meals
            .filter(meal => meal.type === mealType)
            .map(meal => (
              <div key={meal.id} className="meal-item">
                <div className="meal-thumbnail">
                  <img src={meal.image} alt={meal.name} />
                </div>
                <div className="meal-info">
                  <h4>{meal.name}</h4>
                  <p>{meal.time} • {meal.calories} cal</p>
                </div>
                <button 
                  className="btn-icon delete-btn" 
                  onClick={() => handleDeleteMeal(meal.id)}
                  title="Delete meal"
                >
                  🗑️
                </button>
              </div>
            ))}
        </div>

        <button 
          className="btn-secondary btn-full"
          onClick={() => setIsModalOpen(true)}
        >
          + Add {mealType}
        </button>
      </section>

      {/* Barcode Scanner Modal */}
      {isScannerOpen && (
        <div className="modal-overlay" onClick={() => setIsScannerOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Scan Barcode</h2>
              <button className="modal-close" onClick={() => setIsScannerOpen(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="scanner-placeholder">
                <p className="scanner-icon">📷</p>
                <h3>Barcode Scanner</h3>
                <p>This feature requires camera access and barcode scanning library.</p>
                <p className="tech-note">Implementation ready for:</p>
                <ul className="tech-list">
                  <li>QuaggaJS / ZXing library</li>
                  <li>Camera API integration</li>
                  <li>Product database lookup</li>
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-secondary" 
                onClick={() => setIsScannerOpen(false)}
              >
                Close
              </button>
              <button 
                className="btn-primary" 
                onClick={() => {
                  setIsScannerOpen(false);
                  setIsModalOpen(true);
                }}
              >
                Enter Manually
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Meal Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add {mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Meal Name</label>
                <input
                  type="text"
                  placeholder="e.g., Grilled Chicken Salad"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Calories</label>
                <input
                  type="number"
                  placeholder="e.g., 450"
                  value={mealCalories}
                  onChange={(e) => setMealCalories(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-secondary" 
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handleAddMeal}
                disabled={!mealName.trim() || !mealCalories}
              >
                Add Meal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Water Tracker */}
      <section className="water-tracker">
        <h3>💧 Water Intake</h3>
        <div className="water-glasses">
          {[...Array(8)].map((_, i) => (
            <button 
              key={i} 
              className={`water-glass ${i < (waterIntake?.glasses || 0) ? 'filled' : ''}`}
              onClick={() => handleWaterUpdate(i + 1)}
              title={`${i + 1} glass${i + 1 > 1 ? 'es' : ''}`}
            >
              💧
            </button>
          ))}
        </div>
        <p>{waterIntake?.glasses || 0} of 8 glasses ({((waterIntake?.glasses || 0) * 0.25).toFixed(2)}L / 2L)</p>
        {(waterIntake?.glasses || 0) === 8 && (
          <p className="water-complete">🎉 Daily water goal completed!</p>
        )}
      </section>
    </div>
  );
};

export default Nutrition;

