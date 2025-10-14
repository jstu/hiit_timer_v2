'use client';

import { useTimer } from '@/hooks/useTimer';
import { formatTime } from '@/utils';

export function CircularTimerDisplay() {
  const { currentTime, state, progress } = useTimer();

  const getDisplayColor = () => {
    switch (state) {
      case 'active': return 'text-green-400';
      case 'rest': return 'text-orange-400';
      case 'prepare': return 'text-blue-400';
      case 'completed': return 'text-purple-400';
      case 'paused': return 'text-yellow-400';
      default: return 'text-white';
    }
  };

  const getGlowEffect = () => {
    switch (state) {
      case 'active': return 'drop-shadow-[0_0_30px_rgba(34,197,94,0.8)]';
      case 'rest': return 'drop-shadow-[0_0_30px_rgba(249,115,22,0.8)]';
      case 'prepare': return 'drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]';
      case 'completed': return 'drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]';
      case 'paused': return 'drop-shadow-[0_0_30px_rgba(234,179,8,0.8)]';
      default: return '';
    }
  };

  const getProgressColor = () => {
    switch (state) {
      case 'active': return '#22c55e'; // green-500
      case 'rest': return '#f97316';   // orange-500
      case 'prepare': return '#3b82f6'; // blue-500
      case 'completed': return '#a855f7'; // purple-500
      case 'paused': return '#eab308';   // yellow-500
      default: return '#6b7280';         // gray-500
    }
  };

  // Circle parameters - responsive sizing
  const strokeWidth = 8; // Relative to viewBox
  const radius = 46; // Relative to 100x100 viewBox
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-full h-full max-w-md max-h-md aspect-square">
      {/* Circular Progress Ring - Responsive SVG */}
      <svg
        className="absolute inset-0 w-full h-full transform -rotate-90"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="rgba(75, 85, 99, 0.2)"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="drop-shadow-lg"
        />
        
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={getProgressColor()}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 2px ${getProgressColor()}60)`
          }}
        />
        
        {/* Animated pulse ring when near completion */}
        {progress > 90 && (
          <circle
            cx="50"
            cy="50"
            r={radius + 4}
            stroke={getProgressColor()}
            strokeWidth="2"
            fill="transparent"
            opacity={0.5}
            className="animate-pulse"
          />
        )}
      </svg>
      
      {/* Timer Display in Center */}
      <div className={`relative z-0 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-mono font-bold ${getDisplayColor()} ${getGlowEffect()} flex items-center justify-center`}>
        {formatTime(currentTime)}
      </div>
    </div>
  );
}