
export interface Process {
  id: number;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  color: string;
}

export interface ProcessWithMetrics extends Process {
  remainingTime: number;
  startTime: number | null;
  finishTime: number | null;
  waitingTime: number;
  turnaroundTime: number;
  responseTime: number;
  hasStarted: boolean;
}

export interface Algorithm {
  value: 'FIFO' | 'LIFO' | 'SJF' | 'SRTF' | 'RR' | 'PRIORITY_P' | 'PRIORITY_NP';
  label: string;
  requiresQuantum?: boolean;
  requiresPriority?: boolean;
}

export interface GanttChartEntry {
  processId: number;
  processName: string;
  start: number;
  end: number;
  color: string;
}

export type SimulationStatus = 'idle' | 'running' | 'paused' | 'finished';

export interface SchedulerState {
  time: number;
  processes: ProcessWithMetrics[];
  runningProcess: ProcessWithMetrics | null;
  readyQueue: ProcessWithMetrics[];
  ganttChartData: GanttChartEntry[];
  status: SimulationStatus;
  metrics: FinalMetrics;
}

export interface FinalMetrics {
  avgWaitingTime: number;
  avgTurnaroundTime: number;
  avgResponseTime: number;
  cpuUtilization: number;
  throughput: number;
}

export interface SchedulerOptions {
  quantum?: number;
}

export interface ComparisonResult {
  algorithm: string;
  metrics: FinalMetrics;
}
