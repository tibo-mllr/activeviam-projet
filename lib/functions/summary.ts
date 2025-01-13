import { QueryPlan } from "../types";

type Summary = {
  groupedRetrievalsElapsedTimings: Record<string, number>;
  groupedRetrievalsExecutionContextElapsedTimings: Record<string, number>;
  groupedRetrievalsTypeCounts: Record<string, number>;
  aggregateRetrievalsElapsedTimings: Record<string, number>;
  aggregateRetrievalsExecutionContextElapsedTimings: Record<string, number>;
  databaseRetrievalsElapsedTimings: Record<string, number>;
  databaseRetrievalsExecutionContextElapsedTimings: Record<string, number>;
  retrievalsTypeCounts: Record<string, number>;
};

export function buildSummary(queryPlan: QueryPlan): Summary {
  const {
    aggregateRetrievals,
    databaseRetrievals,
    querySummary: { retrievalsCountByType },
  } = queryPlan;

  // Data records about the retrievals
  const groupedRetrievalsElapsedTimings: Record<string, number> = {
    Database: 0,
    Engine: 0,
    Network: 0,
    Providers: 0,
  };
  const groupedRetrievalsExecutionContextElapsedTimings: Record<
    string,
    number
  > = {
    Database: 0,
    Engine: 0,
    Network: 0,
    Providers: 0,
  };
  const groupedRetrievalsTypeCounts: Record<string, number> = {
    Database: 0,
    Engine: 0,
    Network: 0,
    Providers: 0,
  };

  // Detailed data (not grouped) about the retrievals
  // There is an aggregate retrievals variable and a database retrievals variable
  // aggregate
  const aggregateRetrievalsElapsedTimings: Record<string, number> = {};
  const aggregateRetrievalsExecutionContextElapsedTimings: Record<
    string,
    number
  > = {};

  // Database: only one type and it needs to be directly specified since it is not in the JSON
  const databaseRetrievalsElapsedTimings = {
    DatabaseRetrieval: 0,
  };
  const databaseRetrievalsExecutionContextElapsedTimings = {
    DatabaseRetrieval: 0,
  };
  const retrievalsTypeCounts = retrievalsCountByType;

  // Filling the records
  aggregateRetrievals.forEach(({ timingInfo, type }) => {
    const elapsedTimeSum = timingInfo.elapsedTime.reduce(
      (acc, num) => acc + num,
      0,
    );

    aggregateRetrievalsElapsedTimings[type] =
      (aggregateRetrievalsElapsedTimings[type] ?? 0) + elapsedTimeSum;

    if (type == "JITPrimitiveAggregatesRetrieval")
      groupedRetrievalsElapsedTimings["Database"] += elapsedTimeSum;
    else if (type == "PartialPrimitiveAggregatesRetrieval")
      groupedRetrievalsElapsedTimings["Providers"] += elapsedTimeSum;
    else groupedRetrievalsElapsedTimings["Engine"] += elapsedTimeSum;

    if (timingInfo.executionContextElapsedTime !== undefined) {
      const executionContextElapsedTimeSum =
        timingInfo.executionContextElapsedTime.reduce(
          (acc, num) => acc + num,
          0,
        );

      aggregateRetrievalsExecutionContextElapsedTimings[type] =
        (aggregateRetrievalsExecutionContextElapsedTimings[type] ?? 0) +
        executionContextElapsedTimeSum;

      if (type == "JITPrimitiveAggregatesRetrieval")
        groupedRetrievalsExecutionContextElapsedTimings["Database"] +=
          executionContextElapsedTimeSum;
      else if (type == "PartialPrimitiveAggregatesRetrieval")
        groupedRetrievalsExecutionContextElapsedTimings["Providers"] +=
          executionContextElapsedTimeSum;
      else
        groupedRetrievalsExecutionContextElapsedTimings["Engine"] +=
          executionContextElapsedTimeSum;
    }
  });

  databaseRetrievals.forEach(({ timingInfo }) => {
    const databaseRetrievalsElapsedTime = timingInfo.elapsedTime.reduce(
      (acc, num) => acc + num,
      0,
    );
    groupedRetrievalsElapsedTimings["Database"] +=
      databaseRetrievalsElapsedTime;
    databaseRetrievalsElapsedTimings["DatabaseRetrieval"] +=
      databaseRetrievalsElapsedTime;

    if (timingInfo.executionContextElapsedTime !== undefined) {
      const databaseRetrievalsExecutionContextElapsedTime =
        timingInfo.executionContextElapsedTime.reduce(
          (acc, num) => acc + num,
          0,
        );
      groupedRetrievalsExecutionContextElapsedTimings["Database"] +=
        databaseRetrievalsExecutionContextElapsedTime;
      databaseRetrievalsExecutionContextElapsedTimings["DatabaseRetrieval"] +=
        databaseRetrievalsExecutionContextElapsedTime;
    }
  });

  Object.entries(retrievalsTypeCounts).forEach(([key, value]) => {
    if (
      key === "JITPrimitiveAggregatesRetrieval" ||
      key === "DatabaseRetrieval"
    )
      groupedRetrievalsTypeCounts["Database"] += value;
    else if (key === "PartialPrimitiveAggregatesRetrieval")
      groupedRetrievalsTypeCounts["Providers"] += value;
    else groupedRetrievalsTypeCounts["Engine"] += value;
  });

  return {
    groupedRetrievalsElapsedTimings,
    groupedRetrievalsExecutionContextElapsedTimings,
    groupedRetrievalsTypeCounts,
    aggregateRetrievalsElapsedTimings,
    aggregateRetrievalsExecutionContextElapsedTimings,
    databaseRetrievalsElapsedTimings,
    databaseRetrievalsExecutionContextElapsedTimings,
    retrievalsTypeCounts,
  };
}

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

type PiePartData = {
  name: string;
  value: number;
  fill: string;
};

type PieChartData = {
  pieDataElapsedTimings: PiePartData[];
  pieDataRetrievalsTypeCounts: PiePartData[];
  groupedPieDataElaspedTimings: PiePartData[];
  groupedPieDataRetrievalsTypeCounts: PiePartData[];
  retrievalsColors: Record<string, string>;
};

export function buildPieCharts(
  queryPlanRetrievalsCountByType: QueryPlan["querySummary"]["retrievalsCountByType"],
  summary: Summary,
): PieChartData {
  const {
    aggregateRetrievalsElapsedTimings,
    databaseRetrievalsElapsedTimings,
    groupedRetrievalsElapsedTimings,
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
    retrievalsTypeCounts,
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
