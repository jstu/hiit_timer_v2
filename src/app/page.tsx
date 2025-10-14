'use client';

import { TimerProvider } from '@/hooks/useTimer';
import { CircularTimerDisplay } from '@/components/CircularTimerDisplay';
import { StatusDisplay } from '@/components/StatusDisplay';
import { TimerControls } from '@/components/TimerControls';
import { WorkoutSettings } from '@/components/WorkoutSettings';
import { ClientOnly } from '@/components/ClientOnly';
import { BurnZoneWrapper } from '@/components/BurnZoneWrapper';

export default function Home() {
  return (
    <ClientOnly 
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-2xl">Loading WarriorTimer...</div>
        </div>
      }
    >
      <TimerProvider>
        <BurnZoneWrapper>
          
          {/* Floating Settings Button - Top Left */}
          <div className="absolute top-6 left-6 z-10">
            <WorkoutSettings />
          </div>
          
          {/* Main Centered Layout */}
          <div className="h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
            
            {/* Status and Round Info */}
            <div className="flex-shrink-0 mb-4 sm:mb-6 lg:mb-8">
              <StatusDisplay />
            </div>
            
            {/* Circular Timer Display with Integrated Progress */}
            <div className="flex-1 flex items-center justify-center w-full min-h-0 max-w-2xl">
              <CircularTimerDisplay />
            </div>
            
            {/* Controls - Safe at bottom */}
            <div className="flex-shrink-0 mt-4 sm:mt-6 lg:mt-8 pb-4 sm:pb-6 lg:pb-8">
              <TimerControls />
            </div>
            
          </div>
          
        </BurnZoneWrapper>
      </TimerProvider>
    </ClientOnly>
  );
}