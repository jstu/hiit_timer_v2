'use client';

import { useTimer } from '@/hooks/useTimer';
import { formatTime } from '@/utils';

export function TimerDisplay() {
  const { currentTime, state } = useTimer();

  const getDisplayColor = () => {
    switch (state) {
      case 'active': return 'text-green-400';
      case 'rest': return 'text-orange-400';
      case 'prepare': return 'text-blue-400';
      case 'completed': return 'text-purple-400';
      case 'paused': return 'text-yellow-400';
      default: return 'text-white';
    }
  };

  const getGlowEffect = () => {
    switch (state) {
      case 'active': return 'drop-shadow-[0_0_30px_rgba(34,197,94,0.8)]';
      case 'rest': return 'drop-shadow-[0_0_30px_rgba(249,115,22,0.8)]';
      case 'prepare': return 'drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]';
      case 'completed': return 'drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]';
      case 'paused': return 'drop-shadow-[0_0_30px_rgba(234,179,8,0.8)]';
      default: return '';
    }
  };

  return (
    <div className={`text-9xl lg:text-[12rem] xl:text-[16rem] font-mono font-bold ${getDisplayColor()} ${getGlowEffect()}`}>
      {formatTime(currentTime)}
    </div>
  );
}