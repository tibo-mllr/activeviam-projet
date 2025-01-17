import {
  AggregateRetrieval,
  DatabaseRetrieval,
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
      startTime: [10],
      elapsedTime: [10],
    },
  },
];

describe("getSlowestNodes", () => {
  it("gives nothing when given nothing", () => {
    const result = getSlowestNodes([], [], 1);
    expect(result).toEqual([]);
  });

  it("gives the slowest node when given one", () => {
    const result = getSlowestNodes(aggregateRetrievals, [], 1);

    const expected: ProcessedNode[] = [
      {
        id: "Aggregate 0",
        type: "Aggregate",
        timing: 37,
      },
    ];

    expect(result).toEqual(expected);
  });

  it("gives the slowest node when given two", () => {
    const result = getSlowestNodes([], databaseRetrievals, 1);

    const expected: ProcessedNode[] = [
      {
        id: "Database 1",
        type: "Database",
        timing: 10,
      },
    ];

    expect(result).toEqual(expected);
  });

  it("gives the slowest nodes", () => {
    const result = getSlowestNodes(aggregateRetrievals, databaseRetrievals, 2);

    const expected: ProcessedNode[] = [
      {
        id: "Aggregate 0",
        type: "Aggregate",
        timing: 37,
      },
      {
        id: "Database 1",
        type: "Database",
        timing: 10,
      },
    ];

    expect(result).toEqual(expected);
  });
});
