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
  pass: string;
};

export type Timeline = Record<number, TimelineTiming[]> & {
  minDuration: number;
  maxDuration: number;
  totalProcesses: number;
};

export const TIMELINE_COLORS: Record<string, string> = {
  AggregateRetrieval: "secondary.dark",
  AggregateRetrievalExecutionContext: "gold",
  DatabaseRetrieval: "primary.dark",
  DatabaseRetrievalExecutionContext: "primary.light",
};
