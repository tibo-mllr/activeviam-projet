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

export type Timeline = Record<number, TimelineTiming[]>;

export const TIMELINE_COLORS: Record<string, string> = {
  AggregateRetrieval: "secondary.dark",
  AggregateRetrievalExecutionContext: "secondary.light",
  DatabaseRetrieval: "primary.dark",
  DatabaseRetrievalExecutionContext: "primary.light",
};

export const TIMELINE_MAX_GREEN: number = 175;
export const TIMELINE_MIN_GREEN: number = 50;
export const TIMELINE_MAX_RED: number = 255;
export const TIMELINE_MIN_RED: number = 0;
