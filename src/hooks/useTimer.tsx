'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { TimerContextType, TimerState, WorkoutSettings } from '@/types';
import { AudioManager } from '@/utils/audioManager';
import { StorageManager } from '@/utils';

const defaultSettings: WorkoutSettings = {
  activeTime: 240, // 4:00
  restTime: 60,   // 1:00
  cycles: 10,
  thirtySecondAlert: true,
  jumpAlert: true,
  jumpIntensity: 'medium',
};

const TimerContext = createContext<TimerContextType | null>(null);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [state, setState] = useState<TimerState>('idle');
  const [settings, setSettings] = useState<WorkoutSettings>(defaultSettings);
  const [isClient, setIsClient] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // Refs - declare these first before any useEffects that use them
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioManagerRef = useRef<AudioManager | null>(null);
  const startTimeRef = useRef<number>(0);
  const stateRef = useRef<TimerState>('idle');
  const jumpTimesRef = useRef<Map<number, number[]>>(new Map());

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update state ref whenever state changes
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Seeded random number generator for consistent jump patterns
  // const seededRandom = (seed: number) => {
  //   const x = Math.sin(seed) * 10000;
  //   return x - Math.floor(x);
  // };

  // Generate deterministic jump times for a round
  const generateJumpTimes = (roundNumber: number, activeTime: number, intensity: 'low' | 'medium' | 'high', burnAlert: boolean): number[] => {
    const jumpTimes: number[] = [];
    
    // Define time range for jumps (countdown format - higher numbers = earlier in round)
    const maxTime = activeTime - 15; // Start after 15 seconds into the round
    const minTime = burnAlert ? 35 : 30; // End before burn alert zone
    
    // Ensure we have a valid time window
    if (maxTime <= minTime) {
      return jumpTimes;
    }
    
    const availableTime = maxTime - minTime;
    
    // Calculate jumps based on intensity setting
    const getJumpCount = (intensity: 'low' | 'medium' | 'high', duration: number): number => {
      const baseDuration = Math.max(60, duration); // At least 60 seconds for calculation
      
      switch (intensity) {
        case 'low':
          return Math.max(1, Math.min(2, Math.floor(baseDuration / 120))); // 1-2 jumps
        case 'medium':
          return Math.max(2, Math.min(4, Math.floor(baseDuration / 60)));  // 2-4 jumps  
        case 'high':
          return Math.max(3, Math.min(6, Math.floor(baseDuration / 40)));  // 3-6 jumps
        default:
          return 2;
      }
    };
    
    const targetJumps = getJumpCount(intensity, availableTime);
    
    // Use round number as seed for consistent results
    let seed = roundNumber * 12345;
    
    // Divide the time range into segments and place jumps evenly for better distribution
    const segments = targetJumps + 1;
    const segmentSize = availableTime / segments;
    
    for (let i = 0; i < targetJumps; i++) {
      // Place jump in the middle of each segment with some randomness
      const segmentStart = minTime + (i * segmentSize);
      const segmentEnd = minTime + ((i + 1) * segmentSize);
      const segmentMiddle = (segmentStart + segmentEnd) / 2;
      
      // Add some randomness around the middle (±25% of segment size)
      seed = (seed * 9301 + 49297) % 233280;
      const random = (seed / 233280 - 0.5) * 0.5; // -0.25 to +0.25
      const jumpTime = Math.floor(segmentMiddle + (random * segmentSize));
      
      // Ensure it stays within bounds
      const clampedJumpTime = Math.max(minTime, Math.min(maxTime, jumpTime));
      jumpTimes.push(clampedJumpTime);
    }
    
    return jumpTimes.sort((a, b) => b - a); // Sort descending (countdown times)
  };

  // Pre-calculate jump times for all rounds when settings change (but not during active workout)
  useEffect(() => {
    if (isClient && settingsLoaded && settings.jumpAlert && (state === 'idle' || state === 'completed')) {
      const newJumpTimes = new Map<number, number[]>();
      
      for (let round = 1; round <= settings.cycles; round++) {
        const jumpTimes = generateJumpTimes(round, settings.activeTime, settings.jumpIntensity, settings.thirtySecondAlert);
        newJumpTimes.set(round, jumpTimes);
      }
      
      jumpTimesRef.current = newJumpTimes;
    }
  }, [isClient, settingsLoaded, settings.activeTime, settings.cycles, settings.jumpAlert, settings.jumpIntensity, settings.thirtySecondAlert, state]);
  
  // Initialize audio manager and load settings
  useEffect(() => {
    if (isClient) {
      audioManagerRef.current = new AudioManager();
      const savedSettings = StorageManager.loadSettings();
      if (savedSettings) {
        setSettings(savedSettings);
      }
      setSettingsLoaded(true); // Mark settings as loaded
    }
  }, [isClient]);

  // Save settings when changed
  useEffect(() => {
    if (isClient) {
      StorageManager.saveSettings(settings);
    }
  }, [settings, isClient]);

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const playAudioEffects = (time: number, duration: number, timerState: TimerState) => {
    const audio = audioManagerRef.current;
    if (!audio) return;

    const round = currentCycle + 1;
    
    // Halfway sound
    let halfwayPoint: number;
    if (settings.thirtySecondAlert) {
      halfwayPoint = Math.floor((settings.activeTime + 30) / 2);
    } else {
      halfwayPoint = Math.floor(settings.activeTime / 2);
    }
    
    if (time === halfwayPoint) {
      audio.playSound('halfway');
    }

    // 30-second burn alert
    if (timerState === 'active' && time === 30 && settings.thirtySecondAlert) {
      audio.playSound('thirtySecond', 0.4);
    }

    // Deterministic jump sounds for active periods
    if (timerState === 'active' && settings.jumpAlert) {
      const jumpTimes = jumpTimesRef.current.get(round) || [];
      
      if (jumpTimes.includes(time)) {
        audio.playSound('jump', 0.6);
      }
    }

    // Countdown sounds
    if (time <= 3 && time > 0) {
      audio.playSound('anticipation');
    }
  };

  const startTimer = () => {
    if (state === 'idle' || state === 'completed') {
      // Start new workout
      setState('prepare');
      setCurrentCycle(0);
      setCurrentTime(10); // 10 second prep
      startTimeRef.current = Date.now();
    } else if (state === 'paused') {
      // Resume
      setState(currentTime > 0 ? (currentCycle === 0 ? 'prepare' : 'active') : 'rest');
    }

    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev - 1;
        
        if (newTime > 0) {
          playAudioEffects(newTime, prev, stateRef.current);
          return newTime;
        }

        // Time's up - transition to next state
        const currentState = stateRef.current;
        const audio = audioManagerRef.current;
        
        if (currentState === 'prepare') {
          // End of prepare phase - play start sound
          if (audio) {
            audio.playSound('endSound1');
          }
          setState('active');
          return settings.activeTime;
        } else if (currentState === 'active') {
          // End of active phase
          if (audio) {
            const round = currentCycle + 1;
            const endSoundName = audio.getEndSound(round);
            audio.playSound(endSoundName);
          }
          
          if (currentCycle + 1 < settings.cycles) {
            setState('rest');
            return settings.restTime;
          } else {
            // Workout complete
            setState('completed');
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            
            // Save workout history
            const workoutHistory = {
              id: Date.now().toString(),
              date: Date.now(),
              settings,
              completedCycles: currentCycle + 1,
              totalTime: Math.floor((Date.now() - startTimeRef.current) / 1000)
            };
            StorageManager.saveWorkoutHistory(workoutHistory);
            
            return 0;
          }
        } else if (currentState === 'rest') {
          // End of rest phase - play start sound for next round
          if (audio) {
            audio.playSound('endSound2');
          }
          setCurrentCycle(prev => prev + 1);
          setState('active');
          return settings.activeTime;
        }

        return 0;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    setState('paused');
    clearTimer();
  };

  const resetTimer = () => {
    clearTimer();
    setState('idle');
    setCurrentTime(0);
    setCurrentCycle(0);
  };

  const updateSettings = (newSettings: Partial<WorkoutSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Calculate progress within current timer period
  const progress = (() => {
    if (state === 'idle' || state === 'completed') return 0;
    
    if (state === 'prepare') {
      return (10 - currentTime) / 10 * 100;
    } else if (state === 'active') {
      return (settings.activeTime - currentTime) / settings.activeTime * 100;
    } else if (state === 'rest') {
      return (settings.restTime - currentTime) / settings.restTime * 100;
    } else if (state === 'paused') {
      // For paused state, calculate based on what timer was running
      if (currentCycle === 0 && currentTime <= 10) {
        return (10 - currentTime) / 10 * 100;
      } else if (currentTime <= settings.activeTime) {
        return (settings.activeTime - currentTime) / settings.activeTime * 100;
      } else {
        return (settings.restTime - currentTime) / settings.restTime * 100;
      }
    }
    
    return 0;
  })();

  return (
    <TimerContext.Provider
      value={{
        currentTime,
        currentCycle,
        totalCycles: settings.cycles,
        state,
        progress,
        settings,
        startTimer,
        pauseTimer,
        resetTimer,
        updateSettings,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}