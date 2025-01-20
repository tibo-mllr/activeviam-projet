import { PieChartData, QueryPlan, Summary } from "@/lib/types";

const COLORS = [
  "#800080",
  "#FFA500",
  "#0000FF",
  "#FF0000",
  "#00FF00",
  "#FFFF00",
  "#808080",
  "#A52A2A",
];

export const GROUP_COLORS: Record<string, string> = {
  Database: COLORS[0],
  Engine: COLORS[1],
  Network: COLORS[2],
  Providers: COLORS[3],
};

export function buildPieCharts(
  queryPlanRetrievalsCountByType: QueryPlan["querySummary"]["retrievalsCountByType"],
  summary: Summary,
): PieChartData {
  const {
    aggregateRetrievalsElapsedTimings,
    databaseRetrievalsElapsedTimings,
    groupedRetrievalsElapsedTimings,
    groupedRetrievalsTypeCounts,
    retrievalsTypeCounts,
  } = summary;

  // Associating a color for each retrieval type
  let colorIndex = 0;
  const retrievalsColors: Record<string, string> = {};
  Object.entries(queryPlanRetrievalsCountByType).forEach(([key]) => {
    retrievalsColors[key] = COLORS[colorIndex % COLORS.length];
    colorIndex++;
  });

  const pieDataElapsedTimings = [
    ...Object.entries(aggregateRetrievalsElapsedTimings)
      .sort((a, b) => b[1] - a[1])
      .map(([key, value]) => ({
        name: key,
        value,
        fill: retrievalsColors[key],
      })),
    ...Object.entries(databaseRetrievalsElapsedTimings)
      .sort((a, b) => b[1] - a[1])
      .map(([key, value]) => ({
        name: key,
        value,
        fill: retrievalsColors[key],
      })),
  ];

  const groupedPieDataElaspedTimings = Object.entries(
    groupedRetrievalsElapsedTimings,
  )
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => ({
      name: key,
      value,
      fill: GROUP_COLORS[key],
    }));

  const pieDataRetrievalsTypeCounts = Object.entries(retrievalsTypeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => ({
      name: key,
      value,
      fill: retrievalsColors[key],
    }));

  const groupedPieDataRetrievalsTypeCounts = Object.entries(
    groupedRetrievalsTypeCounts,
  )
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => ({
      name: key,
      value,
      fill: GROUP_COLORS[key],
    }));

  return {
    pieDataElapsedTimings,
    pieDataRetrievalsTypeCounts,
    groupedPieDataElaspedTimings,
    groupedPieDataRetrievalsTypeCounts,
    retrievalsColors,
  };
}
