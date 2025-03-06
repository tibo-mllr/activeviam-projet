import {
  AggregateRetrieval,
  emptyAggregateRetrieval,
  emptyQueryPlan,
  QueryPlan,
} from "../types";
import { adjustTimings } from "./adjustTimings";

const aggregateRetrievals: AggregateRetrieval[] = [
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

const pass: QueryPlan = {
  ...emptyQueryPlan,
  aggregateRetrievals,
};

describe("adjustTimings", () => {
  it("gives nothing when given nothing", () => {
    const result = adjustTimings([]);

    expect(result).toEqual([]);
  });

  it("gives back the same query plan when there is only one pass", () => {
    const result = adjustTimings([pass]);

    const expected: QueryPlan[] = [pass];

    expect(result).toEqual(expected);
  });

  it("gives the adjusted query plan", () => {
    const result = adjustTimings([pass, pass]);

    const expected: QueryPlan[] = [
      pass,
      {
        ...emptyQueryPlan,
        aggregateRetrievals: [
          {
            ...emptyAggregateRetrieval,
            timingInfo: {
              startTime: [37, 57],
              elapsedTime: [37, 12],
              executionContextStartTime: [37, 42],
              executionContextElapsedTime: [10, 5],
            },
          },
        ],
      },
    ];

    expect(result).toEqual(expected);
  });
});
