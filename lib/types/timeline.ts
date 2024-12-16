export type TimelineTiming = {
  type:
    | "AggregateRetrieval"
    | "AggregateRetrievalExecutionContext"
    | "DatabaseRetrieval";
  retrievalId: number;
  start: number;
  end: number;
};

export type Timeline = Record<number, TimelineTiming[]>;
