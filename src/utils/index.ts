import { WorkoutSettings, WorkoutPreset, WorkoutHistory } from '@/types';

export class StorageManager {
  private static SETTINGS_KEY = 'hiit-timer-settings';
  private static PRESETS_KEY = 'hiit-timer-presets';
  private static HISTORY_KEY = 'hiit-timer-history';

  static saveSettings(settings: WorkoutSettings): void {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save settings:', error);
    }
  }

  static loadSettings(): WorkoutSettings | null {
    try {
      const stored = localStorage.getItem(this.SETTINGS_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('Failed to load settings:', error);
      return null;
    }
  }

  static savePreset(preset: WorkoutPreset): void {
    try {
      const presets = this.loadPresets();
      const updated = presets.filter(p => p.id !== preset.id);
      updated.push(preset);
      localStorage.setItem(this.PRESETS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to save preset:', error);
    }
  }

  static loadPresets(): WorkoutPreset[] {
    try {
      const stored = localStorage.getItem(this.PRESETS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to load presets:', error);
      return [];
    }
  }

  static deletePreset(id: string): void {
    try {
      const presets = this.loadPresets();
      const filtered = presets.filter(p => p.id !== id);
      localStorage.setItem(this.PRESETS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.warn('Failed to delete preset:', error);
    }
  }

  static saveWorkoutHistory(history: WorkoutHistory): void {
    try {
      const histories = this.loadWorkoutHistory();
      histories.unshift(history);
      // Keep only last 50 workouts
      const trimmed = histories.slice(0, 50);
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(trimmed));
    } catch (error) {
      console.warn('Failed to save workout history:', error);
    }
  }

  static loadWorkoutHistory(): WorkoutHistory[] {
    try {
      const stored = localStorage.getItem(this.HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to load workout history:', error);
      return [];
    }
  }
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function parseTimeInput(timeString: string): number {
  const [mins, secs] = timeString.split(':').map(num => parseInt(num) || 0);
  return mins * 60 + secs;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}