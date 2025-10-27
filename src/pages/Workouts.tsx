import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Workouts: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');

  const categories = ['All', 'Strength', 'Cardio', 'Yoga', 'HIIT', 'Stretching'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const allWorkouts = [
    // Beginner Workouts
    { id: 1, title: 'Morning Yoga Flow', category: 'Yoga', duration: 30, calories: 120, difficulty: 'Beginner', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop&auto=format' },
    { id: 2, title: 'Evening Stretching', category: 'Stretching', duration: 15, calories: 50, difficulty: 'Beginner', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&auto=format' },
    { id: 3, title: 'Light Cardio Walk', category: 'Cardio', duration: 25, calories: 150, difficulty: 'Beginner', image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400&h=300&fit=crop&auto=format' },
    
    // Intermediate Workouts
    { id: 4, title: 'Full Body Blast', category: 'Strength', duration: 45, calories: 400, difficulty: 'Intermediate', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop&auto=format' },
    { id: 5, title: 'Core Strength', category: 'Strength', duration: 25, calories: 180, difficulty: 'Intermediate', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop&auto=format' },
    { id: 6, title: 'Power Yoga Session', category: 'Yoga', duration: 40, calories: 220, difficulty: 'Intermediate', image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=300&fit=crop&auto=format' },
    { id: 7, title: 'Cardio Kickboxing', category: 'Cardio', duration: 35, calories: 350, difficulty: 'Intermediate', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400&h=300&fit=crop&auto=format' },
    { id: 8, title: 'Functional HIIT', category: 'HIIT', duration: 30, calories: 320, difficulty: 'Intermediate', image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=300&fit=crop&auto=format' },
    { id: 9, title: 'Upper Body Power', category: 'Strength', duration: 35, calories: 280, difficulty: 'Intermediate', image: 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=400&h=300&fit=crop&auto=format' },
    { id: 10, title: 'Leg Day Circuit', category: 'Strength', duration: 40, calories: 380, difficulty: 'Intermediate', image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400&h=300&fit=crop&auto=format' },
    
    // Advanced Workouts
    { id: 11, title: 'HIIT Cardio Burn', category: 'HIIT', duration: 20, calories: 300, difficulty: 'Advanced', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop&auto=format' },
    { id: 12, title: 'Running Intervals', category: 'Cardio', duration: 40, calories: 450, difficulty: 'Advanced', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=300&fit=crop&auto=format' },
    { id: 13, title: 'Beast Mode Strength', category: 'Strength', duration: 60, calories: 550, difficulty: 'Advanced', image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=300&fit=crop&auto=format' },
    { id: 14, title: 'Extreme HIIT Challenge', category: 'HIIT', duration: 30, calories: 450, difficulty: 'Advanced', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop&auto=format' },
    { id: 15, title: 'Advanced Ashtanga Yoga', category: 'Yoga', duration: 50, calories: 280, difficulty: 'Advanced', image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=400&h=300&fit=crop&auto=format' },
    { id: 16, title: 'Sprint Training', category: 'Cardio', duration: 35, calories: 500, difficulty: 'Advanced', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=300&fit=crop&auto=format' },
    { id: 17, title: 'CrossFit WOD', category: 'HIIT', duration: 45, calories: 520, difficulty: 'Advanced', image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=300&fit=crop&auto=format' },
    { id: 18, title: 'Explosive Plyometrics', category: 'HIIT', duration: 25, calories: 400, difficulty: 'Advanced', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop&auto=format' }
  ];

  // Filter workouts based on selected category and difficulty
  const filteredWorkouts = allWorkouts.filter(workout => {
    const matchesCategory = selectedCategory === 'all' || workout.category.toLowerCase() === selectedCategory;
    const matchesDifficulty = difficulty === 'all' || workout.difficulty.toLowerCase() === difficulty;
    return matchesCategory && matchesDifficulty;
  });

  return (
    <div className="workouts-page">
      <div className="page-header">
        <h1>Workout Library</h1>
        <p>Choose from hundreds of guided workouts</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Category</label>
          <div className="filter-pills">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-pill ${selectedCategory === cat.toLowerCase() ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.toLowerCase())}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Difficulty</label>
          <div className="filter-pills">
            {difficulties.map(diff => (
              <button
                key={diff}
                className={`filter-pill ${difficulty === diff.toLowerCase() ? 'active' : ''}`}
                onClick={() => setDifficulty(diff.toLowerCase())}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Workout Cards */}
      <div className="workouts-grid">
        {filteredWorkouts.length === 0 ? (
          <div className="no-results">
            <h3>No workouts found</h3>
            <p>Try adjusting your filters to see more results</p>
          </div>
        ) : (
          filteredWorkouts.map(workout => (
          <div key={workout.id} className="workout-card">
            <div className="workout-card-image">
              <img src={workout.image} alt={workout.title} />
              <span className={`difficulty-badge ${workout.difficulty.toLowerCase()}`}>
                {workout.difficulty}
              </span>
            </div>
            <div className="workout-card-content">
              <h3>{workout.title}</h3>
              <div className="workout-meta">
                <span>⏱️ {workout.duration} min</span>
                <span>🔥 {workout.calories} cal</span>
              </div>
              <button 
                className="btn-primary btn-full"
                onClick={() => navigate('/workout-player', { state: { workout } })}
              >
                Start Workout
              </button>
            </div>
          </div>
          ))
        )}
      </div>

      {/* Custom Workout Builder */}
      <div className="builder-cta">
        <h3>Want to create your own?</h3>
        <button className="btn-secondary">Custom Workout Builder</button>
      </div>
    </div>
  );
};

export default Workouts;

