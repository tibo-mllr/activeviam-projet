"use client";

import { getSlowestNodes } from "@/lib/functions";
import { getQueryPlan, getSelectedIndex } from "@/lib/redux";
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
} from "@mui/material";
import { ReactElement, useState } from "react";
import { useSelector } from "react-redux";

export default function NodesPage(): ReactElement {
  const queryPlan = useSelector(getQueryPlan);
  const selectedIndex = useSelector(getSelectedIndex);

  const [numberOfNodes, setNumberOfNodes] = useState<number>(10);

  if (!queryPlan || queryPlan.length === 0) {
    return (
      <Typography>Please send a query to see the slowest nodes</Typography>
    );
  }

  const { aggregateRetrievals, databaseRetrievals } = queryPlan[selectedIndex];

  const slowestNodes = getSlowestNodes(
    aggregateRetrievals,
    databaseRetrievals,
    numberOfNodes,
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
          max={aggregateRetrievals.length + databaseRetrievals.length}
        />
      </Grid2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Node ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Timing (ms)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slowestNodes.map((node) => (
              <TableRow key={node.id}>
                <TableCell>{node.id}</TableCell>
                <TableCell>{node.type}</TableCell>
                <TableCell align="right">{node.timing.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
