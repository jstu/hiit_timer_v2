'use client';

import { useTimer } from '@/hooks/useTimer';
import { ReactNode } from 'react';

interface BurnZoneWrapperProps {
  children: ReactNode;
}

export function BurnZoneWrapper({ children }: BurnZoneWrapperProps) {
  const { currentTime, state, settings } = useTimer();
  
  // Check if we're in the 30-second burn zone and burn alert is enabled
  const isBurnZone = state === 'active' && currentTime <= 30 && currentTime > 0 && settings.thirtySecondAlert;
  
  return (
    <div className={`min-h-screen text-white relative transition-all duration-500 ${
      isBurnZone 
        ? 'bg-gradient-to-br from-red-900/50 via-black to-orange-900/30' 
        : 'bg-black'
    }`}>
      
      {/* Burn Zone Screen Effects */}
      {isBurnZone && (
        <>
          {/* Intense Red Overlay */}
          <div className="fixed inset-0 bg-red-500/10 animate-pulse pointer-events-none z-0" />
          
          {/* Corner Fire Effects */}
          <div className="fixed top-0 left-0 w-32 h-32 bg-gradient-radial from-orange-500/30 to-transparent animate-fire-flicker pointer-events-none z-0" />
          <div className="fixed top-0 right-0 w-32 h-32 bg-gradient-radial from-red-500/30 to-transparent animate-fire-flicker pointer-events-none z-0" />
          <div className="fixed bottom-0 left-0 w-32 h-32 bg-gradient-radial from-yellow-500/30 to-transparent animate-fire-flicker pointer-events-none z-0" />
          <div className="fixed bottom-0 right-0 w-32 h-32 bg-gradient-radial from-orange-600/30 to-transparent animate-fire-flicker pointer-events-none z-0" />
          
          {/* Edge Glow Effects */}
          <div className="fixed top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500/50 via-orange-500/70 to-red-500/50 animate-pulse pointer-events-none z-0" />
          <div className="fixed bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500/50 via-orange-500/70 to-red-500/50 animate-pulse pointer-events-none z-0" />
          <div className="fixed left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-red-500/50 via-orange-500/70 to-red-500/50 animate-pulse pointer-events-none z-0" />
          <div className="fixed right-0 top-0 bottom-0 w-2 bg-gradient-to-b from-red-500/50 via-orange-500/70 to-red-500/50 animate-pulse pointer-events-none z-0" />
        </>
      )}
      
      {/* Content with proper z-index */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}