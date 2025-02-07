import { z } from "zod";

const contextSchema = z.object({
  IBranch: z.string().default(""),
  ISubCubeProperties: z.string().default(""),
  IAsOfEpoch: z.string().default(""),
  IQueryMonitoring: z.string().default(""),
  IQueriesResultLimit: z.string().default(""),
});

const planInfoSchema = z.object({
  pivotType: z.string().default(""),
  pivotId: z.string().default(""),
  epoch: z.string().default(""),
  branch: z.string().default(""),
  retrieverType: z.string().default(""),
  mdxPass: z.string().default(""),
  contextValues: contextSchema.default({}),
  rangeSharing: z.number().default(0),
  missedPrefetchBehavior: z.string().default(""),
  aggregatesCache: z.string().default(""),
  globalTimings: z.record(z.string(), z.number()).default({}),
  continuous: z.boolean().default(false),
});

const locationSchema = z.object({
  dimension: z.string().default(""),
  hierarchy: z.string().default(""),
  level: z.array(z.string()).default([]),
  path: z.array(z.string()).default([]),
});

const timingInfoSchema = z.record(z.string(), z.array(z.number())).default({});

export type TimingInfo = z.infer<typeof timingInfoSchema>;

const aggregateRetrievalSchema = z.object({
  retrievalId: z.number().default(0),
  partialProviderName: z.string().default(""),
  type: z.string().default(""),
  partitioning: z.string().default(""),
  location: z.array(locationSchema).default([]),
  measures: z.array(z.string()).default([]),
  filterId: z.number().default(0),
  measureProvider: z.string().default(""),
  resultSizes: z.array(z.number()).default([]),
  timingInfo: timingInfoSchema,
  underlyingDataNodes: z.array(z.string()).default([]),
});

export type AggregateRetrieval = z.infer<typeof aggregateRetrievalSchema>;

export const emptyAggregateRetrieval: AggregateRetrieval =
  aggregateRetrievalSchema.parse({});

const databaseRetrievalSchema = z.object({
  store: z.string().default(""),
  fields: z.array(z.string()).default([]),
  joinedMeasure: z.array(z.string()).default([]),
  condition: z.string().default(""),
  retrievalId: z.number().default(0),
  resultSizes: z.array(z.number()).default([]),
  timingInfo: timingInfoSchema,
});

export type DatabaseRetrieval = z.infer<typeof databaseRetrievalSchema>;

const dependenciesSchema = z
  .record(z.string(), z.array(z.number()))
  .default({});

const filterSchema = z.object({
  id: z.number().default(0),
  description: z.string().default(""),
});

const querySummarySchema = z.object({
  measures: z.array(z.string()).default([]),
  totalRetrievals: z.number().default(0),
  retrievalsCountByType: z.record(z.string(), z.number()).default({}),
  partitioningCountByType: z.record(z.string(), z.number()).default({}),
  resultSizeByPartitioning: z.record(z.string(), z.number()).default({}),
  partialProviders: z.array(z.string()).default([]),
  totalDatabaseResultSize: z.number().default(0),
});

const queryPlanSchema = z.object({
  planInfo: planInfoSchema.default({}),
  aggregateRetrievals: z.array(aggregateRetrievalSchema).default([]),
  dependencies: dependenciesSchema,
  databaseRetrievals: z.array(databaseRetrievalSchema).default([]),
  databaseDependencies: dependenciesSchema,
  queryFilters: z.array(filterSchema).default([]),
  querySummary: querySummarySchema.default({}),
});

export const queryPlansSchema = z.array(queryPlanSchema);

export type QueryPlan = z.infer<typeof queryPlanSchema>;
