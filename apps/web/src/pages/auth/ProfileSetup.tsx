import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    gender: '',
    age: '',
    height: '',
    weight: '',
    activityLevel: ''
  });

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      navigate('/goal-selection');
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / 2) * 100}%` }}></div>
        </div>

        <h1>Let's Set Up Your Profile</h1>
        <p className="subtitle">Step {step} of 2</p>

        {step === 1 && (
          <div className="form-section">
            <div className="form-group">
              <label>Gender</label>
              <div className="button-group">
                <button
                  className={`btn-option ${profile.gender === 'male' ? 'active' : ''}`}
                  onClick={() => setProfile({...profile, gender: 'male'})}
                >
                  🚹 Male
                </button>
                <button
                  className={`btn-option ${profile.gender === 'female' ? 'active' : ''}`}
                  onClick={() => setProfile({...profile, gender: 'female'})}
                >
                  🚺 Female
                </button>
                <button
                  className={`btn-option ${profile.gender === 'other' ? 'active' : ''}`}
                  onClick={() => setProfile({...profile, gender: 'other'})}
                >
                  ⚧️ Other
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                placeholder="25"
                value={profile.age}
                onChange={(e) => setProfile({...profile, age: e.target.value})}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Height (cm)</label>
                <input
                  type="number"
                  placeholder="170"
                  value={profile.height}
                  onChange={(e) => setProfile({...profile, height: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  placeholder="70"
                  value={profile.weight}
                  onChange={(e) => setProfile({...profile, weight: e.target.value})}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-section">
            <div className="form-group">
              <label>Activity Level</label>
              <div className="option-list">
                <button
                  className={`option-card ${profile.activityLevel === 'sedentary' ? 'active' : ''}`}
                  onClick={() => setProfile({...profile, activityLevel: 'sedentary'})}
                >
                  <strong>Sedentary</strong>
                  <span>Little to no exercise</span>
                </button>
                <button
                  className={`option-card ${profile.activityLevel === 'light' ? 'active' : ''}`}
                  onClick={() => setProfile({...profile, activityLevel: 'light'})}
                >
                  <strong>Lightly Active</strong>
                  <span>Exercise 1-3 days/week</span>
                </button>
                <button
                  className={`option-card ${profile.activityLevel === 'moderate' ? 'active' : ''}`}
                  onClick={() => setProfile({...profile, activityLevel: 'moderate'})}
                >
                  <strong>Moderately Active</strong>
                  <span>Exercise 3-5 days/week</span>
                </button>
                <button
                  className={`option-card ${profile.activityLevel === 'very' ? 'active' : ''}`}
                  onClick={() => setProfile({...profile, activityLevel: 'very'})}
                >
                  <strong>Very Active</strong>
                  <span>Exercise 6-7 days/week</span>
                </button>
                <button
                  className={`option-card ${profile.activityLevel === 'extra' ? 'active' : ''}`}
                  onClick={() => setProfile({...profile, activityLevel: 'extra'})}
                >
                  <strong>Extra Active</strong>
                  <span>Very intense exercise daily</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="form-actions">
          {step > 1 && (
            <button className="btn-secondary" onClick={() => setStep(step - 1)}>
              Back
            </button>
          )}
          <button className="btn-primary" onClick={handleNext}>
            {step === 2 ? 'Continue' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;

