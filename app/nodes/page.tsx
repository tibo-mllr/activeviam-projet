"use client";

import { NodesTable, RetrievalDialog } from "@/components";
import { aggregateData, getSlowestNodes } from "@/lib/functions";
import { getQueryPlan, getSelectedIndex } from "@/lib/redux";
import {
  AggregatedAggregateRetrieval,
  AggregatedDatabaseRetrieval,
  AggregatedQueryPlan,
  AggregateRetrieval,
  DatabaseRetrieval,
  emptyAggregateRetrieval,
  ProcessedNode,
  QueryPlan,
} from "@/lib/types";
import { Box, Typography, InputLabel, Grid2, Slider } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function NodesPage(): ReactElement {
  const queryPlan = useSelector(getQueryPlan);
  const selectedIndex = useSelector(getSelectedIndex);

  const [numberOfNodes, setNumberOfNodes] = useState<number>(10);
  const [sortColumn, setSortColumn] =
    useState<keyof ProcessedNode>("totalTiming");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [displayedNodes, setDisplayedNodes] = useState<ProcessedNode[]>([]);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [selectedRetrieval, setSelectedRetrieval] = useState<
    AggregateRetrieval | DatabaseRetrieval
  >(emptyAggregateRetrieval);

  useEffect(() => {
    if (queryPlan && queryPlan.length > 0) {
      let selectedQueryPlan: QueryPlan | AggregatedQueryPlan;
      if (selectedIndex === -1) selectedQueryPlan = aggregateData(queryPlan);
      else selectedQueryPlan = queryPlan[selectedIndex];
      const nodes = getSlowestNodes(selectedQueryPlan, numberOfNodes);
      setDisplayedNodes(nodes);
    }
  }, [queryPlan, selectedIndex, numberOfNodes]);

  if (!queryPlan || queryPlan.length === 0) {
    return (
      <Typography>Please send a query to see the slowest nodes</Typography>
    );
  }

  let selectedQueryPlan: QueryPlan | AggregatedQueryPlan;
  if (selectedIndex === -1) selectedQueryPlan = aggregateData(queryPlan);
  else selectedQueryPlan = queryPlan[selectedIndex];

  const { aggregateRetrievals, databaseRetrievals } = selectedQueryPlan;

  const handleSort = (column: keyof ProcessedNode): void => {
    const isAsc = sortColumn === column && sortOrder === "asc";
    const newOrder = isAsc ? "desc" : "asc";
    setSortOrder(newOrder);
    setSortColumn(column);

    const sortedNodes = [...displayedNodes].sort((a, b) => {
      if (a[column] < b[column]) return newOrder === "asc" ? -1 : 1;
      if (a[column] > b[column]) return newOrder === "asc" ? 1 : -1;
      return 0;
    });

    setDisplayedNodes(sortedNodes);
  };

  const getRetrievalFromNode = (
    node: ProcessedNode,
  ): AggregateRetrieval | DatabaseRetrieval => {
    const retrievalId = node.id;

    if (selectedIndex !== -1) {
      const retrieval =
        node.type == "Aggregate"
          ? aggregateRetrievals.find((r) => r.retrievalId === retrievalId)
          : databaseRetrievals.find((r) => r.retrievalId === retrievalId);

      return retrieval || emptyAggregateRetrieval;
    }
    const retrieval =
      node.type == "Aggregate"
        ? (aggregateRetrievals as AggregatedAggregateRetrieval[]).find(
            (r) => r.retrievalId === retrievalId && r.pass === node.pass,
          )
        : (databaseRetrievals as AggregatedDatabaseRetrieval[]).find(
            (r) => r.retrievalId === retrievalId && r.pass === node.pass,
          );

    return retrieval || emptyAggregateRetrieval;
  };

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
          max={aggregateRetrievals.length + databaseRetrievals.length}
        />
      </Grid2>

      <NodesTable
        displayedNodes={displayedNodes}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
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
