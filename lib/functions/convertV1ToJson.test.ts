import { convertV1toJson } from "./convertV1ToJson";

describe("convertV1toJson", () => {
  it.each([
    {
      input: `pnl total by year query with "strategy country names" (many-to-many join) filter
notes: medium slow, needs to return in 3 seconds or less
duration: 14 seconds

2024-09-03 23:11:13.801 GMT 598690589 [http-nio-9090-exec-21] com.rokoscapital.activepivot.logging.LogMdxQueryOnQueryStart.TEXT
INFO: MDX Query Started - {Hierarchies=[[AsofDate].[Year Hierarchy].[ALL].[AllMember], [Strategy].[Strategy Country Name].[ALL].[AllMember].[Canada]], Measures=[Pnla Value], query=SELECT
  NON EMPTY {[Measures].[Pnla Value]} DIMENSION PROPERTIES ANCESTOR_CAPTION ON COLUMNS,
  NON EMPTY Hierarchize(Descendants({[AsofDate].[Year Hierarchy].[ALL].[AllMember]}, 1, SELF_AND_BEFORE)) DIMENSION PROPERTIES CHILDREN_CARDINALITY,ANCESTOR_CAPTION ON ROWS
 FROM [Pnla]
 WHERE [Strategy].[Strategy Country Name].[ALL].[AllMember].[Canada]
 CELL PROPERTIES VALUE,FORMATTED_VALUE,BACK_COLOR,FORE_COLOR,FONT_FLAGS, Dimensions=[AsofDate, Strategy], query_type=MDX}
2024-09-03 23:11:13.801 GMT 598690589 [http-nio-9090-exec-21] com.quartetfs.pivot.mdx.impl.MdxQueryBouncer
WARN: No default timeout set. Trying to acquire a permit for at most PT2H. Use the property activeviam.mdx.queryBouncer.waitLimit to configure a default timeout if wanted.
2024-09-03 23:11:13.801 GMT 598690589 [activepivot-health-event-dispatcher] com.activeviam.health.monitor.IActivePivotHealthEventHandler
INFO: [activepivot, realtime, query] INFO 2024-09-03T23:11:13.801Z uptime=598691409ms com.quartetfs.biz.pivot.streaming.impl.AActivePivotStream.updateQuery:123 thread=http-nio-9090-exec-21 thread_id=10647 event_type=ActivePivotContinuousQueryUpdated user=Adam.Crossley@ROKOS.CORP roles=[ROLE_FULL_CUBE, ROLE_USER] Updated  new_query=MdxQuery [mdx=SELECT NON EMPTY {[Measures].[Pnla Value]} DIMENSION PROPERTIES ANCESTOR_CAPTION ON COLUMNS, NON EMPTY Hierarchize(Descendants({[AsofDate].[Year Hierarchy].[ALL].[AllMember]}, 1, SELF_AND_BEFORE)) DIMENSION PROPERTIES CHILDREN_CARDINALITY,ANCESTOR_CAPTION ON ROWS FROM [Pnla] WHERE [Strategy].[Strategy Country Name].[ALL].[AllMember].[Canada] CELL PROPERTIES VALUE,FORMATTED_VALUE,BACK_COLOR,FORE_COLOR,FONT_FLAGS, cellsOnly=false, contextValues=[MdxContext [repository={ancestorCaptionOnSlicer=true}]]] old_query=MdxQuery [mdx=SELECT NON EMPTY {[Measures].[Pnla Value]} DIMENSION PROPERTIES ANCESTOR_CAPTION ON COLUMNS, NON EMPTY Hierarchize(Descendants({[AsofDate].[Year Hierarchy].[ALL].[AllMember]}, 1, SELF_AND_BEFORE)) DIMENSION PROPERTIES CHILDREN_CARDINALITY,ANCESTOR_CAPTION ON ROWS FROM [Pnla] CELL PROPERTIES VALUE,FORMATTED_VALUE,BACK_COLOR,FORE_COLOR,FONT_FLAGS, cellsOnly=false, contextValues=[MdxContext [repository={ancestorCaptionOnSlicer=true}]]]
2024-09-03 23:11:13.802 GMT 598690590 [qfs-common-worker-281] com.activeviam.apm.pivot.query.impl.MonitoredActivePivotQueryExecutor
INFO: [QUERY_EXE_START] Action: Execute Query queryId=[6c2b10bbaeb3925], queryType=[ActivePivotSyncActionQuery[MDX]], query=[SELECT NON EMPTY {[Measures].[Pnla Value]} DIMENSION PROPERTIES ANCESTOR_CAPTION ON COLUMNS, NON EMPTY Hierarchize(Descendants({[AsofDate].[Year Hierarchy].[ALL].[AllMember]}, 1, SELF_AND_BEFORE)) DIMENSION PROPERTIES CHILDREN_CARDINALITY,ANCESTOR_CAPTION ON ROWS FROM [Pnla] WHERE [Strategy].[Strategy Country Name].[ALL].[AllMember].[Canada] CELL PROPERTIES VALUE,FORMATTED_VALUE,BACK_COLOR,FORE_COLOR,FONT_FLAGS], queryStartTimestamp=[1725405073801], exeId=[e0c81534-683c-4ee4-a281-d1e436c21e88], Status: in progress, CompletionTime: n/a, Result: n/a, GC stats: n/a, Heap stats: n/a
2024-09-03 23:11:13.805 GMT 598690593 [qfs-common-worker-281] com.activeviam.apm.pivot.query.impl.MonitoredActivePivotQueryExecutor
INFO: [QUERY_EXE_START] Action: Execute Query queryId=[9803c69bd0e71d1], queryType=[GET_AGGREGATES], query=[GetAggregatesQuery[pivotId=Pnla,nbLocations=2,measureSelection=[Pnla Value],additionalMeasures=[],contextValues=<null>]], queryStartTimestamp=[1725405073805], exeId=[1ce269f7-49e7-462c-b427-620b96470256], Status: in progress, CompletionTime: n/a, Result: n/a, GC stats: n/a, Heap stats: n/a
2024-09-03 23:11:13.808 GMT 598690596 [qfs-common-worker-281] com.activeviam.apm.pivot.query.impl.MonitoredActivePivotQueryExecutor
INFO: [QUERY_EXE_STOP] Action: Execute Query queryId=[9803c69bd0e71d1], queryType=[GET_AGGREGATES], query=[GetAggregatesQuery[pivotId=Pnla,nbLocations=2,measureSelection=[Pnla Value],additionalMeasures=[],contextValues=<null>]], queryStartTimestamp=[1725405073805], exeId=[1ce269f7-49e7-462c-b427-620b96470256], totalReplySize: (0), Status: completed OK, CompletionTime: 2 ms, Result: n/a, GC stats: n/a, Heap stats: n/a
2024-09-03 23:11:13.809 GMT 598690597 [qfs-pool-1-query-worker-531] com.qfs.store.query.impl.QueryCompiler
DEBUG: Plan for RecordQuery on store StrategyCountryJunction with condition: CountryName = Canada and fields: [SelectionField [name=CountryName, expression=CountryName], SelectionField [name=CountryStrategyScdId, expression=CountryStrategyScdId]]:
Search on store StrategyCountryJunction, composed of:
    Scan of field CountryName
2024-09-03 23:11:13.810 GMT 598690598 [qfs-pool-1-query-worker-531] com.qfs.store.query.impl.QueryCompiler
DEBUG: Cursor conditions: []
2024-09-03 23:11:27.329 GMT 598704117 [qfs-pool-1-query-worker-536] com.quartetfs.biz.pivot.query.aggregates.impl.ActivePivotAggregatesRetriever
INFO: 
GetAggregatesQuery explanation
==============================

General information:
-------------------
	ActivePivot: ActivePivotVersion [id=Pnla, epoch=59]
	RetrieverActivePivotAggregatesRetriever : Standard aggregates retriever on cube Pnla

Context values:
--------------
	IAsOfEpoch: null
	ICubeFilter: CubeFilter#1212813 with SubCubeProperties [grantedMeasures=ALL, grantedMembers=ALL]
	IQueriesResultLimit: QueriesResultLimit [transientLimit=9223372036854775807, intermediateLimit=2147483647]
	ISubCubeProperties: null
	IBranch: null

Additional properties:
---------------------
	Continuous: false
	Range sharing: 1000000
	Missed prefetches: WARN
	Cache: capacity=100000, size=134

Planning:
--------
	Planning time: 0ms
		Execution context creation time: 0ms
	Planning finalization time: 1ms

Execution:
---------
	Total query execution time: 13520ms

Query plan:
----------
Retrieval #0: PostProcessedCacheRetrieval
	Location= Pnla Beta Mode@Pnla Core:Pnla Beta Mode=Default,Strategy Country Name@Strategy:Country Name=Canada,ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
	Measures= [Pnla Value]
	Filter= Global query filter
	Partitioning= Constant partitioning
	Measures provider= SimpleMeasuresProvider
	Result size (in points)= [1]
	Start time   (in ms)= [13520]
	Elapsed time (in ms)= [    0]
 which depends on {
	Retrieval #1: PostProcessedAggregatesRetrieval
		Location= Pnla Beta Mode@Pnla Core:Pnla Beta Mode=Default,Strategy Country Name@Strategy:Country Name=Canada,ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
		Measures= [Pnla Value]
		Filter= Global query filter
		Partitioning= Constant partitioning
		Measures provider= SimpleMeasuresProvider
		Result size (in points)= [1]
		Start time   (in ms)= [13520]
		Elapsed time (in ms)= [    0]
	 which depends on {
		Retrieval #2: PostProcessedAggregatesRetrieval
			Location= Pnla Beta Mode@Pnla Core:Pnla Beta Mode=Default,Strategy Country Name@Strategy:Country Name=Canada,ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
			Measures= [Pnla Value_RAW_DeltaFactorBetaModeChoicePP]
			Filter= Global query filter
			Partitioning= Constant partitioning
			Measures provider= SimpleMeasuresProvider
			Result size (in points)= [1]
			Start time   (in ms)= [13519]
			Elapsed time (in ms)= [    0]
		 which depends on {
			Retrieval #3: NoOpPrimitiveAggregatesRetrieval
				Simple placeholder (no work done in this retrieval)
				Partitioning= Constant partitioning
				Result size (in points)= []
				Start time   (in ms)= []
				Elapsed time (in ms)= []
			Retrieval #4: PrimitiveAnalysisAggregationRetrieval
				Location= Pnla Delta Factor Raw@Pnla Core:Pnla Delta Factor Raw=[*],Strategy Country Name@Strategy:Country Name=Canada,ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
				Measures= [Pnla Value_RAW]
				Filter= CubeFilter#1329826655 with SubCubeProperties [grantedMeasures=ALL, grantedMembers={Pnla Core={Pnla Delta Factor=[[AllMember]]}}]
				Partitioning= Constant partitioning
				Measures provider= SimpleMeasuresProvider
				Result size (in points)= [1]
				Start time   (in ms)= [13518]
				Elapsed time (in ms)= [    1]
				Procedure time (in ms)= [1]
			 which depends on {
				ExternalRetrieval #0: ExternalDatastoreRetrieval
					store= StrategyCountryJunction
					fields= [CountryName, CountryStrategyScdId]
					JoinedMeasures= []
					Condition= CountryName = Canada
					Result size (in points)= [288]
					Start time   (in ms)= [0]
					Elapsed time (in ms)= [2]
				Retrieval #5: PrimitiveResultsMerger
					Location= Pnla Delta Factor Raw@Pnla Core:Pnla Delta Factor Raw=[*],StrategyScdId@Strategy_HIDDEN:StrategyScdId=[*]
					Measures= [Pnla Value_RAW]
					Filter= Global query filter
					Partitioning= Constant partitioning
					Measures provider= SimpleMeasuresProvider
					Result size (in points)= [6995]
					Start time   (in ms)= [13507]
					Elapsed time (in ms)= [   10]
				 which depends on {
					Retrieval #6: RangeSharingPrimitiveAggregatesRetrieval
						Location= Pnla Delta Factor Raw@Pnla Core:Pnla Delta Factor Raw=[*],StrategyScdId@Strategy_HIDDEN:StrategyScdId=[*]
						Measures= [Pnla Value_RAW]
						Filter= Global query filter
						Partitioning= value(Month)
						Measures provider= SimpleMeasuresProvider
						Result size (in points)= [0, 0, 3120, 2197, 2069, 1886, 1850, 1750, 1732, 1702, 1651, 1630, 1561, 1471, 1443, 1380, 1368, 1320, 1224, 1248, 1195, 1174, 1256, 1210, 1266, 1218, 1144, 1068, 1017, 969, 914, 933, 995, 848, 979, 1003, 1800, 1803, 1759, 1732, 1723, 1693, 1727, 1626, 1697, 1543, 1432, 1312, 1378, 1178, 1216, 1138, 1082, 1051, 1034, 1004, 916, 869, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2128]
						Start time   (in ms)= [0, 0, 1467, 1481, 1341, 1544, 1353, 1236, 1310, 2500, 2560, 2743, 2670, 2690, 2826, 2726, 3826, 4001, 3795, 4002, 3846, 3847, 4021, 4950, 5152, 5248, 5312, 5239, 5226, 5277, 6014, 6155, 6420, 6266, 6151, 6584, 7229, 8498, 8696, 8661, 8760, 8748, 8866, 9411, 11007, 11043, 11320, 11229, 11440, 11207, 11882, 13506, 12314, 9875, 7780, 5787, 3696, 2019, 299, 294, 289, 282, 275, 268, 263, 256, 250, 243, 237, 231, 226, 220, 214, 208, 203, 197, 190, 183, 176, 170, 164, 159, 153, 149, 144, 140, 137, 133, 130, 126, 123, 121, 117, 114, 112, 109, 106, 103, 101, 98, 95, 93, 91, 89, 87, 84, 83, 81, 80, 77]
						Elapsed time (in ms)= [0, 0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,     0,     0,     0,     0,     0,     0,     0,     0,     0,    0,    0,    0,    0,    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]
					 which depends on {
						Retrieval #7: PartialPrimitiveAggregatesRetrieval
							Location= Pnla Delta Factor Raw@Pnla Core:Pnla Delta Factor Raw=[*],StrategyScdId@Strategy_HIDDEN:StrategyScdId=[*],Year Hierarchy@AsofDate:Year=[*]
							Measures= [Pnla Value_RAW]
							Filter= Global query filter
							Partitioning= value(Month)
							Measures provider= SimpleMeasuresProvider
							Partial provider= Full
							Result size (in points)= [3120, 2197, 2069, 1886, 1850, 1750, 1732, 1702, 1651, 1630, 1561, 1471, 1443, 1380, 1368, 1320, 1224, 1248, 1195, 1174, 1256, 1210, 1266, 1218, 1144, 1068, 1017, 969, 914, 933, 995, 848, 979, 1003, 1800, 1803, 1759, 1732, 1723, 1693, 1727, 1626, 1697, 1543, 1432, 1312, 1378, 1178, 1216, 1138, 1082, 1051, 1034, 1004, 916, 869, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2128]
							Start time   (in ms)= [   0,    0,    0,    0,    0,    1,    2, 1236, 1311, 1341, 1354, 1468, 1482, 1545, 2500, 2560, 2670, 2690, 2726, 2744, 2827, 3796, 3827, 3846, 3847, 4001, 4003, 4021, 4951, 5152, 5227, 5239, 5248, 5278, 5313, 6015, 6151, 6155, 6266, 6421, 6584, 7230, 8498, 8661, 8696, 8748, 8760, 8866, 9412, 11008, 9875, 7780, 5787, 3696, 2019,  299, 294, 289, 282, 275, 268, 263, 256, 250, 243, 237, 231, 226, 220, 214, 208, 203, 197, 190, 183, 176, 170, 164, 159, 153, 149, 144, 140, 137, 133, 130, 127, 123, 121, 117, 114, 112, 109, 106, 103, 101, 98, 95, 93, 91, 89, 87, 84, 83, 81, 80, 78,  0]
							Elapsed time (in ms)= [1467, 1481, 1341, 1544, 1353, 1234, 1307, 1263, 1249, 1401, 1316, 1221, 1344, 1181, 1325, 1440, 1124, 1311, 1119, 1103, 1194, 1154, 1325, 1401, 1464, 1237, 1223, 1256, 1063, 1002, 1193, 1026,  902, 1306, 1916, 2482, 2544, 2505, 2493, 2326, 2281, 2181, 2509, 2381, 2624, 2480, 2679, 2340, 2470,  2498, 2438, 2094, 1992, 2090, 1677, 1719,   4,   5,   7,   6,   6,   5,   6,   5,   6,   6,   5,   4,   6,   6,   5,   4,   6,   6,   6,   7,   5,   5,   5,   5,   4,   4,   3,   3,   3,   3,   3,   3,   2,   3,   2,   2,   2,   2,   2,   2,  2,  2,  2,  2,  2,  2,  2,  1,  1,  1,  1, 77]
							Execution context start time (in ms)= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
							Execution context compute time (in ms)= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
					}
				}
			}
		}
	}
	Retrieval #3: NoOpPrimitiveAggregatesRetrieval (see above for dependencies)
}
Retrieval #8: PostProcessedCacheRetrieval
	Location= Pnla Beta Mode@Pnla Core:Pnla Beta Mode=Default,Strategy Country Name@Strategy:Country Name=Canada,Year Hierarchy@AsofDate:Year=[*],ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
	Measures= [Pnla Value]
	Filter= Global query filter
	Partitioning= Constant partitioning
	Measures provider= SimpleMeasuresProvider
	Result size (in points)= [5]
	Start time   (in ms)= [13520]
	Elapsed time (in ms)= [    0]
 which depends on {
	Retrieval #9: NoOpPrimitiveAggregatesRetrieval
		Simple placeholder (no work done in this retrieval)
		Partitioning= Constant partitioning
		Result size (in points)= []
		Start time   (in ms)= []
		Elapsed time (in ms)= []
	Retrieval #10: PostProcessedAggregatesRetrieval
		Location= Pnla Beta Mode@Pnla Core:Pnla Beta Mode=Default,Strategy Country Name@Strategy:Country Name=Canada,Year Hierarchy@AsofDate:Year=[*],ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
		Measures= [Pnla Value]
		Filter= Global query filter
		Partitioning= Constant partitioning
		Measures provider= SimpleMeasuresProvider
		Result size (in points)= [5]
		Start time   (in ms)= [13520]
		Elapsed time (in ms)= [    0]
	 which depends on {
		Retrieval #11: PostProcessedAggregatesRetrieval
			Location= Pnla Beta Mode@Pnla Core:Pnla Beta Mode=Default,Strategy Country Name@Strategy:Country Name=Canada,Year Hierarchy@AsofDate:Year=[*],ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
			Measures= [Pnla Value_RAW_DeltaFactorBetaModeChoicePP]
			Filter= Global query filter
			Partitioning= Constant partitioning
			Measures provider= SimpleMeasuresProvider
			Result size (in points)= [5]
			Start time   (in ms)= [13520]
			Elapsed time (in ms)= [    0]
		 which depends on {
			Retrieval #9: NoOpPrimitiveAggregatesRetrieval (see above for dependencies)
			Retrieval #12: PrimitiveAnalysisAggregationRetrieval
				Location= Pnla Delta Factor Raw@Pnla Core:Pnla Delta Factor Raw=[*],Strategy Country Name@Strategy:Country Name=Canada,Year Hierarchy@AsofDate:Year=[*],ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
				Measures= [Pnla Value_RAW]
				Filter= CubeFilter#1329826655 with SubCubeProperties [grantedMeasures=ALL, grantedMembers={Pnla Core={Pnla Delta Factor=[[AllMember]]}}]
				Partitioning= Constant partitioning
				Measures provider= SimpleMeasuresProvider
				Result size (in points)= [5]
				Start time   (in ms)= [13518]
				Elapsed time (in ms)= [    2]
				Procedure time (in ms)= [2]
			 which depends on {
				Retrieval #13: PrimitiveResultsMerger
					Location= Pnla Delta Factor Raw@Pnla Core:Pnla Delta Factor Raw=[*],StrategyScdId@Strategy_HIDDEN:StrategyScdId=[*],Year Hierarchy@AsofDate:Year=[*]
					Measures= [Pnla Value_RAW]
					Filter= Global query filter
					Partitioning= Constant partitioning
					Measures provider= SimpleMeasuresProvider
					Result size (in points)= [12104]
					Start time   (in ms)= [13506]
					Elapsed time (in ms)= [   10]
				 which depends on {
					Retrieval #7: PartialPrimitiveAggregatesRetrieval (see above for dependencies)
				}
				ExternalRetrieval #0: ExternalDatastoreRetrieval (see above for dependencies)
			}
		}
	}
}

Query Plan Summary:
-------------------
	Total number of retrievals: 14
	List of retrievals measures: [Pnla Value_RAW_DeltaFactorBetaModeChoicePP, Pnla Value_RAW, Pnla Value]
	Retrievals count by type: {ExternalDatastoreRetrieval=1, PostProcessedAggregatesRetrieval=4, PrimitiveAnalysisAggregationRetrieval=2, PostProcessedCacheRetrieval=2, PartialPrimitiveAggregatesRetrieval=1, PrimitiveResultsMerger=2, NoOpPrimitiveAggregatesRetrieval=2, RangeSharingPrimitiveAggregatesRetrieval=1}
	Used Partial Providers: [Full]
	Partitioning count by type: {value(Month)=2, Constant partitioning=12}

2024-09-03 23:11:27.332 GMT 598704120 [activepivot-health-event-dispatcher] com.rokoscapital.activepivot.logging.QueriesEventHandler.TEXT
DEBUG: Query completed {duration_ms=13526, Hierarchies=[[Strategy].[Strategy Country Name].[AllMember].[Canada], [AsofDate].[Year Hierarchy].[AllMember].[null]], Measures=[Pnla Value], AdditionalMeasures=[], Dimensions=[AsofDate, Strategy], query_type=GET_AGGREGATES, CorrelationId=448738779, user=Adam.Crossley@ROKOS.CORP, PivotId=Pnla}
2024-09-03 23:11:27.337 GMT 598704125 [qfs-common-worker-281] com.activeviam.apm.pivot.query.impl.MonitoredActivePivotQueryExecutor
INFO: [QUERY_EXE_STOP] Action: Execute Query queryId=[6c2b10bbaeb3925], queryType=[ActivePivotSyncActionQuery[MDX]], query=[SELECT NON EMPTY {[Measures].[Pnla Value]} DIMENSION PROPERTIES ANCESTOR_CAPTION ON COLUMNS, NON EMPTY Hierarchize(Descendants({[AsofDate].[Year Hierarchy].[ALL].[AllMember]}, 1, SELF_AND_BEFORE)) DIMENSION PROPERTIES CHILDREN_CARDINALITY,ANCESTOR_CAPTION ON ROWS FROM [Pnla] WHERE [Strategy].[Strategy Country Name].[ALL].[AllMember].[Canada] CELL PROPERTIES VALUE,FORMATTED_VALUE,BACK_COLOR,FORE_COLOR,FONT_FLAGS], queryStartTimestamp=[1725405073801], exeId=[e0c81534-683c-4ee4-a281-d1e436c21e88], totalReplySize: (0), Status: completed OK, CompletionTime: 13535 ms (13 s), Result: n/a, GC stats: n/a, Heap stats: n/a
2024-09-03 23:11:27.338 GMT 598704126 [activepivot-health-event-dispatcher] com.rokoscapital.activepivot.logging.QueriesEventHandler.TEXT
DEBUG: Query completed {duration_ms=13536, Hierarchies=[[AsofDate].[Year Hierarchy].[ALL].[AllMember], [Strategy].[Strategy Country Name].[ALL].[AllMember].[Canada]], Measures=[Pnla Value], query=SELECT   NON EMPTY {[Measures].[Pnla Value]} DIMENSION PROPERTIES ANCESTOR_CAPTION ON COLUMNS,   NON EMPTY Hierarchize(Descendants({[AsofDate].[Year Hierarchy].[ALL].[AllMember]}, 1, SELF_AND_BEFORE)) DIMENSION PROPERTIES CHILDREN_CARDINALITY,ANCESTOR_CAPTION ON ROWS  FROM [Pnla]  WHERE [Strategy].[Strategy Country Name].[ALL].[AllMember].[Canada]  CELL PROPERTIES VALUE,FORMATTED_VALUE,BACK_COLOR,FORE_COLOR,FONT_FLAGS, Dimensions=[AsofDate, Strategy], query_type=ActivePivotSyncActionQuery, CorrelationId=291983368, user=Adam.Crossley@ROKOS.CORP}
2024-09-03 23:11:27.339 GMT 598704127 [qfs-common-worker-281] com.activeviam.apm.pivot.webservices.core.impl.MonitoredMdxStream
INFO: [MDX_STREAM_PUBLISHED] Published CellSetEvent[streamId=QueryWebSocketService-66548cd4-7b4d-1627-daee-5bf36f0f8d58-p-2/0-7-4, epoch=59, cellCount=6], TotalReplySize: 2.722 KB(2770)), queryId=[6c2b10bbaeb3925], query=[SELECT NON EMPTY {[Measures].[Pnla Value]} DIMENSION PROPERTIES ANCESTOR_CAPTION ON COLUMNS, NON EMPTY Hierarchize(Descendants({[AsofDate].[Year Hierarchy].[ALL].[AllMember]}, 1, SELF_AND_BEFORE)) DIMENSION PROPERTIES CHILDREN_CARDINALITY,ANCESTOR_CAPTION ON ROWS FROM [Pnla] WHERE [Strategy].[Strategy Country Name].[ALL].[AllMember].[Canada] CELL PROPERTIES VALUE,FORMATTED_VALUE,BACK_COLOR,FORE_COLOR,FONT_FLAGS]
`,
      output: [
        {
          planInfo: {
            branch: "N/A",
            contextValues: {
              IAsOfEpoch: "null",
              IQueriesResultLimit:
                "QueriesResultLimit [transientLimit=9223372036854775807, intermediateLimit=2147483647]",
              ISubCubeProperties: "null",
              IBranch: "null",
            },
            globalTimings: {
              PLANNING: 0,
              CONTEXT: 0,
              FINALIZATION: 1,
              EXECUTION: 13520,
            },
            $parseErrors: {},
            pivotType: "ActivePivotVersion",
            pivotId: "Pnla",
            epoch: "59",
            retrieverType: "Standard aggregates retriever on cube Pnla",
            isContinuous: "false",
            rangeSharing: 1000000,
            missedPrefetchBehavior: "WARN",
            aggregatesCache: "capacity=100000, size=134",
            mdxPass: "GAQ_0",
          },
          queryFilters: [
            {
              id: 0,
              description:
                "CubeFilter#1212813 with SubCubeProperties [grantedMeasures=ALL, grantedMembers=ALL]",
            },
            {
              id: 1,
              description:
                "CubeFilter#1329826655 with SubCubeProperties [grantedMeasures=ALL, grantedMembers={Pnla Core={Pnla Delta Factor=[[AllMember]]}}]",
            },
          ],
          aggregateRetrievals: [
            {
              $kind: "AggregateRetrieval",
              retrievalId: 0,
              type: "PostProcessedCacheRetrieval",
              location: [
                {
                  dimension: "Pnla Beta Mode",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Beta Mode"],
                  path: ["Default"],
                },
                {
                  dimension: "Strategy Country Name",
                  hierarchy: "Strategy",
                  level: ["Country Name"],
                  path: ["Canada"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["Pnla Value"],
              timingInfo: {
                startTime: [13520],
                elapsedTime: [0],
              },
              partitioning: "Constant partitioning",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [1],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 1,
              type: "PostProcessedAggregatesRetrieval",
              location: [
                {
                  dimension: "Pnla Beta Mode",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Beta Mode"],
                  path: ["Default"],
                },
                {
                  dimension: "Strategy Country Name",
                  hierarchy: "Strategy",
                  level: ["Country Name"],
                  path: ["Canada"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["Pnla Value"],
              timingInfo: {
                startTime: [13520],
                elapsedTime: [0],
              },
              partitioning: "Constant partitioning",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [1],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 2,
              type: "PostProcessedAggregatesRetrieval",
              location: [
                {
                  dimension: "Pnla Beta Mode",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Beta Mode"],
                  path: ["Default"],
                },
                {
                  dimension: "Strategy Country Name",
                  hierarchy: "Strategy",
                  level: ["Country Name"],
                  path: ["Canada"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["Pnla Value_RAW_DeltaFactorBetaModeChoicePP"],
              timingInfo: {
                startTime: [13519],
                elapsedTime: [0],
              },
              partitioning: "Constant partitioning",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [1],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 3,
              type: "NoOpPrimitiveAggregatesRetrieval",
              location: [],
              measures: [],
              timingInfo: {},
              partitioning: "Constant partitioning",
              filterId: 0,
              underlyingDataNodes: [],
              resultSizes: [],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 4,
              type: "PrimitiveAnalysisAggregationRetrieval",
              location: [
                {
                  dimension: "Pnla Delta Factor Raw",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Delta Factor Raw"],
                  path: ["[*]"],
                },
                {
                  dimension: "Strategy Country Name",
                  hierarchy: "Strategy",
                  level: ["Country Name"],
                  path: ["Canada"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["Pnla Value_RAW"],
              timingInfo: {
                startTime: [13518],
                elapsedTime: [1],
              },
              partitioning: "Constant partitioning",
              filterId: 1,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [1],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 5,
              type: "PrimitiveResultsMerger",
              location: [
                {
                  dimension: "Pnla Delta Factor Raw",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Delta Factor Raw"],
                  path: ["[*]"],
                },
                {
                  dimension: "StrategyScdId",
                  hierarchy: "Strategy_HIDDEN",
                  level: ["StrategyScdId"],
                  path: ["[*]"],
                },
              ],
              measures: ["Pnla Value_RAW"],
              timingInfo: {
                startTime: [13507],
                elapsedTime: [10],
              },
              partitioning: "Constant partitioning",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [6995],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 6,
              type: "RangeSharingPrimitiveAggregatesRetrieval",
              location: [
                {
                  dimension: "Pnla Delta Factor Raw",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Delta Factor Raw"],
                  path: ["[*]"],
                },
                {
                  dimension: "StrategyScdId",
                  hierarchy: "Strategy_HIDDEN",
                  level: ["StrategyScdId"],
                  path: ["[*]"],
                },
              ],
              measures: ["Pnla Value_RAW"],
              timingInfo: {
                startTime: [
                  0, 0, 1467, 1481, 1341, 1544, 1353, 1236, 1310, 2500, 2560,
                  2743, 2670, 2690, 2826, 2726, 3826, 4001, 3795, 4002, 3846,
                  3847, 4021, 4950, 5152, 5248, 5312, 5239, 5226, 5277, 6014,
                  6155, 6420, 6266, 6151, 6584, 7229, 8498, 8696, 8661, 8760,
                  8748, 8866, 9411, 11007, 11043, 11320, 11229, 11440, 11207,
                  11882, 13506, 12314, 9875, 7780, 5787, 3696, 2019, 299, 294,
                  289, 282, 275, 268, 263, 256, 250, 243, 237, 231, 226, 220,
                  214, 208, 203, 197, 190, 183, 176, 170, 164, 159, 153, 149,
                  144, 140, 137, 133, 130, 126, 123, 121, 117, 114, 112, 109,
                  106, 103, 101, 98, 95, 93, 91, 89, 87, 84, 83, 81, 80, 77,
                ],
                elapsedTime: [
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0,
                ],
              },
              partitioning: "value(Month)",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [
                0, 0, 3120, 2197, 2069, 1886, 1850, 1750, 1732, 1702, 1651,
                1630, 1561, 1471, 1443, 1380, 1368, 1320, 1224, 1248, 1195,
                1174, 1256, 1210, 1266, 1218, 1144, 1068, 1017, 969, 914, 933,
                995, 848, 979, 1003, 1800, 1803, 1759, 1732, 1723, 1693, 1727,
                1626, 1697, 1543, 1432, 1312, 1378, 1178, 1216, 1138, 1082,
                1051, 1034, 1004, 916, 869, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2128,
              ],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 7,
              partialProviderName: "Full",
              type: "PartialPrimitiveAggregatesRetrieval",
              location: [
                {
                  dimension: "Pnla Delta Factor Raw",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Delta Factor Raw"],
                  path: ["[*]"],
                },
                {
                  dimension: "StrategyScdId",
                  hierarchy: "Strategy_HIDDEN",
                  level: ["StrategyScdId"],
                  path: ["[*]"],
                },
                {
                  dimension: "Year Hierarchy",
                  hierarchy: "AsofDate",
                  level: ["Year"],
                  path: ["[*]"],
                },
              ],
              measures: ["Pnla Value_RAW"],
              timingInfo: {
                startTime: [
                  0, 0, 0, 0, 0, 1, 2, 1236, 1311, 1341, 1354, 1468, 1482, 1545,
                  2500, 2560, 2670, 2690, 2726, 2744, 2827, 3796, 3827, 3846,
                  3847, 4001, 4003, 4021, 4951, 5152, 5227, 5239, 5248, 5278,
                  5313, 6015, 6151, 6155, 6266, 6421, 6584, 7230, 8498, 8661,
                  8696, 8748, 8760, 8866, 9412, 11008, 9875, 7780, 5787, 3696,
                  2019, 299, 294, 289, 282, 275, 268, 263, 256, 250, 243, 237,
                  231, 226, 220, 214, 208, 203, 197, 190, 183, 176, 170, 164,
                  159, 153, 149, 144, 140, 137, 133, 130, 127, 123, 121, 117,
                  114, 112, 109, 106, 103, 101, 98, 95, 93, 91, 89, 87, 84, 83,
                  81, 80, 78, 0,
                ],
                elapsedTime: [
                  1467, 1481, 1341, 1544, 1353, 1234, 1307, 1263, 1249, 1401,
                  1316, 1221, 1344, 1181, 1325, 1440, 1124, 1311, 1119, 1103,
                  1194, 1154, 1325, 1401, 1464, 1237, 1223, 1256, 1063, 1002,
                  1193, 1026, 902, 1306, 1916, 2482, 2544, 2505, 2493, 2326,
                  2281, 2181, 2509, 2381, 2624, 2480, 2679, 2340, 2470, 2498,
                  2438, 2094, 1992, 2090, 1677, 1719, 4, 5, 7, 6, 6, 5, 6, 5, 6,
                  6, 5, 4, 6, 6, 5, 4, 6, 6, 6, 7, 5, 5, 5, 5, 4, 4, 3, 3, 3, 3,
                  3, 3, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1,
                  77,
                ],
              },
              partitioning: "value(Month)",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [
                3120, 2197, 2069, 1886, 1850, 1750, 1732, 1702, 1651, 1630,
                1561, 1471, 1443, 1380, 1368, 1320, 1224, 1248, 1195, 1174,
                1256, 1210, 1266, 1218, 1144, 1068, 1017, 969, 914, 933, 995,
                848, 979, 1003, 1800, 1803, 1759, 1732, 1723, 1693, 1727, 1626,
                1697, 1543, 1432, 1312, 1378, 1178, 1216, 1138, 1082, 1051,
                1034, 1004, 916, 869, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2128,
              ],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 8,
              type: "PostProcessedCacheRetrieval",
              location: [
                {
                  dimension: "Pnla Beta Mode",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Beta Mode"],
                  path: ["Default"],
                },
                {
                  dimension: "Strategy Country Name",
                  hierarchy: "Strategy",
                  level: ["Country Name"],
                  path: ["Canada"],
                },
                {
                  dimension: "Year Hierarchy",
                  hierarchy: "AsofDate",
                  level: ["Year"],
                  path: ["[*]"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["Pnla Value"],
              timingInfo: {
                startTime: [13520],
                elapsedTime: [0],
              },
              partitioning: "Constant partitioning",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [5],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 9,
              type: "NoOpPrimitiveAggregatesRetrieval",
              location: [],
              measures: [],
              timingInfo: {},
              partitioning: "Constant partitioning",
              filterId: 0,
              underlyingDataNodes: [],
              resultSizes: [],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 10,
              type: "PostProcessedAggregatesRetrieval",
              location: [
                {
                  dimension: "Pnla Beta Mode",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Beta Mode"],
                  path: ["Default"],
                },
                {
                  dimension: "Strategy Country Name",
                  hierarchy: "Strategy",
                  level: ["Country Name"],
                  path: ["Canada"],
                },
                {
                  dimension: "Year Hierarchy",
                  hierarchy: "AsofDate",
                  level: ["Year"],
                  path: ["[*]"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["Pnla Value"],
              timingInfo: {
                startTime: [13520],
                elapsedTime: [0],
              },
              partitioning: "Constant partitioning",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [5],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 11,
              type: "PostProcessedAggregatesRetrieval",
              location: [
                {
                  dimension: "Pnla Beta Mode",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Beta Mode"],
                  path: ["Default"],
                },
                {
                  dimension: "Strategy Country Name",
                  hierarchy: "Strategy",
                  level: ["Country Name"],
                  path: ["Canada"],
                },
                {
                  dimension: "Year Hierarchy",
                  hierarchy: "AsofDate",
                  level: ["Year"],
                  path: ["[*]"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["Pnla Value_RAW_DeltaFactorBetaModeChoicePP"],
              timingInfo: {
                startTime: [13520],
                elapsedTime: [0],
              },
              partitioning: "Constant partitioning",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [5],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 12,
              type: "PrimitiveAnalysisAggregationRetrieval",
              location: [
                {
                  dimension: "Pnla Delta Factor Raw",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Delta Factor Raw"],
                  path: ["[*]"],
                },
                {
                  dimension: "Strategy Country Name",
                  hierarchy: "Strategy",
                  level: ["Country Name"],
                  path: ["Canada"],
                },
                {
                  dimension: "Year Hierarchy",
                  hierarchy: "AsofDate",
                  level: ["Year"],
                  path: ["[*]"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["Pnla Value_RAW"],
              timingInfo: {
                startTime: [13518],
                elapsedTime: [2],
              },
              partitioning: "Constant partitioning",
              filterId: 1,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [5],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 13,
              type: "PrimitiveResultsMerger",
              location: [
                {
                  dimension: "Pnla Delta Factor Raw",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Delta Factor Raw"],
                  path: ["[*]"],
                },
                {
                  dimension: "StrategyScdId",
                  hierarchy: "Strategy_HIDDEN",
                  level: ["StrategyScdId"],
                  path: ["[*]"],
                },
                {
                  dimension: "Year Hierarchy",
                  hierarchy: "AsofDate",
                  level: ["Year"],
                  path: ["[*]"],
                },
              ],
              measures: ["Pnla Value_RAW"],
              timingInfo: {
                startTime: [13506],
                elapsedTime: [10],
              },
              partitioning: "Constant partitioning",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [12104],
            },
          ],
          externalRetrievals: [
            {
              $kind: "ExternalRetrieval",
              retrievalId: 0,
              type: "ExternalDatastoreRetrieval",
              store: "StrategyCountryJunction",
              fields: [],
              joinedMeasure: [""],
              condition: "CountryName = Canada",
              resultSizes: [288],
              timingInfo: {
                startTime: [0],
                elapsedTime: [2],
              },
            },
          ],
          querySummary: {
            measures: [
              "Pnla Value",
              "Pnla Value_RAW_DeltaFactorBetaModeChoicePP",
              "Pnla Value_RAW",
            ],
            totalRetrievals: 15,
            retrievalsCountByType: {
              PostProcessedCacheRetrieval: 2,
              PostProcessedAggregatesRetrieval: 4,
              NoOpPrimitiveAggregatesRetrieval: 2,
              PrimitiveAnalysisAggregationRetrieval: 2,
              PrimitiveResultsMerger: 2,
              RangeSharingPrimitiveAggregatesRetrieval: 1,
              PartialPrimitiveAggregatesRetrieval: 1,
              ExternalDatabaseRetrieval: 1,
            },
            partitioningCountByType: {
              "Constant partitioning": 12,
              "value(Month)": 2,
            },
            resultSizeByPartitioning: {
              "Constant partitioning": 19123,
              "value(Month)": 161366,
            },
            partialProviders: ["Full"],
            totalExternalResultSize: 288,
          },
          dependencies: {
            "0": [1, 3],
            "1": [2],
            "2": [3, 4],
            "4": [5],
            "5": [6],
            "6": [7],
            "8": [9, 10],
            "10": [11],
            "11": [9, 12],
            "12": [13],
            "13": [7],
            "-1": [0, 8],
          },
          externalDependencies: {
            "4": [0],
            "12": [0],
          },
          needFillTimingInfo: false,
        },
      ],
    },
    {
      input: `
        get members query for "strategy country names" copper analysis join (many-to-many)
notes: slow
duration: 17 seconds

INFO: MDX Query Started - {Hierarchies=[[Strategy].[Strategy Country Name]], Measures=[contributors.COUNT], query=SELECT
 NonEmpty([Strategy].[Strategy Country Name].Members, [Measures].[contributors.COUNT]) DIMENSION PROPERTIES ANCESTOR_CAPTION ON ROWS
 FROM [Pnla], Dimensions=[Strategy], query_type=MDX}
2024-09-03 23:09:32.059 GMT 598588847 [http-nio-9090-exec-34] com.quartetfs.pivot.mdx.impl.MdxQueryBouncer
WARN: No default timeout set. Trying to acquire a permit for at most PT2H. Use the property activeviam.mdx.queryBouncer.waitLimit to configure a default timeout if wanted.
2024-09-03 23:09:32.059 GMT 598588847 [http-nio-9090-exec-34] com.activeviam.apm.pivot.webservices.core.impl.MonitoredMdxStream
INFO: [MDX_STREAM_PAUSED] Paused MonitoredMDXStream[streamId=QueryWebSocketService-66548cd4-7b4d-1627-daee-5bf36f0f8d58-6ce61161-50c9-4103-8a79-565e007794b9-47-23, queryId=[557126cabcb9a52], query=[SELECT NonEmpty([Strategy].[Strategy Country Name].Members, [Measures].[contributors.COUNT]) DIMENSION PROPERTIES ANCESTOR_CAPTION ON ROWS FROM [Pnla]]
2024-09-03 23:09:32.059 GMT 598588847 [qfs-common-worker-274] com.activeviam.apm.pivot.query.impl.MonitoredActivePivotQueryExecutor
INFO: [QUERY_EXE_START] Action: Execute Query queryId=[557126cabcb9a52], queryType=[ActivePivotSyncActionQuery[MDX]], query=[SELECT NonEmpty([Strategy].[Strategy Country Name].Members, [Measures].[contributors.COUNT]) DIMENSION PROPERTIES ANCESTOR_CAPTION ON ROWS FROM [Pnla]], queryStartTimestamp=[1725404972059], exeId=[643b04fe-586c-4c09-8d72-3c97d9b41aca], Status: in progress, CompletionTime: n/a, Result: n/a, GC stats: n/a, Heap stats: n/a
2024-09-03 23:09:32.060 GMT 598588848 [activepivot-health-event-dispatcher] com.activeviam.health.monitor.IActivePivotHealthEventHandler
INFO: [activepivot, realtime, query] INFO 2024-09-03T23:09:32.059Z uptime=598589667ms com.quartetfs.biz.pivot.streaming.impl.AActivePivotStream.transitionState:289 thread=http-nio-9090-exec-34 thread_id=10675 event_type=ActivePivotContinuousQueryUnregistered user=Adam.Crossley@ROKOS.CORP roles=[ROLE_FULL_CUBE, ROLE_USER] Unregistered  query=MdxQuery [mdx=SELECT NonEmpty([Strategy].[Strategy Country Name].Members, [Measures].[contributors.COUNT]) DIMENSION PROPERTIES ANCESTOR_CAPTION ON ROWS FROM [Pnla], cellsOnly=false, contextValues=[MdxContext [repository={ancestorCaptionOnSlicer=true}]]]
2024-09-03 23:09:32.063 GMT 598588851 [qfs-common-worker-281] com.activeviam.apm.pivot.query.impl.MonitoredActivePivotQueryExecutor
INFO: [QUERY_EXE_START] Action: Execute Query queryId=[1cb852b031d60b4], queryType=[GET_AGGREGATES], query=[GetAggregatesQuery[pivotId=Pnla,nbLocations=2,measureSelection=[contributors.COUNT, Pnla Value],additionalMeasures=[],contextValues=<null>]], queryStartTimestamp=[1725404972063], exeId=[ccba6f10-bc86-4520-ac22-02e502e1050c], Status: in progress, CompletionTime: n/a, Result: n/a, GC stats: n/a, Heap stats: n/a
2024-09-03 23:09:32.067 GMT 598588855 [qfs-common-worker-281] com.activeviam.apm.pivot.query.impl.MonitoredActivePivotQueryExecutor
INFO: [QUERY_EXE_STOP] Action: Execute Query queryId=[1cb852b031d60b4], queryType=[GET_AGGREGATES], query=[GetAggregatesQuery[pivotId=Pnla,nbLocations=2,measureSelection=[contributors.COUNT, Pnla Value],additionalMeasures=[],contextValues=<null>]], queryStartTimestamp=[1725404972063], exeId=[ccba6f10-bc86-4520-ac22-02e502e1050c], totalReplySize: (0), Status: completed OK, CompletionTime: 4 ms, Result: n/a, GC stats: n/a, Heap stats: n/a
2024-09-03 23:09:32.067 GMT 598588855 [qfs-pool-1-query-worker-539] com.qfs.store.query.impl.QueryCompiler
DEBUG: Plan for RecordQuery on store StrategyCountryJunction with condition: TRUE and fields: [SelectionField [name=CountryName, expression=CountryName], SelectionField [name=CountryStrategyScdId, expression=CountryStrategyScdId]]:

2024-09-03 23:09:32.068 GMT 598588856 [qfs-pool-1-query-worker-539] com.qfs.store.query.impl.QueryCompiler
DEBUG: Cursor conditions: []
2024-09-03 23:09:39.199 GMT 598595987 [activepivot-health-event-dispatcher] com.activeviam.health.monitor.IComposerHealthEventHandler
INFO: [jvm, memory] INFO 2024-09-03T23:09:39.199Z uptime=598596807ms com.activeviam.health.monitor.impl.JvmHealthCheck.createEvent:62 thread=activepivot-health-check thread_id=57 event_type=JvmMemoryReport JVM Memory Usage report: G1 Young Generation[count=941 (+0), time=113s (+0)]  G1 Old Generation[count=0 (+0), time=0s (+0)]  Heap[used=38 GiB 466 MiB (41291778224) (+64 MiB (67108864)), committed=90 GiB (96636764160) (+(0)), max=90 GiB (96636764160) (+(0))]  Direct[used=422 GiB 944 MiB (454109761735) (+(0)), count=1096884 (+0), max=553 GiB (593779228672) (+(0))]  Threads[count=214 (+0), peak=254 (+0)]
2024-09-03 23:09:49.333 GMT 598606121 [qfs-pool-1-query-worker-540] com.quartetfs.biz.pivot.query.aggregates.impl.ActivePivotAggregatesRetriever
INFO: 
GetAggregatesQuery explanation
==============================

General information:
-------------------
	ActivePivot: ActivePivotVersion [id=Pnla, epoch=59]
	RetrieverActivePivotAggregatesRetriever : Standard aggregates retriever on cube Pnla

Context values:
--------------
	IAsOfEpoch: null
	ICubeFilter: CubeFilter#1212813 with SubCubeProperties [grantedMeasures=ALL, grantedMembers=ALL]
	IQueriesResultLimit: QueriesResultLimit [transientLimit=9223372036854775807, intermediateLimit=2147483647]
	ISubCubeProperties: null
	IBranch: null

Additional properties:
---------------------
	Continuous: false
	Range sharing: 1000000
	Missed prefetches: WARN
	Cache: capacity=100000, size=128

Planning:
--------
	Planning time: 0ms
		Execution context creation time: 0ms
	Planning finalization time: 2ms

Execution:
---------
	Total query execution time: 17263ms

Query plan:
----------
Retrieval #0: PrimitiveAggregatesCacheRetrieval
	Location= Pnla Beta Mode@Pnla Core:Pnla Beta Mode=Default,Strategy Country Name@Strategy:Country Name=[*],ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
	Measures= [contributors.COUNT]
	Filter= Global query filter
	Partitioning= Constant partitioning
	Measures provider= SimpleMeasuresProvider
	Result size (in points)= [63]
	Start time   (in ms)= [0]
	Elapsed time (in ms)= [0]
 which depends on {
	Retrieval #1: PrimitiveAnalysisAggregationRetrieval
		Location= Pnla Beta Mode@Pnla Core:Pnla Beta Mode=Default,Strategy Country Name@Strategy:Country Name=[*],ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
		Measures= [contributors.COUNT]
		Filter= Global query filter
		Partitioning= Constant partitioning
		Measures provider= SimpleMeasuresProvider
		Result size (in points)= [63]
		Start time   (in ms)= [0]
		Elapsed time (in ms)= [0]
	 which depends on {
		Retrieval #2: PrimitiveResultsMerger
			Location= StrategyScdId@Strategy_HIDDEN:StrategyScdId=[*]
			Measures= [contributors.COUNT]
			Filter= Global query filter
			Partitioning= Constant partitioning
			Measures provider= SimpleMeasuresProvider
			Result size (in points)= [4539]
			Start time   (in ms)= [16661]
			Elapsed time (in ms)= [    6]
		 which depends on {
			Retrieval #3: PartialPrimitiveAggregatesRetrieval
				Location= StrategyScdId@Strategy_HIDDEN:StrategyScdId=[*]
				Measures= [contributors.COUNT]
				Filter= Global query filter
				Partitioning= value(Month)
				Measures provider= SimpleMeasuresProvider
				Partial provider= Full
				Result size (in points)= [1547, 1493, 1401, 1304, 1303, 1221, 1218, 1209, 1168, 1140, 1103, 1059, 1059, 1030, 1022, 978, 922, 922, 907, 895, 969, 922, 972, 928, 868, 828, 783, 771, 742, 761, 815, 848, 807, 1003, 1800, 1803, 1759, 1732, 1723, 1693, 1727, 1626, 1697, 1543, 1432, 1312, 1378, 1178, 1216, 1138, 1082, 1051, 1034, 1004, 916, 869, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1258]
				Start time   (in ms)= [  0,   0, 740, 757, 1413, 1535, 2073, 2133, 2712, 2763, 3324, 3429, 3944, 4030, 4606, 4608, 5260, 5319, 5809, 5965, 6362, 6506, 6952, 7075, 7605, 7831, 8417, 8500, 9094, 9190, 9675, 9729, 10310, 10314, 10794, 11067, 11888, 12372, 13226, 13681, 14523, 14880, 15357, 15260, 13737, 12307, 10885, 9523, 8088, 6640, 5228, 4115, 3070, 1977, 1097, 151, 148, 146, 142, 139, 136, 133, 129, 126, 123, 120, 117, 115, 112, 109, 106, 104, 100, 97, 94, 90, 87, 84, 81, 79, 76, 74, 72, 70, 68, 67, 65, 63, 62, 60, 59, 57, 56, 54, 53, 51, 50, 49, 47, 46, 45, 44, 43, 42, 41, 40, 39,  0]
				Elapsed time (in ms)= [756, 739, 671, 777,  659,  597,  638,  629,  611,  665,  619,  600,  663,  576,  652,  710,  548,  645,  551,  540,  589,  567,  653,  755,  811,  668,  675,  689,  581,  538,  637,  580,   483,   752,  1092,  1304,  1337,  1308,  1296,  1198,  1205,  1158,  1303,  1385,  1522,  1429,  1421, 1361, 1435, 1446, 1411, 1112, 1043, 1093,  879, 945,   2,   2,   3,   3,   3,   2,   3,   2,   3,   2,   2,   2,   3,   2,   2,   2,   3,  3,  3,  3,  2,  2,  2,  2,  2,  2,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,  1,  0,  0,  0,  0, 39]
				Execution context start time (in ms)= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
				Execution context compute time (in ms)= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		}
		ExternalRetrieval #0: ExternalDatastoreRetrieval
			store= StrategyCountryJunction
			fields= [CountryName, CountryStrategyScdId]
			JoinedMeasures= []
			Condition= TRUE
			Result size (in points)= [21216]
			Start time   (in ms)= [0]
			Elapsed time (in ms)= [5]
	}
}
Retrieval #4: PrimitiveAggregatesCacheRetrieval
	Location= Pnla Beta Mode@Pnla Core:Pnla Beta Mode=Default,ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
	Measures= [contributors.COUNT]
	Filter= Global query filter
	Partitioning= Constant partitioning
	Measures provider= SimpleMeasuresProvider
	Result size (in points)= [1]
	Start time   (in ms)= [0]
	Elapsed time (in ms)= [0]
 which depends on {
	Retrieval #5: PrimitiveResultsMerger
		Location= Pnla Beta Mode@Pnla Core:Pnla Beta Mode=Default,ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
		Measures= [contributors.COUNT]
		Filter= Global query filter
		Partitioning= Constant partitioning
		Measures provider= SimpleMeasuresProvider
		Result size (in points)= [1]
		Start time   (in ms)= [0]
		Elapsed time (in ms)= [0]
	 which depends on {
		Retrieval #6: PrimitiveAnalysisAggregationRetrieval
			Location= Pnla Beta Mode@Pnla Core:Pnla Beta Mode=Default,ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
			Measures= [contributors.COUNT]
			Filter= Global query filter
			Partitioning= value(Month)
			Measures provider= SimpleMeasuresProvider
			Result size (in points)= [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
			Start time   (in ms)= [0, 0, 756, 740, 1412, 1534, 2072, 2133, 2712, 2762, 3324, 3428, 3944, 4029, 4608, 4606, 5259, 5319, 5809, 5965, 6361, 6506, 6951, 7074, 7605, 7831, 8417, 8500, 9093, 9190, 9675, 9728, 10314, 10309, 10794, 11066, 11887, 12371, 13225, 13681, 14523, 14880, 15729, 16039, 16661, 16646, 15260, 13737, 12307, 10885, 9523, 8087, 6640, 5228, 4115, 3070, 1977, 1096, 151, 148, 146, 142, 139, 136, 133, 129, 126, 123, 120, 117, 115, 112, 109, 106, 103, 100, 97, 94, 90, 87, 84, 81, 78, 76, 74, 72, 70, 68, 67, 65, 63, 62, 60, 59, 57, 56, 54, 53, 51, 50, 49, 47, 46, 45, 44, 43, 42, 41, 40, 39]
			Elapsed time (in ms)= [0, 0,   0,   0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,    0,    0,    0,    0,    0,    0,    0,    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]
			Procedure time (in ms)= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		 which depends on {
			Retrieval #7: RangeSharingPrimitiveAggregatesRetrieval
				Location= GRAND TOTAL
				Measures= [contributors.COUNT]
				Filter= Global query filter
				Partitioning= value(Month)
				Measures provider= SimpleMeasuresProvider
				Result size (in points)= [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
				Start time   (in ms)= [0, 0, 756, 740, 1412, 1534, 2072, 2132, 2712, 2762, 3324, 3428, 3944, 4029, 4607, 4606, 5259, 5319, 5809, 5965, 6361, 6506, 6951, 7074, 7605, 7830, 8417, 8500, 9093, 9189, 9675, 9728, 10313, 10309, 10794, 11066, 11887, 12371, 13225, 13680, 14523, 14880, 15729, 16039, 16661, 16646, 15259, 13736, 12306, 10885, 9523, 8087, 6640, 5227, 4114, 3070, 1976, 1096, 151, 148, 146, 142, 139, 136, 133, 129, 126, 123, 120, 117, 115, 112, 109, 106, 103, 100, 97, 94, 90, 87, 84, 81, 78, 76, 74, 72, 70, 68, 67, 65, 63, 62, 60, 58, 57, 56, 54, 53, 51, 50, 49, 47, 46, 45, 44, 43, 42, 41, 40, 39]
				Elapsed time (in ms)= [0, 0,   0,   0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,    0,    0,    0,    0,    0,    0,    0,    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]
			 which depends on {
				Retrieval #3: PartialPrimitiveAggregatesRetrieval (see above for dependencies)
			}
		}
	}
}
Retrieval #8: PostProcessedCacheRetrieval
	Location= Pnla Beta Mode@Pnla Core:Pnla Beta Mode=Default,Strategy Country Name@Strategy:Country Name=[*],ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
	Measures= [Pnla Value]
	Filter= Global query filter
	Partitioning= Constant partitioning
	Measures provider= SimpleMeasuresProvider
	Result size (in points)= [63]
	Start time   (in ms)= [17263]
	Elapsed time (in ms)= [    0]
 which depends on {
	Retrieval #9: PostProcessedAggregatesRetrieval
		Location= Pnla Beta Mode@Pnla Core:Pnla Beta Mode=Default,Strategy Country Name@Strategy:Country Name=[*],ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
		Measures= [Pnla Value]
		Filter= Global query filter
		Partitioning= Constant partitioning
		Measures provider= SimpleMeasuresProvider
		Result size (in points)= [63]
		Start time   (in ms)= [17263]
		Elapsed time (in ms)= [    0]
	 which depends on {
		Retrieval #10: PostProcessedAggregatesRetrieval
			Location= Pnla Beta Mode@Pnla Core:Pnla Beta Mode=Default,Strategy Country Name@Strategy:Country Name=[*],ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
			Measures= [Pnla Value_RAW_DeltaFactorBetaModeChoicePP]
			Filter= Global query filter
			Partitioning= Constant partitioning
			Measures provider= SimpleMeasuresProvider
			Result size (in points)= [63]
			Start time   (in ms)= [17263]
			Elapsed time (in ms)= [    0]
		 which depends on {
			Retrieval #11: PrimitiveAnalysisAggregationRetrieval
				Location= Pnla Delta Factor Raw@Pnla Core:Pnla Delta Factor Raw=[*],Strategy Country Name@Strategy:Country Name=[*],ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
				Measures= [Pnla Value_RAW]
				Filter= CubeFilter#1329826655 with SubCubeProperties [grantedMeasures=ALL, grantedMembers={Pnla Core={Pnla Delta Factor=[[AllMember]]}}]
				Partitioning= Constant partitioning
				Measures provider= SimpleMeasuresProvider
				Result size (in points)= [200]
				Start time   (in ms)= [17259]
				Elapsed time (in ms)= [    3]
				Procedure time (in ms)= [3]
			 which depends on {
				Retrieval #12: PrimitiveResultsMerger
					Location= Pnla Delta Factor Raw@Pnla Core:Pnla Delta Factor Raw=[*],StrategyScdId@Strategy_HIDDEN:StrategyScdId=[*]
					Measures= [Pnla Value_RAW]
					Filter= Global query filter
					Partitioning= Constant partitioning
					Measures provider= SimpleMeasuresProvider
					Result size (in points)= [6995]
					Start time   (in ms)= [17248]
					Elapsed time (in ms)= [   10]
				 which depends on {
					Retrieval #13: PartialPrimitiveAggregatesRetrieval
						Location= Pnla Delta Factor Raw@Pnla Core:Pnla Delta Factor Raw=[*],StrategyScdId@Strategy_HIDDEN:StrategyScdId=[*]
						Measures= [Pnla Value_RAW]
						Filter= Global query filter
						Partitioning= value(Month)
						Measures provider= SimpleMeasuresProvider
						Partial provider= Full
						Result size (in points)= [3120, 2197, 2069, 1886, 1850, 1750, 1732, 1702, 1651, 1630, 1561, 1471, 1443, 1380, 1368, 1320, 1224, 1248, 1195, 1174, 1256, 1210, 1266, 1218, 1144, 1068, 1017, 969, 914, 933, 995, 848, 979, 1003, 1800, 1803, 1759, 1732, 1723, 1693, 1727, 1626, 1697, 1543, 1432, 1312, 1378, 1178, 1216, 1138, 1082, 1051, 1034, 1004, 916, 869, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2128]
						Start time   (in ms)= [   0,    0,    1,    5, 1171, 1283, 1307, 1358, 2337, 2356, 2453, 2459, 3417, 3524, 3557, 3578, 4577, 4593, 4715, 4872, 5548, 5694, 5739, 5839, 6584, 6708, 6920, 7082, 7790, 7854, 8003, 8199, 8733, 8738, 9027, 9094, 9526, 9882, 10709, 11282, 11747, 12044, 12848, 13260, 13731, 13929, 15008, 15084, 12906, 10712, 8574, 6788, 5055, 3248, 1744,  255, 247, 242, 236, 230, 225, 220, 214, 209, 203, 198, 193, 189, 184, 179, 175, 170, 165, 159, 154, 148, 143, 138, 133, 129, 125, 121, 118, 115, 112, 109, 106, 104, 101, 98, 96, 94, 91, 89, 86, 84, 82, 80, 78, 76, 74, 72, 70, 69, 67, 66, 65,  0]
						Elapsed time (in ms)= [1282, 1305, 1169, 1351, 1165, 1072, 1146, 1100, 1078, 1200, 1123, 1064, 1175, 1052, 1157, 1293,  970, 1145,  978,  966, 1035, 1013, 1180, 1242, 1269, 1081, 1082, 1116,  941,  883, 1023,  894,  792, 1143, 1681, 2186, 2220, 2161,  2137,  1977,  1983,  1884,  2159,  2096,  2294,  2159,  2239,  2080,  2177,  2192, 2137, 1785, 1732, 1805, 1503, 1488,   7,   4,   6,   5,   5,   4,   5,   4,   5,   4,   4,   3,   5,   4,   4,   4,   5,   5,   5,   5,   4,   4,   4,   4,   3,   3,   3,   2,   2,   2,   2,   2,   2,  2,  2,  2,  2,  2,  2,  2,  2,  1,  2,  1,  1,  1,  1,  1,  1,  0,  1, 64]
						Execution context start time (in ms)= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
						Execution context compute time (in ms)= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
				}
				ExternalRetrieval #0: ExternalDatastoreRetrieval (see above for dependencies)
			}
			Retrieval #0: PrimitiveAggregatesCacheRetrieval (see above for dependencies)
		}
		Retrieval #0: PrimitiveAggregatesCacheRetrieval (see above for dependencies)
	}
	Retrieval #0: PrimitiveAggregatesCacheRetrieval (see above for dependencies)
}
Retrieval #14: PostProcessedCacheRetrieval
	Location= Pnla Beta Mode@Pnla Core:Pnla Beta Mode=Default,ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
	Measures= [Pnla Value]
	Filter= Global query filter
	Partitioning= Constant partitioning
	Measures provider= SimpleMeasuresProvider
	Result size (in points)= [1]
	Start time   (in ms)= [17249]
	Elapsed time (in ms)= [    0]
 which depends on {
	Retrieval #4: PrimitiveAggregatesCacheRetrieval (see above for dependencies)
	Retrieval #15: PostProcessedAggregatesRetrieval
		Location= Pnla Beta Mode@Pnla Core:Pnla Beta Mode=Default,ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
		Measures= [Pnla Value]
		Filter= Global query filter
		Partitioning= Constant partitioning
		Measures provider= SimpleMeasuresProvider
		Result size (in points)= [1]
		Start time   (in ms)= [17249]
		Elapsed time (in ms)= [    0]
	 which depends on {
		Retrieval #4: PrimitiveAggregatesCacheRetrieval (see above for dependencies)
		Retrieval #16: PostProcessedAggregatesRetrieval
			Location= Pnla Beta Mode@Pnla Core:Pnla Beta Mode=Default,ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
			Measures= [Pnla Value_RAW_DeltaFactorBetaModeChoicePP]
			Filter= Global query filter
			Partitioning= Constant partitioning
			Measures provider= SimpleMeasuresProvider
			Result size (in points)= [1]
			Start time   (in ms)= [17249]
			Elapsed time (in ms)= [    0]
		 which depends on {
			Retrieval #4: PrimitiveAggregatesCacheRetrieval (see above for dependencies)
			Retrieval #17: PrimitiveResultsMerger
				Location= Pnla Delta Factor Raw@Pnla Core:Pnla Delta Factor Raw=[*],ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
				Measures= [Pnla Value_RAW]
				Filter= CubeFilter#1329826655 with SubCubeProperties [grantedMeasures=ALL, grantedMembers={Pnla Core={Pnla Delta Factor=[[AllMember]]}}]
				Partitioning= Constant partitioning
				Measures provider= SimpleMeasuresProvider
				Result size (in points)= [6]
				Start time   (in ms)= [17248]
				Elapsed time (in ms)= [    0]
			 which depends on {
				Retrieval #18: PrimitiveAnalysisAggregationRetrieval
					Location= Pnla Delta Factor Raw@Pnla Core:Pnla Delta Factor Raw=[*],ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
					Measures= [Pnla Value_RAW]
					Filter= CubeFilter#1329826655 with SubCubeProperties [grantedMeasures=ALL, grantedMembers={Pnla Core={Pnla Delta Factor=[[AllMember]]}}]
					Partitioning= value(Month)
					Measures provider= SimpleMeasuresProvider
					Result size (in points)= [0, 0, 6, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4]
					Start time   (in ms)= [0, 0, 1283, 1306, 1171, 1358, 2337, 2356, 2453, 2458, 3416, 3557, 3577, 3524, 4592, 4576, 4714, 4871, 5548, 5738, 5693, 5839, 6584, 6707, 6920, 7081, 7854, 7790, 8003, 8199, 8732, 8737, 9027, 9094, 9525, 9881, 10709, 11281, 11747, 12044, 12847, 13260, 13731, 13929, 15007, 15357, 16026, 16089, 17248, 17165, 15084, 12906, 10712, 8573, 6788, 5054, 3248, 1744, 255, 247, 242, 236, 230, 225, 220, 214, 209, 203, 198, 193, 189, 184, 179, 174, 170, 165, 159, 154, 148, 143, 138, 133, 129, 125, 121, 118, 115, 112, 109, 106, 103, 101, 98, 96, 94, 91, 89, 86, 84, 82, 80, 78, 76, 74, 72, 70, 68, 67, 66, 64]
					Elapsed time (in ms)= [0, 0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,    0,    0,    0,    0,    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]
					Procedure time (in ms)= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
				 which depends on {
					Retrieval #19: RangeSharingPrimitiveAggregatesRetrieval
						Location= Pnla Delta Factor Raw@Pnla Core:Pnla Delta Factor Raw=[*]
						Measures= [Pnla Value_RAW]
						Filter= Global query filter
						Partitioning= value(Month)
						Measures provider= SimpleMeasuresProvider
						Result size (in points)= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
						Start time   (in ms)= [0, 0, 1282, 1306, 1170, 1357, 2336, 2355, 2453, 2458, 3416, 3556, 3577, 3523, 4592, 4576, 4714, 4871, 5548, 5738, 5693, 5838, 6584, 6707, 6920, 7081, 7853, 7789, 8003, 8199, 8732, 8737, 9027, 9094, 9525, 9881, 10708, 11281, 11746, 12044, 12847, 13260, 13730, 13928, 15007, 15356, 16025, 16089, 17248, 17164, 15084, 12905, 10712, 8573, 6787, 5054, 3247, 1743, 255, 247, 242, 236, 230, 224, 220, 214, 209, 203, 198, 193, 189, 184, 179, 174, 170, 165, 159, 154, 148, 143, 138, 133, 129, 125, 121, 118, 115, 112, 109, 106, 103, 101, 98, 96, 94, 91, 89, 86, 84, 82, 80, 78, 76, 74, 72, 70, 68, 67, 66, 64]
						Elapsed time (in ms)= [0, 0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,     0,    0,    0,    0,    0,    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]
					 which depends on {
						Retrieval #13: PartialPrimitiveAggregatesRetrieval (see above for dependencies)
					}
				}
			}
		}
	}
}

Query Plan Summary:
-------------------
	Total number of retrievals: 20
	List of retrievals measures: [contributors.COUNT, Pnla Value_RAW_DeltaFactorBetaModeChoicePP, Pnla Value_RAW, Pnla Value]
	Retrievals count by type: {ExternalDatastoreRetrieval=1, PostProcessedAggregatesRetrieval=4, PrimitiveAnalysisAggregationRetrieval=4, PostProcessedCacheRetrieval=2, PartialPrimitiveAggregatesRetrieval=2, PrimitiveResultsMerger=4, PrimitiveAggregatesCacheRetrieval=2, RangeSharingPrimitiveAggregatesRetrieval=2}
	Used Partial Providers: [Full]
	Partitioning count by type: {value(Month)=6, Constant partitioning=14}

2024-09-03 23:09:49.334 GMT 598606122 [activepivot-health-event-dispatcher] com.rokoscapital.activepivot.logging.QueriesEventHandler.TEXT
DEBUG: Query completed {duration_ms=17271, Hierarchies=[[Strategy].[Strategy Country Name].[AllMember].[null]], Measures=[contributors.COUNT, Pnla Value], AdditionalMeasures=[], Dimensions=[Strategy], query_type=GET_AGGREGATES, CorrelationId=-728928801, user=Adam.Crossley@ROKOS.CORP, PivotId=Pnla}
2024-09-03 23:09:49.336 GMT 598606124 [qfs-common-worker-274] com.activeviam.apm.pivot.query.impl.MonitoredActivePivotQueryExecutor
INFO: [QUERY_EXE_STOP] Action: Execute Query queryId=[557126cabcb9a52], queryType=[ActivePivotSyncActionQuery[MDX]], query=[SELECT NonEmpty([Strategy].[Strategy Country Name].Members, [Measures].[contributors.COUNT]) DIMENSION PROPERTIES ANCESTOR_CAPTION ON ROWS FROM [Pnla]], queryStartTimestamp=[1725404972059], exeId=[643b04fe-586c-4c09-8d72-3c97d9b41aca], totalReplySize: (0), Status: completed OK, CompletionTime: 17276 ms (17 s), Result: n/a, GC stats: n/a, Heap stats: n/a
2024-09-03 23:09:49.337 GMT 598606125 [activepivot-health-event-dispatcher] com.rokoscapital.activepivot.logging.QueriesEventHandler.TEXT
DEBUG: Query completed {duration_ms=17277, Hierarchies=[[Strategy].[Strategy Country Name]], Measures=[contributors.COUNT], query=SELECT  NonEmpty([Strategy].[Strategy Country Name].Members, [Measures].[contributors.COUNT]) DIMENSION PROPERTIES ANCESTOR_CAPTION ON ROWS  FROM [Pnla], Dimensions=[Strategy], query_type=ActivePivotSyncActionQuery, CorrelationId=1727151147, user=Adam.Crossley@ROKOS.CORP}
2024-09-03 23:09:49.340 GMT 598606128 [qfs-common-worker-274] com.activeviam.apm.pivot.webservices.core.impl.MonitoredMdxStream
INFO: [MDX_STREAM_PUBLISHED] Published CellSetEvent[streamId=QueryWebSocketService-66548cd4-7b4d-1627-daee-5bf36f0f8d58-6ce61161-50c9-4103-8a79-565e007794b9-47-23, epoch=59, cellCount=64], TotalReplySize: 13.636 KB(13948)), queryId=[557126cabcb9a52], query=[SELECT NonEmpty([Strategy].[Strategy Country Name].Members, [Measures].[contributors.COUNT]) DIMENSION PROPERTIES ANCESTOR_CAPTION ON ROWS FROM [Pnla]]

        `,
      output: [
        {
          planInfo: {
            branch: "N/A",
            contextValues: {
              IAsOfEpoch: "null",
              IQueriesResultLimit:
                "QueriesResultLimit [transientLimit=9223372036854775807, intermediateLimit=2147483647]",
              ISubCubeProperties: "null",
              IBranch: "null",
            },
            globalTimings: {
              PLANNING: 0,
              CONTEXT: 0,
              FINALIZATION: 2,
              EXECUTION: 17263,
            },
            $parseErrors: {},
            pivotType: "ActivePivotVersion",
            pivotId: "Pnla",
            epoch: "59",
            retrieverType: "Standard aggregates retriever on cube Pnla",
            isContinuous: "false",
            rangeSharing: 1000000,
            missedPrefetchBehavior: "WARN",
            aggregatesCache: "capacity=100000, size=128",
            mdxPass: "GAQ_0",
          },
          queryFilters: [
            {
              id: 0,
              description:
                "CubeFilter#1212813 with SubCubeProperties [grantedMeasures=ALL, grantedMembers=ALL]",
            },
            {
              id: 1,
              description:
                "CubeFilter#1329826655 with SubCubeProperties [grantedMeasures=ALL, grantedMembers={Pnla Core={Pnla Delta Factor=[[AllMember]]}}]",
            },
          ],
          aggregateRetrievals: [
            {
              $kind: "AggregateRetrieval",
              retrievalId: 0,
              type: "PrimitiveAggregatesCacheRetrieval",
              location: [
                {
                  dimension: "Pnla Beta Mode",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Beta Mode"],
                  path: ["Default"],
                },
                {
                  dimension: "Strategy Country Name",
                  hierarchy: "Strategy",
                  level: ["Country Name"],
                  path: ["[*]"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["contributors.COUNT"],
              timingInfo: {
                startTime: [0],
                elapsedTime: [0],
              },
              partitioning: "Constant partitioning",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [63],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 1,
              type: "PrimitiveAnalysisAggregationRetrieval",
              location: [
                {
                  dimension: "Pnla Beta Mode",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Beta Mode"],
                  path: ["Default"],
                },
                {
                  dimension: "Strategy Country Name",
                  hierarchy: "Strategy",
                  level: ["Country Name"],
                  path: ["[*]"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["contributors.COUNT"],
              timingInfo: {
                startTime: [0],
                elapsedTime: [0],
              },
              partitioning: "Constant partitioning",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [63],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 2,
              type: "PrimitiveResultsMerger",
              location: [
                {
                  dimension: "StrategyScdId",
                  hierarchy: "Strategy_HIDDEN",
                  level: ["StrategyScdId"],
                  path: ["[*]"],
                },
              ],
              measures: ["contributors.COUNT"],
              timingInfo: {
                startTime: [16661],
                elapsedTime: [6],
              },
              partitioning: "Constant partitioning",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [4539],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 3,
              partialProviderName: "Full",
              type: "PartialPrimitiveAggregatesRetrieval",
              location: [
                {
                  dimension: "StrategyScdId",
                  hierarchy: "Strategy_HIDDEN",
                  level: ["StrategyScdId"],
                  path: ["[*]"],
                },
              ],
              measures: ["contributors.COUNT"],
              timingInfo: {
                startTime: [
                  0, 0, 740, 757, 1413, 1535, 2073, 2133, 2712, 2763, 3324,
                  3429, 3944, 4030, 4606, 4608, 5260, 5319, 5809, 5965, 6362,
                  6506, 6952, 7075, 7605, 7831, 8417, 8500, 9094, 9190, 9675,
                  9729, 10310, 10314, 10794, 11067, 11888, 12372, 13226, 13681,
                  14523, 14880, 15357, 15260, 13737, 12307, 10885, 9523, 8088,
                  6640, 5228, 4115, 3070, 1977, 1097, 151, 148, 146, 142, 139,
                  136, 133, 129, 126, 123, 120, 117, 115, 112, 109, 106, 104,
                  100, 97, 94, 90, 87, 84, 81, 79, 76, 74, 72, 70, 68, 67, 65,
                  63, 62, 60, 59, 57, 56, 54, 53, 51, 50, 49, 47, 46, 45, 44,
                  43, 42, 41, 40, 39, 0,
                ],
                elapsedTime: [
                  756, 739, 671, 777, 659, 597, 638, 629, 611, 665, 619, 600,
                  663, 576, 652, 710, 548, 645, 551, 540, 589, 567, 653, 755,
                  811, 668, 675, 689, 581, 538, 637, 580, 483, 752, 1092, 1304,
                  1337, 1308, 1296, 1198, 1205, 1158, 1303, 1385, 1522, 1429,
                  1421, 1361, 1435, 1446, 1411, 1112, 1043, 1093, 879, 945, 2,
                  2, 3, 3, 3, 2, 3, 2, 3, 2, 2, 2, 3, 2, 2, 2, 3, 3, 3, 3, 2, 2,
                  2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                  1, 1, 0, 1, 0, 0, 0, 0, 39,
                ],
              },
              partitioning: "value(Month)",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [
                1547, 1493, 1401, 1304, 1303, 1221, 1218, 1209, 1168, 1140,
                1103, 1059, 1059, 1030, 1022, 978, 922, 922, 907, 895, 969, 922,
                972, 928, 868, 828, 783, 771, 742, 761, 815, 848, 807, 1003,
                1800, 1803, 1759, 1732, 1723, 1693, 1727, 1626, 1697, 1543,
                1432, 1312, 1378, 1178, 1216, 1138, 1082, 1051, 1034, 1004, 916,
                869, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1258,
              ],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 4,
              type: "PrimitiveAggregatesCacheRetrieval",
              location: [
                {
                  dimension: "Pnla Beta Mode",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Beta Mode"],
                  path: ["Default"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["contributors.COUNT"],
              timingInfo: {
                startTime: [0],
                elapsedTime: [0],
              },
              partitioning: "Constant partitioning",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [1],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 5,
              type: "PrimitiveResultsMerger",
              location: [
                {
                  dimension: "Pnla Beta Mode",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Beta Mode"],
                  path: ["Default"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["contributors.COUNT"],
              timingInfo: {
                startTime: [0],
                elapsedTime: [0],
              },
              partitioning: "Constant partitioning",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [1],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 6,
              type: "PrimitiveAnalysisAggregationRetrieval",
              location: [
                {
                  dimension: "Pnla Beta Mode",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Beta Mode"],
                  path: ["Default"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["contributors.COUNT"],
              timingInfo: {
                startTime: [
                  0, 0, 756, 740, 1412, 1534, 2072, 2133, 2712, 2762, 3324,
                  3428, 3944, 4029, 4608, 4606, 5259, 5319, 5809, 5965, 6361,
                  6506, 6951, 7074, 7605, 7831, 8417, 8500, 9093, 9190, 9675,
                  9728, 10314, 10309, 10794, 11066, 11887, 12371, 13225, 13681,
                  14523, 14880, 15729, 16039, 16661, 16646, 15260, 13737, 12307,
                  10885, 9523, 8087, 6640, 5228, 4115, 3070, 1977, 1096, 151,
                  148, 146, 142, 139, 136, 133, 129, 126, 123, 120, 117, 115,
                  112, 109, 106, 103, 100, 97, 94, 90, 87, 84, 81, 78, 76, 74,
                  72, 70, 68, 67, 65, 63, 62, 60, 59, 57, 56, 54, 53, 51, 50,
                  49, 47, 46, 45, 44, 43, 42, 41, 40, 39,
                ],
                elapsedTime: [
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0,
                ],
              },
              partitioning: "value(Month)",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [
                0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1,
              ],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 7,
              type: "RangeSharingPrimitiveAggregatesRetrieval",
              location: [],
              measures: ["contributors.COUNT"],
              timingInfo: {
                startTime: [
                  0, 0, 756, 740, 1412, 1534, 2072, 2132, 2712, 2762, 3324,
                  3428, 3944, 4029, 4607, 4606, 5259, 5319, 5809, 5965, 6361,
                  6506, 6951, 7074, 7605, 7830, 8417, 8500, 9093, 9189, 9675,
                  9728, 10313, 10309, 10794, 11066, 11887, 12371, 13225, 13680,
                  14523, 14880, 15729, 16039, 16661, 16646, 15259, 13736, 12306,
                  10885, 9523, 8087, 6640, 5227, 4114, 3070, 1976, 1096, 151,
                  148, 146, 142, 139, 136, 133, 129, 126, 123, 120, 117, 115,
                  112, 109, 106, 103, 100, 97, 94, 90, 87, 84, 81, 78, 76, 74,
                  72, 70, 68, 67, 65, 63, 62, 60, 58, 57, 56, 54, 53, 51, 50,
                  49, 47, 46, 45, 44, 43, 42, 41, 40, 39,
                ],
                elapsedTime: [
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0,
                ],
              },
              partitioning: "value(Month)",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [
                0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1,
              ],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 8,
              type: "PostProcessedCacheRetrieval",
              location: [
                {
                  dimension: "Pnla Beta Mode",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Beta Mode"],
                  path: ["Default"],
                },
                {
                  dimension: "Strategy Country Name",
                  hierarchy: "Strategy",
                  level: ["Country Name"],
                  path: ["[*]"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["Pnla Value"],
              timingInfo: {
                startTime: [17263],
                elapsedTime: [0],
              },
              partitioning: "Constant partitioning",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [63],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 9,
              type: "PostProcessedAggregatesRetrieval",
              location: [
                {
                  dimension: "Pnla Beta Mode",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Beta Mode"],
                  path: ["Default"],
                },
                {
                  dimension: "Strategy Country Name",
                  hierarchy: "Strategy",
                  level: ["Country Name"],
                  path: ["[*]"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["Pnla Value"],
              timingInfo: {
                startTime: [17263],
                elapsedTime: [0],
              },
              partitioning: "Constant partitioning",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [63],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 10,
              type: "PostProcessedAggregatesRetrieval",
              location: [
                {
                  dimension: "Pnla Beta Mode",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Beta Mode"],
                  path: ["Default"],
                },
                {
                  dimension: "Strategy Country Name",
                  hierarchy: "Strategy",
                  level: ["Country Name"],
                  path: ["[*]"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["Pnla Value_RAW_DeltaFactorBetaModeChoicePP"],
              timingInfo: {
                startTime: [17263],
                elapsedTime: [0],
              },
              partitioning: "Constant partitioning",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [63],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 11,
              type: "PrimitiveAnalysisAggregationRetrieval",
              location: [
                {
                  dimension: "Pnla Delta Factor Raw",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Delta Factor Raw"],
                  path: ["[*]"],
                },
                {
                  dimension: "Strategy Country Name",
                  hierarchy: "Strategy",
                  level: ["Country Name"],
                  path: ["[*]"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["Pnla Value_RAW"],
              timingInfo: {
                startTime: [17259],
                elapsedTime: [3],
              },
              partitioning: "Constant partitioning",
              filterId: 1,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [200],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 12,
              type: "PrimitiveResultsMerger",
              location: [
                {
                  dimension: "Pnla Delta Factor Raw",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Delta Factor Raw"],
                  path: ["[*]"],
                },
                {
                  dimension: "StrategyScdId",
                  hierarchy: "Strategy_HIDDEN",
                  level: ["StrategyScdId"],
                  path: ["[*]"],
                },
              ],
              measures: ["Pnla Value_RAW"],
              timingInfo: {
                startTime: [17248],
                elapsedTime: [10],
              },
              partitioning: "Constant partitioning",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [6995],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 13,
              partialProviderName: "Full",
              type: "PartialPrimitiveAggregatesRetrieval",
              location: [
                {
                  dimension: "Pnla Delta Factor Raw",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Delta Factor Raw"],
                  path: ["[*]"],
                },
                {
                  dimension: "StrategyScdId",
                  hierarchy: "Strategy_HIDDEN",
                  level: ["StrategyScdId"],
                  path: ["[*]"],
                },
              ],
              measures: ["Pnla Value_RAW"],
              timingInfo: {
                startTime: [
                  0, 0, 1, 5, 1171, 1283, 1307, 1358, 2337, 2356, 2453, 2459,
                  3417, 3524, 3557, 3578, 4577, 4593, 4715, 4872, 5548, 5694,
                  5739, 5839, 6584, 6708, 6920, 7082, 7790, 7854, 8003, 8199,
                  8733, 8738, 9027, 9094, 9526, 9882, 10709, 11282, 11747,
                  12044, 12848, 13260, 13731, 13929, 15008, 15084, 12906, 10712,
                  8574, 6788, 5055, 3248, 1744, 255, 247, 242, 236, 230, 225,
                  220, 214, 209, 203, 198, 193, 189, 184, 179, 175, 170, 165,
                  159, 154, 148, 143, 138, 133, 129, 125, 121, 118, 115, 112,
                  109, 106, 104, 101, 98, 96, 94, 91, 89, 86, 84, 82, 80, 78,
                  76, 74, 72, 70, 69, 67, 66, 65, 0,
                ],
                elapsedTime: [
                  1282, 1305, 1169, 1351, 1165, 1072, 1146, 1100, 1078, 1200,
                  1123, 1064, 1175, 1052, 1157, 1293, 970, 1145, 978, 966, 1035,
                  1013, 1180, 1242, 1269, 1081, 1082, 1116, 941, 883, 1023, 894,
                  792, 1143, 1681, 2186, 2220, 2161, 2137, 1977, 1983, 1884,
                  2159, 2096, 2294, 2159, 2239, 2080, 2177, 2192, 2137, 1785,
                  1732, 1805, 1503, 1488, 7, 4, 6, 5, 5, 4, 5, 4, 5, 4, 4, 3, 5,
                  4, 4, 4, 5, 5, 5, 5, 4, 4, 4, 4, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2,
                  2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1, 0, 1, 64,
                ],
              },
              partitioning: "value(Month)",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [
                3120, 2197, 2069, 1886, 1850, 1750, 1732, 1702, 1651, 1630,
                1561, 1471, 1443, 1380, 1368, 1320, 1224, 1248, 1195, 1174,
                1256, 1210, 1266, 1218, 1144, 1068, 1017, 969, 914, 933, 995,
                848, 979, 1003, 1800, 1803, 1759, 1732, 1723, 1693, 1727, 1626,
                1697, 1543, 1432, 1312, 1378, 1178, 1216, 1138, 1082, 1051,
                1034, 1004, 916, 869, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2128,
              ],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 14,
              type: "PostProcessedCacheRetrieval",
              location: [
                {
                  dimension: "Pnla Beta Mode",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Beta Mode"],
                  path: ["Default"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["Pnla Value"],
              timingInfo: {
                startTime: [17249],
                elapsedTime: [0],
              },
              partitioning: "Constant partitioning",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [1],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 15,
              type: "PostProcessedAggregatesRetrieval",
              location: [
                {
                  dimension: "Pnla Beta Mode",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Beta Mode"],
                  path: ["Default"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["Pnla Value"],
              timingInfo: {
                startTime: [17249],
                elapsedTime: [0],
              },
              partitioning: "Constant partitioning",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [1],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 16,
              type: "PostProcessedAggregatesRetrieval",
              location: [
                {
                  dimension: "Pnla Beta Mode",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Beta Mode"],
                  path: ["Default"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["Pnla Value_RAW_DeltaFactorBetaModeChoicePP"],
              timingInfo: {
                startTime: [17249],
                elapsedTime: [0],
              },
              partitioning: "Constant partitioning",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [1],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 17,
              type: "PrimitiveResultsMerger",
              location: [
                {
                  dimension: "Pnla Delta Factor Raw",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Delta Factor Raw"],
                  path: ["[*]"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["Pnla Value_RAW"],
              timingInfo: {
                startTime: [17248],
                elapsedTime: [0],
              },
              partitioning: "Constant partitioning",
              filterId: 1,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [6],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 18,
              type: "PrimitiveAnalysisAggregationRetrieval",
              location: [
                {
                  dimension: "Pnla Delta Factor Raw",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Delta Factor Raw"],
                  path: ["[*]"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["Pnla Value_RAW"],
              timingInfo: {
                startTime: [
                  0, 0, 1283, 1306, 1171, 1358, 2337, 2356, 2453, 2458, 3416,
                  3557, 3577, 3524, 4592, 4576, 4714, 4871, 5548, 5738, 5693,
                  5839, 6584, 6707, 6920, 7081, 7854, 7790, 8003, 8199, 8732,
                  8737, 9027, 9094, 9525, 9881, 10709, 11281, 11747, 12044,
                  12847, 13260, 13731, 13929, 15007, 15357, 16026, 16089, 17248,
                  17165, 15084, 12906, 10712, 8573, 6788, 5054, 3248, 1744, 255,
                  247, 242, 236, 230, 225, 220, 214, 209, 203, 198, 193, 189,
                  184, 179, 174, 170, 165, 159, 154, 148, 143, 138, 133, 129,
                  125, 121, 118, 115, 112, 109, 106, 103, 101, 98, 96, 94, 91,
                  89, 86, 84, 82, 80, 78, 76, 74, 72, 70, 68, 67, 66, 64,
                ],
                elapsedTime: [
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0,
                ],
              },
              partitioning: "value(Month)",
              filterId: 1,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [
                0, 0, 6, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
                3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 4,
              ],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 19,
              type: "RangeSharingPrimitiveAggregatesRetrieval",
              location: [
                {
                  dimension: "Pnla Delta Factor Raw",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Delta Factor Raw"],
                  path: ["[*]"],
                },
              ],
              measures: ["Pnla Value_RAW"],
              timingInfo: {
                startTime: [
                  0, 0, 1282, 1306, 1170, 1357, 2336, 2355, 2453, 2458, 3416,
                  3556, 3577, 3523, 4592, 4576, 4714, 4871, 5548, 5738, 5693,
                  5838, 6584, 6707, 6920, 7081, 7853, 7789, 8003, 8199, 8732,
                  8737, 9027, 9094, 9525, 9881, 10708, 11281, 11746, 12044,
                  12847, 13260, 13730, 13928, 15007, 15356, 16025, 16089, 17248,
                  17164, 15084, 12905, 10712, 8573, 6787, 5054, 3247, 1743, 255,
                  247, 242, 236, 230, 224, 220, 214, 209, 203, 198, 193, 189,
                  184, 179, 174, 170, 165, 159, 154, 148, 143, 138, 133, 129,
                  125, 121, 118, 115, 112, 109, 106, 103, 101, 98, 96, 94, 91,
                  89, 86, 84, 82, 80, 78, 76, 74, 72, 70, 68, 67, 66, 64,
                ],
                elapsedTime: [
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0,
                ],
              },
              partitioning: "value(Month)",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
              ],
            },
          ],
          externalRetrievals: [
            {
              $kind: "ExternalRetrieval",
              retrievalId: 0,
              type: "ExternalDatastoreRetrieval",
              store: "StrategyCountryJunction",
              fields: [],
              joinedMeasure: [""],
              condition: "TRUE",
              resultSizes: [21216],
              timingInfo: {
                startTime: [0],
                elapsedTime: [5],
              },
            },
          ],
          querySummary: {
            measures: [
              "contributors.COUNT",
              "Pnla Value",
              "Pnla Value_RAW_DeltaFactorBetaModeChoicePP",
              "Pnla Value_RAW",
            ],
            totalRetrievals: 21,
            retrievalsCountByType: {
              PrimitiveAggregatesCacheRetrieval: 2,
              PrimitiveAnalysisAggregationRetrieval: 4,
              PrimitiveResultsMerger: 4,
              PartialPrimitiveAggregatesRetrieval: 2,
              RangeSharingPrimitiveAggregatesRetrieval: 2,
              PostProcessedCacheRetrieval: 2,
              PostProcessedAggregatesRetrieval: 4,
              ExternalDatabaseRetrieval: 1,
            },
            partitioningCountByType: {
              "Constant partitioning": 14,
              "value(Month)": 6,
            },
            resultSizeByPartitioning: {
              "Constant partitioning": 12060,
              "value(Month)": 148021,
            },
            partialProviders: ["Full"],
            totalExternalResultSize: 21216,
          },
          dependencies: {
            "0": [1],
            "1": [2],
            "2": [3],
            "4": [5],
            "5": [6],
            "6": [7],
            "7": [3],
            "8": [0, 9],
            "9": [0, 10],
            "10": [0, 11],
            "11": [12],
            "12": [13],
            "14": [4, 15],
            "15": [4, 16],
            "16": [4, 17],
            "17": [18],
            "18": [19],
            "19": [13],
            "-1": [8, 14],
          },
          externalDependencies: {
            "1": [0],
            "11": [0],
          },
          needFillTimingInfo: false,
        },
      ],
    },
    {
      input: `
        query with combined "all country names" and "country name" filters
notes: fast
duration: <1 second

INFO: [MDX_STREAM_PUBLISHED] Published CellSetEvent[streamId=QueryWebSocketService-66548cd4-7b4d-1627-daee-5bf36f0f8d58-33eebe54-1a8a-40e6-a3b8-72e68c88ed40-49-24, epoch=59, cellCount=12], TotalReplySize: 3.482 KB(3554)), queryId=[3fc03f6a5cfa470], query=[SELECT NonEmpty([Strategy].[All Country Names].Members, [Measures].[contributors.COUNT]) DIMENSION PROPERTIES ANCESTOR_CAPTION ON ROWS FROM [Pnla] WHERE [Strategy].[Strategy Country Name].[ALL].[AllMember].[Canada]]
2024-09-03 23:13:39.203 GMT 598835991 [activepivot-health-event-dispatcher] com.activeviam.health.monitor.IComposerHealthEventHandler
INFO: [jvm, memory] INFO 2024-09-03T23:13:39.202Z uptime=598836810ms com.activeviam.health.monitor.impl.JvmHealthCheck.createEvent:62 thread=activepivot-health-check thread_id=57 event_type=JvmMemoryReport JVM Memory Usage report: G1 Young Generation[count=941 (+0), time=113s (+0)]  G1 Old Generation[count=0 (+0), time=0s (+0)]  Heap[used=38 GiB 786 MiB (41627322544) (+32 MiB (33554432)), committed=90 GiB (96636764160) (+(0)), max=90 GiB (96636764160) (+(0))]  Direct[used=422 GiB 944 MiB (454109760573) (+415 bytes (415)), count=1096884 (+2), max=553 GiB (593779228672) (+(0))]  Threads[count=216 (+1), peak=254 (+0)]
2024-09-03 23:13:39.690 GMT 598836478 [http-nio-9090-exec-20] com.activeviam.apm.pivot.webservices.core.impl.MonitoredMdxStream
INFO: [MDX_STREAM_STOPPED] Stopped MonitoredMDXStream[streamId=QueryWebSocketService-66548cd4-7b4d-1627-daee-5bf36f0f8d58-33eebe54-1a8a-40e6-a3b8-72e68c88ed40-49-24, queryId=[3fc03f6a5cfa470], query=[SELECT NonEmpty([Strategy].[All Country Names].Members, [Measures].[contributors.COUNT]) DIMENSION PROPERTIES ANCESTOR_CAPTION ON ROWS FROM [Pnla] WHERE [Strategy].[Strategy Country Name].[ALL].[AllMember].[Canada]]
2024-09-03 23:13:39.690 GMT 598836478 [activepivot-health-event-dispatcher] com.activeviam.health.monitor.IActivePivotHealthEventHandler
INFO: [activepivot, realtime, query] INFO 2024-09-03T23:13:39.690Z uptime=598837298ms com.quartetfs.biz.pivot.streaming.impl.AActivePivotStream.transitionState:291 thread=http-nio-9090-exec-20 thread_id=10630 event_type=ActivePivotContinuousQueryUnregistered user=Adam.Crossley@ROKOS.CORP roles=[ROLE_FULL_CUBE, ROLE_USER] Unregistered  query=MdxQuery [mdx=SELECT NonEmpty([Strategy].[All Country Names].Members, [Measures].[contributors.COUNT]) DIMENSION PROPERTIES ANCESTOR_CAPTION ON ROWS FROM [Pnla] WHERE [Strategy].[Strategy Country Name].[ALL].[AllMember].[Canada], cellsOnly=false, contextValues=[MdxContext [repository={ancestorCaptionOnSlicer=true}]]]
2024-09-03 23:13:39.695 GMT 598836483 [http-nio-9090-exec-20] com.rokoscapital.activepivot.logging.LogMdxQueryOnQueryStart.TEXT
INFO: MDX Query Started - {Hierarchies=[[Strategy].[All Country Names].[ALL].[AllMember].[Canada,Japan], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,United States], [Strategy].[All Country Names].[ALL].[AllMember].[Australia,Canada], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Global], [Strategy].[All Country Names].[ALL].[AllMember].[Canada], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Eurozone], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Switzerland], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Norway], [AsofDate].[Year Hierarchy].[ALL].[AllMember], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Japan,Switzerland], [Strategy].[All Country Names].[ALL].[AllMember].[Australia,Canada,Japan], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,New Zealand], [Strategy].[Strategy Country Name].[ALL].[AllMember].[Canada]], Measures=[Pnla Value], query=SELECT
  NON EMPTY {[Measures].[Pnla Value]} DIMENSION PROPERTIES ANCESTOR_CAPTION ON COLUMNS,
  NON EMPTY Hierarchize(Descendants({[AsofDate].[Year Hierarchy].[ALL].[AllMember]}, 1, SELF_AND_BEFORE)) DIMENSION PROPERTIES CHILDREN_CARDINALITY,ANCESTOR_CAPTION ON ROWS
 FROM (SELECT
 {[Strategy].[All Country Names].[ALL].[AllMember].[Australia,Canada], [Strategy].[All Country Names].[ALL].[AllMember].[Australia,Canada,Japan], [Strategy].[All Country Names].[ALL].[AllMember].[Canada], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Eurozone], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Global], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Japan], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Japan,Switzerland], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,New Zealand], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Norway], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Switzerland], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,United States]} ON COLUMNS
 FROM [Pnla]
 WHERE [Strategy].[Strategy Country Name].[ALL].[AllMember].[Canada])
 WHERE [Strategy].[Strategy Country Name].[ALL].[AllMember].[Canada]
 CELL PROPERTIES VALUE,FORMATTED_VALUE,BACK_COLOR,FORE_COLOR,FONT_FLAGS, Dimensions=[AsofDate, Strategy], query_type=MDX}
2024-09-03 23:13:39.695 GMT 598836483 [http-nio-9090-exec-20] com.quartetfs.pivot.mdx.impl.MdxQueryBouncer
WARN: No default timeout set. Trying to acquire a permit for at most PT2H. Use the property activeviam.mdx.queryBouncer.waitLimit to configure a default timeout if wanted.
2024-09-03 23:13:39.696 GMT 598836484 [activepivot-health-event-dispatcher] com.activeviam.health.monitor.IActivePivotHealthEventHandler
INFO: [activepivot, realtime, query] INFO 2024-09-03T23:13:39.695Z uptime=598837303ms com.quartetfs.biz.pivot.streaming.impl.AActivePivotStream.updateQuery:123 thread=http-nio-9090-exec-20 thread_id=10630 event_type=ActivePivotContinuousQueryUpdated user=Adam.Crossley@ROKOS.CORP roles=[ROLE_FULL_CUBE, ROLE_USER] Updated  new_query=MdxQuery [mdx=SELECT NON EMPTY {[Measures].[Pnla Value]} DIMENSION PROPERTIES ANCESTOR_CAPTION ON COLUMNS, NON EMPTY Hierarchize(Descendants({[AsofDate].[Year Hierarchy].[ALL].[AllMember]}, 1, SELF_AND_BEFORE)) DIMENSION PROPERTIES CHILDREN_CARDINALITY,ANCESTOR_CAPTION ON ROWS FROM (SELECT {[Strategy].[All Country Names].[ALL].[AllMember].[Australia,Canada], [Strategy].[All Country Names].[ALL].[AllMember].[Australia,Canada,Japan], [Strategy].[All Country Names].[ALL].[AllMember].[Canada], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Eurozone], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Global], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Japan], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Japan,Switzerland], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,New Zealand], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Norway], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Switzerland], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,United States]} ON COLUMNS FROM [Pnla] WHERE [Strategy].[Strategy Country Name].[ALL].[AllMember].[Canada]) WHERE [Strategy].[Strategy Country Name].[ALL].[AllMember].[Canada] CELL PROPERTIES VALUE,FORMATTED_VALUE,BACK_COLOR,FORE_COLOR,FONT_FLAGS, cellsOnly=false, contextValues=[MdxContext [repository={ancestorCaptionOnSlicer=true}]]] old_query=MdxQuery [mdx=SELECT NON EMPTY {[Measures].[Pnla Value]} DIMENSION PROPERTIES ANCESTOR_CAPTION ON COLUMNS, NON EMPTY Hierarchize(Descendants({[AsofDate].[Year Hierarchy].[ALL].[AllMember]}, 1, SELF_AND_BEFORE)) DIMENSION PROPERTIES CHILDREN_CARDINALITY,ANCESTOR_CAPTION ON ROWS FROM [Pnla] WHERE [Strategy].[Strategy Country Name].[ALL].[AllMember].[Canada] CELL PROPERTIES VALUE,FORMATTED_VALUE,BACK_COLOR,FORE_COLOR,FONT_FLAGS, cellsOnly=false, contextValues=[MdxContext [repository={ancestorCaptionOnSlicer=true}]]]
2024-09-03 23:13:39.696 GMT 598836484 [qfs-common-worker-284] com.activeviam.apm.pivot.query.impl.MonitoredActivePivotQueryExecutor
INFO: [QUERY_EXE_START] Action: Execute Query queryId=[a6b798534251b3a], queryType=[ActivePivotSyncActionQuery[MDX]], query=[SELECT NON EMPTY {[Measures].[Pnla Value]} DIMENSION PROPERTIES ANCESTOR_CAPTION ON COLUMNS, NON EMPTY Hierarchize(Descendants({[AsofDate].[Year Hierarchy].[ALL].[AllMember]}, 1, SELF_AND_BEFORE)) DIMENSION PROPERTIES CHILDREN_CARDINALITY,ANCESTOR_CAPTION ON ROWS FROM (SELECT {[Strategy].[All Country Names].[ALL].[AllMember].[Australia,Canada], [Strategy].[All Country Names].[ALL].[AllMember].[Australia,Canada,Japan], [Strategy].[All Country Names].[ALL].[AllMember].[Canada], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Eurozone], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Global], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Japan], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Japan,Switzerland], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,New Zealand], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Norway], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Switzerland], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,United States]} ON COLUMNS FROM [Pnla] WHERE [Strategy].[Strategy Country Name].[ALL].[AllMember].[Canada]) WHERE [Strategy].[Strategy Country Name].[ALL].[AllMember].[Canada] CELL PROPERTIES VALUE,FORMATTED_VALUE,BACK_COLOR,FORE_COLOR,FONT_FLAGS], queryStartTimestamp=[1725405219695], exeId=[745181bb-2ffd-4fc9-be6d-f1d4a5de4038], Status: in progress, CompletionTime: n/a, Result: n/a, GC stats: n/a, Heap stats: n/a
2024-09-03 23:13:39.699 GMT 598836487 [qfs-common-worker-284] com.activeviam.apm.pivot.query.impl.MonitoredActivePivotQueryExecutor
INFO: [QUERY_EXE_START] Action: Execute Query queryId=[9803c69bd0e71d1], queryType=[GET_AGGREGATES], query=[GetAggregatesQuery[pivotId=Pnla,nbLocations=2,measureSelection=[Pnla Value],additionalMeasures=[],contextValues=<null>]], queryStartTimestamp=[1725405219699], exeId=[842b9128-b819-499e-a4b2-b59864e94ca8], Status: in progress, CompletionTime: n/a, Result: n/a, GC stats: n/a, Heap stats: n/a
2024-09-03 23:13:39.703 GMT 598836491 [qfs-common-worker-284] com.activeviam.apm.pivot.query.impl.MonitoredActivePivotQueryExecutor
INFO: [QUERY_EXE_STOP] Action: Execute Query queryId=[9803c69bd0e71d1], queryType=[GET_AGGREGATES], query=[GetAggregatesQuery[pivotId=Pnla,nbLocations=2,measureSelection=[Pnla Value],additionalMeasures=[],contextValues=<null>]], queryStartTimestamp=[1725405219699], exeId=[842b9128-b819-499e-a4b2-b59864e94ca8], totalReplySize: (0), Status: completed OK, CompletionTime: 3 ms, Result: n/a, GC stats: n/a, Heap stats: n/a
2024-09-03 23:13:39.710 GMT 598836498 [qfs-pool-1-query-worker-541] com.qfs.store.query.impl.QueryCompiler
DEBUG: Plan for RecordQuery on store StrategyCountryJunction with condition: CountryName = Canada and fields: [SelectionField [name=CountryName, expression=CountryName], SelectionField [name=CountryStrategyScdId, expression=CountryStrategyScdId]]:
Search on store StrategyCountryJunction, composed of:
    Scan of field CountryName
2024-09-03 23:13:39.710 GMT 598836498 [qfs-pool-1-query-worker-541] com.qfs.store.query.impl.QueryCompiler
DEBUG: Cursor conditions: []
2024-09-03 23:13:40.095 GMT 598836883 [qfs-pool-1-query-worker-543] com.quartetfs.biz.pivot.query.aggregates.impl.ActivePivotAggregatesRetriever
INFO: 
GetAggregatesQuery explanation
==============================

General information:
-------------------
	ActivePivot: ActivePivotVersion [id=Pnla, epoch=59]
	RetrieverActivePivotAggregatesRetriever : Standard aggregates retriever on cube Pnla

Context values:
--------------
	IAsOfEpoch: null
	ICubeFilter: CubeFilter#684908155 with SubCubeProperties [grantedMeasures=ALL, grantedMembers={Strategy={All Country Names=[[AllMember, IN - [Canada,Eurozone, Canada, Canada,Global, Canada,Japan, Canada,Norway, Canada,United States, Australia,Canada,Japan, Canada,Japan,Switzerland, Canada,New Zealand, Canada,Switzerland, Australia,Canada]]]}}]
	IQueriesResultLimit: QueriesResultLimit [transientLimit=9223372036854775807, intermediateLimit=2147483647]
	ISubCubeProperties: null
	IBranch: null

Additional properties:
---------------------
	Continuous: false
	Range sharing: 1000000
	Missed prefetches: WARN
	Cache: capacity=100000, size=163

Planning:
--------
	Planning time: 0ms
		Execution context creation time: 0ms
	Planning finalization time: 1ms

Execution:
---------
	Total query execution time: 391ms

Query plan:
----------
Retrieval #0: PostProcessedCacheRetrieval
	Location= Pnla Beta Mode@Pnla Core:Pnla Beta Mode=Default,Strategy Country Name@Strategy:Country Name=Canada,Year Hierarchy@AsofDate:Year=[*],ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
	Measures= [Pnla Value]
	Filter= Global query filter
	Partitioning= Constant partitioning
	Measures provider= SimpleMeasuresProvider
	Result size (in points)= [5]
	Start time   (in ms)= [391]
	Elapsed time (in ms)= [  0]
 which depends on {
	Retrieval #1: NoOpPrimitiveAggregatesRetrieval
		Simple placeholder (no work done in this retrieval)
		Partitioning= Constant partitioning
		Result size (in points)= []
		Start time   (in ms)= []
		Elapsed time (in ms)= []
	Retrieval #2: PostProcessedAggregatesRetrieval
		Location= Pnla Beta Mode@Pnla Core:Pnla Beta Mode=Default,Strategy Country Name@Strategy:Country Name=Canada,Year Hierarchy@AsofDate:Year=[*],ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
		Measures= [Pnla Value]
		Filter= Global query filter
		Partitioning= Constant partitioning
		Measures provider= SimpleMeasuresProvider
		Result size (in points)= [5]
		Start time   (in ms)= [391]
		Elapsed time (in ms)= [  0]
	 which depends on {
		Retrieval #3: PostProcessedAggregatesRetrieval
			Location= Pnla Beta Mode@Pnla Core:Pnla Beta Mode=Default,Strategy Country Name@Strategy:Country Name=Canada,Year Hierarchy@AsofDate:Year=[*],ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
			Measures= [Pnla Value_RAW_DeltaFactorBetaModeChoicePP]
			Filter= Global query filter
			Partitioning= Constant partitioning
			Measures provider= SimpleMeasuresProvider
			Result size (in points)= [5]
			Start time   (in ms)= [390]
			Elapsed time (in ms)= [  0]
		 which depends on {
			Retrieval #1: NoOpPrimitiveAggregatesRetrieval (see above for dependencies)
			Retrieval #4: PrimitiveAnalysisAggregationRetrieval
				Location= Pnla Delta Factor Raw@Pnla Core:Pnla Delta Factor Raw=[*],Strategy Country Name@Strategy:Country Name=Canada,Year Hierarchy@AsofDate:Year=[*],ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
				Measures= [Pnla Value_RAW]
				Filter= CubeFilter#2013521997 with SubCubeProperties [grantedMeasures=ALL, grantedMembers={Pnla Core={Pnla Delta Factor=[[AllMember]]}, Strategy={All Country Names=[[AllMember, IN - [Canada,Eurozone, Canada, Canada,Global, Canada,Japan, Canada,Norway, Canada,United States, Australia,Canada,Japan, Canada,Japan,Switzerland, Canada,New Zealand, Canada,Switzerland, Australia,Canada]]]}}]
				Partitioning= Constant partitioning
				Measures provider= SimpleMeasuresProvider
				Result size (in points)= [5]
				Start time   (in ms)= [389]
				Elapsed time (in ms)= [  0]
				Procedure time (in ms)= [0]
			 which depends on {
				Retrieval #5: PrimitiveResultsMerger
					Location= Pnla Delta Factor Raw@Pnla Core:Pnla Delta Factor Raw=[*],StrategyScdId@Strategy_HIDDEN:StrategyScdId=[*],Year Hierarchy@AsofDate:Year=[*]
					Measures= [Pnla Value_RAW]
					Filter= Global query filter
					Partitioning= Constant partitioning
					Measures provider= SimpleMeasuresProvider
					Result size (in points)= [176]
					Start time   (in ms)= [388]
					Elapsed time (in ms)= [  0]
				 which depends on {
					Retrieval #6: PartialPrimitiveAggregatesRetrieval
						Location= Pnla Delta Factor Raw@Pnla Core:Pnla Delta Factor Raw=[*],StrategyScdId@Strategy_HIDDEN:StrategyScdId=[*],Year Hierarchy@AsofDate:Year=[*]
						Measures= [Pnla Value_RAW]
						Filter= Global query filter
						Partitioning= value(Month)
						Measures provider= SimpleMeasuresProvider
						Partial provider= Full
						Result size (in points)= [28, 24, 24, 24, 24, 23, 27, 28, 24, 24, 24, 23, 23, 22, 21, 20, 16, 17, 16, 16, 20, 19, 20, 21, 19, 18, 17, 18, 18, 20, 20, 27, 25, 29, 43, 44, 44, 42, 42, 42, 43, 41, 43, 39, 32, 30, 31, 25, 24, 24, 23, 22, 22, 21, 18, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25]
						Start time   (in ms)= [ 7,  7,  7,  7,  8,  8,  8, 51, 54, 55, 56, 59, 59, 65, 87, 89, 89, 90, 91, 91, 93, 117, 120, 121, 124, 125, 127, 128, 156, 160, 163, 167, 168, 182, 189, 193, 197, 197, 200, 220, 239, 260, 261, 263, 268, 269, 285, 301, 318, 327, 276, 226, 183, 136, 74, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 10, 10, 10, 10, 7]
						Elapsed time (in ms)= [47, 51, 52, 58, 47, 43, 46, 38, 33, 35, 35, 30, 31, 28, 38, 39, 28, 33, 30, 29, 33,  64,  35, 138,  42,  34,  35,  39,  33,  33,  37,  30,  28,  38,  50,  69,  72,  63,  68,  64,  61,  58,  67,  63,  66,  60,  61,  59,  59,  60,  57,  49,  43,  46, 61, 61,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 3]
						Execution context start time (in ms)= [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6]
						Execution context compute time (in ms)= [1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 5, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]
				}
				ExternalRetrieval #0: ExternalDatastoreRetrieval
					store= StrategyCountryJunction
					fields= [CountryName, CountryStrategyScdId]
					JoinedMeasures= []
					Condition= CountryName = Canada
					Result size (in points)= [288]
					Start time   (in ms)= [7]
					Elapsed time (in ms)= [1]
			}
		}
	}
}
Retrieval #7: PostProcessedCacheRetrieval
	Location= Pnla Beta Mode@Pnla Core:Pnla Beta Mode=Default,Strategy Country Name@Strategy:Country Name=Canada,ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
	Measures= [Pnla Value]
	Filter= Global query filter
	Partitioning= Constant partitioning
	Measures provider= SimpleMeasuresProvider
	Result size (in points)= [1]
	Start time   (in ms)= [391]
	Elapsed time (in ms)= [  0]
 which depends on {
	Retrieval #8: PostProcessedAggregatesRetrieval
		Location= Pnla Beta Mode@Pnla Core:Pnla Beta Mode=Default,Strategy Country Name@Strategy:Country Name=Canada,ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
		Measures= [Pnla Value]
		Filter= Global query filter
		Partitioning= Constant partitioning
		Measures provider= SimpleMeasuresProvider
		Result size (in points)= [1]
		Start time   (in ms)= [391]
		Elapsed time (in ms)= [  0]
	 which depends on {
		Retrieval #9: PostProcessedAggregatesRetrieval
			Location= Pnla Beta Mode@Pnla Core:Pnla Beta Mode=Default,Strategy Country Name@Strategy:Country Name=Canada,ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
			Measures= [Pnla Value_RAW_DeltaFactorBetaModeChoicePP]
			Filter= Global query filter
			Partitioning= Constant partitioning
			Measures provider= SimpleMeasuresProvider
			Result size (in points)= [1]
			Start time   (in ms)= [390]
			Elapsed time (in ms)= [  0]
		 which depends on {
			Retrieval #10: NoOpPrimitiveAggregatesRetrieval
				Simple placeholder (no work done in this retrieval)
				Partitioning= Constant partitioning
				Result size (in points)= []
				Start time   (in ms)= []
				Elapsed time (in ms)= []
			Retrieval #11: PrimitiveAnalysisAggregationRetrieval
				Location= Pnla Delta Factor Raw@Pnla Core:Pnla Delta Factor Raw=[*],Strategy Country Name@Strategy:Country Name=Canada,ConvertFiltersToLocations@ConvertFiltersToLocations:ConvertFiltersToLocations=Disabled
				Measures= [Pnla Value_RAW]
				Filter= CubeFilter#2013521997 with SubCubeProperties [grantedMeasures=ALL, grantedMembers={Pnla Core={Pnla Delta Factor=[[AllMember]]}, Strategy={All Country Names=[[AllMember, IN - [Canada,Eurozone, Canada, Canada,Global, Canada,Japan, Canada,Norway, Canada,United States, Australia,Canada,Japan, Canada,Japan,Switzerland, Canada,New Zealand, Canada,Switzerland, Australia,Canada]]]}}]
				Partitioning= Constant partitioning
				Measures provider= SimpleMeasuresProvider
				Result size (in points)= [1]
				Start time   (in ms)= [389]
				Elapsed time (in ms)= [  0]
				Procedure time (in ms)= [0]
			 which depends on {
				ExternalRetrieval #0: ExternalDatastoreRetrieval (see above for dependencies)
				Retrieval #12: PrimitiveResultsMerger
					Location= Pnla Delta Factor Raw@Pnla Core:Pnla Delta Factor Raw=[*],StrategyScdId@Strategy_HIDDEN:StrategyScdId=[*]
					Measures= [Pnla Value_RAW]
					Filter= Global query filter
					Partitioning= Constant partitioning
					Measures provider= SimpleMeasuresProvider
					Result size (in points)= [78]
					Start time   (in ms)= [388]
					Elapsed time (in ms)= [  0]
				 which depends on {
					Retrieval #13: RangeSharingPrimitiveAggregatesRetrieval
						Location= Pnla Delta Factor Raw@Pnla Core:Pnla Delta Factor Raw=[*],StrategyScdId@Strategy_HIDDEN:StrategyScdId=[*]
						Measures= [Pnla Value_RAW]
						Filter= Global query filter
						Partitioning= value(Month)
						Measures provider= SimpleMeasuresProvider
						Result size (in points)= [0, 0, 28, 24, 24, 24, 24, 23, 27, 28, 24, 24, 24, 23, 23, 22, 21, 20, 16, 17, 16, 16, 20, 19, 20, 21, 19, 18, 17, 18, 18, 20, 20, 27, 25, 29, 43, 44, 44, 42, 42, 42, 43, 41, 43, 39, 32, 30, 31, 25, 24, 24, 23, 22, 22, 21, 18, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25]
						Start time   (in ms)= [7, 7, 54, 58, 59, 65, 55, 51, 55, 89, 87, 90, 91, 89, 91, 93, 125, 128, 117, 124, 121, 120, 127, 182, 156, 259, 166, 160, 162, 168, 189, 193, 200, 197, 197, 220, 239, 263, 269, 261, 268, 285, 301, 318, 329, 327, 335, 330, 346, 360, 377, 388, 334, 276, 226, 183, 136, 74, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 10, 10, 10, 10]
						Elapsed time (in ms)= [0, 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]
					 which depends on {
						Retrieval #6: PartialPrimitiveAggregatesRetrieval (see above for dependencies)
					}
				}
			}
		}
	}
	Retrieval #10: NoOpPrimitiveAggregatesRetrieval (see above for dependencies)
}

Query Plan Summary:
-------------------
	Total number of retrievals: 14
	List of retrievals measures: [Pnla Value_RAW_DeltaFactorBetaModeChoicePP, Pnla Value_RAW, Pnla Value]
	Retrievals count by type: {ExternalDatastoreRetrieval=1, PostProcessedAggregatesRetrieval=4, PrimitiveAnalysisAggregationRetrieval=2, PostProcessedCacheRetrieval=2, PartialPrimitiveAggregatesRetrieval=1, PrimitiveResultsMerger=2, NoOpPrimitiveAggregatesRetrieval=2, RangeSharingPrimitiveAggregatesRetrieval=1}
	Used Partial Providers: [Full]
	Partitioning count by type: {value(Month)=2, Constant partitioning=12}

2024-09-03 23:13:40.096 GMT 598836884 [activepivot-health-event-dispatcher] com.rokoscapital.activepivot.logging.QueriesEventHandler.TEXT
DEBUG: Query completed {duration_ms=396, Hierarchies=[[Strategy].[Strategy Country Name].[AllMember].[Canada], [AsofDate].[Year Hierarchy].[AllMember].[null]], Measures=[Pnla Value], AdditionalMeasures=[], Dimensions=[AsofDate, Strategy], query_type=GET_AGGREGATES, CorrelationId=448738779, user=Adam.Crossley@ROKOS.CORP, PivotId=Pnla}
2024-09-03 23:13:40.097 GMT 598836885 [qfs-common-worker-284] com.activeviam.apm.pivot.query.impl.MonitoredActivePivotQueryExecutor
INFO: [QUERY_EXE_STOP] Action: Execute Query queryId=[a6b798534251b3a], queryType=[ActivePivotSyncActionQuery[MDX]], query=[SELECT NON EMPTY {[Measures].[Pnla Value]} DIMENSION PROPERTIES ANCESTOR_CAPTION ON COLUMNS, NON EMPTY Hierarchize(Descendants({[AsofDate].[Year Hierarchy].[ALL].[AllMember]}, 1, SELF_AND_BEFORE)) DIMENSION PROPERTIES CHILDREN_CARDINALITY,ANCESTOR_CAPTION ON ROWS FROM (SELECT {[Strategy].[All Country Names].[ALL].[AllMember].[Australia,Canada], [Strategy].[All Country Names].[ALL].[AllMember].[Australia,Canada,Japan], [Strategy].[All Country Names].[ALL].[AllMember].[Canada], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Eurozone], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Global], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Japan], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Japan,Switzerland], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,New Zealand], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Norway], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Switzerland], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,United States]} ON COLUMNS FROM [Pnla] WHERE [Strategy].[Strategy Country Name].[ALL].[AllMember].[Canada]) WHERE [Strategy].[Strategy Country Name].[ALL].[AllMember].[Canada] CELL PROPERTIES VALUE,FORMATTED_VALUE,BACK_COLOR,FORE_COLOR,FONT_FLAGS], queryStartTimestamp=[1725405219695], exeId=[745181bb-2ffd-4fc9-be6d-f1d4a5de4038], totalReplySize: (0), Status: completed OK, CompletionTime: 401 ms, Result: n/a, GC stats: n/a, Heap stats: n/a
2024-09-03 23:13:40.098 GMT 598836886 [activepivot-health-event-dispatcher] com.rokoscapital.activepivot.logging.QueriesEventHandler.TEXT
DEBUG: Query completed {duration_ms=402, Hierarchies=[[Strategy].[All Country Names].[ALL].[AllMember].[Canada,Japan], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,United States], [Strategy].[All Country Names].[ALL].[AllMember].[Australia,Canada], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Global], [Strategy].[All Country Names].[ALL].[AllMember].[Canada], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Eurozone], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Switzerland], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Norway], [AsofDate].[Year Hierarchy].[ALL].[AllMember], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Japan,Switzerland], [Strategy].[All Country Names].[ALL].[AllMember].[Australia,Canada,Japan], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,New Zealand], [Strategy].[Strategy Country Name].[ALL].[AllMember].[Canada]], Measures=[Pnla Value], query=SELECT   NON EMPTY {[Measures].[Pnla Value]} DIMENSION PROPERTIES ANCESTOR_CAPTION ON COLUMNS,   NON EMPTY Hierarchize(Descendants({[AsofDate].[Year Hierarchy].[ALL].[AllMember]}, 1, SELF_AND_BEFORE)) DIMENSION PROPERTIES CHILDREN_CARDINALITY,ANCESTOR_CAPTION ON ROWS  FROM (SELECT  {[Strategy].[All Country Names].[ALL].[AllMember].[Australia,Canada], [Strategy].[All Country Names].[ALL].[AllMember].[Australia,Canada,Japan], [Strategy].[All Country Names].[ALL].[AllMember].[Canada], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Eurozone], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Global], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Japan], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Japan,Switzerland], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,New Zealand], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Norway], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Switzerland], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,United States]} ON COLUMNS  FROM [Pnla]  WHERE [Strategy].[Strategy Country Name].[ALL].[AllMember].[Canada])  WHERE [Strategy].[Strategy Country Name].[ALL].[AllMember].[Canada]  CELL PROPERTIES VALUE,FORMATTED_VALUE,BACK_COLOR,FORE_COLOR,FONT_FLAGS, Dimensions=[AsofDate, Strategy], query_type=ActivePivotSyncActionQuery, CorrelationId=45234633, user=Adam.Crossley@ROKOS.CORP}
2024-09-03 23:13:40.099 GMT 598836887 [qfs-common-worker-284] com.activeviam.apm.pivot.webservices.core.impl.MonitoredMdxStream
INFO: [MDX_STREAM_PUBLISHED] Published CellSetEvent[streamId=QueryWebSocketService-66548cd4-7b4d-1627-daee-5bf36f0f8d58-p-2/0-7-4, epoch=59, cellCount=6], TotalReplySize: 2.722 KB(2770)), queryId=[a6b798534251b3a], query=[SELECT NON EMPTY {[Measures].[Pnla Value]} DIMENSION PROPERTIES ANCESTOR_CAPTION ON COLUMNS, NON EMPTY Hierarchize(Descendants({[AsofDate].[Year Hierarchy].[ALL].[AllMember]}, 1, SELF_AND_BEFORE)) DIMENSION PROPERTIES CHILDREN_CARDINALITY,ANCESTOR_CAPTION ON ROWS FROM (SELECT {[Strategy].[All Country Names].[ALL].[AllMember].[Australia,Canada], [Strategy].[All Country Names].[ALL].[AllMember].[Australia,Canada,Japan], [Strategy].[All Country Names].[ALL].[AllMember].[Canada], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Eurozone], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Global], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Japan], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Japan,Switzerland], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,New Zealand], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Norway], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,Switzerland], [Strategy].[All Country Names].[ALL].[AllMember].[Canada,United States]} ON COLUMNS FROM [Pnla] WHERE [Strategy].[Strategy Country Name].[ALL].[AllMember].[Canada]) WHERE [Strategy].[Strategy Country Name].[ALL].[AllMember].[Canada] CELL PROPERTIES VALUE,FORMATTED_VALUE,BACK_COLOR,FORE_COLOR,FONT_FLAGS]

        `,
      output: [
        {
          planInfo: {
            branch: "N/A",
            contextValues: {
              IAsOfEpoch: "null",
              IQueriesResultLimit:
                "QueriesResultLimit [transientLimit=9223372036854775807, intermediateLimit=2147483647]",
              ISubCubeProperties: "null",
              IBranch: "null",
            },
            globalTimings: {
              PLANNING: 0,
              CONTEXT: 0,
              FINALIZATION: 1,
              EXECUTION: 391,
            },
            $parseErrors: {},
            pivotType: "ActivePivotVersion",
            pivotId: "Pnla",
            epoch: "59",
            retrieverType: "Standard aggregates retriever on cube Pnla",
            isContinuous: "false",
            rangeSharing: 1000000,
            missedPrefetchBehavior: "WARN",
            aggregatesCache: "capacity=100000, size=163",
            mdxPass: "GAQ_0",
          },
          queryFilters: [
            {
              id: 0,
              description:
                "CubeFilter#684908155 with SubCubeProperties [grantedMeasures=ALL, grantedMembers={Strategy={All Country Names=[[AllMember, IN - [Canada,Eurozone, Canada, Canada,Global, Canada,Japan, Canada,Norway, Canada,United States, Australia,Canada,Japan, Canada,Japan,Switzerland, Canada,New Zealand, Canada,Switzerland, Australia,Canada]]]}}]",
            },
            {
              id: 1,
              description:
                "CubeFilter#2013521997 with SubCubeProperties [grantedMeasures=ALL, grantedMembers={Pnla Core={Pnla Delta Factor=[[AllMember]]}, Strategy={All Country Names=[[AllMember, IN - [Canada,Eurozone, Canada, Canada,Global, Canada,Japan, Canada,Norway, Canada,United States, Australia,Canada,Japan, Canada,Japan,Switzerland, Canada,New Zealand, Canada,Switzerland, Australia,Canada]]]}}]",
            },
          ],
          aggregateRetrievals: [
            {
              $kind: "AggregateRetrieval",
              retrievalId: 0,
              type: "PostProcessedCacheRetrieval",
              location: [
                {
                  dimension: "Pnla Beta Mode",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Beta Mode"],
                  path: ["Default"],
                },
                {
                  dimension: "Strategy Country Name",
                  hierarchy: "Strategy",
                  level: ["Country Name"],
                  path: ["Canada"],
                },
                {
                  dimension: "Year Hierarchy",
                  hierarchy: "AsofDate",
                  level: ["Year"],
                  path: ["[*]"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["Pnla Value"],
              timingInfo: {
                startTime: [391],
                elapsedTime: [0],
              },
              partitioning: "Constant partitioning",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [5],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 1,
              type: "NoOpPrimitiveAggregatesRetrieval",
              location: [],
              measures: [],
              timingInfo: {},
              partitioning: "Constant partitioning",
              filterId: 0,
              underlyingDataNodes: [],
              resultSizes: [],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 2,
              type: "PostProcessedAggregatesRetrieval",
              location: [
                {
                  dimension: "Pnla Beta Mode",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Beta Mode"],
                  path: ["Default"],
                },
                {
                  dimension: "Strategy Country Name",
                  hierarchy: "Strategy",
                  level: ["Country Name"],
                  path: ["Canada"],
                },
                {
                  dimension: "Year Hierarchy",
                  hierarchy: "AsofDate",
                  level: ["Year"],
                  path: ["[*]"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["Pnla Value"],
              timingInfo: {
                startTime: [391],
                elapsedTime: [0],
              },
              partitioning: "Constant partitioning",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [5],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 3,
              type: "PostProcessedAggregatesRetrieval",
              location: [
                {
                  dimension: "Pnla Beta Mode",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Beta Mode"],
                  path: ["Default"],
                },
                {
                  dimension: "Strategy Country Name",
                  hierarchy: "Strategy",
                  level: ["Country Name"],
                  path: ["Canada"],
                },
                {
                  dimension: "Year Hierarchy",
                  hierarchy: "AsofDate",
                  level: ["Year"],
                  path: ["[*]"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["Pnla Value_RAW_DeltaFactorBetaModeChoicePP"],
              timingInfo: {
                startTime: [390],
                elapsedTime: [0],
              },
              partitioning: "Constant partitioning",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [5],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 4,
              type: "PrimitiveAnalysisAggregationRetrieval",
              location: [
                {
                  dimension: "Pnla Delta Factor Raw",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Delta Factor Raw"],
                  path: ["[*]"],
                },
                {
                  dimension: "Strategy Country Name",
                  hierarchy: "Strategy",
                  level: ["Country Name"],
                  path: ["Canada"],
                },
                {
                  dimension: "Year Hierarchy",
                  hierarchy: "AsofDate",
                  level: ["Year"],
                  path: ["[*]"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["Pnla Value_RAW"],
              timingInfo: {
                startTime: [389],
                elapsedTime: [0],
              },
              partitioning: "Constant partitioning",
              filterId: 1,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [5],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 5,
              type: "PrimitiveResultsMerger",
              location: [
                {
                  dimension: "Pnla Delta Factor Raw",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Delta Factor Raw"],
                  path: ["[*]"],
                },
                {
                  dimension: "StrategyScdId",
                  hierarchy: "Strategy_HIDDEN",
                  level: ["StrategyScdId"],
                  path: ["[*]"],
                },
                {
                  dimension: "Year Hierarchy",
                  hierarchy: "AsofDate",
                  level: ["Year"],
                  path: ["[*]"],
                },
              ],
              measures: ["Pnla Value_RAW"],
              timingInfo: {
                startTime: [388],
                elapsedTime: [0],
              },
              partitioning: "Constant partitioning",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [176],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 6,
              partialProviderName: "Full",
              type: "PartialPrimitiveAggregatesRetrieval",
              location: [
                {
                  dimension: "Pnla Delta Factor Raw",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Delta Factor Raw"],
                  path: ["[*]"],
                },
                {
                  dimension: "StrategyScdId",
                  hierarchy: "Strategy_HIDDEN",
                  level: ["StrategyScdId"],
                  path: ["[*]"],
                },
                {
                  dimension: "Year Hierarchy",
                  hierarchy: "AsofDate",
                  level: ["Year"],
                  path: ["[*]"],
                },
              ],
              measures: ["Pnla Value_RAW"],
              timingInfo: {
                startTime: [
                  7, 7, 7, 7, 8, 8, 8, 51, 54, 55, 56, 59, 59, 65, 87, 89, 89,
                  90, 91, 91, 93, 117, 120, 121, 124, 125, 127, 128, 156, 160,
                  163, 167, 168, 182, 189, 193, 197, 197, 200, 220, 239, 260,
                  261, 263, 268, 269, 285, 301, 318, 327, 276, 226, 183, 136,
                  74, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
                  12, 12, 12, 12, 12, 12, 12, 12, 11, 11, 11, 11, 11, 11, 11,
                  11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11,
                  11, 11, 11, 11, 10, 10, 10, 10, 7,
                ],
                elapsedTime: [
                  47, 51, 52, 58, 47, 43, 46, 38, 33, 35, 35, 30, 31, 28, 38,
                  39, 28, 33, 30, 29, 33, 64, 35, 138, 42, 34, 35, 39, 33, 33,
                  37, 30, 28, 38, 50, 69, 72, 63, 68, 64, 61, 58, 67, 63, 66,
                  60, 61, 59, 59, 60, 57, 49, 43, 46, 61, 61, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 3,
                ],
              },
              partitioning: "value(Month)",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [
                28, 24, 24, 24, 24, 23, 27, 28, 24, 24, 24, 23, 23, 22, 21, 20,
                16, 17, 16, 16, 20, 19, 20, 21, 19, 18, 17, 18, 18, 20, 20, 27,
                25, 29, 43, 44, 44, 42, 42, 42, 43, 41, 43, 39, 32, 30, 31, 25,
                24, 24, 23, 22, 22, 21, 18, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25,
              ],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 7,
              type: "PostProcessedCacheRetrieval",
              location: [
                {
                  dimension: "Pnla Beta Mode",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Beta Mode"],
                  path: ["Default"],
                },
                {
                  dimension: "Strategy Country Name",
                  hierarchy: "Strategy",
                  level: ["Country Name"],
                  path: ["Canada"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["Pnla Value"],
              timingInfo: {
                startTime: [391],
                elapsedTime: [0],
              },
              partitioning: "Constant partitioning",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [1],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 8,
              type: "PostProcessedAggregatesRetrieval",
              location: [
                {
                  dimension: "Pnla Beta Mode",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Beta Mode"],
                  path: ["Default"],
                },
                {
                  dimension: "Strategy Country Name",
                  hierarchy: "Strategy",
                  level: ["Country Name"],
                  path: ["Canada"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["Pnla Value"],
              timingInfo: {
                startTime: [391],
                elapsedTime: [0],
              },
              partitioning: "Constant partitioning",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [1],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 9,
              type: "PostProcessedAggregatesRetrieval",
              location: [
                {
                  dimension: "Pnla Beta Mode",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Beta Mode"],
                  path: ["Default"],
                },
                {
                  dimension: "Strategy Country Name",
                  hierarchy: "Strategy",
                  level: ["Country Name"],
                  path: ["Canada"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["Pnla Value_RAW_DeltaFactorBetaModeChoicePP"],
              timingInfo: {
                startTime: [390],
                elapsedTime: [0],
              },
              partitioning: "Constant partitioning",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [1],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 10,
              type: "NoOpPrimitiveAggregatesRetrieval",
              location: [],
              measures: [],
              timingInfo: {},
              partitioning: "Constant partitioning",
              filterId: 0,
              underlyingDataNodes: [],
              resultSizes: [],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 11,
              type: "PrimitiveAnalysisAggregationRetrieval",
              location: [
                {
                  dimension: "Pnla Delta Factor Raw",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Delta Factor Raw"],
                  path: ["[*]"],
                },
                {
                  dimension: "Strategy Country Name",
                  hierarchy: "Strategy",
                  level: ["Country Name"],
                  path: ["Canada"],
                },
                {
                  dimension: "ConvertFiltersToLocations",
                  hierarchy: "ConvertFiltersToLocations",
                  level: ["ConvertFiltersToLocations"],
                  path: ["Disabled"],
                },
              ],
              measures: ["Pnla Value_RAW"],
              timingInfo: {
                startTime: [389],
                elapsedTime: [0],
              },
              partitioning: "Constant partitioning",
              filterId: 1,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [1],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 12,
              type: "PrimitiveResultsMerger",
              location: [
                {
                  dimension: "Pnla Delta Factor Raw",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Delta Factor Raw"],
                  path: ["[*]"],
                },
                {
                  dimension: "StrategyScdId",
                  hierarchy: "Strategy_HIDDEN",
                  level: ["StrategyScdId"],
                  path: ["[*]"],
                },
              ],
              measures: ["Pnla Value_RAW"],
              timingInfo: {
                startTime: [388],
                elapsedTime: [0],
              },
              partitioning: "Constant partitioning",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [78],
            },
            {
              $kind: "AggregateRetrieval",
              retrievalId: 13,
              type: "RangeSharingPrimitiveAggregatesRetrieval",
              location: [
                {
                  dimension: "Pnla Delta Factor Raw",
                  hierarchy: "Pnla Core",
                  level: ["Pnla Delta Factor Raw"],
                  path: ["[*]"],
                },
                {
                  dimension: "StrategyScdId",
                  hierarchy: "Strategy_HIDDEN",
                  level: ["StrategyScdId"],
                  path: ["[*]"],
                },
              ],
              measures: ["Pnla Value_RAW"],
              timingInfo: {
                startTime: [
                  7, 7, 54, 58, 59, 65, 55, 51, 55, 89, 87, 90, 91, 89, 91, 93,
                  125, 128, 117, 124, 121, 120, 127, 182, 156, 259, 166, 160,
                  162, 168, 189, 193, 200, 197, 197, 220, 239, 263, 269, 261,
                  268, 285, 301, 318, 329, 327, 335, 330, 346, 360, 377, 388,
                  334, 276, 226, 183, 136, 74, 12, 12, 12, 12, 12, 12, 12, 12,
                  12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 11,
                  11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11,
                  11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 10, 10, 10, 10,
                ],
                elapsedTime: [
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0,
                ],
              },
              partitioning: "value(Month)",
              filterId: 0,
              measureProvider: "SimpleMeasuresProvider",
              underlyingDataNodes: [],
              resultSizes: [
                0, 0, 28, 24, 24, 24, 24, 23, 27, 28, 24, 24, 24, 23, 23, 22,
                21, 20, 16, 17, 16, 16, 20, 19, 20, 21, 19, 18, 17, 18, 18, 20,
                20, 27, 25, 29, 43, 44, 44, 42, 42, 42, 43, 41, 43, 39, 32, 30,
                31, 25, 24, 24, 23, 22, 22, 21, 18, 18, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 25,
              ],
            },
          ],
          externalRetrievals: [
            {
              $kind: "ExternalRetrieval",
              retrievalId: 0,
              type: "ExternalDatastoreRetrieval",
              store: "StrategyCountryJunction",
              fields: [],
              joinedMeasure: [""],
              condition: "CountryName = Canada",
              resultSizes: [288],
              timingInfo: {
                startTime: [7],
                elapsedTime: [1],
              },
            },
          ],
          querySummary: {
            measures: [
              "Pnla Value",
              "Pnla Value_RAW_DeltaFactorBetaModeChoicePP",
              "Pnla Value_RAW",
            ],
            totalRetrievals: 15,
            retrievalsCountByType: {
              PostProcessedCacheRetrieval: 2,
              NoOpPrimitiveAggregatesRetrieval: 2,
              PostProcessedAggregatesRetrieval: 4,
              PrimitiveAnalysisAggregationRetrieval: 2,
              PrimitiveResultsMerger: 2,
              PartialPrimitiveAggregatesRetrieval: 1,
              RangeSharingPrimitiveAggregatesRetrieval: 1,
              ExternalDatabaseRetrieval: 1,
            },
            partitioningCountByType: {
              "Constant partitioning": 12,
              "value(Month)": 2,
            },
            resultSizeByPartitioning: {
              "Constant partitioning": 278,
              "value(Month)": 2954,
            },
            partialProviders: ["Full"],
            totalExternalResultSize: 288,
          },
          dependencies: {
            "0": [1, 2],
            "2": [3],
            "3": [1, 4],
            "4": [5],
            "5": [6],
            "7": [8, 10],
            "8": [9],
            "9": [10, 11],
            "11": [12],
            "12": [13],
            "13": [6],
            "-1": [0, 7],
          },
          externalDependencies: {
            "4": [0],
            "11": [0],
          },
          needFillTimingInfo: false,
        },
      ],
    },
  ])("converts from V1 to JSON format", async ({ input, output }) => {
    expect(await convertV1toJson(input)).toStrictEqual(output);
  });
});
