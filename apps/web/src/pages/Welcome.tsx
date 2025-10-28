import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Activity, Target, Award, Users } from 'lucide-react';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="kinetic-landing">
      {/* Header Navigation */}
      <header className="kinetic-header">
        <div className="kinetic-nav">
          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#social">Community</a>
            <button className="nav-login" onClick={() => navigate('/login')}>Login</button>
            <button className="nav-cta" onClick={() => navigate('/register')}>Start Blueprint</button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="kinetic-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            The Fitness App That <span className="gradient-text">Writes Itself</span>.
          </h1>
          <p className="hero-subtitle">
            Stop guessing. GetFit translates your movement into a <strong>Kinetic Blueprint</strong>—the personalized strategy for your next 90 days.
          </p>
          
          {/* Data Visualization */}
          <div className="blueprint-visual">
            <div className="blueprint-graph">
              <div className="graph-grid">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="grid-line" style={{ left: `${i * 8.33}%` }} />
                ))}
              </div>
              <svg className="progress-line" viewBox="0 0 400 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00FFF5" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#BF00FF" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <path 
                  d="M 0 180 Q 50 160, 100 140 T 200 100 T 300 60 T 400 20" 
                  stroke="url(#lineGradient)" 
                  strokeWidth="3" 
                  fill="none"
                  className="animated-path"
                />
              </svg>
              <div className="data-points">
                <div className="data-point" style={{ left: '20%', bottom: '30%' }}>
                  <div className="point-dot"></div>
                  <span className="point-label">Week 4</span>
                </div>
                <div className="data-point" style={{ left: '50%', bottom: '50%' }}>
                  <div className="point-dot"></div>
                  <span className="point-label">Week 8</span>
                </div>
                <div className="data-point" style={{ left: '80%', bottom: '70%' }}>
                  <div className="point-dot pulsing"></div>
                  <span className="point-label">Week 12</span>
                </div>
              </div>
            </div>
            <div className="blueprint-stats">
              <div className="stat-mini">
                <span className="stat-mini-value">+24%</span>
                <span className="stat-mini-label">Strength</span>
              </div>
              <div className="stat-mini">
                <span className="stat-mini-value">94.7</span>
                <span className="stat-mini-label">Streak Score</span>
              </div>
              <div className="stat-mini">
                <span className="stat-mini-value">8.2kg</span>
                <span className="stat-mini-label">Progress</span>
              </div>
            </div>
          </div>

          <div className="hero-ctas">
            <button className="cta-primary" onClick={() => navigate('/register')}>
              Start Your Kinetic Blueprint
            </button>
            <button className="cta-secondary" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              See How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="kinetic-features">
        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-card">
            <div className="feature-icon-box">
              <TrendingUp size={32} />
            </div>
            <h3 className="feature-title">Never Miss a PR.</h3>
            <div className="feature-problem">
              <strong>Problem:</strong> You forget your max lifts or plateau because you don't vary your volume correctly.
            </div>
            <div className="feature-solution">
              <strong>Solution:</strong> <span className="highlight">Intelligent Volume Prescription.</span> GetFit tracks your e1RM and uses your recovery score to dynamically adjust your weekly sets and reps, ensuring progressive overload without burnout.
            </div>
            <div className="feature-visual">
              <div className="volume-card">
                <div className="volume-exercise">Bench Press</div>
                <div className="volume-prescription">
                  <span className="volume-sets">4 sets</span> × <span className="volume-reps">8 reps</span>
                  <span className="volume-weight">@ 82.5kg</span>
                </div>
                <div className="volume-badge">Optimized for Recovery</div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="feature-card">
            <div className="feature-icon-box">
              <Target size={32} />
            </div>
            <h3 className="feature-title">Predict Your Success.</h3>
            <div className="feature-problem">
              <strong>Problem:</strong> You have a goal (e.g., lose 10kg) but don't know the realistic timeline.
            </div>
            <div className="feature-solution">
              <strong>Solution:</strong> <span className="highlight">AI Goal Modeling.</span> Based on your logged data and streak history, GetFit gives you a predicted date of achievement and a confidence score.
            </div>
            <div className="feature-visual">
              <div className="goal-prediction">
                <div className="prediction-icon">📅</div>
                <div className="prediction-date">March 15, 2025</div>
                <div className="prediction-confidence">
                  <div className="confidence-bar">
                    <div className="confidence-fill" style={{ width: '87%' }}></div>
                  </div>
                  <span className="confidence-text">87% Confidence</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="feature-card">
            <div className="feature-icon-box">
              <Award size={32} />
            </div>
            <h3 className="feature-title">The Anti-Cheat Streak.</h3>
            <div className="feature-problem">
              <strong>Problem:</strong> Simple streak counters are easy to reset and demotivating.
            </div>
            <div className="feature-solution">
              <strong>Solution:</strong> <span className="highlight">Weighted Streak Score.</span> Your streak isn't just a count; it's a score based on workout intensity, consistency, and goal adherence. A skipped workout hurts, but a high-intensity session saves your score.
            </div>
            <div className="feature-visual">
              <div className="streak-score">
                <svg className="score-circle" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle 
                    cx="60" cy="60" r="54" 
                    fill="none" 
                    stroke="url(#scoreGradient)" 
                    strokeWidth="8"
                    strokeDasharray="339.292"
                    strokeDashoffset="33.929"
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                  <defs>
                    <linearGradient id="scoreGradient">
                      <stop offset="0%" stopColor="#00FFF5" />
                      <stop offset="100%" stopColor="#BF00FF" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="score-value">94%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section id="social" className="kinetic-social">
        <h2 className="social-headline">Your Crew is Already Competing.</h2>
        <div className="leaderboard">
          <div className="leaderboard-header">
            <Users size={20} />
            <span>Global Leaderboard</span>
          </div>
          <div className="leaderboard-list">
            {[
              { rank: 1, name: 'PapiBlvck', score: 98.7 },
              { rank: 2, name: 'FitnessMaven', score: 96.3 },
              { rank: 3, name: 'IronWarrior', score: 94.8 },
              { rank: 4, name: 'ZenAthlete', score: 92.1 },
              { rank: 5, name: 'PowerLift_Pro', score: 89.5 },
            ].map((user) => (
              <div key={user.rank} className="leaderboard-item">
                <span className="rank">#{user.rank}</span>
                <span className="username">{user.name}</span>
                <span className="score">{user.score}</span>
              </div>
            ))}
          </div>
        </div>
        <blockquote className="social-quote">
          "I stopped competing with myself and started competing with my friend's Kinetic Blueprint."
          <cite>— Happy User</cite>
        </blockquote>
      </section>

      {/* Final CTA */}
      <section className="kinetic-final-cta">
        <h2 className="final-headline">Ready to Trade Effort for Efficiency?</h2>
        <button className="final-cta-button" onClick={() => navigate('/register')}>
          GetFit FREE - Start Now
        </button>
      </section>

      {/* Footer */}
      <footer className="kinetic-footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#social">Community</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
          <div className="footer-tech">
            Built on <strong>Tailwind</strong> & <strong>Firebase</strong>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;

