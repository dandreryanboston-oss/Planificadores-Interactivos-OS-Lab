
import React from 'react';
import { PlayIcon, PauseIcon, RefreshIcon, ChartBarIcon } from './icons/Icons';

interface ControlsProps {
  scheduler: {
    start: () => void;
    pause: () => void;
    reset: () => void;
    setSpeed: (speed: number) => void;
    status: string;
    speed: number;
  };
  onRunComparison: () => void;
  processesExist: boolean;
}

const Controls: React.FC<ControlsProps> = ({ scheduler, onRunComparison, processesExist }) => {
  const { start, pause, reset, setSpeed, status, speed } = scheduler;
  const isRunning = status === 'running';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {isRunning ? (
          <button onClick={pause} className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-all duration-200 flex items-center justify-center gap-1 bg-amber-500 hover:bg-amber-600">
            <PauseIcon /> Pause
          </button>
        ) : (
          <button onClick={start} disabled={status === 'finished' || !processesExist} className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-all duration-200 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed">
            <PlayIcon /> {status === 'paused' ? 'Resume' : 'Start'}
          </button>
        )}
        <button onClick={reset} className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800 transition-all duration-200 flex items-center justify-center gap-1">
          <RefreshIcon /> Reset
        </button>
        <button onClick={onRunComparison} disabled={!processesExist} className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800 transition-all duration-200 flex items-center justify-center gap-1 col-span-3 disabled:opacity-50 disabled:cursor-not-allowed">
          <ChartBarIcon /> Compare All
        </button>
      </div>
      <div>
        <label htmlFor="speed" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Speed ({((1000 / speed)).toFixed(1)}x)
        </label>
        <input
          type="range"
          id="speed"
          min="50"
          max="1000"
          step="50"
          value={speed}
          onChange={e => setSpeed(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
          style={{ transform: 'scaleX(-1)' }}
        />
      </div>
    </div>
  );
};

export { Controls };