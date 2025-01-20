import { QueryPlan, Summary } from "@/lib/types";

export function buildSummary(queryPlan: QueryPlan): Summary {
  const {
    aggregateRetrievals,
    databaseRetrievals,
    querySummary: { retrievalsCountByType },
  } = queryPlan;

  // Data records about the retrievals
  const groupedRetrievalsElapsedTimings: Record<string, number> = {
    Database: 0,
    Engine: 0,
    Network: 0,
    Providers: 0,
  };
  const groupedRetrievalsExecutionContextElapsedTimings: Record<
    string,
    number
  > = {
    Database: 0,
    Engine: 0,
    Network: 0,
    Providers: 0,
  };
  const groupedRetrievalsTypeCounts: Record<string, number> = {
    Database: 0,
    Engine: 0,
    Network: 0,
    Providers: 0,
  };

  // Detailed data (not grouped) about the retrievals
  // There is an aggregate retrievals variable and a database retrievals variable
  // aggregate
  const aggregateRetrievalsElapsedTimings: Record<string, number> = {};
  const aggregateRetrievalsExecutionContextElapsedTimings: Record<
    string,
    number
  > = {};

  // Database: only one type and it needs to be directly specified since it is not in the JSON
  const databaseRetrievalsElapsedTimings = {
    DatabaseRetrieval: 0,
  };
  const databaseRetrievalsExecutionContextElapsedTimings = {
    DatabaseRetrieval: 0,
  };
  const retrievalsTypeCounts = retrievalsCountByType;

  // Filling the records
  aggregateRetrievals.forEach(({ timingInfo, type }) => {
    const elapsedTimeSum = timingInfo.elapsedTime.reduce(
      (acc, num) => acc + num,
      0,
    );

    aggregateRetrievalsElapsedTimings[type] =
      (aggregateRetrievalsElapsedTimings[type] ?? 0) + elapsedTimeSum;

    if (type == "JITPrimitiveAggregatesRetrieval")
      groupedRetrievalsElapsedTimings["Database"] += elapsedTimeSum;
    else if (type == "PartialPrimitiveAggregatesRetrieval")
      groupedRetrievalsElapsedTimings["Providers"] += elapsedTimeSum;
    else groupedRetrievalsElapsedTimings["Engine"] += elapsedTimeSum;

    if (timingInfo.executionContextElapsedTime !== undefined) {
      const executionContextElapsedTimeSum =
        timingInfo.executionContextElapsedTime.reduce(
          (acc, num) => acc + num,
          0,
        );

      aggregateRetrievalsExecutionContextElapsedTimings[type] =
        (aggregateRetrievalsExecutionContextElapsedTimings[type] ?? 0) +
        executionContextElapsedTimeSum;

      if (type == "JITPrimitiveAggregatesRetrieval")
        groupedRetrievalsExecutionContextElapsedTimings["Database"] +=
          executionContextElapsedTimeSum;
      else if (type == "PartialPrimitiveAggregatesRetrieval")
        groupedRetrievalsExecutionContextElapsedTimings["Providers"] +=
          executionContextElapsedTimeSum;
      else
        groupedRetrievalsExecutionContextElapsedTimings["Engine"] +=
          executionContextElapsedTimeSum;
    }
  });

  databaseRetrievals.forEach(({ timingInfo }) => {
    const databaseRetrievalsElapsedTime = timingInfo.elapsedTime.reduce(
      (acc, num) => acc + num,
      0,
    );
    groupedRetrievalsElapsedTimings["Database"] +=
      databaseRetrievalsElapsedTime;
    databaseRetrievalsElapsedTimings["DatabaseRetrieval"] +=
      databaseRetrievalsElapsedTime;

    if (timingInfo.executionContextElapsedTime !== undefined) {
      const databaseRetrievalsExecutionContextElapsedTime =
        timingInfo.executionContextElapsedTime.reduce(
          (acc, num) => acc + num,
          0,
        );
      groupedRetrievalsExecutionContextElapsedTimings["Database"] +=
        databaseRetrievalsExecutionContextElapsedTime;
      databaseRetrievalsExecutionContextElapsedTimings["DatabaseRetrieval"] +=
        databaseRetrievalsExecutionContextElapsedTime;
    }
  });

  Object.entries(retrievalsTypeCounts).forEach(([key, value]) => {
    if (
      key === "JITPrimitiveAggregatesRetrieval" ||
      key === "DatabaseRetrieval"
    )
      groupedRetrievalsTypeCounts["Database"] += value;
    else if (key === "PartialPrimitiveAggregatesRetrieval")
      groupedRetrievalsTypeCounts["Providers"] += value;
    else groupedRetrievalsTypeCounts["Engine"] += value;
  });

  return {
    groupedRetrievalsElapsedTimings,
    groupedRetrievalsExecutionContextElapsedTimings,
    groupedRetrievalsTypeCounts,
    aggregateRetrievalsElapsedTimings,
    aggregateRetrievalsExecutionContextElapsedTimings,
    databaseRetrievalsElapsedTimings,
    databaseRetrievalsExecutionContextElapsedTimings,
    retrievalsTypeCounts,
  };
}
