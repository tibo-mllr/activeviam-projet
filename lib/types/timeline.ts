export type TimingType =
  | "AggregateRetrieval"
  | "AggregateRetrievalExecutionContext"
  | "DatabaseRetrieval"
  | "DatabaseRetrievalExecutionContext";

export type TimelineTiming = {
  type: TimingType;
  retrievalId: number;
  start: number;
  end: number;
};

export type Timeline = Record<number, TimelineTiming[]>;
