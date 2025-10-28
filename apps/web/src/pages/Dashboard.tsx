import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import { Activity, Flame, Footprints, Dumbbell, TrendingUp, Target } from 'lucide-react';

interface DashboardStats {
  steps: number;
  calories: number;
  workouts: number;
  streak: number;
  goals: {
    stepsGoal: number;
    caloriesGoal: number;
    workoutsGoal: number;
  };
}

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    steps: 0,
    calories: 0,
    workouts: 0,
    streak: 0,
    goals: {
      stepsGoal: 10000,
      caloriesGoal: 2000,
      workoutsGoal: 5,
    },
  });
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('Welcome back');

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Fetch user stats
    fetchDashboardStats();
  }, [currentUser]);

  const fetchDashboardStats = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);

      // Fetch user profile for goals
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const userData = userDoc.data();

      // Fetch today's activity data
      const today = new Date().toISOString().split('T')[0];
      const healthQuery = query(
        collection(db, 'health'),
        where('userId', '==', currentUser.uid),
        where('date', '==', today)
      );
      const healthSnapshot = await getDocs(healthQuery);
      
      let totalSteps = 0;
      let totalCalories = 0;
      
      healthSnapshot.forEach((doc) => {
        const data = doc.data();
        totalSteps += data.steps || 0;
        totalCalories += data.caloriesBurned || 0;
      });

      // Fetch workouts count for this week
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      
      const workoutQuery = query(
        collection(db, 'workouts'),
        where('userId', '==', currentUser.uid),
        where('completedAt', '>=', weekStart.toISOString())
      );
      const workoutSnapshot = await getDocs(workoutQuery);
      const workoutsCount = workoutSnapshot.size;

      // Calculate streak (simplified - count consecutive days with activity)
      const activityQuery = query(
        collection(db, 'health'),
        where('userId', '==', currentUser.uid)
      );
      const activitySnapshot = await getDocs(activityQuery);
      const streak = calculateStreak(activitySnapshot);

      setStats({
        steps: totalSteps,
        calories: totalCalories,
        workouts: workoutsCount,
        streak,
        goals: {
          stepsGoal: userData?.goals?.stepsGoal || 10000,
          caloriesGoal: userData?.goals?.caloriesGoal || 2000,
          workoutsGoal: userData?.goals?.workoutsGoal || 5,
        },
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setLoading(false);
    }
  };

  const calculateStreak = (snapshot: any) => {
    // Simplified streak calculation
    const dates = snapshot.docs.map((doc: any) => doc.data().date).sort().reverse();
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = 0; i < dates.length; i++) {
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      const expected = expectedDate.toISOString().split('T')[0];
      
      if (dates[i] === expected) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getUserDisplayName = () => {
    // 1. Check if displayName exists and extract first name
    if (currentUser?.displayName) {
      return currentUser.displayName.split(' ')[0];
    }
    
    // 2. If no displayName, try to extract from email
    if (currentUser?.email) {
      const emailName = currentUser.email.split('@')[0];
      // 3. Capitalize first letter
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    
    // 4. Only return "User" if everything else fails
    return 'User';
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  return (
    <div className="corporate-dashboard">
      {/* Welcome Header */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1 className="welcome-title">
            {greeting}, <span className="user-name">{getUserDisplayName()}</span>
          </h1>
          <p className="welcome-subtitle">Here's your fitness overview for today</p>
        </div>
        <div className="quick-actions">
          <button className="action-btn primary">
            <Target size={18} />
            <span>Log Activity</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {/* Steps Card */}
        <div className="stat-card steps-card">
          <div className="card-header">
            <div className="card-icon steps-icon">
              <Footprints size={24} />
            </div>
            <div className="card-trend">
              <TrendingUp size={16} />
              <span>+12%</span>
            </div>
          </div>
          <div className="card-content">
            <div className="stat-value">{loading ? '...' : stats.steps.toLocaleString()}</div>
            <div className="stat-label">Steps</div>
            <div className="stat-goal">
              <div className="goal-text">
                Goal: {stats.goals.stepsGoal.toLocaleString()}
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill steps-fill" 
                  style={{ width: `${getProgressPercentage(stats.steps, stats.goals.stepsGoal)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Calories Card */}
        <div className="stat-card calories-card">
          <div className="card-header">
            <div className="card-icon calories-icon">
              <Flame size={24} />
            </div>
            <div className="card-trend">
              <TrendingUp size={16} />
              <span>+8%</span>
            </div>
          </div>
          <div className="card-content">
            <div className="stat-value">{loading ? '...' : stats.calories.toLocaleString()}</div>
            <div className="stat-label">Calories Burned</div>
            <div className="stat-goal">
              <div className="goal-text">
                Goal: {stats.goals.caloriesGoal.toLocaleString()} kcal
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill calories-fill" 
                  style={{ width: `${getProgressPercentage(stats.calories, stats.goals.caloriesGoal)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Workouts Card */}
        <div className="stat-card workouts-card">
          <div className="card-header">
            <div className="card-icon workouts-icon">
              <Dumbbell size={24} />
            </div>
            <div className="card-trend positive">
              <TrendingUp size={16} />
              <span>On track</span>
            </div>
          </div>
          <div className="card-content">
            <div className="stat-value">{loading ? '...' : stats.workouts}</div>
            <div className="stat-label">Workouts Done</div>
            <div className="stat-goal">
              <div className="goal-text">
                Weekly Goal: {stats.goals.workoutsGoal}
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill workouts-fill" 
                  style={{ width: `${getProgressPercentage(stats.workouts, stats.goals.workoutsGoal)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Streak Card */}
        <div className="stat-card streak-card">
          <div className="card-header">
            <div className="card-icon streak-icon">
              <Activity size={24} />
            </div>
            <div className="card-badge">
              🔥
            </div>
          </div>
          <div className="card-content">
            <div className="stat-value">{loading ? '...' : stats.streak}</div>
            <div className="stat-label">Day Streak</div>
            <div className="stat-goal">
              <div className="goal-text streak-message">
                {stats.streak === 0 && 'Start your streak today!'}
                {stats.streak > 0 && stats.streak < 7 && 'Keep it going!'}
                {stats.streak >= 7 && stats.streak < 30 && 'Amazing streak! 🚀'}
                {stats.streak >= 30 && 'Legendary! 🏆'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="summary-section">
        <h2 className="section-title">Weekly Overview</h2>
        <div className="summary-cards">
          <div className="summary-item">
            <div className="summary-label">Total Steps</div>
            <div className="summary-value">{(stats.steps * 7).toLocaleString()}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Avg. Calories/Day</div>
            <div className="summary-value">{stats.calories.toLocaleString()}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Active Days</div>
            <div className="summary-value">{stats.streak}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

