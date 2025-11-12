
import { useState, useEffect, useRef, useCallback } from 'react';
import { Process, Algorithm, SchedulerState, SchedulerOptions, SimulationStatus, ProcessWithMetrics, GanttChartEntry } from '../types';
import { runSchedulerStep } from '../lib/algorithms';
import { calculateFinalMetrics, getInitialProcessMetrics } from '../lib/utils';

const INITIAL_STATE: SchedulerState = {
  time: 0,
  processes: [],
  runningProcess: null,
  readyQueue: [],
  ganttChartData: [],
  status: 'idle',
  metrics: {
    avgWaitingTime: 0,
    avgTurnaroundTime: 0,
    avgResponseTime: 0,
    cpuUtilization: 0,
    throughput: 0,
  },
};

export const useScheduler = (initialProcesses: Process[], algorithm: Algorithm, options: SchedulerOptions) => {
  const [state, setState] = useState<SchedulerState>(INITIAL_STATE);
  const [speed, setSpeed] = useState(500);
  const intervalRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const initialProcessMetrics = getInitialProcessMetrics(initialProcesses);
    setState({
      ...INITIAL_STATE,
      processes: initialProcessMetrics,
    });
  }, [initialProcesses]);

  useEffect(() => {
    reset();
  }, [initialProcesses, algorithm, options.quantum, reset]);
  
  const tick = useCallback(() => {
    setState(prevState => {
      const nextState = runSchedulerStep(prevState, algorithm, options);

      const finishedProcesses = nextState.processes.filter(p => p.finishTime !== null);
      if (finishedProcesses.length === nextState.processes.length && nextState.processes.length > 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        
        const finalMetrics = calculateFinalMetrics(nextState.processes, nextState.time);

        return { ...nextState, status: 'finished' as SimulationStatus, metrics: finalMetrics };
      }
      return nextState;
    });
  }, [algorithm, options]);
  
  const start = useCallback(() => {
    if (state.status === 'idle' || state.status === 'paused') {
      if(state.processes.length === 0) return;

      setState(s => ({ ...s, status: 'running' }));
      intervalRef.current = window.setInterval(tick, speed);
    }
  }, [state.status, state.processes, tick, speed]);

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setState(s => ({ ...s, status: 'paused' }));
    }
  }, []);
  
  useEffect(() => {
    if (state.status === 'running') {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(tick, speed);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [speed, state.status, tick]);

  return {
    ...state,
    start,
    pause,
    reset,
    setSpeed,
    speed,
  };
};
