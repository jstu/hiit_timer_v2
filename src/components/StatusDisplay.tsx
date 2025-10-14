'use client';

import { useTimer } from '@/hooks/useTimer';

export function StatusDisplay() {
  const { state, currentCycle, totalCycles } = useTimer();

  const getStatusText = () => {
    switch (state) {
      case 'idle': return 'Ready to Start';
      case 'prepare': return `Prepare for Round ${currentCycle + 1}!`;
      case 'active': return `WORK TIME - GO!`;
      case 'rest': return currentCycle + 1 < totalCycles ? `REST TIME` : 'FINAL REST';
      case 'paused': return 'PAUSED';
      case 'completed': return 'WORKOUT COMPLETE! 🎉';
      default: return '';
    }
  };

  const getRoundInfo = () => {
    if (state === 'idle' || state === 'completed') {
      return `${totalCycles} ROUNDS TOTAL`;
    }
    return `ROUND ${currentCycle + 1} OF ${totalCycles}`;
  };

  const getStatusColor = () => {
    switch (state) {
      case 'active': return 'text-green-400';
      case 'rest': return 'text-orange-400';
      case 'prepare': return 'text-blue-400';
      case 'completed': return 'text-purple-400';
      case 'paused': return 'text-yellow-400';
      default: return 'text-red-400';
    }
  };

  const getStatusBg = () => {
    switch (state) {
      case 'active': return 'bg-green-900/30 border-green-500/50';
      case 'rest': return 'bg-orange-900/30 border-orange-500/50';
      case 'prepare': return 'bg-blue-900/30 border-blue-500/50';
      case 'completed': return 'bg-purple-900/30 border-purple-500/50';
      case 'paused': return 'bg-yellow-900/30 border-yellow-500/50';
      default: return 'bg-gray-900/30 border-gray-500/50';
    }
  };

  return (
    <div className={`text-center space-y-4 p-6 rounded-2xl border-2 ${getStatusBg()} backdrop-blur-sm`}>
      <div className={`text-3xl lg:text-4xl xl:text-5xl font-bold uppercase tracking-wider ${getStatusColor()}`}>
        {getStatusText()}
      </div>
      <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white uppercase tracking-wide">
        {getRoundInfo()}
      </div>
    </div>
  );
}