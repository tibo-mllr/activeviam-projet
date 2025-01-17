"use client";

import { RetrievalDialog } from "@/components";
import { getSlowestNodes } from "@/lib/functions/slowestNodes";
import { getQueryPlan, getSelectedIndex } from "@/lib/redux";
import {
  AggregateRetrieval,
  DatabaseRetrieval,
  emptyAggregateRetrieval,
  ProcessedNode,
} from "@/lib/types";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  InputLabel,
  Grid2,
  Slider,
  TableSortLabel,
} from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function NodesPage(): ReactElement {
  const queryPlan = useSelector(getQueryPlan);
  const selectedIndex = useSelector(getSelectedIndex);

  const [numberOfNodes, setNumberOfNodes] = useState<number>(10);
  const [sortColumn, setSortColumn] = useState<keyof ProcessedNode>("timing");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [displayedNodes, setDisplayedNodes] = useState<ProcessedNode[]>([]);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [selectedRetrieval, setSelectedRetrieval] = useState<
    AggregateRetrieval | DatabaseRetrieval
  >(emptyAggregateRetrieval);

  useEffect(() => {
    if (queryPlan && queryPlan.length > 0) {
      const { aggregateRetrievals, databaseRetrievals } =
        queryPlan[selectedIndex];
      const nodes = getSlowestNodes(
        aggregateRetrievals,
        databaseRetrievals,
        numberOfNodes,
      );
      setDisplayedNodes(nodes);
    }
  }, [queryPlan, selectedIndex, numberOfNodes]);

  if (!queryPlan || queryPlan.length === 0) {
    return (
      <Typography>Please send a query to see the slowest nodes</Typography>
    );
  }

  const { aggregateRetrievals, databaseRetrievals } = queryPlan[selectedIndex];

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

    const retrieval =
      node.type == "Aggregate"
        ? aggregateRetrievals.find((r) => r.retrievalId === retrievalId)
        : databaseRetrievals.find((r) => r.retrievalId === retrievalId);

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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {[
                { id: "id", label: "Node ID" },
                { id: "timing", label: "Timing (ms)" },
                { id: "mean", label: "Average (ms)" },
                { id: "stdDev", label: "Std Dev (ms)" },
                { id: "parallelCount", label: "Parallel Count" },
              ].map((column) => (
                <TableCell
                  key={column.id}
                  align={
                    column.id === "id" || column.id === "type"
                      ? "left"
                      : "right"
                  }
                >
                  <TableSortLabel
                    active={sortColumn === column.id}
                    direction={sortOrder}
                    onClick={() => handleSort(column.id as keyof ProcessedNode)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedNodes.map((node) => (
              <TableRow
                key={`${node.type} ${node.id}`}
                onClick={() => {
                  setSelectedRetrieval(getRetrievalFromNode(node));
                  setShowDialog(true);
                }}
                sx={{
                  cursor: "pointer",
                  "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                }}
              >
                <TableCell>{`${node.type} ${node.id}`}</TableCell>
                <TableCell align="right">{node.timing.toFixed(2)}</TableCell>
                <TableCell align="right">{node.mean.toFixed(2)}</TableCell>
                <TableCell align="right">{node.stdDev.toFixed(2)}</TableCell>
                <TableCell align="right">{node.parallelCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <RetrievalDialog
        retrieval={selectedRetrieval}
        open={showDialog}
        setOpen={setShowDialog}
      />
    </Box>
  );
}
