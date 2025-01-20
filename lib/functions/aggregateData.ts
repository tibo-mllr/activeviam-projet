import { AggregateRetrieval, DatabaseRetrieval, QueryPlan } from "../types";

// the objective is to return an object of type QueryPlan that contains all the data
// the page will be able to display it.
export function aggregateData(queryPlan: QueryPlan[]): QueryPlan {
  let aggregatedMeasures: string[] = [];
  let aggregatedPartialProviders: string[] = [];
  const aggregatedRetrievalsCountsByType: Record<string, number> = {};
  const aggregatedGlobalTimings: Record<string, number> = {};
  let aggregatedTotalRetrievals: number = 0;
  const aggregatedAggregateRetrievals: AggregateRetrieval[] = [];
  const aggregatedDatabaseRetrievals: DatabaseRetrieval[] = [];

  queryPlan.forEach((element) => {
    // aggregating unique measures (excluding if appears twice)
    aggregatedMeasures = Array.from(
      new Set([
        ...aggregatedMeasures,
        ...(element.querySummary.measures ?? []),
      ]),
    );
    // aggregating unique partial providers (excluding if appears twice)
    aggregatedPartialProviders = Array.from(
      new Set([
        ...aggregatedPartialProviders,
        ...(element.querySummary.partialProviders ?? []),
      ]),
    );
    // aggregating global timings (sum)
    if (element.planInfo.globalTimings != undefined) {
      Object.entries(element.planInfo.globalTimings).forEach(([key, value]) => {
        aggregatedGlobalTimings[key] =
          (aggregatedGlobalTimings[key] ?? 0) + value;
      });
    }

    // aggregating retrievals by type (sum)
    if (element.querySummary.retrievalsCountByType != undefined) {
      Object.entries(element.querySummary.retrievalsCountByType).forEach(
        ([key, value]) => {
          aggregatedRetrievalsCountsByType[key] =
            (aggregatedRetrievalsCountsByType[key] ?? 0) + value;
        },
      );
    }
    // aggregating totalRetrievals value
    aggregatedTotalRetrievals += element.querySummary.totalRetrievals;

    // aggregating aggregate retrievals data
    aggregatedAggregateRetrievals.push(...element.aggregateRetrievals);
    // aggregating database retrievals data
    aggregatedDatabaseRetrievals.push(...element.databaseRetrievals);
  });

  const aggregatedQueryPlan: QueryPlan = {
    planInfo: {
      pivotType: "",
      pivotId: "",
      epoch: "",
      branch: "",
      retrieverType: "",
      mdxPass: "Aggregation",
      contextValues: {
        IBranch: "",
        ISubCubeProperties: "",
        IAsOfEpoch: "",
        IQueryMonitoring: "",
        IQueriesResultLimit: "",
      },
      rangeSharing: 0,
      missedPrefetchBehavior: "",
      aggregatesCache: "",
      globalTimings: aggregatedGlobalTimings,
      continuous: false,
    },
    aggregateRetrievals: aggregatedAggregateRetrievals,
    dependencies: {},
    databaseRetrievals: aggregatedDatabaseRetrievals,
    databaseDependencies: {},
    queryFilters: [],
    querySummary: {
      measures: aggregatedMeasures,
      totalRetrievals: aggregatedTotalRetrievals,
      retrievalsCountByType: aggregatedRetrievalsCountsByType,
      partitioningCountByType: {},
      resultSizeByPartitioning: {},
      partialProviders: aggregatedPartialProviders,
      totalDatabaseResultSize: 0,
    },
  };

  return aggregatedQueryPlan;
}
