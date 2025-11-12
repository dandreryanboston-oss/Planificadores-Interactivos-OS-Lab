
import { Process, ProcessWithMetrics, FinalMetrics, Algorithm, SchedulerOptions, ComparisonResult, SchedulerState } from '../types';
import { PROCESS_COLORS, ALGORITHMS } from '../constants';
import { runSchedulerStep } from './algorithms';

export const generateColor = (index: number): string => {
  return PROCESS_COLORS[index % PROCESS_COLORS.length];
};

export const getInitialProcessMetrics = (processes: Process[]): ProcessWithMetrics[] => {
  return processes.map(p => ({
    ...p,
    remainingTime: p.burstTime,
    startTime: null,
    finishTime: null,
    waitingTime: 0,
    turnaroundTime: 0,
    responseTime: 0,
    hasStarted: false,
  }));
};

export const calculateFinalMetrics = (processes: ProcessWithMetrics[], totalTime: number): FinalMetrics => {
  if (processes.length === 0) {
    return {
      avgWaitingTime: 0,
      avgTurnaroundTime: 0,
      avgResponseTime: 0,
      cpuUtilization: 0,
      throughput: 0,
    };
  }

  const totalWaitingTime = processes.reduce((sum, p) => sum + p.waitingTime, 0);
  const totalTurnaroundTime = processes.reduce((sum, p) => sum + (p.finishTime! - p.arrivalTime), 0);
  const totalResponseTime = processes.reduce((sum, p) => sum + p.responseTime, 0);
  const totalBurstTime = processes.reduce((sum, p) => sum + p.burstTime, 0);

  const numProcesses = processes.length;
  return {
    avgWaitingTime: totalWaitingTime / numProcesses,
    avgTurnaroundTime: totalTurnaroundTime / numProcesses,
    avgResponseTime: totalResponseTime / numProcesses,
    cpuUtilization: (totalBurstTime / totalTime) * 100,
    throughput: numProcesses / totalTime,
  };
};

export const exportToJSON = (data: any, filename: string) => {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = `${filename}.json`;
  link.click();
};

export const exportToCSV = (data: ProcessWithMetrics[], filename: string) => {
  const headers = ['ID', 'Name', 'Arrival Time', 'Burst Time', 'Priority', 'Finish Time', 'Turnaround Time', 'Waiting Time', 'Response Time'];
  const rows = data.map(p => 
    [p.id, p.name, p.arrivalTime, p.burstTime, p.priority, p.finishTime, p.turnaroundTime, p.waitingTime, p.responseTime].join(',')
  );
  const csvString = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


const runSimulationHeadless = (processes: Process[], algorithm: Algorithm, options: SchedulerOptions): FinalMetrics => {
  // FIX: Explicitly type 'state' as SchedulerState to prevent type inference errors.
  let state: SchedulerState = {
    time: -1,
    processes: getInitialProcessMetrics(processes),
    runningProcess: null,
    readyQueue: [],
    ganttChartData: [],
    status: 'idle',
    metrics: { avgWaitingTime: 0, avgTurnaroundTime: 0, avgResponseTime: 0, cpuUtilization: 0, throughput: 0 },
  };

  while (true) {
    state = runSchedulerStep(state, algorithm, options);
    
    const finishedProcesses = state.processes.filter(p => p.finishTime !== null);
    if (finishedProcesses.length === state.processes.length && state.processes.length > 0) {
      const finalMetrics = calculateFinalMetrics(state.processes, state.time);
      return finalMetrics;
    }
    // Safety break
    if (state.time > 1000) { 
        console.error("Simulation timeout for", algorithm.label);
        break;
    }
  }
  return state.metrics;
};


export const runAllSimulations = (processes: Process[], options: SchedulerOptions): ComparisonResult[] => {
  return ALGORITHMS.map(algo => {
    const metrics = runSimulationHeadless(processes, algo, options);
    return {
      algorithm: algo.label,
      metrics,
    };
  });
};