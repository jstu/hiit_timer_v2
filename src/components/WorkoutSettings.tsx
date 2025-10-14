'use client';

import { useState, useEffect, useRef } from 'react';
import { useTimer } from '@/hooks/useTimer';

export function WorkoutSettings() {
  const { settings, updateSettings, state } = useTimer();
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Local input states to avoid parsing on every keystroke
  const [activeTimeInput, setActiveTimeInput] = useState('');
  const [restTimeInput, setRestTimeInput] = useState('');
  
  // Ref for the modal content to detect outside clicks
  const modalRef = useRef<HTMLDivElement>(null);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const parseTimeInput = (input: string): number => {
    // Handle various input formats
    const cleaned = input.trim().replace(/[^\d:]/g, ''); // Remove non-digits and non-colons
    
    if (!cleaned) return 1; // Default to 1 second if empty
    
    // If no colon, treat as total seconds
    if (!cleaned.includes(':')) {
      const num = parseInt(cleaned) || 0;
      return Math.max(1, num);
    }
    
    // Handle MM:SS format
    const parts = cleaned.split(':');
    const minutes = parseInt(parts[0]) || 0;
    const seconds = parseInt(parts[1]) || 0;
    
    return Math.max(1, minutes * 60 + Math.min(59, seconds)); // Limit seconds to 59, minimum 1 total
  };

  const handleTimeInputChange = (field: 'activeTime' | 'restTime', value: string) => {
    // Just update the local input state, don't parse yet
    if (field === 'activeTime') {
      setActiveTimeInput(value);
    } else {
      setRestTimeInput(value);
    }
  };

  const handleTimeCommit = (field: 'activeTime' | 'restTime', value: string) => {
    // Parse and commit the value when user finishes editing
    const totalSeconds = parseTimeInput(value);
    updateSettings({ [field]: totalSeconds });
    
    // Update input to show the formatted result
    const formatted = formatTime(totalSeconds);
    if (field === 'activeTime') {
      setActiveTimeInput(formatted);
    } else {
      setRestTimeInput(formatted);
    }
  };

  const handleKeyDown = (field: 'activeTime' | 'restTime', value: string, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTimeCommit(field, value);
      (e.target as HTMLInputElement).blur();
    }
  };

  const getDisplayValue = (field: 'activeTime' | 'restTime') => {
    if (field === 'activeTime') {
      return activeTimeInput || formatTime(settings.activeTime);
    } else {
      return restTimeInput || formatTime(settings.restTime);
    }
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Handle click outside modal to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const isDisabled = state !== 'idle' && state !== 'completed';

  return (
    <>
      {/* Compact Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gray-800/90 hover:bg-red-600/90 border border-gray-600 hover:border-red-600 text-gray-300 hover:text-white transition-all duration-200 rounded-xl backdrop-blur-sm shadow-xl flex items-center justify-center"
        title="Workout Settings"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Settings Overlay Panel */}

      {/* Settings Overlay Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div 
            ref={modalRef}
            className="w-full max-w-md bg-gray-900/95 backdrop-blur-sm border border-gray-600 rounded-2xl shadow-2xl p-6 space-y-6 relative z-10"
          >
            
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-6">Workout Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-bold text-gray-200 mb-2">
                Work Time
              </label>
              <input
                type="text"
                value={getDisplayValue('activeTime')}
                onChange={(e) => handleTimeInputChange('activeTime', e.target.value)}
                onBlur={(e) => handleTimeCommit('activeTime', e.target.value)}
                onKeyDown={(e) => handleKeyDown('activeTime', e.currentTarget.value, e)}
                onFocus={() => setActiveTimeInput(formatTime(settings.activeTime))}
                disabled={isDisabled}
                className="w-full px-4 py-3 border-2 border-red-600 bg-transparent text-white text-center rounded-lg text-xl font-mono disabled:opacity-50"
                placeholder="04:00"
              />
            </div>

            <div>
              <label className="block text-lg font-bold text-gray-200 mb-2">
                Rest Time
              </label>
              <input
                type="text"
                value={getDisplayValue('restTime')}
                onChange={(e) => handleTimeInputChange('restTime', e.target.value)}
                onBlur={(e) => handleTimeCommit('restTime', e.target.value)}
                onKeyDown={(e) => handleKeyDown('restTime', e.currentTarget.value, e)}
                onFocus={() => setRestTimeInput(formatTime(settings.restTime))}
                disabled={isDisabled}
                className="w-full px-4 py-3 border-2 border-red-600 bg-transparent text-white text-center rounded-lg text-xl font-mono disabled:opacity-50"
                placeholder="01:00"
              />
            </div>
          </div>

          <div>
            <label className="block text-lg font-bold text-gray-200 mb-2">
              Cycles
            </label>
            <input
              type="number"
              value={settings.cycles}
              onChange={(e) => updateSettings({ cycles: parseInt(e.target.value) || 1 })}
              disabled={isDisabled}
              min="1"
              max="50"
              className="w-full px-4 py-3 border-2 border-red-600 bg-transparent text-white text-center rounded-lg text-xl font-mono disabled:opacity-50"
            />
          </div>

          <div className="space-y-4 border-t border-gray-600 pt-4">
            <h3 className="text-lg font-bold text-gray-200">Audio Alerts</h3>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.thirtySecondAlert}
                onChange={(e) => updateSettings({ thirtySecondAlert: e.target.checked })}
                disabled={isDisabled}
                className="w-5 h-5 text-red-600 bg-transparent border-2 border-red-600 rounded focus:ring-red-500"
              />
              <span className="text-gray-200 text-lg">30-Second Burn Alert</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.jumpAlert}
                onChange={(e) => updateSettings({ jumpAlert: e.target.checked })}
                disabled={isDisabled}
                className="w-5 h-5 text-red-600 bg-transparent border-2 border-red-600 rounded focus:ring-red-500"
              />
              <span className="text-gray-200 text-lg">Jump Sound Effects</span>
            </label>

            {settings.jumpAlert && (
              <div className="ml-8 mt-2">
                <label className="block text-md font-bold text-gray-300 mb-2">
                  Jump Intensity
                </label>
                <select
                  value={settings.jumpIntensity}
                  onChange={(e) => updateSettings({ jumpIntensity: e.target.value as 'low' | 'medium' | 'high' })}
                  disabled={isDisabled}
                  className="w-full px-3 py-2 border-2 border-red-600 bg-gray-800 text-white rounded-lg disabled:opacity-50"
                >
                  <option value="low">Low (1-2 jumps per round)</option>
                  <option value="medium">Medium (2-4 jumps per round)</option>
                  <option value="high">High (3-6 jumps per round)</option>
                </select>
              </div>
            )}
          </div>

          {/* Jump Times Preview (for debugging/verification) */}
          {isClient && settings.jumpAlert && (
            <div className="border-t border-gray-600 pt-4">
              <h4 className="text-md font-bold text-gray-300 mb-2">Jump Pattern Preview</h4>
              <div className="text-sm text-gray-400 max-h-32 overflow-y-auto">
                <p className="mb-1">
                  Each round will have consistent jumps
                  {settings.thirtySecondAlert ? ' (avoiding burn alert zone)' : ''}:
                </p>
                {[1, 2, 3].map(round => {
                  // Simulate the same jump generation logic
                  const generatePreview = (roundNum: number): number[] => {
                    const jumpTimes: number[] = [];
                    const minTime = settings.thirtySecondAlert ? 35 : 30; // Match the logic in useTimer
                    const maxTime = settings.activeTime - 15;
                    const availableTime = maxTime - minTime;
                    
                    if (availableTime <= 0) return jumpTimes;
                    
                    // Use the same intensity calculation as in useTimer
                    const getJumpCount = (intensity: 'low' | 'medium' | 'high', duration: number): number => {
                      const baseDuration = Math.max(60, duration);
                      
                      switch (intensity) {
                        case 'low':
                          return Math.max(1, Math.min(2, Math.floor(baseDuration / 120)));
                        case 'medium':
                          return Math.max(2, Math.min(4, Math.floor(baseDuration / 60)));
                        case 'high':
                          return Math.max(3, Math.min(6, Math.floor(baseDuration / 40)));
                        default:
                          return 2;
                      }
                    };
                    
                    const targetJumps = getJumpCount(settings.jumpIntensity, availableTime);
                    
                    let seed = roundNum * 12345;
                    const minSpacing = 5;
                    
                    for (let i = 0; i < targetJumps; i++) {
                      let attempts = 0;
                      let jumpTime: number;
                      
                      do {
                        seed = (seed * 9301 + 49297) % 233280;
                        const random = seed / 233280;
                        jumpTime = Math.floor(minTime + random * availableTime);
                        attempts++;
                      } while (
                        attempts < 50 && 
                        jumpTimes.some(existing => Math.abs(existing - jumpTime) < minSpacing)
                      );
                      
                      if (attempts < 50) jumpTimes.push(jumpTime);
                    }
                    
                    return jumpTimes.sort((a, b) => a - b);
                  };

                  const jumpTimes = generatePreview(round);
                  return (
                    <div key={round} className="mb-1">
                      <span className="text-gray-300">Round {round}:</span> {jumpTimes.length} jumps
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          </div>
        </div>
      )}
    </>
  );
}