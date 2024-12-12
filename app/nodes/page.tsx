"use client";

import { getQueryPlan } from "@/lib/redux";
import {
  AggregateRetrieval,
  DatabaseRetrieval,
  TimingInfo,
} from "@/lib/types/queryPlan";
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
} from "@mui/material";
import { ReactElement, useMemo } from "react";
import { useSelector } from "react-redux";

interface ProcessedNode {
  id: string;
  type: "Aggregate" | "Database";
  totalTiming: number;
}

const calculateTotalTiming = (timingInfo: TimingInfo): number => {
  return Object.values(timingInfo)
    .flat()
    .reduce((sum, value) => sum + value, 0);
};

export default function NodesPage(): ReactElement {
  const queryPlan = useSelector(getQueryPlan);

  const slowestNodes: ProcessedNode[] = useMemo(() => {
    if (!queryPlan || queryPlan.length === 0) return [];

    const allNodes: ProcessedNode[] = queryPlan.flatMap((queryPlan) => {
      const aggregateNodes: ProcessedNode[] = queryPlan.aggregateRetrievals.map(
        (node: AggregateRetrieval) => ({
          id: `Aggregate-${node.retrievalId}`,
          type: "Aggregate",
          totalTiming: calculateTotalTiming(node.timingInfo),
        }),
      );

      const databaseNodes: ProcessedNode[] = queryPlan.databaseRetrievals.map(
        (node: DatabaseRetrieval) => ({
          id: `Database-${node.retrievalId}`,
          type: "Database",
          totalTiming: calculateTotalTiming(node.timingInfo),
        }),
      );

      return [...aggregateNodes, ...databaseNodes];
    });

    // Sort nodes by totalTiming in descending order and take the top 10
    return allNodes.sort((a, b) => b.totalTiming - a.totalTiming).slice(0, 10);
  }, [queryPlan]);

  if (!queryPlan || queryPlan.length === 0) {
    return (
      <Typography>Please send a query to see the slowest nodes</Typography>
    );
  }

  return (
    <Box padding={2} width="100%">
      <Typography variant="h4" gutterBottom>
        Top 10 Slowest Nodes
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Node ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Total Timing (ms)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slowestNodes.map((node) => (
              <TableRow key={node.id}>
                <TableCell>{node.id}</TableCell>
                <TableCell>{node.type}</TableCell>
                <TableCell align="right">
                  {node.totalTiming.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
