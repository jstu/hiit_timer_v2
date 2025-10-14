'use client';

import { useTimer } from '@/hooks/useTimer';

export function CircularProgressBar() {
  const { progress, state } = useTimer();

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

  const getGlowColor = () => {
    switch (state) {
      case 'active': return 'drop-shadow-[0_0_20px_rgba(34,197,94,0.6)]';
      case 'rest': return 'drop-shadow-[0_0_20px_rgba(249,115,22,0.6)]';
      case 'prepare': return 'drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]';
      case 'completed': return 'drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]';
      case 'paused': return 'drop-shadow-[0_0_20px_rgba(234,179,8,0.6)]';
      default: return '';
    }
  };

  // Circle parameters
  const size = 400; // SVG size
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative">
      <svg
        className={`transform -rotate-90 ${getGlowColor()}`}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(75, 85, 99, 0.3)" // gray-600/30
          strokeWidth={strokeWidth}
          fill="transparent"
          className="drop-shadow-lg"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getProgressColor()}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out drop-shadow-xl"
          style={{
            filter: `drop-shadow(0 0 8px ${getProgressColor()}40)`
          }}
        />
        
        {/* Animated pulse ring on progress end */}
        {progress > 95 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius + 8}
            stroke={getProgressColor()}
            strokeWidth={2}
            fill="transparent"
            opacity={0.6}
            className="animate-pulse"
          />
        )}
      </svg>
      
      {/* Progress percentage overlay */}
      <div className="absolute inset-0 flex items-end justify-center pb-12">
        <div className="text-center">
          <div className="text-2xl font-bold text-white opacity-70">
            {Math.round(progress)}%
          </div>
        </div>
      </div>
    </div>
  );
}