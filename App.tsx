
import React, { useState, useMemo, useCallback } from 'react';
import { InputPanel } from './components/InputPanel';
import { VisualizationPanel } from './components/VisualizationPanel';
import { ComparisonModal } from './components/ComparisonModal';
import { ThemeToggle } from './components/ThemeToggle';
import { useScheduler } from './hooks/useScheduler';
import { useTheme } from './hooks/useTheme';
import { Algorithm, Process } from './types';
import { ALGORITHMS } from './constants';
import { runAllSimulations } from './lib/utils';
import { ComparisonResult } from './types';

const App: React.FC = () => {
  const [theme, toggleTheme] = useTheme();
  const [processes, setProcesses] = useState<Process[]>([]);
  const [algorithm, setAlgorithm] = useState<Algorithm>(ALGORITHMS[0]);
  const [quantum, setQuantum] = useState<number>(2);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [comparisonResults, setComparisonResults] = useState<ComparisonResult[]>([]);

  const scheduler = useScheduler(processes, algorithm, { quantum });

  const handleRunComparison = useCallback(() => {
    if (processes.length > 0) {
      const results = runAllSimulations(processes, { quantum });
      setComparisonResults(results);
      setIsComparisonModalOpen(true);
    } else {
      alert("Please add at least one process to run a comparison.");
    }
  }, [processes, quantum]);

  return (
    <div className={`${theme} transition-colors duration-300`}>
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen font-sans">
        <header className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-20">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold text-primary-600 dark:text-primary-400">
              Planificadores Interactivos OS Lab
            </h1>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </header>

        <main className="container mx-auto p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 xl:col-span-3">
              <InputPanel
                processes={processes}
                setProcesses={setProcesses}
                algorithm={algorithm}
                setAlgorithm={setAlgorithm}
                quantum={quantum}
                setQuantum={setQuantum}
                scheduler={scheduler}
                onRunComparison={handleRunComparison}
              />
            </div>
            <div className="lg:col-span-8 xl:col-span-9">
              <VisualizationPanel scheduler={scheduler} />
            </div>
          </div>
        </main>

        <footer className="text-center py-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 mt-6">
          <p>&copy; {new Date().getFullYear()} OS Lab Simulator. All rights reserved.</p>
        </footer>

        {isComparisonModalOpen && (
          <ComparisonModal
            results={comparisonResults}
            onClose={() => setIsComparisonModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default App;
