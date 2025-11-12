
import React from 'react';
import { ComparisonResult } from '../types';

interface ComparisonModalProps {
  results: ComparisonResult[];
  onClose: () => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ results, onClose }) => {
  const getMinMax = (key: keyof ComparisonResult['metrics']) => {
    const values = results.map(r => r.metrics[key]);
    return { min: Math.min(...values), max: Math.max(...values) };
  };

  const getCellStyle = (value: number, min: number, max: number) => {
    if (min === max) return '';
    if (value === min) return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 font-semibold';
    if (value === max) return 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300';
    return '';
  };

  const turnaroundStats = getMinMax('avgTurnaroundTime');
  const waitingStats = getMinMax('avgWaitingTime');
  const responseStats = getMinMax('avgResponseTime');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold">Algorithm Performance Comparison</h2>
        </div>
        <div className="p-4 md:p-6 overflow-y-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                <tr>
                  <th scope="col" className="px-4 py-3">Algorithm</th>
                  <th scope="col" className="px-4 py-3">Avg Turnaround</th>
                  <th scope="col" className="px-4 py-3">Avg Waiting</th>
                  <th scope="col" className="px-4 py-3">Avg Response</th>
                  <th scope="col" className="px-4 py-3">CPU Utilization</th>
                  <th scope="col" className="px-4 py-3">Throughput</th>
                </tr>
              </thead>
              <tbody>
                {results.map(result => (
                  <tr key={result.algorithm} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50">
                    <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{result.algorithm}</td>
                    <td className={`px-4 py-2 ${getCellStyle(result.metrics.avgTurnaroundTime, turnaroundStats.min, turnaroundStats.max)}`}>{result.metrics.avgTurnaroundTime.toFixed(2)}</td>
                    <td className={`px-4 py-2 ${getCellStyle(result.metrics.avgWaitingTime, waitingStats.min, waitingStats.max)}`}>{result.metrics.avgWaitingTime.toFixed(2)}</td>
                    <td className={`px-4 py-2 ${getCellStyle(result.metrics.avgResponseTime, responseStats.min, responseStats.max)}`}>{result.metrics.avgResponseTime.toFixed(2)}</td>
                    <td className="px-4 py-2">{result.metrics.cpuUtilization.toFixed(2)}%</td>
                    <td className="px-4 py-2">{result.metrics.throughput.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
           <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-block w-3 h-3 rounded-full bg-green-200 dark:bg-green-800 mr-1"></span> Best performance.
            <span className="inline-block w-3 h-3 rounded-full bg-red-200 dark:bg-red-800 mr-1 ml-4"></span> Worst performance.
          </p>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-right">
          <button onClick={onClose} className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export { ComparisonModal };
