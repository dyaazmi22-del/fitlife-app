import React, { useState, useEffect } from 'react';
import { 
  Home, Calendar, Dumbbell, Apple, Heart, User, 
  CheckCircle2, Circle, Trash2, Plus, Droplets, 
  Moon, Sun, Target, Activity, Flame, ChevronRight,
  Utensils, Trophy, Clock, Edit2, Check, Sparkles, RotateCcw
} from 'lucide-react';

// --- CUSTOM HOOKS ---
// Hook to manage localStorage seamlessly
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// --- CONSTANT DATA ---
const EXERCISE_LIBRARY = [
  { name: 'Bench Press', muscle: 'Chest', difficulty: 'Intermediate', desc: 'Compound movement for chest strength and hypertrophy.', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { name: 'Push Up', muscle: 'Chest', difficulty: 'Beginner', desc: 'Versatile bodyweight exercise for upper body development.', image: 'https://images.unsplash.com/photo-1598971639058-fab354c6812c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { name: 'Pull Up', muscle: 'Back', difficulty: 'Intermediate', desc: 'Great bodyweight movement for building lat width and biceps.', image: 'https://images.unsplash.com/photo-1598971439775-685b5d1945a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { name: 'Deadlift', muscle: 'Back/Legs', difficulty: 'Advanced', desc: 'Ultimate heavy posterior-chain strength builder.', image: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { name: 'Squat', muscle: 'Legs', difficulty: 'Intermediate', desc: 'The fundamental standard for building leg and core power.', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { name: 'Shoulder Press', muscle: 'Shoulders', difficulty: 'Intermediate', desc: 'Overhead pressing movement targeting deltoids and triceps.', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { name: 'Bicep Curl', muscle: 'Arms', difficulty: 'Beginner', desc: 'Isolation exercise targeting muscle building in biceps.', image: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { name: 'Plank', muscle: 'Abs', difficulty: 'Beginner', desc: 'Excellent core stabilization static hold.', image: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
];

const FOOD_DATABASE = {
  animal: [
    { name: 'Chicken Breast', proteinValue: 31, protein: '31g / 100g', icon: '🍗' },
    { name: 'Egg', proteinValue: 6, protein: '6g / 1 large egg', icon: '🥚' },
    { name: 'Salmon Filet', proteinValue: 25, protein: '25g / 100g', icon: '🐟' },
    { name: 'Tuna Can', proteinValue: 28, protein: '28g / 100g', icon: '🥫' }
  ],
  plant: [
    { name: 'Tempeh', proteinValue: 19, protein: '19g / 100g', icon: '🍱' },
    { name: 'Tofu Blocks', proteinValue: 8, protein: '8g / 100g', icon: '🧊' },
    { name: 'Edamame Bowl', proteinValue: 11, protein: '11g / 100g', icon: '🫛' }
  ],
  snacks: [
    { name: 'Greek Yogurt', proteinValue: 10, protein: '10g / 100g', icon: '🥛' },
    { name: 'Whey Protein', proteinValue: 24, protein: '24g / 1 scoop', icon: '🥤' }
  ]
};

const MOTIVATIONAL_QUOTES = [
  "Consistency beats perfection.",
  "Small progress is still progress.",
  "Take care of your body. It's the only place you have to live.",
  "Health is the greatest wealth.",
  "The hard part isn't getting your body in shape. The hard part is getting your mind in shape.",
  "Don't stop when you're tired. Stop when you're done."
];

// --- MAIN APP COMPONENT ---
export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // App Data States (Persisted via LocalStorage)
  const [profile, setProfile] = useLocalStorage('fitlife_profile', {
    name: 'Tsabit Azmi',
    age: '24',
    height: '178',
    weight: '72',
    goal: 'Build Lean Muscle & Hydrate',
    photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=TsabitAzmi'
  });

  const [workouts, setWorkouts] = useLocalStorage('fitlife_workouts', [
    { id: 101, name: 'Morning Leg Crusher', type: 'Leg Day', time: '07:30', duration: '45', completed: true, date: new Date().toISOString() },
    { id: 102, name: 'Core Shred Plank Routine', type: 'Cardio', time: '18:00', duration: '20', completed: false, date: new Date().toISOString() }
  ]);

  const [water, setWater] = useLocalStorage('fitlife_water', 1250);
  const [sleepData, setSleepData] = useLocalStorage('fitlife_sleep', { sleepTime: '22:30', wakeTime: '06:30' });
  
  // Protein tracking state
  const [proteinData, setProteinData] = useLocalStorage('fitlife_protein', { target: 130, current: 45 });
  const [loggedProteins, setLoggedProteins] = useLocalStorage('fitlife_logged_proteins', [
    { id: 1, name: 'Whey Protein Shake', amount: 24, timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) },
    { id: 2, name: '3 Scrambled Eggs', amount: 18, timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
  ]);

  const defaultHabits = [
    { id: 1, name: 'Morning Stretch', completed: true },
    { id: 2, name: '8000 Steps Daily', completed: false },
    { id: 3, name: 'Protein Goal Met', completed: false },
    { id: 4, name: 'Hydration Target', completed: false },
    { id: 5, name: 'No High-Sugar Snacks', completed: true },
    { id: 6, name: '8 Hours Sleep', completed: false }
  ];
  const [habits, setHabits] = useLocalStorage('fitlife_habits', defaultHabits);
  const [quoteOfTheDay, setQuoteOfTheDay] = useState(MOTIVATIONAL_QUOTES[0]);

  useEffect(() => {
    // Pick a random quote based on the current day index
    const day = new Date().getDay();
    setQuoteOfTheDay(MOTIVATIONAL_QUOTES[day % MOTIVATIONAL_QUOTES.length]);
  }, []);

  // Calculate derived data
  const calculateSleepHours = () => {
    const [h1, m1] = sleepData.sleepTime.split(':').map(Number);
    const [h2, m2] = sleepData.wakeTime.split(':').map(Number);
    let hours = h2 - h1 + (m2 - m1) / 60;
    if (hours < 0) hours += 24;
    return hours.toFixed(1);
  };
  
  const sleepHours = calculateSleepHours();
  const habitCompletion = Math.round((habits.filter(h => h.completed).length / habits.length) * 100) || 0;
  const todaysWorkouts = workouts.filter(w => new Date(w.date).toDateString() === new Date().toDateString());
  const workoutsCompleted = todaysWorkouts.filter(w => w.completed).length;

  // Track protein increment
  const handleLogProtein = (name, grams) => {
    const newLog = {
      id: Date.now(),
      name: name,
      amount: parseInt(grams),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updatedLogs = [...loggedProteins, newLog];
    setLoggedProteins(updatedLogs);
    
    // Auto increment total
    const totalCurrent = updatedLogs.reduce((acc, log) => acc + log.amount, 0);
    setProteinData({ ...proteinData, current: totalCurrent });
  };

  const handleDeleteProteinLog = (id) => {
    const updatedLogs = loggedProteins.filter(log => log.id !== id);
    setLoggedProteins(updatedLogs);
    const totalCurrent = updatedLogs.reduce((acc, log) => acc + log.amount, 0);
    setProteinData({ ...proteinData, current: totalCurrent });
  };

  // Safe app reset
  const handleResetAllData = () => {
    setWorkouts([]);
    setWater(0);
    setProteinData({ target: 130, current: 0 });
    setLoggedProteins([]);
    setHabits(defaultHabits);
    setProfile({
      name: 'Tsabit Azmi',
      age: '24',
      height: '178',
      weight: '72',
      goal: 'Build Lean Muscle & Hydrate',
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=TsabitAzmi'
    });
    alert("Dashboard progress successfully reset!");
  };

  // --- SUB-COMPONENTS ---

  const Dashboard = () => (
    <div className="space-y-6 animate-fade-in">
      <header className="mb-4">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Hello, {profile.name}! 👋</h1>
        <p className="text-slate-500 mt-1">Here is your custom daily overview. Fuel your fire today!</p>
      </header>

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-15">
          <Flame size={110} />
        </div>
        <div className="relative z-10">
          <span className="bg-white/20 text-xs uppercase font-extrabold px-2.5 py-1 rounded-full tracking-wider">Quote of the Day</span>
          <p className="text-xl italic font-semibold mt-3">"{quoteOfTheDay}"</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Today's Workout Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Today's Workout</h3>
            <div className="p-2.5 bg-emerald-50 text-emerald-500 rounded-xl">
              <Dumbbell size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-800">
              {workoutsCompleted} <span className="text-sm font-normal text-slate-400">/ {todaysWorkouts.length}</span>
            </p>
            <p className="text-sm text-slate-500 mt-1">Sessions Completed Today</p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
            <div 
              className="bg-emerald-400 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${todaysWorkouts.length ? (workoutsCompleted / todaysWorkouts.length) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        {/* Protein Tracker Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Protein Target</h3>
            <div className="p-2.5 bg-rose-50 text-rose-500 rounded-xl">
              <Apple size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-800">
              {proteinData.current}g <span className="text-sm font-normal text-slate-400">/ {proteinData.target}g</span>
            </p>
            <p className="text-sm text-slate-500 mt-1">Muscle Protein Synthesis</p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
            <div 
              className="bg-rose-400 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min((proteinData.current / proteinData.target) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Water Intake Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Water Intake</h3>
            <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl">
              <Droplets size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-800">
              {water} <span className="text-sm font-normal text-slate-400">/ 2500ml</span>
            </p>
            <p className="text-sm text-slate-500 mt-1">Stay Hydrated & Energized</p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
            <div 
              className="bg-blue-400 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min((water / 2500) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Sleep Duration Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Sleep Duration</h3>
            <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-xl">
              <Moon size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-800">{sleepHours} <span className="text-sm font-normal text-slate-400">hrs</span></p>
            <p className={`text-sm mt-1 font-semibold ${sleepHours < 7 ? 'text-amber-500' : 'text-emerald-500'}`}>
              {sleepHours < 7 ? 'Below Sleep Goal' : 'Perfect Recovery'}
            </p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
            <div 
              className="bg-indigo-400 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min((parseFloat(sleepHours) / 8) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Habit Tracker Preview & Quick Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Target size={20} className="text-emerald-500" /> Daily Habits Complete
            </h3>
            <span className="text-sm font-extrabold text-emerald-500">{habitCompletion}% Done</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 mb-6">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-teal-400 h-3 rounded-full transition-all duration-500" 
              style={{ width: `${habitCompletion}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {habits.slice(0, 4).map(habit => (
              <div 
                key={habit.id} 
                onClick={() => setHabits(habits.map(h => h.id === habit.id ? { ...h, completed: !h.completed } : h))}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  habit.completed ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800' : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className={`text-sm font-medium ${habit.completed ? 'line-through opacity-75' : ''}`}>{habit.name}</span>
                {habit.completed ? <CheckCircle2 className="text-emerald-500" size={18} /> : <Circle className="text-slate-300" size={18} />}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Log Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Sparkles size={20} className="text-indigo-500" /> Quick Water Log
          </h3>
          <div className="flex items-center gap-4 py-2">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <Droplets size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Water Intake</p>
              <p className="text-xl font-bold text-slate-700">{water} ml</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button 
              onClick={() => setWater(prev => Math.min(prev + 250, 5000))} 
              className="py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-xl transition-colors"
            >
              +250ml Glass
            </button>
            <button 
              onClick={() => setWater(prev => Math.min(prev + 500, 5000))} 
              className="py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors"
            >
              +500ml Bottle
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const GymScheduler = () => {
    const [newWorkout, setNewWorkout] = useState({ name: '', type: 'Push Day', time: '08:00', duration: '60' });
    
    const colors = {
      'Push Day': 'bg-blue-50 text-blue-700 border-blue-100',
      'Pull Day': 'bg-amber-50 text-amber-700 border-amber-100',
      'Leg Day': 'bg-rose-50 text-rose-700 border-rose-100',
      'Cardio': 'bg-emerald-50 text-emerald-700 border-emerald-100',
      'Shoulder': 'bg-purple-50 text-purple-700 border-purple-100',
      'Rest Day': 'bg-slate-100 text-slate-700 border-slate-200'
    };

    const addWorkout = (e) => {
      e.preventDefault();
      if (!newWorkout.name.trim()) return;
      setWorkouts([...workouts, { ...newWorkout, id: Date.now(), completed: false, date: new Date().toISOString() }]);
      setNewWorkout({ ...newWorkout, name: '' });
    };

    const toggleWorkout = (id) => {
      setWorkouts(workouts.map(w => w.id === id ? { ...w, completed: !w.completed } : w));
    };

    const deleteWorkout = (id) => {
      setWorkouts(workouts.filter(w => w.id !== id));
    };

    return (
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        <header className="mb-4">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">Gym Scheduler 🏋️</h1>
          <p className="text-slate-500">Plan and check off your workout sessions.</p>
        </header>

        {/* Add Form */}
        <form onSubmit={addWorkout} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Workout Name</label>
            <input 
              type="text" 
              required 
              value={newWorkout.name} 
              onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })} 
              className="w-full border border-slate-200 rounded-xl bg-slate-50 p-3 focus:ring-2 focus:ring-emerald-400 outline-none transition-all" 
              placeholder="e.g. Chest & Triceps" 
            />
          </div>
          <div className="w-full md:w-44">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Category</label>
            <select 
              value={newWorkout.type} 
              onChange={(e) => setNewWorkout({ ...newWorkout, type: e.target.value })} 
              className="w-full border border-slate-200 rounded-xl bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
            >
              {Object.keys(colors).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="w-full md:w-32">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Time</label>
            <input 
              type="time" 
              value={newWorkout.time} 
              onChange={(e) => setNewWorkout({ ...newWorkout, time: e.target.value })} 
              className="w-full border border-slate-200 rounded-xl bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-emerald-400 transition-all" 
            />
          </div>
          <div className="w-full md:w-32">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Mins</label>
            <input 
              type="number" 
              min="1" 
              value={newWorkout.duration} 
              onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })} 
              className="w-full border border-slate-200 rounded-xl bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-emerald-400 transition-all" 
            />
          </div>
          <button type="submit" className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm">
            <Plus size={18} /> Add
          </button>
        </form>

        {/* Workout List */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-700">Scheduled Workouts</h3>
          {workouts.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
              <Calendar size={48} className="mx-auto mb-3 opacity-40 text-emerald-500" />
              <p className="font-medium text-slate-600">No workouts scheduled yet.</p>
              <p className="text-xs text-slate-400 mt-1">Use the scheduler above to structure your week.</p>
            </div>
          ) : (
            workouts.slice().reverse().map(workout => (
              <div 
                key={workout.id} 
                className={`bg-white p-4 rounded-2xl shadow-sm border border-slate-100 border-l-4 ${
                  workout.completed ? 'border-l-emerald-500 opacity-75' : 'border-l-sky-500'
                } flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:shadow-md`}
              >
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => toggleWorkout(workout.id)} 
                    className={`transition-colors ${workout.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-emerald-400'}`}
                  >
                    {workout.completed ? <CheckCircle2 size={26} /> : <Circle size={26} />}
                  </button>
                  <div>
                    <h4 className={`font-semibold text-base md:text-lg ${workout.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {workout.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold ${colors[workout.type] || 'bg-slate-100 text-slate-700'}`}>
                        {workout.type}
                      </span>
                      <span className="flex items-center gap-1"><Clock size={13} /> {workout.time}</span>
                      <span>• {workout.duration} mins</span>
                      <span>• {new Date(workout.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => deleteWorkout(workout.id)} 
                  className="text-slate-400 hover:text-rose-500 transition-colors p-2 self-end md:self-auto"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const ExerciseLibrary = () => {
    const [search, setSearch] = useState('');
    const [selectedMuscle, setSelectedMuscle] = useState('All');

    const muscles = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Abs'];

    const filteredExercises = EXERCISE_LIBRARY.filter(ex => {
      const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
      const matchesMuscle = selectedMuscle === 'All' || ex.muscle.includes(selectedMuscle);
      return matchesSearch && matchesMuscle;
    });

    return (
      <div className="space-y-6 animate-fade-in">
        <header className="mb-4">
          <h1 className="text-2xl font-bold text-slate-800">Exercise Reference Library 📚</h1>
          <p className="text-slate-500">Perfect your alignment and lift with proper form.</p>
        </header>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <input 
            type="text" 
            placeholder="Search exercises..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 border border-slate-200 rounded-xl bg-white p-3 outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {muscles.map(m => (
              <button
                key={m}
                onClick={() => setSelectedMuscle(m)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedMuscle === m 
                    ? 'bg-slate-800 text-white' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredExercises.map((exercise, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1 group">
              <div className="h-44 overflow-hidden relative">
                <img src={exercise.image} alt={exercise.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 text-white font-extrabold text-lg">{exercise.name}</h3>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="px-2.5 py-1 bg-sky-50 text-sky-700 rounded-full text-xs font-bold border border-sky-100">{exercise.muscle}</span>
                  <span className={`text-xs font-bold ${
                    exercise.difficulty === 'Beginner' ? 'text-emerald-500' : 
                    exercise.difficulty === 'Intermediate' ? 'text-amber-500' : 'text-rose-500'
                  }`}>{exercise.difficulty}</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">{exercise.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const Nutrition = () => {
    const [calcWeight, setCalcWeight] = useState(profile.weight);
    const [customFood, setCustomFood] = useState({ name: '', protein: '20' });
    
    const handleCalculate = () => {
      const target = Math.round(parseFloat(calcWeight) * 1.8);
      setProteinData({ ...proteinData, target });
    };

    const handleCustomLog = (e) => {
      e.preventDefault();
      if (!customFood.name.trim()) return;
      handleLogProtein(customFood.name, customFood.protein);
      setCustomFood({ name: '', protein: '20' });
    };

    return (
      <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
        <header>
          <h1 className="text-2xl font-bold text-slate-800">Nutrition & Protein Tracker 🥗</h1>
          <p className="text-slate-500">Log meals, hit daily macros, and explore protein sources.</p>
        </header>

        {/* Protein target info panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Trophy className="text-amber-500" /> Target Calculator</h2>
            <p className="text-slate-500 text-sm">Calculate ideal daily protein based on current physical body mass (Mass × 1.8g).</p>
            <div className="flex gap-4 items-end pt-2">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Current Body Weight (kg)</label>
                <input 
                  type="number" 
                  value={calcWeight} 
                  onChange={(e) => setCalcWeight(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400" 
                />
              </div>
              <button onClick={handleCalculate} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold p-3.5 px-6 rounded-xl transition-colors">
                Apply Target
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-rose-500 to-pink-500 rounded-3xl p-6 text-white text-center flex flex-col justify-center shadow-md">
            <h3 className="font-semibold text-rose-100">Daily Intake Progress</h3>
            <div className="text-5xl font-extrabold my-2">{proteinData.current}g</div>
            <p className="text-xs text-rose-100">Daily Target: {proteinData.target}g</p>
            <div className="w-full bg-white/20 rounded-full h-2 mt-4 overflow-hidden">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((proteinData.current / proteinData.target) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Log Meal / Intake Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Custom entry form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Plus className="text-rose-500" /> Log Custom Protein Meal
            </h3>
            <form onSubmit={handleCustomLog} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Meal / Food Description</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Grilled Turkey Breast" 
                  value={customFood.name} 
                  onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Protein Grams (g)</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  max="150"
                  value={customFood.protein} 
                  onChange={(e) => setCustomFood({ ...customFood, protein: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
              <button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl transition-colors">
                Add to Daily Tracker
              </button>
            </form>
          </div>

          {/* Today's Log History */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Utensils className="text-rose-500" size={18} /> Today's Log history
              </h3>
              {loggedProteins.length === 0 ? (
                <p className="text-slate-400 text-sm py-4 text-center italic">No foods logged today yet. Click a source below or add custom meals!</p>
              ) : (
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {loggedProteins.map(log => (
                    <div key={log.id} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-sm">
                      <div>
                        <p className="font-semibold text-slate-700">{log.name}</p>
                        <p className="text-xs text-slate-400">{log.timestamp}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-rose-500">+{log.amount}g</span>
                        <button 
                          onClick={() => handleDeleteProteinLog(log.id)}
                          className="text-slate-300 hover:text-rose-600 transition-colors p-1"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button 
              onClick={() => {
                setLoggedProteins([]);
                setProteinData({ ...proteinData, current: 0 });
              }}
              className="text-xs text-slate-400 hover:text-rose-600 mt-4 transition-colors font-semibold flex items-center gap-1 self-end"
            >
              <RotateCcw size={12} /> Clear Log History
            </button>
          </div>
        </div>

        {/* Healthy Foods Quick Add */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold text-slate-800">Healthy Protein Sources</h2>
            <span className="bg-rose-50 text-rose-600 text-xs font-bold px-2.5 py-0.5 rounded-full border border-rose-100">Tap to Quick Log</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Animal Protein */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">🥩 Animal Sources</h3>
              <ul className="space-y-3">
                {FOOD_DATABASE.animal.map((food, i) => (
                  <li 
                    key={i} 
                    onClick={() => handleLogProtein(food.name, food.proteinValue)}
                    className="flex items-center justify-between p-3 bg-slate-50/50 hover:bg-rose-50/40 rounded-xl cursor-pointer border border-slate-100 hover:border-rose-200 transition-all group"
                  >
                    <span className="flex items-center gap-3 font-medium text-slate-700"><span className="text-xl">{food.icon}</span> {food.name}</span>
                    <span className="text-xs text-sky-500 font-bold group-hover:text-rose-500 transition-colors bg-white px-2.5 py-1 rounded-lg border border-slate-100">{food.protein}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Plant Protein */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">🌱 Plant Sources</h3>
              <ul className="space-y-3">
                {FOOD_DATABASE.plant.map((food, i) => (
                  <li 
                    key={i} 
                    onClick={() => handleLogProtein(food.name, food.proteinValue)}
                    className="flex items-center justify-between p-3 bg-slate-50/50 hover:bg-rose-50/40 rounded-xl cursor-pointer border border-slate-100 hover:border-rose-200 transition-all group"
                  >
                    <span className="flex items-center gap-3 font-medium text-slate-700"><span className="text-xl">{food.icon}</span> {food.name}</span>
                    <span className="text-xs text-emerald-500 group-hover:text-rose-500 transition-colors bg-white px-2.5 py-1 rounded-lg border border-slate-100">{food.protein}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Snacks */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">🥣 Snack Sources</h3>
              <ul className="space-y-3">
                {FOOD_DATABASE.snacks.map((food, i) => (
                  <li 
                    key={i} 
                    onClick={() => handleLogProtein(food.name, food.proteinValue)}
                    className="flex items-center justify-between p-3 bg-slate-50/50 hover:bg-rose-50/40 rounded-xl cursor-pointer border border-slate-100 hover:border-rose-200 transition-all group"
                  >
                    <span className="flex items-center gap-3 font-medium text-slate-700"><span className="text-xl">{food.icon}</span> {food.name}</span>
                    <span className="text-xs text-purple-500 group-hover:text-rose-500 transition-colors bg-white px-2.5 py-1 rounded-lg border border-slate-100">{food.protein}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const HealthyLifestyle = () => {
    const [newHabitName, setNewHabitName] = useState('');
    const addWater = (amount) => setWater(Math.min(water + amount, 5000));
    const resetWater = () => setWater(0);

    const toggleHabit = (id) => {
      setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
    };

    const handleAddHabit = (e) => {
      e.preventDefault();
      if (!newHabitName.trim()) return;
      setHabits([...habits, { id: Date.now(), name: newHabitName, completed: false }]);
      setNewHabitName('');
    };

    const handleDeleteHabit = (id) => {
      setHabits(habits.filter(h => h.id !== id));
    };

    return (
      <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
        <header className="mb-4">
          <h1 className="text-2xl font-bold text-slate-800">Healthy Lifestyle & Routines ❤️</h1>
          <p className="text-slate-500">Log hydration habits, record sleep recovery, and monitor standard metrics.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Water Tracker */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Droplets className="text-blue-500"/> Hydration Tracker</h3>
              <button onClick={resetWater} className="text-sm font-semibold text-slate-400 hover:text-rose-500 transition-colors">Reset</button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center py-6">
              <div className="text-5xl font-extrabold text-blue-500 mb-2">{water}<span className="text-2xl text-blue-300 font-medium">ml</span></div>
              <p className="text-slate-400 mb-6 font-medium text-sm">Optimal Hydration: 2500 ml</p>
              
              <div className="w-full bg-slate-100 rounded-full h-4 mb-8 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-300 to-blue-500 h-4 transition-all duration-500 relative" style={{ width: `${Math.min((water / 2500) * 100, 100)}%` }}>
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>

              <div className="flex gap-4 w-full">
                <button onClick={() => addWater(250)} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-3 rounded-xl font-bold text-sm transition-all">+250 ml</button>
                <button onClick={() => addWater(500)} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-bold text-sm transition-all">+500 ml</button>
              </div>
            </div>
          </div>

          {/* Sleep Tracker */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6"><Moon className="text-indigo-500"/> Sleep & Rest Recovery</h3>
            
            <div className="space-y-6 flex-1 flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Sleep Target Time</label>
                  <input 
                    type="time" 
                    value={sleepData.sleepTime} 
                    onChange={(e) => setSleepData({ ...sleepData, sleepTime: e.target.value })} 
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-slate-700" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Wake Up Time</label>
                  <input 
                    type="time" 
                    value={sleepData.wakeTime} 
                    onChange={(e) => setSleepData({ ...sleepData, wakeTime: e.target.value })} 
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-slate-700" 
                  />
                </div>
              </div>

              <div className={`p-6 rounded-2xl text-center border ${sleepHours < 7 ? 'bg-amber-50/50 border-amber-100' : 'bg-indigo-50/50 border-indigo-100'}`}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Resting Hours</p>
                <div className={`text-4xl font-extrabold mb-2 ${sleepHours < 7 ? 'text-amber-500' : 'text-indigo-500'}`}>{sleepHours} hours</div>
                <p className={`font-semibold text-sm ${sleepHours < 7 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {sleepHours < 7 ? '⚠️ Below 7 hours. Try to optimize rest patterns!' : '✨ Rested: Safe target met.'}
                </p>
              </div>
            </div>
          </div>

          {/* Habit Tracker */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 col-span-1 md:col-span-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Activity className="text-emerald-500"/> Personalized Habits</h3>
                <p className="text-slate-400 text-xs mt-1">Consistency is key. Click a habit to check it off.</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">{habitCompletion}% Completed Today</span>
            </div>
            
            {/* List of Habits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {habits.map(habit => (
                <div 
                  key={habit.id} 
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
                    habit.completed 
                      ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800' 
                      : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                  }`}
                >
                  <button 
                    onClick={() => toggleHabit(habit.id)}
                    className="flex-1 flex items-center gap-3 text-left"
                  >
                    {habit.completed ? <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={18} /> : <Circle className="text-slate-300 flex-shrink-0" size={18} />}
                    <span className={`text-sm font-semibold ${habit.completed ? 'line-through opacity-70' : ''}`}>{habit.name}</span>
                  </button>
                  <button 
                    onClick={() => handleDeleteHabit(habit.id)}
                    className="text-slate-300 hover:text-rose-500 transition-colors ml-2"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Habit Builder Add Form */}
            <form onSubmit={handleAddHabit} className="flex gap-2 max-w-md border-t border-slate-100 pt-4">
              <input 
                type="text" 
                required
                placeholder="Type customized habit..." 
                value={newHabitName} 
                onChange={(e) => setNewHabitName(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 p-2.5 px-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
              />
              <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-1">
                <Plus size={16} /> Add
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const ProfileView = () => {
    const [editMode, setEditMode] = useState(false);
    const [tempProfile, setTempProfile] = useState(profile);

    const handleSave = () => {
      setProfile(tempProfile);
      // Auto recalculate target on weight modification
      if (tempProfile.weight !== profile.weight) {
        setProteinData({
          ...proteinData,
          target: Math.round(parseFloat(tempProfile.weight) * 1.8)
        });
      }
      setEditMode(false);
    };

    return (
      <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
        <header className="mb-4">
          <h1 className="text-2xl font-bold text-slate-800">User Profile 👤</h1>
          <p className="text-slate-500">Edit metrics, bio targets, and modify credentials.</p>
        </header>

        {/* Avatar Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-24 bg-gradient-to-r from-emerald-400 to-sky-400 opacity-20"></div>
          <div className="relative pt-6">
            <div className="w-28 h-28 mx-auto bg-white rounded-full p-1.5 shadow-md mb-4 border border-slate-100">
               <img src={profile.photo} alt="Profile" className="w-full h-full object-cover rounded-full" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800">{profile.name}</h2>
            <p className="text-emerald-500 font-bold text-sm mt-1 flex items-center justify-center gap-1">
              <Sparkles size={14} /> {profile.goal}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 border-t border-slate-100 pt-6">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Age</p>
              <p className="text-xl font-extrabold text-slate-800">{profile.age}</p>
            </div>
            <div className="border-x border-slate-100">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Height</p>
              <p className="text-xl font-extrabold text-slate-800">{profile.height} <span className="text-sm font-normal text-slate-500">cm</span></p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Weight</p>
              <p className="text-xl font-extrabold text-slate-800">{profile.weight} <span className="text-sm font-normal text-slate-500">kg</span></p>
            </div>
          </div>
        </div>

        {/* Detailed Form Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <User size={18} className="text-emerald-500" /> Metric Parameters
            </h3>
            {!editMode ? (
              <button 
                onClick={() => { setTempProfile(profile); setEditMode(true); }}
                className="text-sm font-bold text-emerald-500 hover:text-emerald-600 flex items-center gap-1"
              >
                <Edit2 size={14} /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={() => setEditMode(false)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 px-3.5 py-1.5 rounded-xl flex items-center gap-1 shadow-sm"
                >
                  <Check size={14} /> Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Display Name</label>
                <input 
                  type="text" 
                  disabled={!editMode}
                  value={tempProfile.name} 
                  onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                  className="w-full bg-slate-50 disabled:bg-slate-50/50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400 transition-all text-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Primary Fitness Goal</label>
                <input 
                  type="text" 
                  disabled={!editMode}
                  value={tempProfile.goal} 
                  onChange={(e) => setTempProfile({ ...tempProfile, goal: e.target.value })}
                  className="w-full bg-slate-50 disabled:bg-slate-50/50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400 transition-all text-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Age</label>
                <input 
                  type="number" 
                  disabled={!editMode}
                  value={tempProfile.age} 
                  onChange={(e) => setTempProfile({ ...tempProfile, age: e.target.value })}
                  className="w-full bg-slate-50 disabled:bg-slate-50/50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400 transition-all text-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Height (cm)</label>
                <input 
                  type="number" 
                  disabled={!editMode}
                  value={tempProfile.height} 
                  onChange={(e) => setTempProfile({ ...tempProfile, height: e.target.value })}
                  className="w-full bg-slate-50 disabled:bg-slate-50/50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400 transition-all text-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Weight (kg)</label>
                <input 
                  type="number" 
                  disabled={!editMode}
                  value={tempProfile.weight} 
                  onChange={(e) => setTempProfile({ ...tempProfile, weight: e.target.value })}
                  className="w-full bg-slate-50 disabled:bg-slate-50/50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400 transition-all text-slate-700"
                />
              </div>
            </div>

            {editMode && (
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Avatar Seed (Dicebear Customization)</label>
                <input 
                  type="text" 
                  placeholder="e.g. TsabitAzmi, StrongGym, Health"
                  value={tempProfile.photo.split('seed=')[1] || ''} 
                  onChange={(e) => setTempProfile({ ...tempProfile, photo: `https://api.dicebear.com/7.x/adventurer/svg?seed=${e.target.value || 'FitLife'}` })}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400 text-slate-700 text-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50/50 border border-red-100 rounded-3xl p-8">
          <h3 className="font-bold text-red-800 text-lg mb-2">System Danger Zone</h3>
          <p className="text-red-600/80 text-sm mb-6">Wipes all cached data including personal targets, calorie tracking, water levels, and custom workout history.</p>
          <button 
            onClick={handleResetAllData}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors shadow-sm"
          >
            Clear and Reset System
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-600 font-sans pb-24 md:pb-6 flex flex-col md:flex-row">
      
      {/* SIDEBAR NAVIGATION - DESKTOP VIEWPORTS */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 p-6 min-h-screen sticky top-0 border-r border-slate-800">
        <div className="flex items-center gap-3 mb-10 pt-2 px-2">
          <div className="p-2 bg-emerald-500 text-white rounded-xl">
            <Heart size={22} className="fill-current animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-wider">FitLife.io</h1>
            <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">Self Discipline</p>
          </div>
        </div>

        <nav className="space-y-1.5 flex-1">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'dashboard' ? 'bg-emerald-500 text-white shadow-sm' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Home size={18} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('scheduler')} 
            className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'scheduler' ? 'bg-emerald-500 text-white shadow-sm' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Calendar size={18} /> Gym Scheduler
          </button>
          <button 
            onClick={() => setActiveTab('library')} 
            className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'library' ? 'bg-emerald-500 text-white shadow-sm' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Dumbbell size={18} /> Exercise Library
          </button>
          <button 
            onClick={() => setActiveTab('nutrition')} 
            className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'nutrition' ? 'bg-emerald-500 text-white shadow-sm' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Apple size={18} /> Nutrition Log
          </button>
          <button 
            onClick={() => setActiveTab('lifestyle')} 
            className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'lifestyle' ? 'bg-emerald-500 text-white shadow-sm' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Heart size={18} /> Healthy Lifestyle
          </button>
          <button 
            onClick={() => setActiveTab('profile')} 
            className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'profile' ? 'bg-emerald-500 text-white shadow-sm' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <User size={18} /> My Profile
          </button>
        </nav>

        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 font-medium">
          FitLife Engine v1.4.2
        </div>
      </aside>

      {/* MOBILE HEADER BAR */}
      <header className="md:hidden flex items-center justify-between bg-slate-900 text-white p-4 py-3 sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2">
          <Heart size={18} className="fill-emerald-500 text-emerald-500 animate-pulse" />
          <h1 className="text-lg font-bold tracking-wider">FitLife.io</h1>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
          <img src={profile.photo} alt="Avatar" className="w-full h-full object-cover" />
        </div>
      </header>

      {/* MAIN DYNAMIC CONTAINER */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl overflow-x-hidden">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'scheduler' && <GymScheduler />}
        {activeTab === 'library' && <ExerciseLibrary />}
        {activeTab === 'nutrition' && <Nutrition />}
        {activeTab === 'lifestyle' && <HealthyLifestyle />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* STICKY BOTTOM NAVIGATION BAR - MOBILE DEVICE INTERFACES ONLY */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-2.5 flex justify-around items-center z-40 text-slate-400">
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === 'dashboard' ? 'text-emerald-400' : 'text-slate-400'}`}
        >
          <Home size={18} /> Dash
        </button>
        <button 
          onClick={() => setActiveTab('scheduler')} 
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === 'scheduler' ? 'text-emerald-400' : 'text-slate-400'}`}
        >
          <Calendar size={18} /> Gym
        </button>
        <button 
          onClick={() => setActiveTab('library')} 
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === 'library' ? 'text-emerald-400' : 'text-slate-400'}`}
        >
          <Dumbbell size={18} /> Library
        </button>
        <button 
          onClick={() => setActiveTab('nutrition')} 
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === 'nutrition' ? 'text-emerald-400' : 'text-slate-400'}`}
        >
          <Apple size={18} /> Eat
        </button>
        <button 
          onClick={() => setActiveTab('lifestyle')} 
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === 'lifestyle' ? 'text-emerald-400' : 'text-slate-400'}`}
        >
          <Heart size={18} /> Life
        </button>
        <button 
          onClick={() => setActiveTab('profile')} 
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === 'profile' ? 'text-emerald-400' : 'text-slate-400'}`}
        >
          <User size={18} /> Me
        </button>
      </nav>

    </div>
  );
}
