import React, { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  fetchLeaderboard, 
  fetchFriendsActivity, 
  addFriendByEmailOrId,
  getUserFriends,
  getUser
} from '../services/firestore.service';

interface LeaderboardUser {
  id: string;
  displayName: string;
  photoURL?: string;
  totalWorkouts: number;
  rank: number;
}

interface FriendActivity {
  id: string;
  userName: string;
  userPhoto?: string;
  workoutTitle: string;
  workoutCategory: string;
  completedAt: number;
  calories: number;
  duration: number;
}

interface FriendData {
  id: string;
  displayName: string;
  photoURL?: string;
  stats: {
    totalWorkouts: number;
    totalCalories: number;
    currentStreak: number;
    longestStreak: number;
    totalDistance: number;
  };
}

const Social: React.FC = () => {
  const toast = useToast();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');

  // State for real Firebase data
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [friendsActivityData, setFriendsActivityData] = useState<FriendActivity[]>([]);
  const [friendsList, setFriendsList] = useState<FriendData[]>([]);
  const [currentUserFriendIds, setCurrentUserFriendIds] = useState<string[]>([]);
  
  // Loading states
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);
  const [isLoadingFriends, setIsLoadingFriends] = useState(true);

  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState('week');
  const [friendEmailInput, setFriendEmailInput] = useState('');

  // Mock data for challenges (can be replaced with Firebase later)
  const challenges = [
    { id: 1, name: '10K Steps Challenge', participants: 47, daysLeft: 3, progress: 75, description: 'Walk 10,000 steps every day for a week!' },
    { id: 2, name: '30 Day Yoga Journey', participants: 32, daysLeft: 12, progress: 60, description: 'Complete a yoga session every day for 30 days.' },
    { id: 3, name: 'Plank Challenge', participants: 85, daysLeft: 7, progress: 85, description: 'Hold a plank for 2 minutes every day!' }
  ];

  // Fetch all social data when component mounts or user changes
  useEffect(() => {
    if (currentUser) {
      updateSocialDisplay();
    }
  }, [currentUser]);

  // Update social display when tab changes
  useEffect(() => {
    if (currentUser && activeTab === 'leaderboard' && leaderboardData.length === 0) {
      loadLeaderboard();
    }
    if (currentUser && activeTab === 'feed' && friendsActivityData.length === 0) {
      loadFriendsActivity();
    }
    if (currentUser && activeTab === 'friends' && friendsList.length === 0) {
      loadFriends();
    }
  }, [activeTab, currentUser]);

  /**
   * Main function to update all social displays
   */
  const updateSocialDisplay = async () => {
    if (!currentUser) return;

    try {
      // Fetch current user's data to get friends list
      const userData = await getUser(currentUser.uid);
      const friendIds = userData?.friends || [];
      setCurrentUserFriendIds(friendIds);

      // Load all data in parallel
      await Promise.all([
        loadLeaderboard(),
        loadFriendsActivity(friendIds),
        loadFriends()
      ]);
    } catch (error) {
      console.error('Error updating social display:', error);
      toast.error('Failed to load social data');
    }
  };

  /**
   * Load leaderboard data
   */
  const loadLeaderboard = async () => {
    setIsLoadingLeaderboard(true);
    try {
      const leaderboard = await fetchLeaderboard(10);
      setLeaderboardData(leaderboard);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  /**
   * Load friends activity feed
   */
  const loadFriendsActivity = async (friendIds?: string[]) => {
    setIsLoadingActivity(true);
    try {
      const ids = friendIds || currentUserFriendIds;
      const activities = await fetchFriendsActivity(ids, 5);
      setFriendsActivityData(activities);
    } catch (error) {
      console.error('Error loading friends activity:', error);
      toast.error('Failed to load activity feed');
    } finally {
      setIsLoadingActivity(false);
    }
  };

  /**
   * Load friends list
   */
  const loadFriends = async () => {
    if (!currentUser) return;
    
    setIsLoadingFriends(true);
    try {
      const friends = await getUserFriends(currentUser.uid);
      setFriendsList(friends);
    } catch (error) {
      console.error('Error loading friends:', error);
      toast.error('Failed to load friends');
    } finally {
      setIsLoadingFriends(false);
    }
  };

  /**
   * Handle adding a friend
   */
  const handleAddFriend = async () => {
    if (!currentUser) {
      toast.error('You must be logged in to add friends');
      return;
    }

    if (!friendEmailInput.trim()) {
      toast.error('Please enter an email or user ID');
      return;
    }

    try {
      const result = await addFriendByEmailOrId(currentUser.uid, friendEmailInput.trim());
      
      if (result.success) {
        toast.success(result.message);
        setIsAddFriendModalOpen(false);
        setFriendEmailInput('');
        
        // Refresh social data
        await updateSocialDisplay();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error adding friend:', error);
      toast.error('Failed to add friend. Please try again.');
    }
  };

  const handleViewChallenge = (challenge: any) => {
    setSelectedChallenge(challenge);
    toast.info(`Viewing: ${challenge.name}`);
  };

  // Helper to format time ago
  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Helper to format duration
  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
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
          {isLoadingActivity ? (
            <div className="loading-container">
              <p>Loading activity feed...</p>
            </div>
          ) : friendsActivityData.length > 0 ? (
            <ul id="activity-feed-list" className="activity-feed-list">
              {friendsActivityData.map(activity => (
                <li key={activity.id} className="post-card">
                  <div className="post-header">
                    <img 
                      src={activity.userPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&auto=format'} 
                      alt={activity.userName} 
                      className="post-avatar" 
                    />
                    <div>
                      <h4>{activity.userName}</h4>
                      <p className="post-time">{formatTimeAgo(activity.completedAt)}</p>
                    </div>
                  </div>
                  <div className="post-content">
                    <p>Completed <strong>{activity.workoutTitle}</strong> ({activity.workoutCategory})</p>
                    <div className="post-stats">
                      <span>🔥 {activity.calories} cal</span>
                      <span>⏱️ {formatDuration(activity.duration)}</span>
                    </div>
                  </div>
                  <div className="post-actions">
                    <button onClick={() => toast.success('Post liked!')}>❤️ Like</button>
                    <button onClick={() => toast.success('🔥 You cheered for ' + activity.userName + '!')}>🔥 Cheer</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <p>No recent activity from friends.</p>
              <p className="helper-text">Add friends to see their workout activities!</p>
              <button className="btn-primary" onClick={() => setActiveTab('friends')}>
                Find Friends
              </button>
            </div>
          )}
        </div>
      )}

      {/* Friends Tab */}
      {activeTab === 'friends' && (
        <div className="friends-container">
          <button className="btn-primary btn-full" onClick={() => setIsAddFriendModalOpen(true)}>+ Add Friends</button>
          
          {isLoadingFriends ? (
            <div className="loading-container">
              <p>Loading friends...</p>
            </div>
          ) : friendsList.length > 0 ? (
            <div className="friends-list">
              {friendsList.map(friend => (
                <div key={friend.id} className="friend-card">
                  <img 
                    src={friend.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&auto=format'} 
                    alt={friend.displayName} 
                    className="friend-avatar" 
                  />
                  <div className="friend-info">
                    <h4>{friend.displayName}</h4>
                    <p className="friend-streak">🔥 {friend.stats.currentStreak} day streak</p>
                    <p className="friend-activity">{friend.stats.totalWorkouts} workouts completed</p>
                  </div>
                  <button 
                    className="btn-secondary btn-sm"
                    onClick={() => toast.info(`Viewing ${friend.displayName}'s profile`)}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>You haven't added any friends yet.</p>
              <p className="helper-text">Start building your fitness community!</p>
            </div>
          )}
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="leaderboard-container">
          <div className="leaderboard-header">
            <h3>Global Leaderboard - Top Performers</h3>
            <p className="helper-text">Ranked by total workouts completed</p>
          </div>

          {isLoadingLeaderboard ? (
            <div className="loading-container">
              <p>Loading leaderboard...</p>
            </div>
          ) : leaderboardData.length > 0 ? (
            <ul id="leaderboard-list" className="leaderboard-list">
              {leaderboardData.map(user => {
                const isCurrentUser = currentUser && user.id === currentUser.uid;
                const isTopThree = user.rank <= 3;
                
                return (
                  <li 
                    key={user.id} 
                    className={`leaderboard-item ${isCurrentUser ? 'current-user' : ''} ${isTopThree ? 'top-three' : ''}`}
                  >
                    <span className={`rank ${isTopThree ? 'rank-top' : ''}`}>
                      {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : `#${user.rank}`}
                    </span>
                    <img 
                      src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&auto=format'} 
                      alt={user.displayName} 
                      className="user-avatar" 
                    />
                    <div className="user-info">
                      <h4 style={isTopThree ? { color: '#10b981', fontWeight: '700' } : {}}>
                        {user.displayName} {isCurrentUser && '(You)'}
                      </h4>
                      <p>{user.totalWorkouts} workouts completed</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="empty-state">
              <p>No leaderboard data available yet.</p>
              <p className="helper-text">Complete workouts to appear on the leaderboard!</p>
            </div>
          )}
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
                <label>Friend's Email or User ID</label>
                <input
                  type="text"
                  placeholder="Enter email or user ID"
                  className="form-input"
                  value={friendEmailInput}
                  onChange={(e) => setFriendEmailInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFriend()}
                />
              </div>
              <p className="helper-text">Search for your friends to add them to your network!</p>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-secondary" 
                onClick={() => {
                  setIsAddFriendModalOpen(false);
                  setFriendEmailInput('');
                }}
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
