'use client';

import { useTimer } from '@/hooks/useTimer';
import { formatTime } from '@/utils';

export function CircularTimerDisplay() {
  const { currentTime, state, progress, settings } = useTimer();

  // Check if we're in the 30-second burn zone AND the setting is enabled
  const isBurnZone = state === 'active' && currentTime <= 30 && currentTime > 0 && settings.thirtySecondAlert;

  const getDisplayColor = () => {
    if (isBurnZone) return 'text-red-400'; // Burn zone gets red color
    
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
    if (isBurnZone) {
      return 'drop-shadow-[0_0_50px_rgba(239,68,68,1)] drop-shadow-[0_0_80px_rgba(239,68,68,0.8)] animate-pulse';
    }
    
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
    if (isBurnZone) return '#ef4444'; // red-500 for burn zone
    
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
  const strokeWidth = 6; // Reduced to prevent inner ring artifacts
  const radius = 46; // Relative to 100x100 viewBox
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative flex items-center justify-center w-full h-full max-w-md max-h-md aspect-square ${isBurnZone ? 'animate-intense-pulse' : ''}`}>
      
      {/* Burn Zone Fire Effect Background */}
      {isBurnZone && (
        <>
          <div className="absolute inset-0 rounded-full bg-gradient-radial from-red-500/30 via-orange-500/40 to-yellow-500/20 animate-fire-flicker scale-110 pointer-events-none" />
          <div className="absolute inset-0 rounded-full bg-gradient-radial from-orange-600/20 via-red-600/30 to-transparent animate-pulse scale-125 pointer-events-none" />
        </>
      )}
      
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
        />
        
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={getProgressColor()}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="butt"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
          style={{
            transitionProperty: 'stroke-dashoffset, stroke'
          }}
        />
        
        {/* Animated pulse ring when near completion - disabled during burn zone to avoid conflicts */}
        {progress > 90 && !isBurnZone && (
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
      
      {/* Timer Display in Center - Absolute positioned */}
      <div className={`absolute inset-0 flex items-center justify-center ${isBurnZone ? 'animate-screen-shake' : ''}`}>
        <div className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-mono font-bold ${getDisplayColor()} ${getGlowEffect()}`}>
          {formatTime(currentTime)}
        </div>
      </div>
      
      {/* Additional Burn Zone Effects */}
      {isBurnZone && (
        <>
          {/* Pulse Rings - Using same viewBox as main progress to avoid artifacts */}
          <svg
            className="absolute inset-0 w-full h-full animate-ping"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* First pulse ring - smaller radius to stay within viewBox */}
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="rgba(239, 68, 68, 0.6)"
              strokeWidth="2"
              fill="transparent"
              className="animate-pulse"
            />
          </svg>
          
          <svg
            className="absolute inset-0 w-full h-full animate-pulse"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Second pulse ring - even smaller to create layered effect */}
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="rgba(249, 115, 22, 0.4)"
              strokeWidth="1"
              fill="transparent"
            />
          </svg>
          
          {/* Fire Particle Effects */}
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-red-500 rounded-full animate-bounce transform -translate-x-1/2 -translate-y-2 pointer-events-none" />
          <div className="absolute top-2 right-4 w-1 h-1 bg-orange-500 rounded-full animate-ping pointer-events-none" />
          <div className="absolute top-2 left-4 w-1 h-1 bg-yellow-500 rounded-full animate-pulse pointer-events-none" />
        </>
      )}
      
    </div>
  );
}