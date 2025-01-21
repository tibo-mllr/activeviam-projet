import {
  AggregateRetrieval,
  DatabaseRetrieval,
  ProcessedNode,
  TimingInfo,
} from "@/lib/types";

function calculateStandardDeviation(values: number[], mean: number): number {
  const variance =
    values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
    values.length;
  return Math.sqrt(variance);
}

function computeTimingDetails(timingInfo: TimingInfo): {
  totalTiming: number;
  meanTiming: number;
  stdDevTiming: number;
  parallelCount: number;
} {
  const startTimes: number[] = timingInfo.startTime;
  const elapsedTimes: number[] = timingInfo.elapsedTime;

  if (startTimes.length != elapsedTimes.length) {
    return {
      totalTiming: 0,
      meanTiming: 0,
      stdDevTiming: 0,
      parallelCount: 0,
    };
  }

  const endTimes: number[] = startTimes.map(
    (num, idx) => num + elapsedTimes[idx],
  );

  const totalTiming =
    endTimes.reduce((a, b) => Math.max(a, b)) -
    startTimes.reduce((a, b) => Math.min(a, b));

  const meanTiming =
    elapsedTimes.reduce((sum, time) => sum + time, 0) / elapsedTimes.length;
  const stdDevTiming = calculateStandardDeviation(elapsedTimes, meanTiming);

  return {
    totalTiming,
    meanTiming,
    stdDevTiming,
    parallelCount: elapsedTimes.length,
  };
}

export function getSlowestNodes(
  aggregateRetrievals: AggregateRetrieval[],
  databaseRetrievals: DatabaseRetrieval[],
  numberOfNodes: number,
): ProcessedNode[] {
  const aggregateNodes: ProcessedNode[] = aggregateRetrievals.map((node) => {
    const { totalTiming, meanTiming, stdDevTiming, parallelCount } =
      computeTimingDetails(node.timingInfo);
    return {
      id: node.retrievalId,
      type: "Aggregate",
      timing: totalTiming,
      mean: meanTiming,
      stdDev: stdDevTiming,
      parallelCount,
    };
  });
  const databaseNodes: ProcessedNode[] = databaseRetrievals.map((node) => {
    const { totalTiming, meanTiming, stdDevTiming, parallelCount } =
      computeTimingDetails(node.timingInfo);
    return {
      id: node.retrievalId,
      type: "Database",
      timing: totalTiming,
      mean: meanTiming,
      stdDev: stdDevTiming,
      parallelCount,
    };
  });

  const allNodes: ProcessedNode[] = [...aggregateNodes, ...databaseNodes];

  return allNodes.sort((a, b) => b.timing - a.timing).slice(0, numberOfNodes);
}
