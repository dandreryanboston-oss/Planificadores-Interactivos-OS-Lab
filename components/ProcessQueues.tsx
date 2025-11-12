
import React from 'react';
import { ProcessWithMetrics } from '../types';

interface ProcessQueuesProps {
  runningProcess: ProcessWithMetrics | null;
  readyQueue: ProcessWithMetrics[];
}

const ProcessCard: React.FC<{ process: ProcessWithMetrics, isRunning?: boolean }> = ({ process, isRunning }) => (
  <div className={`p-3 rounded-lg shadow-md transition-all duration-300 ${isRunning ? 'bg-primary-100 dark:bg-primary-900/50' : 'bg-gray-100 dark:bg-gray-700/50'}`}>
    <div className="flex justify-between items-center">
      <span className="font-bold text-lg" style={{ color: process.color }}>
        {process.name}
      </span>
      <div className="text-right text-sm">
        <p>Burst: <span className="font-semibold">{process.burstTime}</span></p>
        <p>Rem: <span className="font-semibold">{process.remainingTime}</span></p>
      </div>
    </div>
  </div>
);

const ProcessQueues: React.FC<ProcessQueuesProps> = ({ runningProcess, readyQueue }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-md font-semibold mb-3 text-center">Running Process</h3>
        <div className="min-h-[80px] p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center">
          {runningProcess ? (
            <ProcessCard process={runningProcess} isRunning />
          ) : (
            <p className="text-gray-400 dark:text-gray-500">Idle</p>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-md font-semibold mb-3 text-center">Ready Queue</h3>
        <div className="min-h-[80px] p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50">
          {readyQueue.length > 0 ? (
            <div className="flex flex-wrap gap-2 justify-center">
              {readyQueue.map(p => (
                <ProcessCard key={p.id} process={p} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 dark:text-gray-500 text-center pt-5">Empty</p>
          )}
        </div>
      </div>
    </div>
  );
};

export { ProcessQueues };
