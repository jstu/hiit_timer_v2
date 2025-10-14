export type TimerState = 'idle' | 'prepare' | 'active' | 'rest' | 'paused' | 'completed';

export interface WorkoutSettings {
  activeTime: number; // seconds
  restTime: number; // seconds
  cycles: number;
  thirtySecondAlert: boolean;
  jumpAlert: boolean;
}

export interface TimerContextType {
  currentTime: number;
  currentCycle: number;
  totalCycles: number;
  state: TimerState;
  progress: number;
  settings: WorkoutSettings;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  updateSettings: (settings: Partial<WorkoutSettings>) => void;
}

export interface AudioSettings {
  volume: number;
  enabled: boolean;
}

export interface WorkoutPreset {
  id: string;
  name: string;
  settings: WorkoutSettings;
  createdAt: number;
}

export interface WorkoutHistory {
  id: string;
  date: number;
  settings: WorkoutSettings;
  completedCycles: number;
  totalTime: number;
}