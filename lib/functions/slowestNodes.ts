import {
  AggregatedAggregateRetrieval,
  AggregatedDatabaseRetrieval,
  AggregatedQueryPlan,
  ProcessedNode,
  QueryPlan,
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
  queryPlan: QueryPlan | AggregatedQueryPlan,
  numberOfNodes: number,
): {
  minDuration: number;
  maxDuration: number;
  processedNodes: ProcessedNode[];
} {
  let aggregateRetrievals: AggregatedAggregateRetrieval[];
  let databaseRetrievals: AggregatedDatabaseRetrieval[];

  // If the queryPlan is an AggregatedQueryPlan, the aggregateRetrievals and databaseRetrievals
  // are already aggregated, so we don't need to do it again.
  if (
    queryPlan.aggregateRetrievals?.length &&
    "pass" in queryPlan.aggregateRetrievals[0]
  ) {
    aggregateRetrievals =
      queryPlan.aggregateRetrievals as AggregatedAggregateRetrieval[];
    databaseRetrievals =
      queryPlan.databaseRetrievals as AggregatedDatabaseRetrieval[];
  } else {
    aggregateRetrievals = (queryPlan.aggregateRetrievals ?? []).map(
      (retrieval) => ({
        ...retrieval,
        pass: queryPlan.planInfo.mdxPass,
      }),
    );
    databaseRetrievals = (queryPlan.databaseRetrievals ?? []).map(
      (retrieval) => ({
        ...retrieval,
        pass: queryPlan.planInfo.mdxPass,
      }),
    );
  }

  const aggregateNodes: ProcessedNode[] = aggregateRetrievals
    ?.filter(
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
        pass: node.pass,
      };
    });

  const databaseNodes: ProcessedNode[] = databaseRetrievals
    ?.filter(
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
        pass: node.pass,
      };
    });

  const allNodes: ProcessedNode[] = [...aggregateNodes, ...databaseNodes];

  const minDuration =
    allNodes.length > 0
      ? Math.min(...allNodes.map((node) => node.totalTiming))
      : 0;

  const maxDuration =
    allNodes.length > 0
      ? Math.max(...allNodes.map((node) => node.totalTiming))
      : 0;

  return {
    minDuration,
    maxDuration,
    processedNodes: allNodes
      .sort((a, b) => b.totalTiming - a.totalTiming)
      .slice(0, numberOfNodes),
  };
}
