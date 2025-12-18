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
          
          {/* TV-Optimized Layout: Massive Central Timer + Floating Controls */}
          <div className="h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
            
            {/* Mobile/Tablet: Vertical Layout */}
            <div className="lg:hidden flex flex-col items-center justify-center gap-6 w-full max-w-2xl">
              
              {/* Status and Round Info */}
              <div className="flex-shrink-0">
                <StatusDisplay />
              </div>
              
              {/* Circular Timer Display */}
              <div className="flex-1 flex items-center justify-center w-full min-h-0">
                <div className="w-full h-full max-w-md max-h-md aspect-square">
                  <CircularTimerDisplay />
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex-shrink-0">
                <TimerControls />
              </div>
              
            </div>
            
            {/* Desktop/TV: Massive Central Timer with Floating Elements */}
            <div className="hidden lg:flex items-center justify-center w-full h-full">
              
              {/* Massive Central Timer - Takes Full Available Space */}
              <div className="flex items-center justify-center w-full h-full max-w-[90vw] max-h-[90vh]">
                <div className="w-full h-full aspect-square">
                  <CircularTimerDisplay />
                </div>
              </div>
              
              {/* Floating Status Display - Top Right */}
              <div className="absolute top-8 right-8 z-10">
                <div className="transform scale-75 origin-top-right">
                  <StatusDisplay />
                </div>
              </div>
              
              {/* Floating Controls - Bottom Right */}
              <div className="absolute bottom-8 right-8 z-10">
                <div className="transform scale-75 origin-bottom-right">
                  <TimerControls />
                </div>
              </div>
              
            </div>
            
          </div>
          
        </BurnZoneWrapper>
      </TimerProvider>
    </ClientOnly>
  );
}