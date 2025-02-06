import { z } from "zod";

const contextSchema = z.object({
  IBranch: z.string().nullable().optional(),
  ISubCubeProperties: z.string().nullable().optional(),
  IAsOfEpoch: z.string().nullable().optional(),
  IQueryMonitoring: z.string().nullable().optional(),
  IQueriesResultLimit: z.string().nullable().optional(),
});

const planInfoSchema = z.object({
  pivotType: z.string().nullable().optional(),
  pivotId: z.string().nullable().optional(),
  epoch: z.string().nullable().optional(),
  branch: z.string().nullable().optional(),
  retrieverType: z.string().nullable().optional(),
  mdxPass: z.string().nullable().optional(),
  contextValues: contextSchema.optional(),
  rangeSharing: z.number().nullable().optional(),
  missedPrefetchBehavior: z.string().nullable().optional(),
  aggregatesCache: z.string().nullable().optional(),
  globalTimings: z.record(z.string(), z.number()).nullable().optional(),
  continuous: z.boolean().nullable().optional(),
});

const locationSchema = z.object({
  dimension: z.string().nullable().optional(),
  hierarchy: z.string().nullable().optional(),
  level: z.array(z.string()).nullable().optional(),
  path: z.array(z.string()).nullable().optional(),
});

const timingInfoSchema = z
  .record(z.string(), z.array(z.number()))
  .nullable()
  .optional();

export type TimingInfo = z.infer<typeof timingInfoSchema>;

const aggregateRetrievalSchema = z.object({
  retrievalId: z.number().nullable().optional(),
  partialProviderName: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  partitioning: z.string().nullable().optional(),
  location: z.array(locationSchema).nullable().optional(),
  measures: z.array(z.string()).nullable().optional(),
  filterId: z.number().nullable().optional(),
  measureProvider: z.string().nullable().optional(),
  resultSizes: z.array(z.number()).nullable().optional(),
  timingInfo: timingInfoSchema,
  underlyingDataNodes: z.array(z.string()).nullable().optional(),
});

export type AggregateRetrieval = z.infer<typeof aggregateRetrievalSchema>;

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

const databaseRetrievalSchema = z.object({
  store: z.string().nullable().optional(),
  fields: z.array(z.string()).nullable().optional(),
  joinedMeasure: z.array(z.string()).nullable().optional(),
  condition: z.string().nullable().optional(),
  retrievalId: z.number().nullable().optional(),
  resultSizes: z.array(z.number()).nullable().optional(),
  timingInfo: timingInfoSchema,
});

export type DatabaseRetrieval = z.infer<typeof databaseRetrievalSchema>;

const dependenciesSchema = z
  .record(z.string(), z.array(z.number()))
  .nullable()
  .optional();

const filterSchema = z.object({
  id: z.number().nullable().optional(),
  description: z.string().nullable().optional(),
});

const querySummarySchema = z.object({
  measures: z.array(z.string()).nullable().optional(),
  totalRetrievals: z.number().nullable().optional(),
  retrievalsCountByType: z.record(z.string(), z.number()).nullable().optional(),
  partitioningCountByType: z
    .record(z.string(), z.number())
    .nullable()
    .optional(),
  resultSizeByPartitioning: z
    .record(z.string(), z.number())
    .nullable()
    .optional(),
  partialProviders: z.array(z.string()).nullable().optional(),
  totalDatabaseResultSize: z.number().nullable().optional(),
});

const queryPlanSchema = z.object({
  planInfo: planInfoSchema.optional(),
  aggregateRetrievals: z.array(aggregateRetrievalSchema).nullable().optional(),
  dependencies: dependenciesSchema,
  databaseRetrievals: z.array(databaseRetrievalSchema).nullable().optional(),
  databaseDependencies: dependenciesSchema,
  queryFilters: z.array(filterSchema).nullable().optional(),
  querySummary: querySummarySchema.optional(),
});

export const queryPlansSchema = z.array(queryPlanSchema);

export type QueryPlan = z.infer<typeof queryPlanSchema>;
