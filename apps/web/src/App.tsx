import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Pages
import Welcome from './pages/Welcome';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProfileSetup from './pages/auth/ProfileSetup';
import GoalSelection from './pages/auth/GoalSelection';
import Dashboard from './pages/Dashboard';

// Protected Pages
import Activity from './pages/Activity';
import Health from './pages/Health';
import Nutrition from './pages/Nutrition';
import Social from './pages/Social';
import Workouts from './pages/Workouts';
import WorkoutPlayer from './pages/WorkoutPlayer';

// Layouts
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Loading Component
const LoadingScreen: React.FC = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#0A0A0A',
    color: '#00FFF5',
    fontSize: '1.5rem'
  }}>
    Loading...
  </div>
);

const App: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page - Redirect to dashboard if authenticated */}
        <Route path="/" element={
          currentUser ? <Navigate to="/dashboard" replace /> : <Welcome />
        } />
        
        {/* Auth Routes - Redirect to dashboard if already authenticated */}
        <Route path="/login" element={
          currentUser ? <Navigate to="/dashboard" replace /> : <Login />
        } />
        <Route path="/register" element={
          currentUser ? <Navigate to="/dashboard" replace /> : <Register />
        } />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/goal-selection" element={<GoalSelection />} />
        
        {/* Protected Routes - Main App with MainLayout (includes navbar) */}
        <Route element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/workout/:workoutId" element={<WorkoutPlayer />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/health" element={<Health />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/social" element={<Social />} />
          <Route path="/goals" element={<GoalSelection />} />
        </Route>
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

