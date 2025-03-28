import {
  AggregateRetrieval,
  DatabaseRetrieval,
  emptyQueryPlan,
  Timeline,
} from "@/lib/types";
import { buildTimeline } from "./buildTimeline";

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

describe("buildTimeline", () => {
  it("gives nothing when given nothing", () => {
    const result = buildTimeline(emptyQueryPlan);
    expect(result).toEqual({
      maxDuration: 0,
      minDuration: Number.MAX_SAFE_INTEGER,
      totalProcesses: 0,
    });
  });

  it("builds a timeline from aggregate retrievals", () => {
    const result = buildTimeline({
      ...emptyQueryPlan,
      aggregateRetrievals,
    });

    const expected: Timeline = {
      "0": [
        {
          start: 0,
          end: 37,
          retrievalId: 0,
          type: "AggregateRetrieval",
          pass: "",
        },
      ],
      "1": [
        {
          end: 10,
          retrievalId: 0,
          start: 0,
          type: "AggregateRetrievalExecutionContext",
          pass: "",
        },
      ],
      minDuration: 10,
      maxDuration: 37,
      totalProcesses: 2,
    };

    expect(result).toEqual(expected);
  });

  it("builds a timeline from database retrievals", () => {
    const result = buildTimeline({
      ...emptyQueryPlan,
      databaseRetrievals,
    });

    const expected: Timeline = {
      "0": [
        {
          start: 8,
          end: 9,
          retrievalId: 0,
          type: "DatabaseRetrieval",
          pass: "",
        },
        {
          start: 10,
          end: 20,
          retrievalId: 1,
          type: "DatabaseRetrievalExecutionContext",
          pass: "",
        },
      ],
      minDuration: 1,
      maxDuration: 10,
      totalProcesses: 2,
    };

    expect(result).toEqual(expected);
  });

  it("builds a timeline from both aggregate and database retrievals", () => {
    const result = buildTimeline({
      ...emptyQueryPlan,
      aggregateRetrievals,
      databaseRetrievals,
    });

    const expected: Timeline = {
      "0": [
        {
          start: 0,
          end: 37,
          retrievalId: 0,
          type: "AggregateRetrieval",
          pass: "",
        },
      ],
      "1": [
        {
          start: 0,
          end: 10,
          retrievalId: 0,
          type: "AggregateRetrievalExecutionContext",
          pass: "",
        },
        {
          start: 10,
          end: 20,
          retrievalId: 1,
          type: "DatabaseRetrievalExecutionContext",
          pass: "",
        },
      ],
      "2": [
        {
          end: 9,
          retrievalId: 0,
          start: 8,
          type: "DatabaseRetrieval",
          pass: "",
        },
      ],
      minDuration: 1,
      maxDuration: 37,
      totalProcesses: 4,
    };

    expect(result).toEqual(expected);
  });

  it("builds a timeline from both aggregate and database retrievals without duplicates", () => {
    aggregateRetrievals.push(aggregateRetrievals[0]);

    const result = buildTimeline({
      ...emptyQueryPlan,
      aggregateRetrievals,
      databaseRetrievals,
    });

    const expected: Timeline = {
      "0": [
        {
          start: 0,
          end: 37,
          retrievalId: 0,
          type: "AggregateRetrieval",
          pass: "",
        },
      ],
      "1": [
        {
          start: 0,
          end: 10,
          retrievalId: 0,
          type: "AggregateRetrievalExecutionContext",
          pass: "",
        },
        {
          start: 10,
          end: 20,
          retrievalId: 1,
          type: "DatabaseRetrievalExecutionContext",
          pass: "",
        },
      ],
      "2": [
        {
          end: 9,
          retrievalId: 0,
          start: 8,
          type: "DatabaseRetrieval",
          pass: "",
        },
      ],
      minDuration: 1,
      maxDuration: 37,
      totalProcesses: 4,
    };

    expect(result).toEqual(expected);
  });
});
