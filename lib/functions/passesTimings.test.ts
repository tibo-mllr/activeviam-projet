import {
  AggregateRetrieval,
  DatabaseRetrieval,
  emptyAggregateRetrieval,
  emptyDatabaseRetrieval,
  emptyPlanInfo,
  emptyQueryPlan,
  QueryPlan,
} from "@/lib/types";
import { getPassesTimings, PassTiming } from "./passesTimings";

const firstAggregateRetrievals: AggregateRetrieval[] = [
  {
    ...emptyAggregateRetrieval,
    timingInfo: {
      startTime: [0, 20],
      elapsedTime: [37, 12],
      executionContextStartTime: [0, 5],
      executionContextElapsedTime: [10, 5],
    },
  },
];

const firstPass: QueryPlan = {
  ...emptyQueryPlan,
  planInfo: {
    ...emptyPlanInfo,
    mdxPass: "First pass",
  },
  aggregateRetrievals: firstAggregateRetrievals,
};

const secondAggregateRetrievals: AggregateRetrieval[] = [
  {
    ...emptyAggregateRetrieval,
    timingInfo: {
      startTime: [0, 20, 12],
      elapsedTime: [4, 13, 12],
      executionContextStartTime: [0, 10],
      executionContextElapsedTime: [5, 5],
    },
  },
];

const secondDatabaseRetrievals: DatabaseRetrieval[] = [
  {
    ...emptyDatabaseRetrieval,
    timingInfo: {
      startTime: [10, 12, 12],
      elapsedTime: [2, 4, 5],
      executionContextStartTime: [0, 0],
      executionContextElapsedTime: [0, 0],
    },
  },
  {
    ...emptyDatabaseRetrieval,
    timingInfo: {
      startTime: [50, 40],
      elapsedTime: [10, 10],
      executionContextStartTime: [20, 35],
      executionContextElapsedTime: [10, 10],
    },
  },
];

const secondPass: QueryPlan = {
  ...emptyQueryPlan,
  planInfo: {
    ...emptyPlanInfo,
    mdxPass: "Second pass",
  },
  aggregateRetrievals: secondAggregateRetrievals,
  databaseRetrievals: secondDatabaseRetrievals,
};

describe("passesTimings", () => {
  it("gives nothing when given nothing", () => {
    const result = getPassesTimings([]);

    expect(result).toEqual([]);
  });

  it("gives the timing of the pass when given one", () => {
    const result = getPassesTimings([firstPass]);

    const expected: PassTiming[] = [
      {
        passName: "First pass",
        totalTiming: 37,
      },
    ];

    expect(result).toEqual(expected);
  });

  it("gives two timing when given two passes", () => {
    const result = getPassesTimings([firstPass, secondPass]);

    const expected: PassTiming[] = [
      {
        passName: "First pass",
        totalTiming: 37,
      },
      {
        passName: "Second pass",
        totalTiming: 60,
      },
    ];

    expect(result).toEqual(expected);
  });
});
