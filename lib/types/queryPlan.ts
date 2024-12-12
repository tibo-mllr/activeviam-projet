// A lot of the types here are inferred from the JSON response of the query plan endpoint
// I think quite a few `string` types could be enums, but I'm not sure what the possible values are

type Context = {
  IBranch: string;
  ISubCubeProperties: string;
  IAsOfEpoch: string;
  IQueryMonitoring: string;
  IQueriesResultLimit: string;
};

type PlanInfo = {
  pivotType: string;
  pivotId: string;
  epoch: string;
  branch: string;
  retrieverType: string;
  mdxPass: string;
  contextValues: Context;
  rangeSharing: number;
  missedPrefetchBehavior: string;
  aggregatesCache: string;
  globalTimings: Record<string, number>;
  continuous: boolean;
};

type Location = {
  dimension: string;
  hierarchy: string;
  level: string[];
  path: string[];
};

export type TimingInfo = Record<string, number[]>;

export type AggregateRetrieval = {
  retrievalId: number;
  partialProviderName: string;
  type: string;
  partitioning: string;
  location: Location[];
  measures: string[];
  filterId: number;
  measureProvider: string;
  resultSizes: number[];
  timingInfo: TimingInfo;
  underlyingDataNodes: string[];
};

export const emptyAggregateRetrieval: AggregateRetrieval = {
  retrievalId: 0,
  partialProviderName: "",
  type: "",
  partitioning: "",
  location: [],
  measures: [],
  filterId: 0,
  measureProvider: "",
  resultSizes: [],
  timingInfo: {},
  underlyingDataNodes: [],
};

export type DatabaseRetrieval = {
  store: string;
  fields: string[];
  joinedMeasure: string[];
  condition: string;
  retrievalId: number;
  resultSizes: number[];
  timingInfo: TimingInfo;
};

type Dependencies = Record<string, number[]>;

type Filter = {
  id: number;
  description: string;
};

type QuerySummary = {
  measures: string[];
  totalRetrievals: number;
  retrievalsCountByType: Record<string, number>;
  partitioningCountByType: Record<string, number>;
  resultSizeByPartitioning: Record<string, number>;
  partialProviders: string[];
  totalDatabaseResultSize: number;
};

export type QueryPlan = {
  planInfo: PlanInfo;
  aggregateRetrievals: AggregateRetrieval[];
  dependencies: Dependencies;
  databaseRetrievals: DatabaseRetrieval[];
  databaseDependencies: Dependencies;
  queryFilters: Filter[];
  querySummary: QuerySummary;
};
