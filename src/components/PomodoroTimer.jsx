import { useState, useEffect, useRef } from 'react';

const WORK_TIME = 50 * 60;       // 50 minutes
const SHORT_BREAK = 10 * 60;     // 10 minutes
const LONG_BREAK = 20 * 60;      // 20 minutes

const PomodoroTimer = () => {
  const [secondsLeft, setSecondsLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work'); // work, short, long
  const pomodoroCount = useRef(0);
  const intervalRef = useRef(null);
 

  // Format seconds into MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const showNotification = (message) => {
    if (Notification.permission === 'granted') {
      new Notification('⏰ Pomodoro Timer', {
        body: message,
        icon: 'https://cdn-icons-png.flaticon.com/512/879/879859.png', // Optional icon
      });
    }
  };

  const handleSessionEnd = () => {
    if (mode === 'work') {
      pomodoroCount.current += 1;
      if (pomodoroCount.current % 4 === 0) {
        setMode('long');
        setSecondsLeft(LONG_BREAK);
        showNotification('🎉 Time for a long break!');
      } else {
        setMode('short');
        setSecondsLeft(SHORT_BREAK);
        showNotification('☕ Time for a short break!');
      }
    } else {
      setMode('work');
      setSecondsLeft(WORK_TIME);
      showNotification('💼 Time to focus and work!');
    }
  };

  const startTimer = () => {
    if (intervalRef.current !== null) return;

    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsRunning(false);
          handleSessionEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const resetTimer = () => {
    pauseTimer();
    setMode('work');
    setSecondsLeft(WORK_TIME);
    pomodoroCount.current = 0;
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl text-center text-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Schedule Timer</h2>
      <div className="text-xl mb-2">
        Mode: <span className="capitalize font-semibold">{mode}</span>
      </div>
      <div className="text-5xl font-mono mb-6">{formatTime(secondsLeft)}</div>
      <div className="flex justify-center gap-4">
        {!isRunning ? (
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            onClick={startTimer}
          >
            Start
          </button>
        ) : (
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
            onClick={pauseTimer}
          >
            Pause
          </button>
        )}
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
