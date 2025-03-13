import {
  AggregateRetrieval,
  DatabaseRetrieval,
  emptyQueryPlan,
  ProcessedNode,
} from "@/lib/types";
import { getSlowestNodes } from "./slowestNodes";

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
      startTime: [10, 15],
      elapsedTime: [10, 20],
    },
  },
];

describe("getSlowestNodes", () => {
  it("gives nothing when given nothing", () => {
    const result = getSlowestNodes(emptyQueryPlan, 1);
    expect(result).toEqual({
      minDuration: 0,
      maxDuration: 0,
      processedNodes: [],
    });
  });

  it("gives the slowest node when given one", () => {
    const result = getSlowestNodes(
      { ...emptyQueryPlan, aggregateRetrievals },
      1,
    );

    const expected: {
      minDuration: number;
      maxDuration: number;
      processedNodes: ProcessedNode[];
    } = {
      minDuration: 37,
      maxDuration: 37,
      processedNodes: [
        {
          id: 0,
          maxTiming: 37,
          mean: 37,
          parallelCount: 1,
          pass: "",
          stdDev: 0,
          totalTiming: 37,
          type: "Aggregate",
        },
      ],
    };

    expect(result).toEqual(expected);
  });

  it("gives the slowest node when given two", () => {
    const result = getSlowestNodes(
      { ...emptyQueryPlan, databaseRetrievals },
      1,
    );

    const expected: {
      minDuration: number;
      maxDuration: number;
      processedNodes: ProcessedNode[];
    } = {
      minDuration: 1,
      maxDuration: 25,
      processedNodes: [
        {
          id: 1,
          maxTiming: 20,
          mean: 15,
          parallelCount: 2,
          pass: "",
          stdDev: 5,
          totalTiming: 25,
          type: "Database",
        },
      ],
    };

    expect(result).toEqual(expected);
  });

  it("gives the slowest nodes", () => {
    const result = getSlowestNodes(
      { ...emptyQueryPlan, aggregateRetrievals, databaseRetrievals },
      2,
    );

    const expected: {
      minDuration: number;
      maxDuration: number;
      processedNodes: ProcessedNode[];
    } = {
      maxDuration: 37,
      minDuration: 1,
      processedNodes: [
        {
          id: 0,
          maxTiming: 37,
          mean: 37,
          parallelCount: 1,
          pass: "",
          stdDev: 0,
          totalTiming: 37,
          type: "Aggregate",
        },
        {
          id: 1,
          maxTiming: 20,
          mean: 15,
          parallelCount: 2,
          pass: "",
          stdDev: 5,
          totalTiming: 25,
          type: "Database",
        },
      ],
    };

    expect(result).toEqual(expected);
  });
});
