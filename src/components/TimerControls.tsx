'use client';

import { useTimer } from '@/hooks/useTimer';

export function TimerControls() {
  const { state, startTimer, pauseTimer, resetTimer } = useTimer();

  const getButtonText = () => {
    if (state === 'idle' || state === 'completed') return 'START WORKOUT';
    if (state === 'paused') return 'RESUME';
    return 'PAUSE';
  };

  const getButtonColor = () => {
    if (state === 'idle' || state === 'completed') return 'bg-green-600 hover:bg-green-700 border-green-600';
    if (state === 'paused') return 'bg-blue-600 hover:bg-blue-700 border-blue-600';
    return 'bg-red-600 hover:bg-red-700 border-red-600';
  };

  const handleMainButton = () => {
    if (state === 'idle' || state === 'completed' || state === 'paused') {
      startTimer();
    } else {
      pauseTimer();
    }
  };

  return (
    <div className="flex gap-8">
      <button
        onClick={handleMainButton}
        className={`px-12 py-6 ${getButtonColor()} text-white font-bold text-2xl rounded-xl transition-all duration-200 uppercase tracking-wider shadow-2xl transform hover:scale-105 active:scale-95`}
      >
        {getButtonText()}
      </button>
      
      <button
        onClick={resetTimer}
        className="px-12 py-6 border-4 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white font-bold text-2xl rounded-xl transition-all duration-200 uppercase tracking-wider shadow-2xl transform hover:scale-105 active:scale-95"
      >
        RESET
      </button>
    </div>
  );
}