"use client";

import { RetrievalDialog } from "@/components";
import { aggregateData, getSlowestNodes } from "@/lib/functions";
import { getQueryPlan, getSelectedIndex } from "@/lib/redux";
import {
  AggregateRetrieval,
  DatabaseRetrieval,
  emptyAggregateRetrieval,
  ProcessedNode,
} from "@/lib/types";
import InfoIcon from "@mui/icons-material/Info";
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
  FormControlLabel,
  Switch,
  Tooltip,
  IconButton,
} from "@mui/material";
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
  const [isDataAggregated, setIsDataAggregated] = useState<boolean>(false);
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

  let selectedQueryPlan = queryPlan[selectedIndex];
  if (isDataAggregated) selectedQueryPlan = aggregateData(queryPlan);

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

      <Grid2 container flexDirection="row" spacing={2} marginBottom={2}>
        <Grid2 size={{ xs: 12, md: 4 }} marginRight={4}>
          <InputLabel id="query-plan-select-number-of-nodes">
            Select the number of nodes
          </InputLabel>
          <Slider
            value={numberOfNodes}
            onChange={(_event, value) => setNumberOfNodes(value as number)}
            min={1}
            max={aggregateRetrievals.length + databaseRetrievals.length}
          />
        </Grid2>
        <Grid2>
          <FormControlLabel
            control={
              <Switch
                checked={isDataAggregated}
                onChange={() => setIsDataAggregated((prev) => !prev)}
              />
            }
            label="Aggregate all passes"
            sx={{
              borderWidth: 1,
              borderColor: "primary.main",
              borderRadius: 2,
              padding: 1,
            }}
          />
        </Grid2>
      </Grid2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {[
                {
                  id: "id",
                  label: "Node ID",
                  tooltip: "Unique identifier for the node in the query plan",
                },
                {
                  id: "maxTiming",
                  label: "Max Timing (ms)",
                  tooltip:
                    "Maximum execution time among all partitions of this node",
                },
                {
                  id: "totalTiming",
                  label: "Total Timing (ms)",
                  tooltip:
                    "Total elapsed time from the start of the first partition to the end of the last partition",
                },
                {
                  id: "mean",
                  label: "Average (ms)",
                  tooltip:
                    "Mean execution time across all partitions of this node",
                },
                {
                  id: "stdDev",
                  label: "Std Dev (ms)",
                  tooltip:
                    "Standard deviation of execution times across partitions, indicating variability.",
                },
                {
                  id: "parallelCount",
                  label: "Parallel Count",
                  tooltip:
                    "Number of partitions executed in parallel for this node",
                },
              ].map((column) => (
                <TableCell
                  key={column.id}
                  align={column.id === "id" ? "left" : "right"}
                >
                  <TableSortLabel
                    active={sortColumn === column.id}
                    direction={sortOrder}
                    onClick={() => handleSort(column.id as keyof ProcessedNode)}
                  >
                    <Typography display="flex" alignItems="center">
                      {column.label}
                      <Tooltip title={column.tooltip}>
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Typography>
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
                <TableCell align="right">{node.maxTiming.toFixed(2)}</TableCell>
                <TableCell align="right">
                  {node.totalTiming.toFixed(2)}
                </TableCell>
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
