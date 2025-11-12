
import React, { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, ChartTypeRegistry } from 'chart.js';
import 'chart.js/auto';
import { GanttChartEntry, ProcessWithMetrics } from '../types';

interface GanttChartProps {
  data: GanttChartEntry[];
  processes: ProcessWithMetrics[];
  time: number;
}

const GanttChart: React.FC<GanttChartProps> = ({ data, processes, time }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const chartData = {
      labels: processes.map(p => p.name).reverse(),
      datasets: [{
        label: 'Execution',
        data: data.map(entry => {
            const processIndex = processes.length - 1 - processes.findIndex(p => p.id === entry.processId);
            return {
              x: [entry.start, entry.end],
              y: processIndex,
              processName: entry.processName
            }
        }),
        backgroundColor: data.map(entry => entry.color),
        borderColor: 'rgba(255,255,255,0.5)',
        borderWidth: 1,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      }],
    };
    
    const config: ChartConfiguration = {
      type: 'bar',
      data: chartData,
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            min: 0,
            max: Math.max(20, time + 2),
            title: {
              display: true,
              text: 'Time (units)',
            },
            grid: {
                color: 'rgba(128, 128, 128, 0.2)'
            }
          },
          y: {
            stacked: true,
            grid: {
                display: false
            }
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const raw: any = context.raw;
                return `${raw.processName}: [${raw.x[0]}, ${raw.x[1]})`;
              }
            }
          }
        },
        animation: {
            duration: 200,
            easing: 'linear'
        }
      },
    };

    if (chartInstanceRef.current) {
        chartInstanceRef.current.data = chartData;
        chartInstanceRef.current.options.scales!.x!.max = Math.max(20, time + 5);
        chartInstanceRef.current.update();
    } else {
        chartInstanceRef.current = new Chart(ctx, config);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, processes, time]);
  
  // Cleanup
  useEffect(() => {
    return () => {
      chartInstanceRef.current?.destroy();
      chartInstanceRef.current = null;
    }
  }, []);

  return (
    <div className="h-64 relative">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export { GanttChart };
