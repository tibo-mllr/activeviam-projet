import { AggregateRetrieval, DatabaseRetrieval, TimingInfo } from "../types";

interface ProcessedNode {
  id: string;
  type: "Aggregate" | "Database";
  timing: number;
}

function computeTiming(timingInfo: TimingInfo): number {
  const startTimes: number[] = timingInfo["startTime"];
  const elapsedTimes: number[] = timingInfo["elapsedTime"];

  if (startTimes.length != elapsedTimes.length) {
    return 0;
  }

  const endTimes: number[] = startTimes.map(function (num, idx) {
    return num + elapsedTimes[idx];
  });

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
  const aggregateNodes: ProcessedNode[] = aggregateRetrievals.map(
    (node: AggregateRetrieval) => ({
      id: `Aggregate ${node.retrievalId}`,
      type: "Aggregate",
      timing: computeTiming(node.timingInfo),
    }),
  );
  const databaseNodes: ProcessedNode[] = databaseRetrievals.map(
    (node: DatabaseRetrieval) => ({
      id: `Database ${node.retrievalId}`,
      type: "Database",
      timing: computeTiming(node.timingInfo),
    }),
  );

  const allNodes: ProcessedNode[] = [...aggregateNodes, ...databaseNodes];

  return allNodes.sort((a, b) => b.timing - a.timing).slice(0, numberOfNodes);
}
