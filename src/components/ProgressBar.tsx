'use client';

import { useTimer } from '@/hooks/useTimer';

export function ProgressBar() {
  const { progress, state, currentTime } = useTimer();

  const getProgressColor = () => {
    switch (state) {
      case 'active': return 'bg-green-500';
      case 'rest': return 'bg-orange-500'; 
      case 'prepare': return 'bg-blue-500';
      case 'completed': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getGlowColor = () => {
    switch (state) {
      case 'active': return 'shadow-green-500/50';
      case 'rest': return 'shadow-orange-500/50'; 
      case 'prepare': return 'shadow-blue-500/50';
      case 'completed': return 'shadow-purple-500/50';
      default: return 'shadow-gray-500/50';
    }
  };

  const getStateLabel = () => {
    switch (state) {
      case 'active': return 'WORK';
      case 'rest': return 'REST';
      case 'prepare': return 'PREPARE';
      case 'completed': return 'COMPLETE';
      case 'paused': return 'PAUSED';
      default: return 'READY';
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* Progress Label */}
      <div className="flex justify-between items-center text-lg font-bold">
        <span className={`${state === 'active' ? 'text-green-400' : state === 'rest' ? 'text-orange-400' : state === 'prepare' ? 'text-blue-400' : 'text-gray-400'}`}>
          {getStateLabel()}
        </span>
        <span className="text-white">
          {Math.round(progress)}%
        </span>
      </div>
      
      {/* Large Progress Bar */}
      <div className="w-full bg-gray-800 h-8 rounded-xl overflow-hidden shadow-inner">
        <div 
          className={`h-full transition-all duration-1000 ease-out ${getProgressColor()} ${getGlowColor()} shadow-2xl relative`}
          style={{ width: `${progress}%` }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
}