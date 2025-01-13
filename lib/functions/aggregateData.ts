import { AggregateRetrieval, DatabaseRetrieval, QueryPlan } from "../types";

// the objective is to return an object of type QueryPlan that contains all the data
export function aggregateData(queryPlan: QueryPlan[]) {
  let aggregatedMeasures: string[] = [];
  let aggregatedPartialProviders: string[] = [];
  let aggregatedRetrievalsCountsByType: Record<string, number> = {};
  let aggregatedGlobalTimings: Record<string, number> = {};
  let aggregatedTotalRetrievals: number = 0;
  let aggregatedAggregateRetrievals: AggregateRetrieval[] = [];
  let aggregatedDatabaseRetrievals: DatabaseRetrieval[] = [];

  queryPlan.forEach((element) => {
    // aggregating unique measures (excluding if appears twice)
    aggregatedMeasures = Array.from(
      new Set([
        ...aggregatedMeasures,
        ...(element.querySummary.measures !== undefined
          ? element.querySummary.measures
          : []),
      ]),
    );
    // aggregating unique partial providers (excluding if appears twice)
    aggregatedMeasures = Array.from(
      new Set([
        ...aggregatedPartialProviders,
        ...(element.querySummary.partialProviders !== undefined
          ? element.querySummary.partialProviders
          : []),
      ]),
    );
    // aggregating global timings (sum)
    if (element.planInfo.globalTimings != undefined) {
      Object.entries(element.planInfo.globalTimings).forEach(([key, value]) => {
        if (key in aggregatedGlobalTimings) {
          aggregatedGlobalTimings[key] += value;
        } else {
          aggregatedGlobalTimings[key] = value;
        }
      });
    }

    // aggregating retrievals by type (sum)
    if (element.querySummary.retrievalsCountByType != undefined) {
      Object.entries(element.querySummary.retrievalsCountByType).forEach(
        ([key, value]) => {
          if (key in aggregatedRetrievalsCountsByType) {
            aggregatedRetrievalsCountsByType[key] += value;
          } else {
            aggregatedRetrievalsCountsByType[key] = value;
          }
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
