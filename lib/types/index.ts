export * from "./queryPlan";
export * from "./timeline";

export type ProcessedNode = {
  id: number;
  type: "Aggregate" | "Database";
  maxTiming: number;
  totalTiming: number;
  parallelCount: number;
  mean: number;
  stdDev: number;
  pass: string;
};

export type PiePartData = {
  name: string;
  value: number;
  fill: string;
};

export type PieChartData = {
  pieDataElapsedTimings: PiePartData[];
  pieDataRetrievalsTypeCounts: PiePartData[];
  groupedPieDataElaspedTimings: PiePartData[];
  groupedPieDataRetrievalsTypeCounts: PiePartData[];
  retrievalsColors: Record<string, string>;
};

export type Summary = {
  groupedRetrievalsElapsedTimings: Record<string, number>;
  groupedRetrievalsExecutionContextElapsedTimings: Record<string, number>;
  groupedRetrievalsTypeCounts: Record<string, number>;
  aggregateRetrievalsElapsedTimings: Record<string, number>;
  aggregateRetrievalsExecutionContextElapsedTimings: Record<string, number>;
  databaseRetrievalsElapsedTimings: Record<string, number>;
  databaseRetrievalsExecutionContextElapsedTimings: Record<string, number>;
  retrievalsTypeCounts: Record<string, number>;
};

export const MAX_GREEN: number = 175;
export const MIN_GREEN: number = 50;
export const MAX_RED: number = 255;
export const MIN_RED: number = 0;
