import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';

const Health: React.FC = () => {
  const toast = useToast();
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isSleepModalOpen, setIsSleepModalOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [newWeight, setNewWeight] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [sleepQuality, setSleepQuality] = useState('Good');
  
  const [currentWeight, setCurrentWeight] = useState(72.5);
  const [weightHistory, setWeightHistory] = useState([73.2, 73.0, 72.8, 72.7, 72.5]);
  const [currentSleep, setCurrentSleep] = useState(7.5);
  
  const healthStats = {
    weight: { current: currentWeight, goal: 70, unit: 'kg' },
    bmi: 23.5,
    bodyFat: 18.5,
    heartRate: 72,
    sleep: currentSleep
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    toast.success(`Mood logged: ${mood}`);
    setTimeout(() => setSelectedMood(null), 2000);
  };

  const handleSaveWeight = () => {
    const weight = parseFloat(newWeight);
    if (weight && weight > 0) {
      setCurrentWeight(weight);
      setWeightHistory([...weightHistory.slice(-4), weight]);
      setIsWeightModalOpen(false);
      setNewWeight('');
      toast.success(`Weight updated to ${weight} kg`);
    } else {
      toast.error('Please enter a valid weight');
    }
  };

  const handleSaveSleep = () => {
    const sleep = parseFloat(sleepHours);
    if (sleep && sleep > 0 && sleep <= 24) {
      setCurrentSleep(sleep);
      setIsSleepModalOpen(false);
      setSleepHours('');
      const quality = sleep >= 7 ? 'Great' : sleep >= 6 ? 'Good' : 'Try to get more sleep';
      toast.success(`Sleep logged: ${sleep} hours - ${quality}!`);
    } else {
      toast.error('Please enter valid sleep hours (0-24)');
    }
  };

  return (
    <div className="health-page">
      <div className="page-header">
        <h1>Health & Body Tracking</h1>
        <p>Monitor your physical health metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="health-metrics">
        <div className="metric-card large">
          <h3>Weight</h3>
          <div className="metric-value-large">
            <span className="value">{healthStats.weight.current}</span>
            <span className="unit">{healthStats.weight.unit}</span>
          </div>
          <p className="metric-subtitle">
            Goal: {healthStats.weight.goal} {healthStats.weight.unit} 
            <span className="trend down">▼ 0.2 kg this week</span>
          </p>
          <button className="btn-secondary" onClick={() => setIsWeightModalOpen(true)}>
            Update Weight
          </button>
        </div>

        <div className="metrics-row">
          <div className="metric-card">
            <span className="metric-icon">📊</span>
            <h4>BMI</h4>
            <p className="metric-value">{healthStats.bmi}</p>
            <span className="badge success">Normal</span>
          </div>

          <div className="metric-card">
            <span className="metric-icon">💪</span>
            <h4>Body Fat</h4>
            <p className="metric-value">{healthStats.bodyFat}%</p>
            <span className="badge info">Athletic</span>
          </div>

          <div className="metric-card">
            <span className="metric-icon">❤️</span>
            <h4>Heart Rate</h4>
            <p className="metric-value">{healthStats.heartRate} bpm</p>
            <span className="badge success">Healthy</span>
          </div>
        </div>
      </div>

      {/* Weight Trend Graph */}
      <section className="trend-graph">
        <div className="section-header">
          <h2>Weight Trend (Last 30 Days)</h2>
          <select className="time-range">
            <option>7 Days</option>
            <option>30 Days</option>
            <option>90 Days</option>
            <option>1 Year</option>
          </select>
        </div>

        <div className="graph-container">
          <div className="line-graph">
            {weightHistory.map((weight, index) => (
              <div key={index} className="graph-point" style={{ left: `${(index / (weightHistory.length - 1)) * 100}%`, bottom: `${((weight - 70) / 5) * 100}%` }}>
                <div className="point"></div>
              </div>
            ))}
          </div>
          <div className="graph-labels">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
          </div>
        </div>
      </section>

      {/* Sleep Tracker */}
      <section className="sleep-section">
        <h2>😴 Sleep Tracker</h2>
        <div className="sleep-card">
          <div className="sleep-stat">
            <h3>{healthStats.sleep} hrs</h3>
            <p>Last Night</p>
          </div>
          <div className="sleep-quality">
            <div className="quality-bars">
              <div className="bar deep"></div>
              <div className="bar light"></div>
              <div className="bar rem"></div>
              <div className="bar awake"></div>
            </div>
            <div className="quality-legend">
              <span>Deep</span>
              <span>Light</span>
              <span>REM</span>
              <span>Awake</span>
            </div>
          </div>
          <button className="btn-secondary btn-full" onClick={() => setIsSleepModalOpen(true)}>
            Log Sleep
          </button>
        </div>
      </section>

      {/* Mood Tracker */}
      <section className="mood-section">
        <h2>😊 Mood Tracker</h2>
        <p>How are you feeling today?</p>
        <div className="mood-buttons">
          <button 
            className={`mood-btn ${selectedMood === 'Great' ? 'selected' : ''}`}
            onClick={() => handleMoodSelect('Great')}
          >
            😄 Great
          </button>
          <button 
            className={`mood-btn ${selectedMood === 'Good' ? 'selected' : ''}`}
            onClick={() => handleMoodSelect('Good')}
          >
            🙂 Good
          </button>
          <button 
            className={`mood-btn ${selectedMood === 'Okay' ? 'selected' : ''}`}
            onClick={() => handleMoodSelect('Okay')}
          >
            😐 Okay
          </button>
          <button 
            className={`mood-btn ${selectedMood === 'Down' ? 'selected' : ''}`}
            onClick={() => handleMoodSelect('Down')}
          >
            😔 Down
          </button>
          <button 
            className={`mood-btn ${selectedMood === 'Stressed' ? 'selected' : ''}`}
            onClick={() => handleMoodSelect('Stressed')}
          >
            😫 Stressed
          </button>
        </div>
        {selectedMood && (
          <p className="mood-saved">✓ Mood logged: {selectedMood}</p>
        )}
      </section>

      {/* Weight Update Modal */}
      {isWeightModalOpen && (
        <div className="modal-overlay" onClick={() => setIsWeightModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Weight</h2>
              <button className="modal-close" onClick={() => setIsWeightModalOpen(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Current Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="72.5"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-secondary" 
                onClick={() => setIsWeightModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handleSaveWeight}
                disabled={!newWeight}
              >
                Save Weight
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sleep Log Modal */}
      {isSleepModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSleepModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Log Sleep</h2>
              <button className="modal-close" onClick={() => setIsSleepModalOpen(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Hours of Sleep</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  placeholder="7.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Sleep Quality</label>
                <select 
                  className="form-input"
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(e.target.value)}
                >
                  <option>Excellent</option>
                  <option>Good</option>
                  <option>Fair</option>
                  <option>Poor</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-secondary" 
                onClick={() => setIsSleepModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handleSaveSleep}
                disabled={!sleepHours}
              >
                Save Sleep Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Health;

