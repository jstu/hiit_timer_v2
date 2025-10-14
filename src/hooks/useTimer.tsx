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
};

const TimerContext = createContext<TimerContextType | null>(null);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [state, setState] = useState<TimerState>('idle');
  const [settings, setSettings] = useState<WorkoutSettings>(defaultSettings);

  // Update state ref whenever state changes
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioManagerRef = useRef<AudioManager | null>(null);
  const jumpCooldownRef = useRef(0);
  const startTimeRef = useRef<number>(0);
  const stateRef = useRef<TimerState>('idle');

  // Initialize audio manager and load settings
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioManagerRef.current = new AudioManager();
      const savedSettings = StorageManager.loadSettings();
      if (savedSettings) {
        setSettings(savedSettings);
      }
    }
  }, []);

  // Save settings when changed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      StorageManager.saveSettings(settings);
    }
  }, [settings]);

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

    // Jump sound for active periods
    if (timerState === 'active' && settings.jumpAlert) {
      if (jumpCooldownRef.current > 0) {
        jumpCooldownRef.current--;
      } else if (time <= settings.activeTime - 15 && time > 30) {
        if (Math.random() < 0.05) { // 5% chance
          audio.playSound('jump', 0.6);
          jumpCooldownRef.current = 5; // 5 second cooldown
        }
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
          jumpCooldownRef.current = 0; // Reset jump cooldown
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
    jumpCooldownRef.current = 0;
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