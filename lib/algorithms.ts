
import { SchedulerState, Algorithm, SchedulerOptions, ProcessWithMetrics } from '../types';

let rrTimeSlice = 0;

export const runSchedulerStep = (
  prevState: SchedulerState,
  algorithm: Algorithm,
  options: SchedulerOptions
): SchedulerState => {
  const state = JSON.parse(JSON.stringify(prevState)) as SchedulerState;
  const time = state.time;

  // 1. Update processes based on the running process from the *previous* tick
  let runningProcess = state.runningProcess;
  if (runningProcess) {
    runningProcess.remainingTime -= 1;

    // Check if the process finished in this tick
    if (runningProcess.remainingTime === 0) {
      const finishedProcessIndex = state.processes.findIndex(p => p.id === runningProcess!.id);
      if (finishedProcessIndex !== -1) {
        state.processes[finishedProcessIndex].finishTime = time + 1;
        state.processes[finishedProcessIndex].remainingTime = 0;
        runningProcess = null;
      }
    }
  }
  
  // 2. Add newly arrived processes to the ready queue
  state.processes.forEach(p => {
    if (p.arrivalTime === time + 1) {
      state.readyQueue.push(p);
    }
  });

  // 3. Handle context switch / process completion for the previous running process
  if (runningProcess) {
    const isPreemptive = algorithm.value === 'SRTF' || algorithm.value === 'PRIORITY_P';
    const isRoundRobin = algorithm.value === 'RR';

    if (isRoundRobin && (rrTimeSlice + 1) % options.quantum! === 0) {
        state.readyQueue.push(runningProcess);
        runningProcess = null;
        rrTimeSlice = 0;
    } else if (isPreemptive) {
        state.readyQueue.push(runningProcess);
        runningProcess = null;
    } else if (runningProcess.remainingTime > 0) {
       // Non-preemptive, so it continues
    } else {
        runningProcess = null; // Process finished
    }
  }
  
  // 4. Select the next process to run based on the algorithm
  let nextProcess: ProcessWithMetrics | null = null;
  if (state.readyQueue.length > 0) {
    switch (algorithm.value) {
      case 'FIFO':
        state.readyQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);
        nextProcess = state.readyQueue.shift()!;
        break;
      case 'LIFO':
        state.readyQueue.sort((a, b) => b.arrivalTime - a.arrivalTime);
        nextProcess = state.readyQueue.shift()!;
        break;
      case 'SJF':
      case 'SRTF':
        state.readyQueue.sort((a, b) => a.remainingTime - b.remainingTime);
        nextProcess = state.readyQueue.shift()!;
        break;
      case 'PRIORITY_NP':
      case 'PRIORITY_P':
        state.readyQueue.sort((a, b) => a.priority - b.priority); // Lower number = higher priority
        nextProcess = state.readyQueue.shift()!;
        break;
      case 'RR':
        nextProcess = state.readyQueue.shift()!;
        break;
      default:
        nextProcess = state.readyQueue.shift()!;
        break;
    }
  }

  // 5. If there's a running process that wasn't preempted, it's the next process.
  if (runningProcess && runningProcess.remainingTime > 0) {
      nextProcess = runningProcess;
      // Remove from ready queue if it exists there (can happen in RR logic)
      const existingIndex = state.readyQueue.findIndex(p => p.id === nextProcess!.id);
      if(existingIndex > -1) state.readyQueue.splice(existingIndex, 1);
  } else {
     rrTimeSlice = 0;
  }
  
  if (nextProcess) {
    if (algorithm.value === 'RR') {
        rrTimeSlice++;
    }
  }


  // 6. Update metrics for waiting processes
  state.readyQueue.forEach(p => {
    const processInMainList = state.processes.find(mainP => mainP.id === p.id);
    if(processInMainList) processInMainList.waitingTime += 1;
  });

  // 7. Update start time and response time for the new running process
  if (nextProcess && !nextProcess.hasStarted) {
    const processIndex = state.processes.findIndex(p => p.id === nextProcess!.id);
    if (processIndex !== -1) {
      state.processes[processIndex].startTime = time + 1;
      state.processes[processIndex].hasStarted = true;
      state.processes[processIndex].responseTime = (time + 1) - state.processes[processIndex].arrivalTime;
    }
  }

  // 8. Update Gantt chart data
  const lastGanttEntry = state.ganttChartData[state.ganttChartData.length - 1];
  if (nextProcess) {
    if (lastGanttEntry && lastGanttEntry.processId === nextProcess.id) {
      lastGanttEntry.end = time + 2;
    } else {
      state.ganttChartData.push({
        processId: nextProcess.id,
        processName: nextProcess.name,
        start: time + 1,
        end: time + 2,
        color: nextProcess.color,
      });
    }
  }
  
  // 9. Final state update
  state.time = time + 1;
  state.runningProcess = nextProcess;
  
  // Update Turnaround Time for all processes
  state.processes.forEach(p => {
    if (p.finishTime) {
      p.turnaroundTime = p.finishTime - p.arrivalTime;
    }
  });

  return state;
};
