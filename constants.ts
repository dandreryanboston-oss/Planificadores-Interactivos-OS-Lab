
import { Algorithm } from './types';

export const ALGORITHMS: Algorithm[] = [
  { value: 'FIFO', label: 'First-In, First-Out (FIFO)' },
  { value: 'LIFO', label: 'Last-In, First-Out (LIFO)' },
  { value: 'SJF', label: 'Shortest Job First (SJF, Non-Preemptive)' },
  { value: 'SRTF', label: 'Shortest Remaining Time First (SRTF, Preemptive)' },
  { value: 'RR', label: 'Round Robin (RR)', requiresQuantum: true },
  { value: 'PRIORITY_NP', label: 'Priority (Non-Preemptive)', requiresPriority: true },
  { value: 'PRIORITY_P', label: 'Priority (Preemptive)', requiresPriority: true },
  // Future algorithms can be added here
  // { value: 'MLQ', label: 'Multilevel Queue' },
  // { value: 'MLFQ', label: 'Multilevel Feedback Queue' },
];

export const PROCESS_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'
];
