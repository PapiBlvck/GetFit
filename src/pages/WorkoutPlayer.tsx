import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Exercise {
  name: string;
  duration: number; // in seconds
  reps?: string;
  description: string;
}

const WorkoutPlayer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const workout = location.state?.workout;

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Sample exercises - in a real app, this would come from the workout data
  const exercises: Exercise[] = [
    { name: 'Warm-up', duration: 60, description: 'Light cardio to get your heart rate up' },
    { name: 'Push-ups', duration: 45, reps: '3 sets × 15 reps', description: 'Keep your core tight and back straight' },
    { name: 'Rest', duration: 30, description: 'Take a breather and hydrate' },
    { name: 'Squats', duration: 60, reps: '3 sets × 20 reps', description: 'Keep your knees behind your toes' },
    { name: 'Rest', duration: 30, description: 'Take a breather and hydrate' },
    { name: 'Plank', duration: 60, reps: '3 sets × 30 sec', description: 'Hold a strong plank position' },
    { name: 'Cool-down', duration: 120, description: 'Stretch and bring your heart rate down' }
  ];

  const currentExercise = exercises[currentExerciseIndex];
  const totalExercises = exercises.length;
  const progress = ((currentExerciseIndex + 1) / totalExercises) * 100;

  useEffect(() => {
    if (!workout) {
      // If no workout data, redirect back
      navigate('/workouts');
    }
  }, [workout, navigate]);

  useEffect(() => {
    setTimeRemaining(currentExercise.duration);
  }, [currentExerciseIndex, currentExercise.duration]);

  useEffect(() => {
    if (isPaused || isCompleted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Move to next exercise
          if (currentExerciseIndex < exercises.length - 1) {
            setCurrentExerciseIndex((prevIndex) => prevIndex + 1);
            return exercises[currentExerciseIndex + 1].duration;
          } else {
            // Workout complete
            setIsCompleted(true);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, currentExerciseIndex, exercises, isCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleSkip = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const handleExit = () => {
    if (window.confirm('Are you sure you want to exit this workout?')) {
      navigate('/workouts');
    }
  };

  const handleFinish = () => {
    navigate('/workouts', { state: { workoutCompleted: true } });
  };

  if (!workout) {
    return null;
  }

  if (isCompleted) {
    return (
      <div className="workout-player">
        <div className="workout-complete">
          <div className="complete-icon">🎉</div>
          <h1>Workout Complete!</h1>
          <p className="complete-message">
            Great job! You've completed <strong>{workout.title}</strong>
          </p>
          <div className="workout-stats">
            <div className="stat-item">
              <span className="stat-value">{workout.duration}</span>
              <span className="stat-label">Minutes</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">~{workout.calories}</span>
              <span className="stat-label">Calories</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{totalExercises}</span>
              <span className="stat-label">Exercises</span>
            </div>
          </div>
          <div className="complete-actions">
            <button className="btn-primary" onClick={handleFinish}>
              Finish
            </button>
            <button className="btn-secondary" onClick={() => window.location.reload()}>
              Restart Workout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="workout-player">
      <div className="player-header">
        <button className="exit-btn" onClick={handleExit}>
          ✕
        </button>
        <div className="workout-info">
          <h2>{workout.title}</h2>
          <p>{workout.category} • {workout.difficulty}</p>
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="progress-text">
          {currentExerciseIndex + 1} / {totalExercises}
        </span>
      </div>

      <div className="exercise-display">
        <div className="timer-circle">
          <svg viewBox="0 0 200 200" className="timer-svg">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="10"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="var(--neon-cyan)"
              strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 90}`}
              strokeDashoffset={`${
                2 * Math.PI * 90 * (1 - timeRemaining / currentExercise.duration)
              }`}
              transform="rotate(-90 100 100)"
              className="timer-progress"
            />
          </svg>
          <div className="timer-content">
            <h1 className="timer-display">{formatTime(timeRemaining)}</h1>
          </div>
        </div>

        <div className="exercise-details">
          <h2 className="exercise-name">{currentExercise.name}</h2>
          {currentExercise.reps && (
            <p className="exercise-reps">{currentExercise.reps}</p>
          )}
          <p className="exercise-description">{currentExercise.description}</p>
        </div>
      </div>

      <div className="player-controls">
        <button
          className="control-btn"
          onClick={handlePrevious}
          disabled={currentExerciseIndex === 0}
        >
          ⏮️ Previous
        </button>
        <button className="control-btn primary" onClick={handlePauseResume}>
          {isPaused ? '▶️ Resume' : '⏸️ Pause'}
        </button>
        <button
          className="control-btn"
          onClick={handleSkip}
          disabled={currentExerciseIndex === exercises.length - 1}
        >
          Next ⏭️
        </button>
      </div>

      <div className="exercise-list">
        <h3>Exercises</h3>
        <div className="exercise-items">
          {exercises.map((exercise, index) => (
            <div
              key={index}
              className={`exercise-item ${
                index === currentExerciseIndex ? 'active' : ''
              } ${index < currentExerciseIndex ? 'completed' : ''}`}
            >
              <span className="exercise-number">
                {index < currentExerciseIndex ? '✓' : index + 1}
              </span>
              <span className="exercise-item-name">{exercise.name}</span>
              <span className="exercise-time">{formatTime(exercise.duration)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlayer;

