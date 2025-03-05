import { QueryPlan } from "@/lib/types";

export function adjustTimings(queryPlan: QueryPlan[]): QueryPlan[] {
  let offset = 0;
  return queryPlan.map((pass) => {
    let maxEndTime = 0;

    const newAggregateRetrievals = pass.aggregateRetrievals.map((retrieval) => {
      const newStartTime = (retrieval.timingInfo.startTime ?? []).map(
        (start) => start + offset,
      );

      const newExecutionContextStartTime = (
        retrieval.timingInfo.executionContextStartTime ?? []
      ).map((start) => start + offset);

      const newTimingInfo = {
        ...retrieval.timingInfo,
        startTime: newStartTime,
        executionContextStartTime: newExecutionContextStartTime,
      };

      maxEndTime = Math.max(
        maxEndTime,
        ...newStartTime.map(
          (start, index) => start + retrieval.timingInfo.elapsedTime[index],
        ),
        ...newExecutionContextStartTime.map(
          (start, index) =>
            start + retrieval.timingInfo.executionContextElapsedTime[index],
        ),
      );

      return { ...retrieval, timingInfo: newTimingInfo };
    });

    const newDatabaseRetrievals = pass.databaseRetrievals.map((retrieval) => {
      const newStartTime = (retrieval.timingInfo.startTime ?? []).map(
        (start) => start + offset,
      );

      const newExecutionContextStartTime = (
        retrieval.timingInfo.executionContextStartTime ?? []
      ).map((start) => start + offset);

      const newTimingInfo = {
        ...retrieval.timingInfo,
        startTime: newStartTime,
        executionContextStartTime: newExecutionContextStartTime,
      };

      maxEndTime = Math.max(
        maxEndTime,
        ...newStartTime.map(
          (start, index) => start + retrieval.timingInfo.elapsedTime[index],
        ),
        ...newExecutionContextStartTime.map(
          (start, index) =>
            start + retrieval.timingInfo.executionContextElapsedTime[index],
        ),
      );

      return { ...retrieval, timingInfo: newTimingInfo };
    });

    offset = maxEndTime;

    return {
      ...pass,
      aggregateRetrievals: newAggregateRetrievals,
      databaseRetrievals: newDatabaseRetrievals,
    };
  });
}
