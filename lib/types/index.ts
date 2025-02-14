export * from "./queryPlan";
export * from "./timeline";

export type ProcessedNode = {
  id: number;
  type: "Aggregate" | "Database";
  timing: number;
  parallelCount: number;
  mean: number;
  stdDev: number;
};

type PiePartData = {
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
