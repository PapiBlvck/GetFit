import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Heart, Activity, Flame, Dumbbell, BarChart3, Settings, Users, Home, Loader2, Plus, X, Target } from 'lucide-react';
// --- FIREBASE IMPORTS ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, setDoc, updateDoc, increment, collection, query, where, getDocs } from 'firebase/firestore';

// Import existing Firebase config
import { app as existingApp, auth as existingAuth, db as existingDb } from '../config/firebase.config';

// --- GLOBAL VARIABLES ---
const appId = 'getfit-app';
const initialAuthToken = null;

// Use existing Firebase instances
const useExistingFirebase = true;

// --- MOCK DATA FOR DEMO PURPOSES (Will be overwritten by Firestore) ---
const mockWeeklyProgress = [
    { day: 'Sun', calories: 50 },
    { day: 'Mon', calories: 150 },
    { day: 'Tue', calories: 80 },
    { day: 'Wed', calories: 120 },
    { day: 'Thu', calories: 30 },
    { day: 'Fri', calories: 180 },
    { day: 'Sat', calories: 0 },
];
const mockCoachingAdvice = {
    title: "Full Body Strength",
    duration: "45 Min",
    focus: "Hypertrophy",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop&auto=format"
};

const screens = {
    dashboard: 'Dashboard',
    progress: 'Progress',
    social: 'Social',
    settings: 'Settings',
};

// --- APPLICATION STATE (Firebase Initialization and Context Simulation) ---

function useAppState() {
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        // Use existing Firebase configuration
        try {
            setDb(existingDb);
            setAuth(existingAuth);
        } catch (e) {
            setAuthError("Failed to initialize Firebase.");
            console.error("Firebase Initialization Error:", e);
            return;
        }
    }, []);

    useEffect(() => {
        if (!auth) return;

        // Set up Auth State Listener (use existing auth, don't force sign-in)
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                setIsAuthReady(true);
            } else {
                // If no user, generate a temporary ID for demo purposes
                const tempId = 'demo-' + Math.random().toString(36).substring(2, 15);
                setUserId(tempId);
                setIsAuthReady(true);
            }
        });

        return () => unsubscribe();
    }, [auth]);

    return { db, auth, userId, isAuthReady, authError };
}

// --- FIRESTORE DATA HOOK (Daily Summary: Steps/Calories) ---

function useFirestoreDailySummary(db, userId, isAuthReady) {
    // Defines the shape of the data for clarity (simulating TypeScript interface)
    /** @type {{steps: number, calories_burned: number, heartbeat: number} | null} */
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthReady || !db || !userId) {
            setIsLoading(true);
            return;
        }

        // Generate today's date key (YYYY-MM-DD)
        const today = new Date().toISOString().split('T')[0];
        
        // Firestore Path (Private Daily Data - M1 Requirement)
        // /artifacts/{appId}/users/{userId}/daily_summary/{today}
        const docRef = doc(db, 
            'artifacts', appId, 
            'users', userId, 
            'daily_summary', today
        );
        
        setIsLoading(false); 

        // Setup real-time listener (onSnapshot)
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                // If data exists, use it
                setSummary(docSnap.data());
            } else {
                // If the document doesn't exist, set a baseline 
                const defaultData = { steps: 0, calories_burned: 0, heartbeat: 0 };
                setSummary(defaultData);
                // Create the document with default data
                setDoc(docRef, defaultData, { merge: true }).catch(e => console.error("Error setting default daily doc:", e));
            }
            setIsLoading(false);
            setError(null);
        }, (e) => {
            console.error("Firestore Daily Summary Fetch Error:", e);
            setError("Failed to load daily summary.");
            setIsLoading(false);
            setSummary(null);
        });

        return () => unsubscribe();
    }, [db, userId, isAuthReady]);

    return { data: summary, isLoading, isError: !!error, error };
}

// --- FIRESTORE DATA HOOK (User Goals - Persistent Setting - M1 Requirement) ---

function useFirestoreUserGoals(db, userId, isAuthReady) {
    const [goal, setGoal] = useState(10000); // Default Goal
    const [isLoadingGoal, setIsLoadingGoal] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthReady || !db || !userId) {
            setIsLoadingGoal(true);
            return;
        }

        // Firestore Path for persistent user settings (M1 Requirement)
        // /artifacts/{appId}/users/{userId}/settings/goals
        const docRef = doc(db, 
            'artifacts', appId, 
            'users', userId, 
            'settings', 'goals'
        );
        
        setIsLoadingGoal(false);

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists() && docSnap.data().daily_steps_goal) {
                // Ensure goal is a number, fallback if not
                const newGoal = Number(docSnap.data().daily_steps_goal);
                setGoal(newGoal || 10000);
            } else {
                // If doc doesn't exist, use default and create it.
                const defaultGoal = 10000; 
                setGoal(defaultGoal);
                setDoc(docRef, { daily_steps_goal: defaultGoal }, { merge: true }).catch(e => console.error("Error setting default goal doc:", e));
            }
            setIsLoadingGoal(false);
            setError(null);
        }, (e) => {
            console.error("Firestore Goal Fetch Error:", e);
            setError("Failed to load user goals.");
            setIsLoadingGoal(false);
            setGoal(10000); // Fallback
        });

        return () => unsubscribe();
    }, [db, userId, isAuthReady]);

    return { data: goal, isLoading: isLoadingGoal, isError: !!error, error };
}


// --- FIRESTORE MUTATION FUNCTIONS ---

/**
 * Updates the user's daily step count by incrementing the existing value. (M1 - Steps Logging)
 */
const logStepsToFirestore = async (db, userId, stepsToAdd) => {
    if (!db || !userId || stepsToAdd <= 0) {
        console.error("Cannot log steps: Missing DB/UserID or stepsToAdd is zero/negative.");
        return false;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const docRef = doc(db, 
        'artifacts', appId, 
        'users', userId, 
        'daily_summary', today
    );

    try {
        await updateDoc(docRef, {
            steps: increment(stepsToAdd),
        });
        console.log(`Successfully logged ${stepsToAdd} steps.`);
        return true;
    } catch (e) {
        console.error("Failed to log steps to Firestore:", e);
        if (e.code === 'not-found') {
             try {
                // Attempt to set the initial document if it doesn't exist
                await setDoc(docRef, { steps: stepsToAdd, calories_burned: 0, heartbeat: 0 }, { merge: true });
                console.log(`Set initial steps document with ${stepsToAdd} steps.`);
                return true;
            } catch (setE) {
                console.error("Failed to set initial steps document:", setE);
                return false;
            }
        }
        return false;
    }
};

/**
 * Sets the user's persistent daily steps goal. (M1 - Goals)
 */
const setDailyGoalToFirestore = async (db, userId, newGoal) => {
    if (!db || !userId || newGoal <= 0) {
        console.error("Cannot set goal: Missing DB/UserID or newGoal is zero/negative.");
        return false;
    }
    
    const docRef = doc(db, 
        'artifacts', appId, 
        'users', userId, 
        'settings', 'goals'
    );

    try {
        await setDoc(docRef, { daily_steps_goal: newGoal }, { merge: true });
        console.log(`Successfully set daily goal to ${newGoal}.`);
        return true;
    } catch (e) {
        console.error("Failed to set daily goal to Firestore:", e);
        return false;
    }
};


// --- UTILITY COMPONENTS ---

// 1. Metric Card (Refined Dark Theme)
const MetricCard = ({ value, label, icon: Icon, color }) => (
  <div
    className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.03] shadow-inner`}
    style={{ backgroundColor: '#181818' }} // Slightly lighter card background
  >
    <div className={`text-4xl font-extrabold mb-1`} style={{ color }}>
      {value}
    </div>
    <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 flex items-center">
      <Icon size={14} className="mr-1" style={{ color }} />
      {label}
    </div>
  </div>
);

// 2. Main Button (High-Impact Yellow/Gold)
const CallToActionButton = ({ children, onClick, disabled = false, className = '' }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full py-4 text-center text-lg font-bold rounded-xl transition-all duration-300 tracking-wider uppercase
                    ${disabled
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-yellow-500 text-black hover:bg-yellow-400 active:scale-[0.98] shadow-lg shadow-yellow-500/30'
                    } ${className}`}
    >
        {children}
    </button>
);

// 3. Navigation
const BottomNav = ({ activeScreen, setScreen }) => {
    const NavItem = ({ name, icon: Icon }) => {
        const isActive = activeScreen === name;
        const color = isActive ? 'text-yellow-500' : 'text-gray-500';
        const iconSize = 24;

        return (
            <button
                onClick={() => setScreen(name)}
                className={`flex flex-col items-center p-2 rounded-xl transition-colors duration-200 
                            ${isActive ? 'bg-gray-800' : 'hover:bg-gray-800/50'}`}
            >
                <Icon size={iconSize} className={color} />
            </button>
        );
    };

    return (
        // The fixed background is now a solid black bar
        <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto p-4 z-40" style={{ backgroundColor: '#0A0A0A' }}>
            {/* The actual navigation container is a highly rounded, slightly inset dark panel */}
            <div className="flex justify-around bg-gray-900 rounded-full p-2 shadow-2xl shadow-black">
                <NavItem name={screens.dashboard} icon={Home} />
                <NavItem name={screens.progress} icon={BarChart3} />
                <NavItem name={screens.social} icon={Users} />
                <NavItem name={screens.settings} icon={Settings} />
            </div>
        </div>
    );
};

// 4. Custom Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-end justify-center z-50 transition-opacity duration-300">
            {/* Modal Content - Slide-up sheet style */}
            <div
                className="w-full max-w-lg bg-gray-900 p-6 rounded-t-3xl shadow-2xl transform transition-transform duration-300 translate-y-0"
                style={{ backgroundColor: '#181818' }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full bg-gray-800 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

// 5. Step Logger Component (M1 - Steps Logging)
const StepLoggerModal = ({ isOpen, onClose, db, userId }) => {
    const [stepInput, setStepInput] = useState('');
    const [isLogging, setIsLogging] = useState(false);
    const [message, setMessage] = useState('');

    const handleLogSteps = async () => {
        const steps = parseInt(stepInput, 10);
        if (isNaN(steps) || steps <= 0) {
            setMessage('Please enter a valid number of steps.');
            return;
        }

        setIsLogging(true);
        setMessage('');

        const success = await logStepsToFirestore(db, userId, steps);

        if (success) {
            setMessage(`+${steps.toLocaleString()} steps logged!`);
            setStepInput('');
            setTimeout(() => {
                onClose();
            }, 1000); 
        } else {
            setMessage('Error: Failed to save steps. Try again.');
        }

        setIsLogging(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Log Daily Steps">
            <div className="space-y-6">
                <div className="flex flex-col">
                    <label htmlFor="steps" className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-widest">
                        Steps Counted
                    </label>
                    <input
                        id="steps"
                        type="number"
                        min="1"
                        value={stepInput}
                        onChange={(e) => setStepInput(e.target.value)}
                        placeholder="e.g., 5000"
                        className="w-full p-4 text-3xl font-bold text-white bg-gray-800 rounded-xl border-2 border-gray-700 focus:border-yellow-500 transition-colors placeholder-gray-600"
                    />
                </div>
                
                {message && (
                    <p className={`text-center font-medium ${message.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                        {message}
                    </p>
                )}

                <CallToActionButton 
                    onClick={handleLogSteps} 
                    disabled={isLogging || !stepInput}
                >
                    {isLogging ? (
                        <span className="flex items-center justify-center">
                            <Loader2 size={24} className="animate-spin mr-2" /> SAVING...
                        </span>
                    ) : (
                        'ADD STEPS'
                    )}
                </CallToActionButton>
            </div>
        </Modal>
    );
};

// 6. Goal Setting Component (M1 - Goals)
const GoalSettingModal = ({ isOpen, onClose, db, userId, currentGoal }) => {
    const [goalInput, setGoalInput] = useState(currentGoal.toString());
    const [isSetting, setIsSetting] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isOpen) {
            // Reset input and message when modal opens
            setGoalInput(currentGoal.toString());
            setMessage('');
        }
    }, [isOpen, currentGoal]);

    const handleSetGoal = async () => {
        const goal = parseInt(goalInput, 10);
        if (isNaN(goal) || goal < 1000) {
            setMessage('Please enter a realistic goal (minimum 1,000 steps).');
            return;
        }

        setIsSetting(true);
        setMessage('');

        const success = await setDailyGoalToFirestore(db, userId, goal);

        if (success) {
            setMessage(`Goal successfully set to ${goal.toLocaleString()} steps!`);
            setTimeout(() => {
                onClose();
            }, 1000); 
        } else {
            setMessage('Error: Failed to save goal. Try again.');
        }

        setIsSetting(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Set Daily Steps Goal">
            <div className="space-y-6">
                <p className="text-gray-400 text-center">Your current goal is <span className="text-yellow-500 font-bold">{currentGoal.toLocaleString()}</span> steps.</p>
                <div className="flex flex-col">
                    <label htmlFor="goal" className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-widest">
                        New Daily Steps Goal
                    </label>
                    <input
                        id="goal"
                        type="number"
                        min="1000"
                        step="500"
                        value={goalInput}
                        onChange={(e) => setGoalInput(e.target.value)}
                        placeholder="e.g., 10000"
                        className="w-full p-4 text-3xl font-bold text-white bg-gray-800 rounded-xl border-2 border-gray-700 focus:border-yellow-500 transition-colors placeholder-gray-600"
                    />
                </div>
                
                {message && (
                    <p className={`text-center font-medium ${message.startsWith('Goal') ? 'text-green-400' : 'text-red-400'}`}>
                        {message}
                    </p>
                )}

                <CallToActionButton 
                    onClick={handleSetGoal} 
                    disabled={isSetting || goalInput === '' || parseInt(goalInput, 10) === currentGoal}
                >
                    {isSetting ? (
                        <span className="flex items-center justify-center">
                            <Loader2 size={24} className="animate-spin mr-2" /> UPDATING...
                        </span>
                    ) : (
                        'SET NEW GOAL'
                    )}
                </CallToActionButton>
            </div>
        </Modal>
    );
};

// 7. Progress Ring Component (Visual Steps Goal)
const ProgressRing = ({ percentage, value, goal }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    // Calculate the stroke offset for the percentage
    const offset = circumference - (percentage / 100) * circumference;
    // Gold for completion (>= 100%), Green for in-progress
    const progressColor = percentage >= 100 ? '#FBBF24' : '#34D399'; 

    return (
        <div className="relative flex items-center justify-center p-4">
            <svg className="w-40 h-40 transform -rotate-90">
                {/* Background Ring */}
                <circle
                    className="text-gray-700"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="80"
                    cy="80"
                />
                {/* Progress Ring */}
                <circle
                    className="transition-all duration-1000 ease-out"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke={progressColor}
                    fill="transparent"
                    r={radius}
                    cx="80"
                    cy="80"
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <p className="text-4xl font-extrabold text-white mb-1">{value.toLocaleString()}</p>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                    of {goal.toLocaleString()}
                </p>
            </div>
        </div>
    );
};


// --- SCREEN COMPONENTS ---

const DashboardScreen = ({ onStartWorkout, firebaseState, onLogStepsClick, onSetGoalClick }) => {
  const { db, userId, isAuthReady } = firebaseState;
  
  // REAL-TIME FIRESTORE DATA HOOKS (M1 - Daily Summary & Goals)
  const { data: summaryData, isLoading: isLoadingSummary, isError: isErrorSummary } = useFirestoreDailySummary(db, userId, isAuthReady);
  const { data: goalData, isLoading: isLoadingGoal } = useFirestoreUserGoals(db, userId, isAuthReady); 

  // Helper for rendering skeleton/loading state
  const Skeleton = ({ w = 'full', h = 'h-5', className = '' }) => (
    <div className={`bg-gray-700 rounded-lg animate-pulse ${w} ${h} ${className}`}></div>
  );

  const isLoading = isLoadingSummary || isLoadingGoal || !isAuthReady;
  const data = summaryData;
  const goal = goalData || 10000;
  const currentSteps = data?.steps || 0;
  // Calculate percentage for the progress ring
  const stepPercentage = Math.min(100, Math.round((currentSteps / goal) * 100));


  if (isErrorSummary) {
      return <SimpleScreen title="Data Error" message="Could not load daily summary data from Firestore." />;
  }
  
  // Data for the Weekly Chart (still mock, as full history is not implemented)
  const progressData = mockWeeklyProgress;
  const coachingData = mockCoachingAdvice;

  return (
    <div className="p-4 space-y-8">
      {/* 1. Header and Profile (Bold Typography) */}
      <header className="flex justify-between items-center pt-4">
        <div className="flex items-center space-x-3">
          <div className="h-14 w-14 rounded-full bg-yellow-500 border-4 border-yellow-500 flex items-center justify-center text-black font-extrabold text-2xl">
            MB
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400">Welcome Back,</p>
            <h1 className="text-2xl font-black text-white tracking-wide">MICHAEL BERNANDO</h1>
          </div>
        </div>
        
        {/* Log Steps Button (Quick Action - M1 Requirement) */}
        <button 
            onClick={onLogStepsClick}
            disabled={isLoading}
            className="p-3 bg-yellow-500 rounded-full text-black shadow-lg shadow-yellow-500/50 hover:bg-yellow-400 transition-colors active:scale-95"
        >
            <Plus size={24} strokeWidth={3} />
        </button>
      </header>

      {/* 2. Key Metrics: Steps Goal Progress Ring & Other Metrics */}
      <section className="flex flex-col space-y-4">
        {/* STEPS GOAL PROGRESS RING (M1 - Goals Visualization) */}
        <div className="w-full p-5 rounded-3xl shadow-xl flex flex-col items-center" style={{ backgroundColor: '#181818' }}>
            <div className="flex justify-between w-full items-center mb-4">
                <h2 className="text-lg font-bold text-white tracking-wider flex items-center">
                    <Activity size={20} className="mr-2 text-green-400" />
                    DAILY STEP TARGET
                </h2>
                {/* Button to open Goal Setting Modal */}
                <button 
                    onClick={onSetGoalClick} 
                    className="text-sm font-semibold text-yellow-500 hover:text-yellow-400 transition-colors flex items-center"
                >
                    <Target size={16} className="mr-1" />
                    {isLoading ? '...' : goal.toLocaleString()} Goal
                </button>
            </div>
            
            {isLoading ? (
                <div className="py-8"><Skeleton h="h-28" w="w-28" className="rounded-full" /></div>
            ) : (
                <ProgressRing 
                    percentage={stepPercentage} 
                    value={currentSteps} 
                    goal={goal}
                />
            )}
        </div>

        {/* Other Metrics (M1 - Daily Summary) */}
        <div className="grid grid-cols-2 gap-3">
          {isLoading ? (
            <>
              <Skeleton h="h-24" />
              <Skeleton h="h-24" />
            </>
          ) : (
            <>
              <MetricCard value={`${data?.calories_burned || '0'} KCAL`} label="CAL BURN" icon={Flame} color="#FBBF24" />
              <MetricCard value={`${data?.heartbeat || '0'} BPM`} label="HEARTBEAT" icon={Heart} color="#F87171" />
            </>
          )}
        </div>
      </section>
      
      {/* Display User ID (Mandatory for multi-user apps) */}
      <div className="text-center text-xs text-gray-500 pt-1">
            <span className="font-medium text-yellow-500">USER ID:</span> {userId || 'Authenticating...'}
      </div>


      {/* 3. Weekly Progress Chart (Visual Hierarchy) */}
      <section className="p-5 rounded-3xl shadow-xl" style={{ backgroundColor: '#181818' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white tracking-wider">WEEKLY PROGRESS</h2>
          <div className="text-sm font-medium text-gray-400">Weekly Average: {isLoading ? <Skeleton w="w-12" h="h-4" className="inline-block align-middle" /> : <span className="font-bold text-white">{`${Math.round(progressData.reduce((acc, curr) => acc + curr.calories, 0) / 7)} CAL`}</span>}</div>
        </div>

        <div className="flex h-36 items-end justify-around border-b border-gray-700 pb-2">
          {isLoading ? (
            Array(7).fill().map((_, i) => <Skeleton key={i} w="w-4" h={`h-${(i % 5) * 5 + 5}`} />)
          ) : (
            progressData.map((item, index) => (
              <div key={item.day} className="flex flex-col items-center">
                {/* Bar height based on actual data vs max possible value (200 assumed max) */}
                <div
                  className={`w-4 rounded-t-full transition-all duration-500 ease-out`}
                  style={{
                    height: `${(item.calories / 200) * 80 + 20}px`, // Scale between 20px and 100px
                    backgroundColor: item.calories > 150 ? '#FBBF24' : '#34D399',
                  }}
                ></div>
                <span className="text-xs font-medium text-gray-500 mt-2">{item.day.substring(0, 3).toUpperCase()}</span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 4. Personalized Plan Card (High-Impact Imagery) */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white tracking-wider">YOUR NEXT WORKOUT</h2>
          <button className="text-sm font-semibold text-yellow-500 hover:text-yellow-400 transition-colors">VIEW ALL</button>
        </div>

        <div
          className="relative h-56 rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
          onClick={onStartWorkout}
        >
          {/* Mock Image Placeholder using high-impact style */}
          <img
            src={isLoading ? "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=400&fit=crop&auto=format" : coachingData.image}
            alt="Workout background"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />

          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6">
            <h3 className="text-3xl font-black text-white leading-tight tracking-wide">
                {isLoading ? <Skeleton w="w-48" h="h-7" /> : coachingData.title.toUpperCase()}
            </h3>
            <p className="text-base font-semibold text-yellow-500 flex items-center mt-2">
                <Dumbbell size={18} className="mr-2" />
                {isLoading ? <Skeleton w="w-24" h="h-5" /> : coachingData.duration.toUpperCase()}
            </p>
          </div>
        </div>

        <CallToActionButton onClick={onStartWorkout} disabled={isLoading} className="mt-6">
            START NOW
        </CallToActionButton>
      </section>
    </div>
  );
};


// --- MINIMAL SCREEN PLACEHOLDERS ---

const SimpleScreen = ({ title, message = "This screen is functional but needs implementation based on the TDD." }) => (
    <div className="p-8 h-full flex flex-col justify-center items-center text-center min-h-64">
        <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
        <p className="text-lg text-gray-400">
            {message}
        </p>
    </div>
);


// --- MAIN APPLICATION COMPONENT ---
export default function App() {
  const firebaseState = useAppState();
  const { isAuthReady, authError, db, userId } = firebaseState;

  const { data: currentGoal } = useFirestoreUserGoals(db, userId, isAuthReady); // Fetch goal for modal

  const [activeScreen, setActiveScreen] = useState(screens.dashboard);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [isLogStepsModalOpen, setIsLogStepsModalOpen] = useState(false);
  const [isGoalSettingModalOpen, setIsGoalSettingModalOpen] = useState(false); // NEW STATE for goal modal

  const startWorkout = useCallback(() => {
    setCurrentWorkout({
      name: "Full Body Strength",
      startTime: new Date(),
    });
  }, []);

  const finishWorkout = useCallback(() => {
    setCurrentWorkout(null);
    console.log('Workout Finished! Data needs to be logged via tRPC mutation.');
  }, []);

  if (authError) {
    return <SimpleScreen title="App Error" message={authError} />;
  }

  if (!isAuthReady) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="flex flex-col items-center">
                <Loader2 size={48} className="animate-spin text-yellow-500 mb-4" />
                <p className="text-xl font-medium">Connecting to GetFit Backend...</p>
                <p className="text-sm text-gray-500 mt-2">Initializing Firebase Auth & Firestore.</p>
            </div>
        </div>
    );
  }

  // Conditional Rendering Logic (Simulating Router)
  const renderScreen = () => {
    if (currentWorkout) {
      // In a real app, this screen would have logic to end the workout
      return (
        <div className="flex flex-col h-full">
            <SimpleScreen title={`Active Workout: ${currentWorkout.name}`} />
            <div className="p-6">
                <CallToActionButton onClick={finishWorkout}>END WORKOUT</CallToActionButton>
            </div>
        </div>
      );
    }

    switch (activeScreen) {
      case screens.dashboard:
        return <DashboardScreen 
            onStartWorkout={startWorkout} 
            firebaseState={firebaseState} 
            onLogStepsClick={() => setIsLogStepsModalOpen(true)} 
            onSetGoalClick={() => setIsGoalSettingModalOpen(true)} 
        />;
      case screens.progress:
        return <SimpleScreen title="Progress & Stats" />;
      case screens.social:
        return <SimpleScreen title="Social Challenges" />;
      case screens.settings:
        return <SimpleScreen title="Settings" />;
      default:
        return <DashboardScreen 
            onStartWorkout={startWorkout} 
            firebaseState={firebaseState} 
            onLogStepsClick={() => setIsLogStepsModalOpen(true)}
            onSetGoalClick={() => setIsGoalSettingModalOpen(true)}
        />;
    }
  };

  return (
    // Main Container (Simulating Mobile Viewport)
    <div
      className="min-h-screen bg-gray-900 flex flex-col items-center justify-start text-white"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <div className="w-full max-w-lg min-h-screen relative overflow-hidden pb-24" style={{ backgroundColor: '#0A0A0A' }}>
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
            {renderScreen()}
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeScreen={activeScreen} setScreen={setActiveScreen} />
        
        {/* Step Logger Modal */}
        <StepLoggerModal 
            isOpen={isLogStepsModalOpen}
            onClose={() => setIsLogStepsModalOpen(false)}
            db={db}
            userId={userId}
        />

        {/* Goal Setting Modal */}
        <GoalSettingModal
            isOpen={isGoalSettingModalOpen}
            onClose={() => setIsGoalSettingModalOpen(false)}
            db={db}
            userId={userId}
            currentGoal={currentGoal || 10000}
        />
      </div>
    </div>
  );
}
