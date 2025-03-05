import { AggregateRetrieval, DatabaseRetrieval, QueryPlan } from "../types";
import { aggregateData } from "./aggregateData";

const emptyQueryplan: QueryPlan = {
  aggregateRetrievals: [],
  databaseDependencies: {},
  databaseRetrievals: [],
  dependencies: {},
  planInfo: {
    aggregatesCache: "",
    branch: "",
    contextValues: {
      IAsOfEpoch: "",
      IBranch: "",
      IQueriesResultLimit: "",
      IQueryMonitoring: "",
      ISubCubeProperties: "",
    },
    continuous: false,
    epoch: "",
    globalTimings: {},
    mdxPass: "Aggregation",
    missedPrefetchBehavior: "",
    pivotId: "",
    pivotType: "",
    rangeSharing: 0,
    retrieverType: "",
  },
  queryFilters: [],
  querySummary: {
    measures: [],
    partialProviders: [],
    partitioningCountByType: {},
    resultSizeByPartitioning: {},
    retrievalsCountByType: {},
    totalDatabaseResultSize: 0,
    totalRetrievals: 0,
  },
};

const aggregateRetrievals: AggregateRetrieval[] = [
  {
    retrievalId: 0,
    partialProviderName: "N/A",
    type: "PrimitiveAnalysisAggregationRetrieval",
    partitioning: "Constant partitioning",
    location: [
      {
        dimension: "Time",
        hierarchy: "HistoricalDates",
        level: ["AsOfDate"],
        path: ["2025-01-04"],
      },
      {
        dimension: "TargetCurrency",
        hierarchy: "TargetCurrency",
        level: ["TargetCurrency"],
        path: ["ZAR"],
      },
    ],
    measures: ["vega.SUM", "theta.SUM"],
    filterId: 0,
    measureProvider: "SimpleMeasuresProvider",
    resultSizes: [1],
    timingInfo: {
      aggregationProcedureTime: [0],
      startTime: [0],
      elapsedTime: [37],
      executionContextStartTime: [0],
      executionContextElapsedTime: [10],
    },
    underlyingDataNodes: [],
  },
];

const databaseRetrievals: DatabaseRetrieval[] = [
  {
    store: "Forex",
    fields: ["Currency", "TargetCurrency"],
    joinedMeasure: [],
    condition: "`TargetCurrency` = ZAR",
    retrievalId: 0,
    resultSizes: [6],
    timingInfo: {
      startTime: [8],
      elapsedTime: [1],
    },
  },
  {
    store: "Forex",
    fields: ["Currency", "TargetCurrency"],
    joinedMeasure: [],
    condition: "`TargetCurrency` = ZAR",
    retrievalId: 1,
    resultSizes: [1],
    timingInfo: {
      aggregationProcedureTime: [0],
      executionContextStartTime: [10],
      executionContextElapsedTime: [10],
    },
  },
];

describe("aggregateData", () => {
  it("gives nothing when given nothing", () => {
    const result = aggregateData([]);

    expect(result).toEqual(emptyQueryplan);
  });

  it("gives back a query plan when given one", () => {
    const result = aggregateData([
      { ...emptyQueryplan, aggregateRetrievals, databaseRetrievals },
    ]);

    const expected: QueryPlan = {
      ...emptyQueryplan,
      aggregateRetrievals,
      databaseRetrievals,
    };

    expect(result).toEqual(expected);
  });

  it("gives back a query plan when given two", () => {
    const result = aggregateData([
      { ...emptyQueryplan, aggregateRetrievals, databaseRetrievals },
      { ...emptyQueryplan, aggregateRetrievals, databaseRetrievals },
    ]);

    const expected: QueryPlan = {
      ...emptyQueryplan,
      aggregateRetrievals: aggregateRetrievals.concat(aggregateRetrievals),
      databaseRetrievals: databaseRetrievals.concat(databaseRetrievals),
    };

    expect(result).toEqual(expected);
  });
});
