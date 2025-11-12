
import React, { useState, useCallback } from 'react';
import { Process, Algorithm } from '../types';
import { ALGORITHMS, PROCESS_COLORS } from '../constants';
import { Controls } from './Controls';
import { generateColor } from '../lib/utils';
import { PlusIcon, TrashIcon, SparklesIcon } from './icons/Icons';

interface InputPanelProps {
  processes: Process[];
  setProcesses: React.Dispatch<React.SetStateAction<Process[]>>;
  algorithm: Algorithm;
  setAlgorithm: (algo: Algorithm) => void;
  quantum: number;
  setQuantum: (q: number) => void;
  scheduler: {
    start: () => void;
    pause: () => void;
    reset: () => void;
    setSpeed: (speed: number) => void;
    status: string;
    speed: number;
  };
  onRunComparison: () => void;
}

const InputPanel: React.FC<InputPanelProps> = ({
  processes,
  setProcesses,
  algorithm,
  setAlgorithm,
  quantum,
  setQuantum,
  scheduler,
  onRunComparison,
}) => {
  const [newProcess, setNewProcess] = useState({ arrivalTime: '0', burstTime: '5', priority: '1' });
  const [nextId, setNextId] = useState(1);

  const addProcess = useCallback(() => {
    const arrivalTime = parseInt(newProcess.arrivalTime);
    const burstTime = parseInt(newProcess.burstTime);
    const priority = parseInt(newProcess.priority);

    if (isNaN(arrivalTime) || isNaN(burstTime) || isNaN(priority) || burstTime <= 0) {
      alert('Please enter valid, positive numbers for process details. Burst time must be greater than 0.');
      return;
    }
    
    const newProc: Process = {
      id: nextId,
      name: `P${nextId}`,
      arrivalTime,
      burstTime,
      priority,
      color: generateColor(nextId - 1),
    };

    setProcesses(p => [...p, newProc]);
    setNextId(id => id + 1);
    setNewProcess({ arrivalTime: '0', burstTime: '5', priority: '1' });
  }, [newProcess, nextId, setProcesses]);
  
  const randomizeProcesses = useCallback(() => {
    const randomProcesses: Process[] = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: `P${i + 1}`,
      arrivalTime: Math.floor(Math.random() * 10),
      burstTime: Math.floor(Math.random() * 10) + 1,
      priority: Math.floor(Math.random() * 10),
      color: generateColor(i)
    }));
    setProcesses(randomProcesses);
    setNextId(6);
    scheduler.reset();
  }, [setProcesses, scheduler]);

  const removeProcess = useCallback((id: number) => {
    setProcesses(p => p.filter(proc => proc.id !== id));
  }, [setProcesses]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 space-y-6 h-full flex flex-col">
      <div className="flex-grow space-y-6 overflow-y-auto">
        {/* Configuration */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2">Configuration</h2>
          <div>
            <label htmlFor="algorithm" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Algorithm</label>
            <select
              id="algorithm"
              value={algorithm.value}
              onChange={e => setAlgorithm(ALGORITHMS.find(a => a.value === e.target.value)!)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              {ALGORITHMS.map(algo => <option key={algo.value} value={algo.value}>{algo.label}</option>)}
            </select>
          </div>
          {algorithm.requiresQuantum && (
            <div>
              <label htmlFor="quantum" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantum</label>
              <input
                type="number"
                id="quantum"
                value={quantum}
                onChange={e => setQuantum(Math.max(1, parseInt(e.target.value) || 1))}
                className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              />
            </div>
          )}
        </div>

        {/* Process Management */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2">Manage Processes</h2>
          <div className="grid grid-cols-3 gap-2">
            <input type="number" placeholder="Arrival" value={newProcess.arrivalTime} onChange={e => setNewProcess(p => ({ ...p, arrivalTime: e.target.value }))} className="w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"/>
            <input type="number" placeholder="Burst" value={newProcess.burstTime} onChange={e => setNewProcess(p => ({ ...p, burstTime: e.target.value }))} className="w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"/>
            <input type="number" placeholder="Priority" value={newProcess.priority} onChange={e => setNewProcess(p => ({ ...p, priority: e.target.value }))} className="w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"/>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={addProcess} className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-all duration-200 flex items-center justify-center gap-1"><PlusIcon /> Add</button>
            <button onClick={randomizeProcesses} className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800 transition-all duration-200 flex items-center justify-center gap-1"><SparklesIcon /> Randomize</button>
          </div>
        </div>

        {/* Process List */}
        <div className="space-y-2">
            <div className="grid grid-cols-5 gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 px-2">
                <span>PID</span><span>Arrival</span><span>Burst</span><span>Priority</span><span></span>
            </div>
            <div className="max-h-60 overflow-y-auto pr-2 -mr-2">
                {processes.map(p => (
                    <div key={p.id} className="grid grid-cols-5 gap-2 items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50">
                        <span className="font-semibold" style={{ color: p.color }}>{p.name}</span>
                        <span>{p.arrivalTime}</span>
                        <span>{p.burstTime}</span>
                        <span>{p.priority}</span>
                        <button onClick={() => removeProcess(p.id)} className="text-gray-400 hover:text-red-500 transition-colors"><TrashIcon /></button>
                    </div>
                ))}
            </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <Controls scheduler={scheduler} onRunComparison={onRunComparison} processesExist={processes.length > 0} />
      </div>
    </div>
  );
};

export { InputPanel };