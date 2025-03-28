"use client";

import { NodesTable, RetrievalDialog } from "@/components";
import { NodesLegend } from "@/components/nodes/NodesLegend";
import { aggregateData, getSlowestNodes } from "@/lib/functions";
import { getQueryPlan, getSelectedIndex } from "@/lib/redux";
import {
  AggregatedAggregateRetrieval,
  AggregatedDatabaseRetrieval,
  AggregatedQueryPlan,
  AggregateRetrieval,
  DatabaseRetrieval,
  emptyAggregateRetrieval,
  emptyQueryPlan,
  ProcessedNode,
  QueryPlan,
} from "@/lib/types";
import { Box, Typography, InputLabel, Grid2, Slider } from "@mui/material";
import { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

export default function NodesPage(): ReactElement {
  const queryPlan = useSelector(getQueryPlan);
  const selectedIndex = useSelector(getSelectedIndex);

  const [numberOfNodes, setNumberOfNodes] = useState<number>(10);
  const [sortColumn, setSortColumn] =
    useState<keyof ProcessedNode>("totalTiming");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [minDuration, setMinDuration] = useState<number>(0);
  const [maxDuration, setMaxDuration] = useState<number>(0);
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
      const { minDuration, maxDuration, processedNodes } = getSlowestNodes(
        selectedQueryPlan,
        numberOfNodes,
        sortColumn,
        sortOrder,
      );
      setMinDuration(minDuration);
      setMaxDuration(maxDuration);
      setDisplayedNodes(processedNodes);
    }
  }, [queryPlan, selectedQueryPlan, numberOfNodes, sortColumn, sortOrder]);

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

  const memoizedAggregateRetrievals = useMemo(
    () => selectedQueryPlan.aggregateRetrievals,
    [selectedQueryPlan.aggregateRetrievals],
  );
  const memoizedDatabaseRetrievals = useMemo(
    () => selectedQueryPlan.databaseRetrievals,
    [selectedQueryPlan.databaseRetrievals],
  );

  const getRetrievalFromNode = useCallback<
    (node: ProcessedNode) => AggregateRetrieval | DatabaseRetrieval
  >(
    (node) => {
      const retrievalId = node.id;

      if (selectedIndex !== -1) {
        const retrieval =
          node.type == "Aggregate"
            ? memoizedAggregateRetrievals.find(
                (r) => r.retrievalId === retrievalId,
              )
            : memoizedDatabaseRetrievals.find(
                (r) => r.retrievalId === retrievalId,
              );

        return retrieval || emptyAggregateRetrieval;
      }
      const retrieval =
        node.type == "Aggregate"
          ? (
              memoizedAggregateRetrievals as AggregatedAggregateRetrieval[]
            ).find((r) => r.retrievalId === retrievalId && r.pass === node.pass)
          : (memoizedDatabaseRetrievals as AggregatedDatabaseRetrieval[]).find(
              (r) => r.retrievalId === retrievalId && r.pass === node.pass,
            );

      return retrieval || emptyAggregateRetrieval;
    },
    [memoizedAggregateRetrievals, memoizedDatabaseRetrievals, selectedIndex],
  );

  if (!queryPlan || queryPlan.length === 0)
    return (
      <Typography>Please send a query to see the slowest nodes</Typography>
    );

  return (
    <Box padding={2} width="100%">
      <Typography variant="h4" gutterBottom>
        Top {numberOfNodes} Slowest Nodes
      </Typography>

      <Grid2>
        <InputLabel id="query-plan-select-number-of-nodes">
          Select the number of nodes
        </InputLabel>
        <Slider
          sx={{ width: { xs: "100%", md: "30%" } }}
          value={numberOfNodes}
          onChange={(_event, value) => setNumberOfNodes(value as number)}
          min={1}
          max={
            memoizedAggregateRetrievals.length +
            memoizedDatabaseRetrievals.length
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
      />

      <RetrievalDialog
        retrieval={selectedRetrieval}
        open={showDialog}
        setOpen={setShowDialog}
      />
    </Box>
  );
}
