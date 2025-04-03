"use client";

import { NodesTable, RetrievalDialog } from "@/components";
import { NodesLegend } from "@/components/nodes/NodesLegend";
import { aggregateData, getSlowestNodes } from "@/lib/functions";
import { getQueryPlan, getSelectedIndex } from "@/lib/redux";
import {
  AggregatedQueryPlan,
  AggregateRetrieval,
  DatabaseRetrieval,
  emptyAggregateRetrieval,
  emptyDatabaseRetrieval,
  emptyQueryPlan,
  ProcessedNode,
  QueryPlan,
} from "@/lib/types";
import { Box, Typography, InputLabel, Grid2, Slider } from "@mui/material";
import { debounce } from "lodash";
import { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

export default function NodesPage(): ReactElement {
  const queryPlan = useSelector(getQueryPlan);
  const selectedIndex = useSelector(getSelectedIndex);

  // Carefull, always use both at the same time
  const [sliderValue, setSliderValue] = useState<number>(10);
  const [numberOfNodes, setNumberOfNodes] = useState<number>(10);
  const [debouncedSetNumberOfNodes] = useState(() =>
    debounce(setNumberOfNodes, 300, {
      leading: false,
      trailing: true,
    }),
  );
  const [isTableLoading, setIsTableLoading] = useState<boolean>(true);
  const [sortColumn, setSortColumn] =
    useState<keyof ProcessedNode>("totalTiming");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [minDuration, setMinDuration] = useState<number>(0);
  const [maxDuration, setMaxDuration] = useState<number>(0);
  const [sortedNodes, setSortedNodes] = useState<ProcessedNode[]>([]);
  const [displayedNodes, setDisplayedNodes] = useState<ProcessedNode[]>([]);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [selectedRetrieval, setSelectedRetrieval] = useState<
    AggregateRetrieval | DatabaseRetrieval
  >(emptyAggregateRetrieval);

  const selectedQueryPlan = useMemo<QueryPlan | AggregatedQueryPlan>(() => {
    if (!queryPlan) return emptyQueryPlan;
    if (selectedIndex == -1) return aggregateData(queryPlan);
    return queryPlan[selectedIndex];
  }, [queryPlan, selectedIndex]);

  useEffect(() => {
    if (queryPlan && queryPlan.length > 0) {
      setIsTableLoading(true);

      const { minDuration, maxDuration, processedNodes } = getSlowestNodes(
        selectedQueryPlan,
        Infinity,
        sortColumn,
        sortOrder,
      );

      setMinDuration(minDuration);
      setMaxDuration(maxDuration);
      setSortedNodes(processedNodes);

      setIsTableLoading(false);
    } else {
      setIsTableLoading(false);
    }
  }, [queryPlan, selectedQueryPlan, sortColumn, sortOrder]);

  useEffect(() => {
    setDisplayedNodes(sortedNodes.slice(0, numberOfNodes));
  }, [numberOfNodes, sortedNodes]);

  const handleSort = useCallback<(column: keyof ProcessedNode) => void>(
    (column) => {
      setSortOrder((prevOrder) => {
        const isAsc = sortColumn === column && prevOrder === "asc";
        const newOrder = isAsc ? "desc" : "asc";
        return newOrder;
      });
      setSortColumn(column);
    },
    [sortColumn],
  );

  const memoizedRetrievals = useMemo(
    () => ({
      aggregate: selectedQueryPlan.aggregateRetrievals,
      database: selectedQueryPlan.databaseRetrievals,
    }),
    [selectedQueryPlan],
  );

  const retrievalMaps = useMemo(() => {
    return {
      aggregate: new Map(
        memoizedRetrievals.aggregate.map((r) => [r.retrievalId, r]),
      ),
      database: new Map(
        memoizedRetrievals.database.map((r) => [r.retrievalId, r]),
      ),
    };
  }, [memoizedRetrievals]);

  const getRetrievalFromNode = useCallback(
    (node: ProcessedNode) => {
      return node.type === "Aggregate"
        ? retrievalMaps.aggregate.get(node.id) || emptyAggregateRetrieval
        : retrievalMaps.database.get(node.id) || emptyDatabaseRetrieval;
    },
    [retrievalMaps],
  );

  if (!queryPlan || queryPlan.length === 0)
    return (
      <Typography>Please send a query to see the slowest nodes</Typography>
    );

  return (
    <Box padding={2} width="100%">
      <Typography variant="h4" gutterBottom>
        Top {sliderValue} Slowest Nodes
      </Typography>

      <Grid2>
        <InputLabel id="query-plan-select-number-of-nodes">
          Select the number of nodes
        </InputLabel>
        <Slider
          sx={{ width: { xs: "100%", md: "30%" } }}
          value={sliderValue}
          onChange={(_event, value) => {
            setSliderValue(value as number);
            debouncedSetNumberOfNodes(value as number);
          }}
          min={1}
          max={
            memoizedRetrievals.aggregate.length +
            memoizedRetrievals.database.length
          }
        />
      </Grid2>

      <NodesLegend minDuration={minDuration} maxDuration={maxDuration} />

      <NodesTable
        displayedNodes={displayedNodes}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        minDuration={minDuration}
        maxDuration={maxDuration}
        handleSort={handleSort}
        getRetrievalFromNode={getRetrievalFromNode}
        setSelectedRetrieval={setSelectedRetrieval}
        setShowDialog={setShowDialog}
        selectedIndex={selectedIndex}
        isLoading={isTableLoading}
      />

      <RetrievalDialog
        retrieval={selectedRetrieval}
        open={showDialog}
        setOpen={setShowDialog}
      />
    </Box>
  );
}
