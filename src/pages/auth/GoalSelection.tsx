import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GoalSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const goals = [
    { id: 'weight-loss', icon: '⚖️', title: 'Weight Loss', description: 'Shed pounds and feel lighter' },
    { id: 'muscle-gain', icon: '💪', title: 'Muscle Gain', description: 'Build strength and mass' },
    { id: 'endurance', icon: '🏃', title: 'Improve Endurance', description: 'Boost stamina and cardio' },
    { id: 'flexibility', icon: '🧘', title: 'Flexibility', description: 'Increase range of motion' },
    { id: 'general-fitness', icon: '🎯', title: 'General Fitness', description: 'Stay healthy and active' },
    { id: 'sports-performance', icon: '⚽', title: 'Sports Performance', description: 'Enhance athletic ability' }
  ];

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleContinue = () => {
    console.log('Selected goals:', selectedGoals);
    navigate('/dashboard');
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <h1>What Are Your Goals?</h1>
        <p className="subtitle">Select one or more goals to personalize your experience</p>

        <div className="goals-grid">
          {goals.map(goal => (
            <button
              key={goal.id}
              className={`goal-card ${selectedGoals.includes(goal.id) ? 'selected' : ''}`}
              onClick={() => toggleGoal(goal.id)}
            >
              <span className="goal-icon">{goal.icon}</span>
              <h3>{goal.title}</h3>
              <p>{goal.description}</p>
              {selectedGoals.includes(goal.id) && (
                <span className="check-badge">✓</span>
              )}
            </button>
          ))}
        </div>

        <div className="form-actions">
          <button 
            className="btn-primary btn-full"
            onClick={handleContinue}
            disabled={selectedGoals.length === 0}
          >
            Start My Journey ({selectedGoals.length} goal{selectedGoals.length !== 1 ? 's' : ''} selected)
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalSelection;

