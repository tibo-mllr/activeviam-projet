import { AggregateRetrieval } from "../types";

export function buildTimeline(
  retrievals: AggregateRetrieval[],
): Record<string, [number, number][]> {
  const res: Record<number, [number, number][]> = {};

  for (const retrieval of retrievals) {
    const { timingInfo } = retrieval;
    Object.entries(timingInfo).map(([key, values]) => {
      if (key === "startTime") {
        values.map((value, core) => {
          const elapsedTime = timingInfo["elapsedTime"][core];
          if (elapsedTime !== 0) {
            if (!res[core]) res[core] = [];

            res[core].push([value, value + elapsedTime]);
          }
        });
      } else if (key === "executionContextStartTime") {
        values.map((value, core) => {
          const elapsedTime = timingInfo["executionContextElapsedTime"][core];
          if (elapsedTime !== 0) {
            if (!res[core]) res[core] = [];

            res[core].push([value, value + elapsedTime]);
          }
        });
      }
    });
  }

  // Remove duplicates
  for (const core in res) {
    res[core] = res[core].reduce(
      (acc, curr) => {
        if (!acc.find(([start, end]) => start === curr[0] && end === curr[1])) {
          acc.push(curr);
        }

        return acc;
      },
      [] as [number, number][],
    );
  }

  return res;
}
