
import React from 'react';
import { ProcessWithMetrics, FinalMetrics } from '../types';
import { exportToCSV, exportToJSON } from '../lib/utils';
import { DownloadIcon } from './icons/Icons';


interface MetricsTableProps {
  processes: ProcessWithMetrics[];
  metrics: FinalMetrics;
}

const MetricsTable: React.FC<MetricsTableProps> = ({ processes, metrics }) => {
  const finishedProcesses = processes.filter(p => p.finishTime !== null);

  const handleExportJSON = () => {
    const data = {
        processes: finishedProcesses,
        summaryMetrics: metrics
    };
    exportToJSON(data, 'cpu-scheduling-metrics');
  };

  const handleExportCSV = () => {
    exportToCSV(finishedProcesses, 'cpu-scheduling-metrics');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
         <button onClick={handleExportJSON} disabled={finishedProcesses.length === 0} className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800 transition-all duration-200 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <DownloadIcon /> JSON
         </button>
         <button onClick={handleExportCSV} disabled={finishedProcesses.length === 0} className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800 transition-all duration-200 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <DownloadIcon /> CSV
         </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
            <tr>
              <th scope="col" className="px-4 py-3">PID</th>
              <th scope="col" className="px-4 py-3">Arrival</th>
              <th scope="col" className="px-4 py-3">Burst</th>
              <th scope="col" className="px-4 py-3">Finish</th>
              <th scope="col" className="px-4 py-3">Turnaround</th>
              <th scope="col" className="px-4 py-3">Waiting</th>
              <th scope="col" className="px-4 py-3">Response</th>
            </tr>
          </thead>
          <tbody>
            {processes.map(p => (
              <tr key={p.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50">
                <td className="px-4 py-2 font-medium" style={{ color: p.color }}>{p.name}</td>
                <td className="px-4 py-2">{p.arrivalTime}</td>
                <td className="px-4 py-2">{p.burstTime}</td>
                <td className="px-4 py-2">{p.finishTime ?? '-'}</td>
                <td className="px-4 py-2">{p.finishTime ? p.finishTime - p.arrivalTime : '-'}</td>
                <td className="px-4 py-2">{p.finishTime ? p.waitingTime : '-'}</td>
                <td className="px-4 py-2">{p.hasStarted ? p.responseTime : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
        <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
          <p className="text-xs uppercase text-gray-500">Avg. Turnaround</p>
          <p className="text-lg font-bold">{metrics.avgTurnaroundTime.toFixed(2)}</p>
        </div>
        <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
          <p className="text-xs uppercase text-gray-500">Avg. Waiting</p>
          <p className="text-lg font-bold">{metrics.avgWaitingTime.toFixed(2)}</p>
        </div>
        <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
          <p className="text-xs uppercase text-gray-500">Avg. Response</p>
          <p className="text-lg font-bold">{metrics.avgResponseTime.toFixed(2)}</p>
        </div>
        <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
          <p className="text-xs uppercase text-gray-500">CPU Utilization</p>
          <p className="text-lg font-bold">{metrics.cpuUtilization.toFixed(2)}%</p>
        </div>
        <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg col-span-2 md:col-span-1 lg:col-span-1">
          <p className="text-xs uppercase text-gray-500">Throughput</p>
          <p className="text-lg font-bold">{metrics.throughput.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export { MetricsTable };