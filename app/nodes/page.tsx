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

  const memoizedAggregateRetrievals = useMemo(
    () => selectedQueryPlan.aggregateRetrievals,
    [selectedQueryPlan.aggregateRetrievals],
  );
  const memoizedDatabaseRetrievals = useMemo(
    () => selectedQueryPlan.databaseRetrievals,
    [selectedQueryPlan.databaseRetrievals],
  );

  const retrievalMaps = useMemo(
    () => ({
      aggregate: new Map(
        memoizedAggregateRetrievals.map((retrieval) =>
          selectedIndex == -1
            ? [
                `id:${retrieval.retrievalId},pass:${(retrieval as AggregatedAggregateRetrieval).pass}`,
                retrieval,
              ]
            : [retrieval.retrievalId.toString(), retrieval],
        ),
      ),
      database: new Map(
        memoizedDatabaseRetrievals.map((retrieval) =>
          selectedIndex == -1
            ? [
                `id:${retrieval.retrievalId},pass:${(retrieval as AggregatedDatabaseRetrieval).pass}`,
                retrieval,
              ]
            : [retrieval.retrievalId.toString(), retrieval],
        ),
      ),
    }),
    [memoizedAggregateRetrievals, memoizedDatabaseRetrievals, selectedIndex],
  );

  const openRetrievalDialog = useCallback(
    (node: ProcessedNode) => {
      const mapSubObject = node.type === "Aggregate" ? "aggregate" : "database";
      const mapKey =
        selectedIndex === -1
          ? `id:${node.id},pass:${node.pass}`
          : node.id.toString();

      const retrieval = retrievalMaps[mapSubObject].get(mapKey);

      if (retrieval) {
        setSelectedRetrieval(retrieval);
        setShowDialog(true);
      }
    },
    [retrievalMaps, selectedIndex],
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
        openRetrievalDialog={openRetrievalDialog}
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
