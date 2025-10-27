import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="welcome-hero">
          <h1 className="welcome-title">🏋️ Welcome to GetFit</h1>
          <p className="welcome-subtitle">
            Your all-in-one fitness companion for tracking workouts, nutrition, and achieving your health goals
          </p>
        </div>

        <div className="feature-highlights">
          <div 
            className="feature-item feature-clickable" 
            onClick={() => navigate('/workouts')}
            role="button"
            tabIndex={0}
          >
            <div className="feature-icon">
              <img 
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&auto=format" 
                alt="Workout tracking"
              />
            </div>
            <h3>Track Workouts</h3>
            <p>Access hundreds of exercises with video guides</p>
          </div>
          <div 
            className="feature-item feature-clickable" 
            onClick={() => navigate('/nutrition')}
            role="button"
            tabIndex={0}
          >
            <div className="feature-icon">
              <img 
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200&h=200&fit=crop&auto=format" 
                alt="Nutrition tracking"
              />
            </div>
            <h3>Monitor Nutrition</h3>
            <p>Log meals and track your macros effortlessly</p>
          </div>
          <div 
            className="feature-item feature-clickable" 
            onClick={() => navigate('/dashboard')}
            role="button"
            tabIndex={0}
          >
            <div className="feature-icon">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop&auto=format" 
                alt="Progress analytics"
              />
            </div>
            <h3>See Progress</h3>
            <p>Visualize your journey with detailed analytics</p>
          </div>
        </div>

        <div className="welcome-actions">
          <button 
            className="btn-primary"
            onClick={() => navigate('/register')}
          >
            Get Started
          </button>
          <button 
            className="btn-secondary"
            onClick={() => navigate('/login')}
          >
            I Already Have an Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

