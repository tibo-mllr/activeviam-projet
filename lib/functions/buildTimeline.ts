import { AggregateRetrieval } from "../types";

export function buildTimeline(
  retrievals: AggregateRetrieval[],
): Record<number, [number, number][]> {
  const allTimings: [number, number][] = [];

  for (const retrieval of retrievals) {
    const { timingInfo } = retrieval;
    Object.entries(timingInfo).map(([key, values]) => {
      if (key === "startTime") {
        values.map((value, index) => {
          const elapsedTime = timingInfo["elapsedTime"][index];
          if (elapsedTime !== 0) allTimings.push([value, value + elapsedTime]);
        });
      } else if (key === "executionContextStartTime") {
        values.map((value, index) => {
          const elapsedTime = timingInfo["executionContextElapsedTime"][index];
          if (elapsedTime !== 0) allTimings.push([value, value + elapsedTime]);
        });
      }
    });
  }

  // Remove duplicates for easier grouping
  const filteredTimings = allTimings.reduce(
    (acc, curr) => {
      if (!acc.find(([start, end]) => start === curr[0] && end === curr[1])) {
        acc.push(curr);
      }

      return acc;
    },
    [] as [number, number][],
  );

  // Sort by start time
  filteredTimings.sort((a, b) => a[0] - b[0]);

  const timeline: Record<number, [number, number][]> = {};

  // Group by core, by trying to fit time intervals into the first available core
  for (const timing of filteredTimings) {
    const [start] = timing;
    let core = 0;
    while (true) {
      if (core in timeline) {
        const lastTiming = timeline[core][timeline[core].length - 1];
        if (start >= lastTiming[1]) {
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
