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
  maxTiming: number;
  totalTiming: number;
  meanTiming: number;
  stdDevTiming: number;
  parallelCount: number;
} {
  const startTimes: number[] = timingInfo.startTime ?? [];
  const elapsedTimes: number[] = timingInfo.elapsedTime ?? [];

  if (
    (startTimes.length === 0 && elapsedTimes.length === 0) ||
    startTimes.length != elapsedTimes.length
  ) {
    return {
      maxTiming: 0,
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

  const maxTiming = Math.max(...elapsedTimes);

  return {
    maxTiming,
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
  const aggregateNodes: ProcessedNode[] = aggregateRetrievals
    .filter(
      (node) =>
        node.timingInfo.startTime?.length &&
        node.timingInfo.elapsedTime?.length,
    )
    .map((node) => {
      const {
        maxTiming,
        totalTiming,
        meanTiming,
        stdDevTiming,
        parallelCount,
      } = computeTimingDetails(node.timingInfo);
      return {
        id: node.retrievalId,
        type: "Aggregate",
        maxTiming,
        totalTiming,
        mean: meanTiming,
        stdDev: stdDevTiming,
        parallelCount,
      };
    });

  const databaseNodes: ProcessedNode[] = databaseRetrievals
    .filter(
      (node) =>
        node.timingInfo.startTime?.length &&
        node.timingInfo.elapsedTime?.length,
    )
    .map((node) => {
      const {
        maxTiming,
        totalTiming,
        meanTiming,
        stdDevTiming,
        parallelCount,
      } = computeTimingDetails(node.timingInfo);
      return {
        id: node.retrievalId,
        type: "Database",
        maxTiming,
        totalTiming,
        mean: meanTiming,
        stdDev: stdDevTiming,
        parallelCount,
      };
    });

  const allNodes: ProcessedNode[] = [...aggregateNodes, ...databaseNodes];

  return allNodes
    .sort((a, b) => b.totalTiming - a.totalTiming)
    .slice(0, numberOfNodes);
}
