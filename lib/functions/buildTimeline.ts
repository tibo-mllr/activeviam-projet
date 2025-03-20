import {
  AggregatedAggregateRetrieval,
  AggregatedDatabaseRetrieval,
  AggregatedQueryPlan,
  QueryPlan,
  Timeline,
  TimelineTiming,
} from "@/lib/types";

export function buildTimeline(
  queryPlan: QueryPlan | AggregatedQueryPlan,
): Timeline & {
  minDuration: number;
  maxDuration: number;
  totalProcesses: number;
} {
  let minDuration: number = Number.MAX_SAFE_INTEGER;
  let maxDuration: number = 0;
  let totalProcesses: number = 0;

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
      (retrieval) => ({ ...retrieval, pass: queryPlan.planInfo.mdxPass }),
    );
    databaseRetrievals = (queryPlan.databaseRetrievals ?? []).map(
      (retrieval) => ({ ...retrieval, pass: queryPlan.planInfo.mdxPass }),
    );
  }

  const allTimings: TimelineTiming[] = [];

  for (const aggregateRetrieval of aggregateRetrievals) {
    const { timingInfo, retrievalId } = aggregateRetrieval;

    // Keep track of the minimum and maximum timing
    minDuration = Math.min(
      minDuration,
      ...(timingInfo.elapsedTime ?? []).filter((time) => time !== 0),
      ...(timingInfo.executionContextElapsedTime ?? []).filter(
        (time) => time !== 0,
      ),
    );
    maxDuration = Math.max(
      maxDuration,
      ...(timingInfo.elapsedTime ?? []),
      ...(timingInfo.executionContextElapsedTime ?? []),
    );

    Object.entries(timingInfo).map(([key, values]) => {
      if (key === "startTime") {
        values.map((value, index) => {
          const elapsedTime = timingInfo["elapsedTime"][index];
          if (elapsedTime !== 0)
            allTimings.push({
              start: value,
              end: value + elapsedTime,
              retrievalId,
              type: "AggregateRetrieval",
              pass: aggregateRetrieval.pass,
            });
        });
      } else if (key === "executionContextStartTime") {
        values.map((value, index) => {
          const elapsedTime = timingInfo["executionContextElapsedTime"][index];
          if (elapsedTime !== 0)
            allTimings.push({
              start: value,
              end: value + elapsedTime,
              retrievalId,
              type: "AggregateRetrievalExecutionContext",
              pass: aggregateRetrieval.pass,
            });
        });
      }
    });
  }

  for (const databaseRetrieval of databaseRetrievals) {
    const { timingInfo, retrievalId } = databaseRetrieval;

    // Keep track of the minimum and maximum timing
    minDuration = Math.min(
      minDuration,
      ...(timingInfo.elapsedTime ?? []).filter((time) => time !== 0),
      ...(timingInfo.executionContextElapsedTime ?? []).filter(
        (time) => time !== 0,
      ),
    );
    maxDuration = Math.max(
      maxDuration,
      ...(timingInfo.elapsedTime ?? []),
      ...(timingInfo.executionContextElapsedTime ?? []),
    );

    Object.entries(timingInfo).map(([key, values]) => {
      if (key === "startTime") {
        values.map((value, index) => {
          const elapsedTime = timingInfo["elapsedTime"][index];
          if (elapsedTime !== 0)
            allTimings.push({
              start: value,
              end: value + elapsedTime,
              retrievalId,
              type: "DatabaseRetrieval",
              pass: databaseRetrieval.pass,
            });
        });
      } else if (key === "executionContextStartTime") {
        values.map((value, index) => {
          const elapsedTime = timingInfo["executionContextElapsedTime"][index];
          if (elapsedTime !== 0)
            allTimings.push({
              start: value,
              end: value + elapsedTime,
              retrievalId,
              type: "DatabaseRetrievalExecutionContext",
              pass: databaseRetrieval.pass,
            });
        });
      }
    });
  }

  // Remove duplicates for easier grouping
  const filteredTimings = allTimings.reduce((acc, curr) => {
    if (
      !acc.find(({ start, end }) => start === curr.start && end === curr.end)
    ) {
      acc.push(curr);
      totalProcesses += 1;
    }

    return acc;
  }, [] as TimelineTiming[]);

  // Sort by start time
  filteredTimings.sort((a, b) => a.start - b.start);

  const timeline: Timeline = {};

  // Group by core, by trying to fit time intervals into the first available core
  for (const timing of filteredTimings) {
    const { start } = timing;
    let core = 0;
    while (true) {
      if (core in timeline) {
        const lastTiming = timeline[core][timeline[core].length - 1];
        if (start >= lastTiming.end) {
          timeline[core].push(timing);
          break;
        }
      } else {
        timeline[core] = [timing];
        break;
      }
      core++;
    }
  }

  return {
    ...timeline,
    minDuration,
    maxDuration,
    totalProcesses,
  };
}
