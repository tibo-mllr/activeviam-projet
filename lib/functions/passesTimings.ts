import { AggregateRetrieval, DatabaseRetrieval, QueryPlan } from "@/lib/types";

export type PassTiming = {
  passName: string;
  totalTiming: number;
};

function getMaxRetrievalTimings(
  retrieval: AggregateRetrieval | DatabaseRetrieval,
): number {
  const elapsedTimes: number[] = retrieval.timingInfo.elapsedTime ?? [];
  const endTimes: number[] = (retrieval.timingInfo.startTime ?? []).map(
    (num, idx) => num + elapsedTimes[idx],
  );
  const executionContextElapsedTimes: number[] =
    retrieval.timingInfo.executionContextElapsedTime ?? [];
  const executionContextEndTimes: number[] = (
    retrieval.timingInfo.executionContextStartTime ?? []
  ).map((num, idx) => num + executionContextElapsedTimes[idx]);

  return endTimes
    .concat(executionContextEndTimes)
    .reduce((a, b) => Math.max(a, b), 0);
}

function passTiming(pass: QueryPlan): PassTiming {
  const maxRetrievalTimings = pass.aggregateRetrievals
    .map(getMaxRetrievalTimings)
    .concat(pass.databaseRetrievals.map(getMaxRetrievalTimings));

  console.log(pass.planInfo.mdxPass, maxRetrievalTimings);

  return {
    passName: pass.planInfo.mdxPass,
    totalTiming: Math.max(...maxRetrievalTimings, 0),
  };
}

export function getPassesTimings(queryPlan: QueryPlan[]): PassTiming[] {
  return queryPlan.map(passTiming);
}
