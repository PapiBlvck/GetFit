import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../contexts/ToastContext';

const Activity: React.FC = () => {
  const toast = useToast();
  const [isTracking, setIsTracking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [selectedType, setSelectedType] = useState('run');
  const [filterType, setFilterType] = useState('all');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const allActivities = [
    { id: 1, type: 'run', name: 'Morning Run', distance: 5.2, duration: 32, calories: 380, date: 'Today', map: '🗺️' },
    { id: 2, type: 'walk', name: 'Evening Walk', distance: 3.1, duration: 45, calories: 180, date: 'Yesterday', map: '🗺️' },
    { id: 3, type: 'cycle', name: 'Bike Ride', distance: 15.8, duration: 55, calories: 520, date: '2 days ago', map: '🗺️' },
    { id: 4, type: 'run', name: 'Afternoon Jog', distance: 4.5, duration: 28, calories: 320, date: '3 days ago', map: '🗺️' },
    { id: 5, type: 'walk', name: 'Park Stroll', distance: 2.8, duration: 38, calories: 150, date: '4 days ago', map: '🗺️' }
  ];

  const activities = filterType === 'all' 
    ? allActivities 
    : allActivities.filter(activity => activity.type === filterType);

  useEffect(() => {
    if (isTracking) {
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
        setDistance(prev => prev + 0.01);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTracking]);

  const handleStartTracking = () => {
    if (isTracking) {
      // Stopping tracking
      const finalDistance = distance.toFixed(2);
      const finalDuration = Math.floor(duration / 60);
      toast.success(`Activity completed! ${finalDistance} km in ${finalDuration} minutes`);
      setDuration(0);
      setDistance(0);
    } else {
      // Starting tracking
      toast.info(`Tracking ${selectedType} activity started`);
    }
    setIsTracking(!isTracking);
  };

  return (
    <div className="activity-page">
      <div className="page-header">
        <h1>Activity Tracking</h1>
        <p>Track your outdoor activities with GPS</p>
      </div>

      {/* Live Tracking Card */}
      <div className="tracking-card">
        <div className="map-placeholder">
          <div className="map-icon">🗺️</div>
          {isTracking ? (
            <div className="tracking-active">
              <div className="pulse-indicator"></div>
              <p>Tracking in progress...</p>
            </div>
          ) : (
            <p>Start tracking to see your route</p>
          )}
        </div>

        <div className="tracking-stats">
          <div className="stat">
            <span className="stat-icon">📍</span>
            <div>
              <h3>{distance.toFixed(2)} km</h3>
              <p>Distance</p>
            </div>
          </div>
          <div className="stat">
            <span className="stat-icon">⏱️</span>
            <div>
              <h3>{Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</h3>
              <p>Duration</p>
            </div>
          </div>
          <div className="stat">
            <span className="stat-icon">⚡</span>
            <div>
              <h3>{duration > 0 ? ((distance / (duration / 3600)).toFixed(1)) : '0.0'} km/h</h3>
              <p>Pace</p>
            </div>
          </div>
        </div>

        <button 
          className={`btn-tracking ${isTracking ? 'active' : ''}`}
          onClick={handleStartTracking}
        >
          {isTracking ? '⏹ Stop Tracking' : '▶️ Start Tracking'}
        </button>

        {!isTracking && (
          <div className="activity-type-selector">
            <button 
              className={`activity-type-btn ${selectedType === 'run' ? 'active' : ''}`}
              onClick={() => setSelectedType('run')}
            >
              🏃 Run
            </button>
            <button 
              className={`activity-type-btn ${selectedType === 'walk' ? 'active' : ''}`}
              onClick={() => setSelectedType('walk')}
            >
              🚶 Walk
            </button>
            <button 
              className={`activity-type-btn ${selectedType === 'cycle' ? 'active' : ''}`}
              onClick={() => setSelectedType('cycle')}
            >
              🚴 Cycle
            </button>
            <button 
              className={`activity-type-btn ${selectedType === 'swim' ? 'active' : ''}`}
              onClick={() => setSelectedType('swim')}
            >
              🏊 Swim
            </button>
          </div>
        )}
      </div>

      {/* Activity History */}
      <section className="activity-history">
        <div className="section-header">
          <h2>Activity History</h2>
          <select 
            className="filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Activities</option>
            <option value="run">Runs</option>
            <option value="walk">Walks</option>
            <option value="cycle">Rides</option>
          </select>
        </div>

        <div className="activity-list">
          {activities.map(activity => (
            <div key={activity.id} className="activity-item">
              <span className="activity-map">{activity.map}</span>
              <div className="activity-details">
                <h4>{activity.name}</h4>
                <div className="activity-stats-row">
                  <span>📍 {activity.distance} km</span>
                  <span>⏱️ {activity.duration} min</span>
                  <span>🔥 {activity.calories} cal</span>
                </div>
                <p className="activity-date">{activity.date}</p>
              </div>
              <button className="btn-icon">→</button>
            </div>
          ))}
        </div>
      </section>

      {/* Weekly Summary */}
      <section className="weekly-summary">
        <h3>This Week</h3>
        <div className="summary-stats">
          <div className="summary-card">
            <h4>24.1 km</h4>
            <p>Total Distance</p>
          </div>
          <div className="summary-card">
            <h4>3:12:00</h4>
            <p>Total Time</p>
          </div>
          <div className="summary-card">
            <h4>1,080 cal</h4>
            <p>Calories Burned</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Activity;

