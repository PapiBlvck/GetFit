import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';

const Social: React.FC = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('feed');

  const [friends, setFriends] = useState([
    { id: 1, name: 'Francine Chirwa', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&auto=format', streak: 15, lastActivity: 'Completed Morning Yoga' },
    { id: 2, name: 'Kafwimbi Chimfwembe', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format', streak: 22, lastActivity: '5km run - 25:30' },
    { id: 3, name: 'Emma Davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&auto=format', streak: 8, lastActivity: 'Upper Body Workout' }
  ]);

  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState('week');

  const allLeaderboards = {
    week: [
      { rank: 1, name: 'Alex Smith', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&auto=format', points: 2450, badge: '🥇' },
      { rank: 2, name: 'You', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&auto=format', points: 2180, badge: '🥈' },
      { rank: 3, name: 'Jordan Lee', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&auto=format', points: 2050, badge: '🥉' },
      { rank: 4, name: 'Taylor Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format', points: 1980, badge: '' },
      { rank: 5, name: 'Casey Brown', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&auto=format', points: 1875, badge: '' }
    ],
    month: [
      { rank: 1, name: 'Jordan Lee', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&auto=format', points: 8950, badge: '🥇' },
      { rank: 2, name: 'Alex Smith', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&auto=format', points: 8720, badge: '🥈' },
      { rank: 3, name: 'You', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&auto=format', points: 7890, badge: '🥉' },
      { rank: 4, name: 'Taylor Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format', points: 7450, badge: '' },
      { rank: 5, name: 'Casey Brown', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&auto=format', points: 6980, badge: '' }
    ],
    alltime: [
      { rank: 1, name: 'Alex Smith', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&auto=format', points: 45280, badge: '🥇' },
      { rank: 2, name: 'Jordan Lee', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&auto=format', points: 42150, badge: '🥈' },
      { rank: 3, name: 'Casey Brown', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&auto=format', points: 38920, badge: '🥉' },
      { rank: 4, name: 'You', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&auto=format', points: 35640, badge: '' },
      { rank: 5, name: 'Taylor Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format', points: 32890, badge: '' }
    ]
  };

  const leaderboard = allLeaderboards[leaderboardPeriod as keyof typeof allLeaderboards];

  const challenges = [
    { id: 1, name: '10K Steps Challenge', participants: 47, daysLeft: 3, progress: 75, description: 'Walk 10,000 steps every day for a week!' },
    { id: 2, name: '30 Day Yoga Journey', participants: 32, daysLeft: 12, progress: 60, description: 'Complete a yoga session every day for 30 days.' },
    { id: 3, name: 'Plank Challenge', participants: 85, daysLeft: 7, progress: 85, description: 'Hold a plank for 2 minutes every day!' }
  ];

  const handleAddFriend = () => {
    const newFriend = {
      id: friends.length + 1,
      name: 'New Friend',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&auto=format',
      streak: 1,
      lastActivity: 'Just joined!'
    };
    setFriends([...friends, newFriend]);
    setIsAddFriendModalOpen(false);
    toast.success('Friend added successfully!');
  };

  const handleViewChallenge = (challenge: any) => {
    setSelectedChallenge(challenge);
    toast.info(`Viewing: ${challenge.name}`);
  };

  return (
    <div className="social-page">
      <div className="page-header">
        <h1>Community</h1>
        <p>Connect, compete, and stay motivated together</p>
      </div>

      {/* Tabs */}
      <div className="social-tabs">
        <button 
          className={`tab ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveTab('feed')}
        >
          Feed
        </button>
        <button 
          className={`tab ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          Friends
        </button>
        <button 
          className={`tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          Leaderboard
        </button>
        <button 
          className={`tab ${activeTab === 'challenges' ? 'active' : ''}`}
          onClick={() => setActiveTab('challenges')}
        >
          Challenges
        </button>
      </div>

      {/* Feed Tab */}
      {activeTab === 'feed' && (
        <div className="feed-container">
          <div className="post-card">
            <div className="post-header">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&auto=format" alt="Francine Chirwa" className="post-avatar" />
              <div>
                <h4>Francine Chirwa</h4>
                <p className="post-time">2 hours ago</p>
              </div>
            </div>
            <div className="post-content">
              <p>Just completed a 5K run! Feeling amazing! 🏃‍♀️💪</p>
              <div className="post-stats">
                <span>🔥 320 cal</span>
                <span>⏱️ 28:45</span>
                <span>📍 5.0 km</span>
              </div>
            </div>
            <div className="post-actions">
              <button onClick={() => toast.success('Post liked!')}>❤️ 12</button>
              <button onClick={() => toast.info('Comments feature coming soon!')}>💬 3</button>
              <button onClick={() => toast.success('🔥 You cheered for Francine!')}>🔥 Cheer</button>
            </div>
          </div>

          <div className="post-card">
            <div className="post-header">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format" alt="Kafwimbi Chimfwembe" className="post-avatar" />
              <div>
                <h4>Kafwimbi Chimfwembe</h4>
                <p className="post-time">5 hours ago</p>
              </div>
            </div>
            <div className="post-content">
              <p>New personal record on bench press! 💪 Hard work pays off!</p>
              <div className="achievement-badge">
                <span>🏆 Achievement Unlocked: Strength Master</span>
              </div>
            </div>
            <div className="post-actions">
              <button onClick={() => toast.success('Post liked!')}>❤️ 24</button>
              <button onClick={() => toast.info('Comments feature coming soon!')}>💬 8</button>
              <button onClick={() => toast.success('🔥 You cheered for Kafwimbi!')}>🔥 Cheer</button>
            </div>
          </div>
        </div>
      )}

      {/* Friends Tab */}
      {activeTab === 'friends' && (
        <div className="friends-container">
          <button className="btn-primary btn-full" onClick={() => setIsAddFriendModalOpen(true)}>+ Add Friends</button>
          
          <div className="friends-list">
            {friends.map(friend => (
              <div key={friend.id} className="friend-card">
                <img src={friend.avatar} alt={friend.name} className="friend-avatar" />
                <div className="friend-info">
                  <h4>{friend.name}</h4>
                  <p className="friend-streak">🔥 {friend.streak} day streak</p>
                  <p className="friend-activity">{friend.lastActivity}</p>
                </div>
                <button className="btn-secondary btn-sm">View</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="leaderboard-container">
          <div className="leaderboard-header">
            <h3>{leaderboardPeriod === 'week' ? "This Week's" : leaderboardPeriod === 'month' ? "This Month's" : "All Time"} Top Performers</h3>
            <select 
              className="time-filter"
              value={leaderboardPeriod}
              onChange={(e) => setLeaderboardPeriod(e.target.value)}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="alltime">All Time</option>
            </select>
          </div>

          <div className="leaderboard-list">
            {leaderboard.map(user => (
              <div key={user.rank} className={`leaderboard-item ${user.name === 'You' ? 'current-user' : ''}`}>
                <span className="rank">{user.badge || `#${user.rank}`}</span>
                <img src={user.avatar} alt={user.name} className="user-avatar" />
                <div className="user-info">
                  <h4>{user.name}</h4>
                  <p>{user.points} points</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Challenges Tab */}
      {activeTab === 'challenges' && (
        <div className="challenges-container">
          <button className="btn-primary btn-full" onClick={() => setIsChallengeModalOpen(true)}>+ Create Challenge</button>

          <div className="challenges-list">
            {challenges.map(challenge => (
              <div key={challenge.id} className="challenge-card">
                <div className="challenge-header">
                  <h4>{challenge.name}</h4>
                  <span className="challenge-badge">{challenge.daysLeft} days left</span>
                </div>
                <p>{challenge.participants} participants</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${challenge.progress}%` }}></div>
                </div>
                <p className="progress-text">{challenge.progress}% Complete</p>
                <button className="btn-secondary btn-full" onClick={() => handleViewChallenge(challenge)}>View Challenge</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Friend Modal */}
      {isAddFriendModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddFriendModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Friend</h2>
              <button className="modal-close" onClick={() => setIsAddFriendModalOpen(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Friend's Username or Email</label>
                <input
                  type="text"
                  placeholder="Enter username or email"
                  className="form-input"
                />
              </div>
              <p className="helper-text">Search for your friends to add them to your network!</p>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-secondary" 
                onClick={() => setIsAddFriendModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handleAddFriend}
              >
                Add Friend
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Challenge Modal */}
      {isChallengeModalOpen && (
        <div className="modal-overlay" onClick={() => setIsChallengeModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Challenge</h2>
              <button className="modal-close" onClick={() => setIsChallengeModalOpen(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Challenge Name</label>
                <input
                  type="text"
                  placeholder="e.g., 30 Day Fitness Challenge"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Describe your challenge..."
                  className="form-input"
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Duration (days)</label>
                <input
                  type="number"
                  placeholder="30"
                  className="form-input"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-secondary" 
                onClick={() => setIsChallengeModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={() => {
                  setIsChallengeModalOpen(false);
                  toast.success('Challenge created successfully!');
                }}
              >
                Create Challenge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Challenge Modal */}
      {selectedChallenge && (
        <div className="modal-overlay" onClick={() => setSelectedChallenge(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedChallenge.name}</h2>
              <button className="modal-close" onClick={() => setSelectedChallenge(null)}>✕</button>
            </div>

            <div className="modal-body">
              <p className="challenge-description">{selectedChallenge.description}</p>
              
              <div className="challenge-stats-grid">
                <div className="challenge-stat">
                  <h4>{selectedChallenge.participants}</h4>
                  <p>Participants</p>
                </div>
                <div className="challenge-stat">
                  <h4>{selectedChallenge.daysLeft}</h4>
                  <p>Days Left</p>
                </div>
                <div className="challenge-stat">
                  <h4>{selectedChallenge.progress}%</h4>
                  <p>Your Progress</p>
                </div>
              </div>

              <div className="progress-bar" style={{ marginTop: '1.5rem' }}>
                <div className="progress-fill" style={{ width: `${selectedChallenge.progress}%` }}></div>
              </div>
              <p className="progress-text">{selectedChallenge.progress}% Complete</p>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-secondary" 
                onClick={() => setSelectedChallenge(null)}
              >
                Close
              </button>
              <button 
                className="btn-primary"
                onClick={() => {
                  setSelectedChallenge(null);
                  toast.success(`Joined ${selectedChallenge?.name}!`);
                }}
              >
                Join Challenge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Social;

