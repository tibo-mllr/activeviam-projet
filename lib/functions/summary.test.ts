import { QueryPlan } from "../types";
import { buildSummary, Summary } from "./summary";

const queryPlan: QueryPlan = {
  planInfo: {
    pivotType: "ActivePivotVersion",
    pivotId: "EquityDerivativesCube",
    epoch: "712956",
    branch: "master",
    retrieverType: "ActivePivotAggregatesRetriever",
    mdxPass: "SelectPass_0",
    contextValues: {
      IBranch: "null",
      ISubCubeProperties: "null",
      IAsOfEpoch: "null",
      IQueryMonitoring:
        "QueryMonitoring [printExecutionPlan=false, printExecutionTiming=false, queryPlanExport=true, queryPlanSummary=false, queryPlanCycleDetection=true]",
      IQueriesResultLimit:
        "QueriesResultLimit [transientLimit=5000000, intermediateLimit=5000000]",
    },
    rangeSharing: 1000000,
    missedPrefetchBehavior: "WARN",
    aggregatesCache: "capacity=1000, size=0",
    globalTimings: {
      executionContextCreationTime: 0,
      finalizationTime: 0,
      planningTime: 0,
      queryExecutionTime: 37,
    },
    continuous: false,
  },
  aggregateRetrievals: [
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
      },
      underlyingDataNodes: [],
    },
  ],
  dependencies: {},
  databaseRetrievals: [
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
        startTime: [11],
        elapsedTime: [13],
      },
    },
  ],
  databaseDependencies: {},
  queryFilters: [
    {
      id: 0,
      description:
        "CubeFilter#1796457083 with Intersected subCubeProperties: SubCubeProperties [grantedMeasures=ALL, grantedMembers={Hierarchy[Geography, City]=[[AllMember, IN - [Tokyo, Johannesburg, New York, Berlin]]]}]SubCubeProperties [grantedMeasures=ALL, grantedMembers={Hierarchy[CounterParty, CounterParty]=[[NOT - [TOSTRINGEQUAL - AllMember]], [AllMember, NOT - [TOSTRINGEQUAL - Cathay]]]}]SubCubeProperties [grantedMeasures=ALL, grantedMembers=ALL]",
    },
  ],
  querySummary: {
    measures: ["vega.SUM", "theta.SUM"],
    totalRetrievals: 3,
    retrievalsCountByType: {
      DatabaseRetrieval: 2,
      PrimitiveAnalysisAggregationRetrieval: 1,
      PartialPrimitiveAggregatesRetrieval: 0,
      PrimitiveResultsMerger: 0,
      RangeSharingPrimitiveAggregatesRetrieval: 0,
    },
    partitioningCountByType: {
      "value(AsOfDate) | modulo8(TradeId)": 3,
      "Constant partitioning": 4,
    },
    resultSizeByPartitioning: {
      "value(AsOfDate) | modulo8(TradeId)": 90,
      "Constant partitioning": 63,
    },
    partialProviders: ["LEAF-Provider-2"],
    totalDatabaseResultSize: 7,
  },
};

describe("buildSummary", () => {
  it("gives nothing when given nothing", () => {
    const result = buildSummary({
      planInfo: {
        pivotType: "",
        pivotId: "",
        epoch: "",
        branch: "",
        retrieverType: "",
        mdxPass: "",
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
        globalTimings: {
          executionContextCreationTime: 0,
          finalizationTime: 0,
          planningTime: 0,
          queryExecutionTime: 0,
        },
        continuous: false,
      },
      aggregateRetrievals: [],
      dependencies: {},
      databaseRetrievals: [],
      databaseDependencies: {},
      queryFilters: [],
      querySummary: {
        measures: [],
        totalRetrievals: 0,
        retrievalsCountByType: {
          DatabaseRetrieval: 0,
          PrimitiveAnalysisAggregationRetrieval: 0,
          PartialPrimitiveAggregatesRetrieval: 0,
          PrimitiveResultsMerger: 0,
          RangeSharingPrimitiveAggregatesRetrieval: 0,
        },
        partitioningCountByType: {},
        resultSizeByPartitioning: {},
        partialProviders: [],
        totalDatabaseResultSize: 0,
      },
    });

    const emptySummary: Summary = {
      aggregateRetrievalsElapsedTimings: {},
      aggregateRetrievalsExecutionContextElapsedTimings: {},
      databaseRetrievalsElapsedTimings: {
        DatabaseRetrieval: 0,
      },
      databaseRetrievalsExecutionContextElapsedTimings: {
        DatabaseRetrieval: 0,
      },
      groupedRetrievalsElapsedTimings: {
        Database: 0,
        Engine: 0,
        Network: 0,
        Providers: 0,
      },
      groupedRetrievalsExecutionContextElapsedTimings: {
        Database: 0,
        Engine: 0,
        Network: 0,
        Providers: 0,
      },
      groupedRetrievalsTypeCounts: {
        Database: 0,
        Engine: 0,
        Network: 0,
        Providers: 0,
      },
      retrievalsTypeCounts: {
        DatabaseRetrieval: 0,
        PartialPrimitiveAggregatesRetrieval: 0,
        PrimitiveAnalysisAggregationRetrieval: 0,
        PrimitiveResultsMerger: 0,
        RangeSharingPrimitiveAggregatesRetrieval: 0,
      },
    };
    expect(result).toEqual(emptySummary);
  });

  it("builds a summary from a query plan", () => {
    const result = buildSummary(queryPlan);

    const expected: Summary = {
      aggregateRetrievalsElapsedTimings: {
        PrimitiveAnalysisAggregationRetrieval: 37,
      },
      aggregateRetrievalsExecutionContextElapsedTimings: {},
      databaseRetrievalsElapsedTimings: {
        DatabaseRetrieval: 14,
      },
      databaseRetrievalsExecutionContextElapsedTimings: {
        DatabaseRetrieval: 10,
      },
      groupedRetrievalsElapsedTimings: {
        Database: 14,
        Engine: 37,
        Network: 0,
        Providers: 0,
      },
      groupedRetrievalsExecutionContextElapsedTimings: {
        Database: 10,
        Engine: 0,
        Network: 0,
        Providers: 0,
      },
      groupedRetrievalsTypeCounts: {
        Database: 2,
        Engine: 1,
        Network: 0,
        Providers: 0,
      },
      retrievalsTypeCounts: {
        DatabaseRetrieval: 2,
        PartialPrimitiveAggregatesRetrieval: 0,
        PrimitiveAnalysisAggregationRetrieval: 1,
        PrimitiveResultsMerger: 0,
        RangeSharingPrimitiveAggregatesRetrieval: 0,
      },
    };

    expect(result).toEqual(expected);
  });
});
