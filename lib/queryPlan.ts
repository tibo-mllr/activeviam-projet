type EmptyObject = Record<string, never>; // Not a true type but it seems some objects are really meant to be empty

type Location = {
  dimension: string;
  hierarchy: string;
  level: string[];
  path: EmptyObject[];
};

type TimingInfo = Record<string, number[]>;

type Retrieval = {
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

type DatabaseRetrieval = {
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
  retrievalCountByType: Record<string, number>;
  partitioningCountByType: Record<string, number>;
  resultSizeByPartitioning: Record<string, number>;
  partialProviders: string[];
  totalDatabaseResultSize: number;
};

export type QueryPlan = {
  planInfo: EmptyObject;
  aggregateRetrievals: Retrieval[];
  dependencies: Dependencies;
  databaseRetrievals: DatabaseRetrieval[];
  databaseDependencies: Dependencies;
  queryFilters: Filter[];
  querySummary: QuerySummary;
};
