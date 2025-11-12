
import React from 'react';
import { GanttChart } from './GanttChart';
import { MetricsTable } from './MetricsTable';
import { ProcessQueues } from './ProcessQueues';
import { SchedulerState } from '../types';

interface VisualizationPanelProps {
  scheduler: SchedulerState;
}

const StatCard: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
    <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{value}</p>
    </div>
);

const VisualizationPanel: React.FC<VisualizationPanelProps> = ({ scheduler }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Simulation Timeline (Gantt Chart)</h2>
        <GanttChart data={scheduler.ganttChartData} processes={scheduler.processes} time={scheduler.time} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Live State</h2>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="Current Time" value={scheduler.time} />
            <StatCard title="Status" value={scheduler.status.charAt(0).toUpperCase() + scheduler.status.slice(1)} />
            <StatCard title="Running Process" value={scheduler.runningProcess?.name ?? 'Idle'} />
            <StatCard title="Ready Queue" value={scheduler.readyQueue.length} />
        </div>
        <ProcessQueues
          runningProcess={scheduler.runningProcess}
          readyQueue={scheduler.readyQueue}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
        <MetricsTable processes={scheduler.processes} metrics={scheduler.metrics} />
      </div>
    </div>
  );
};

export { VisualizationPanel };
