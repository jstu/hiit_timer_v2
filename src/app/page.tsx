'use client';

import { TimerProvider } from '@/hooks/useTimer';
import { TimerDisplay } from '@/components/TimerDisplay';
import { StatusDisplay } from '@/components/StatusDisplay';
import { TimerControls } from '@/components/TimerControls';
import { ProgressBar } from '@/components/ProgressBar';
import { WorkoutSettings } from '@/components/WorkoutSettings';

export default function Home() {
  return (
    <TimerProvider>
      <div className="min-h-screen bg-black text-white relative">
        
        {/* Floating Settings Button - Top Left */}
        <div className="absolute top-6 left-6 z-10">
          <WorkoutSettings />
        </div>
        
        {/* Main Centered Layout */}
        <div className="h-screen flex flex-col items-center justify-center p-8 space-y-8">
          
          {/* Status and Round Info */}
          <div className="flex-shrink-0">
            <StatusDisplay />
          </div>
          
          {/* Progress Bar - Right under status */}
          <div className="flex-shrink-0 w-full max-w-4xl">
            <ProgressBar />
          </div>
          
          {/* Timer Display - Main Focus */}
          <div className="flex-1 flex items-center justify-center">
            <TimerDisplay />
          </div>
          
          {/* Controls - Safe at bottom */}
          <div className="flex-shrink-0 pb-8">
            <TimerControls />
          </div>
          
        </div>
        
      </div>
    </TimerProvider>
  );
}