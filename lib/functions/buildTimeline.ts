import { AggregateRetrieval, Timeline, TimelineTiming } from "../types";

export function buildTimeline(retrievals: AggregateRetrieval[]): Timeline {
  const allTimings: TimelineTiming[] = [];

  for (const retrieval of retrievals) {
    const { timingInfo, retrievalId } = retrieval;
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
  }

  return timeline;
}
