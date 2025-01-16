import {
  AggregateRetrieval,
  DatabaseRetrieval,
  ProcessedNode,
  TimingInfo,
} from "@/lib/types";

function computeTiming(timingInfo: TimingInfo): number {
  const startTimes: number[] = timingInfo.startTime;
  const elapsedTimes: number[] = timingInfo.elapsedTime;

  if (startTimes.length != elapsedTimes.length) {
    return 0;
  }

  const endTimes: number[] = startTimes.map(
    (num, idx) => num + elapsedTimes[idx],
  );

  return (
    endTimes.reduce((a, b) => Math.max(a, b)) -
    startTimes.reduce((a, b) => Math.min(a, b))
  );
}

export function getSlowestNodes(
  aggregateRetrievals: AggregateRetrieval[],
  databaseRetrievals: DatabaseRetrieval[],
  numberOfNodes: number,
): ProcessedNode[] {
  const aggregateNodes: ProcessedNode[] = aggregateRetrievals.map((node) => ({
    id: `Aggregate ${node.retrievalId}`,
    type: "Aggregate",
    timing: computeTiming(node.timingInfo),
  }));
  const databaseNodes: ProcessedNode[] = databaseRetrievals.map((node) => ({
    id: `Database ${node.retrievalId}`,
    type: "Database",
    timing: computeTiming(node.timingInfo),
  }));

  const allNodes: ProcessedNode[] = [...aggregateNodes, ...databaseNodes];

  return allNodes.sort((a, b) => b.timing - a.timing).slice(0, numberOfNodes);
}
