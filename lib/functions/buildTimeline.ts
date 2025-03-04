import {
  AggregateRetrieval,
  DatabaseRetrieval,
  Timeline,
  TimelineTiming,
} from "@/lib/types";

export function buildTimeline(
  aggregateRetrievals: AggregateRetrieval[],
  databaseRetrievals: DatabaseRetrieval[],
): Timeline & { nbCores: number; minDuration: number; maxDuration: number } {
  let maxCores: number = 0;
  let minDuration: number = Number.MAX_SAFE_INTEGER;
  let maxDuration: number = 0;

  const allTimings: TimelineTiming[] = [];

  for (const aggregateRetrieval of aggregateRetrievals) {
    const { timingInfo, retrievalId } = aggregateRetrieval;

    // Keep track of the maximum number of cores
    maxCores = Math.max(
      maxCores,
      timingInfo.startTime?.length ?? 0,
      timingInfo.executionContextStartTime?.length ?? 0,
    );
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
            });
        });
      }
    });
  }

  for (const databaseRetrieval of databaseRetrievals) {
    const { timingInfo, retrievalId } = databaseRetrieval;

    // Keep track of the maximum number of cores
    maxCores = Math.max(
      maxCores,
      timingInfo.startTime?.length ?? 0,
      timingInfo.executionContextStartTime?.length ?? 0,
    );
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
            });
        });
      }
    });
  }

  // Remove duplicates for easier grouping
  const filteredTimings = allTimings.reduce((acc, curr) => {
    if (!acc.find(({ start, end }) => start === curr.start && end === curr.end))
      acc.push(curr);

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
    maxCores = Math.max(maxCores, core + 1);
  }

  return { ...timeline, nbCores: maxCores, minDuration, maxDuration };
}
