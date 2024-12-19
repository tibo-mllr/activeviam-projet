"use client";

import { getSlowestNodes } from "@/lib/functions/slowestNodes";
import { getQueryPlan } from "@/lib/redux";
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { ReactElement, useState } from "react";
import { useSelector } from "react-redux";

export default function NodesPage(): ReactElement {
  const queryPlan = useSelector(getQueryPlan);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  if (!queryPlan || queryPlan.length === 0) {
    return (
      <Typography>Please send a query to see the slowest nodes</Typography>
    );
  }

  const { aggregateRetrievals, databaseRetrievals } = queryPlan[selectedIndex];

  const slowestNodes = getSlowestNodes(
    aggregateRetrievals,
    databaseRetrievals,
    10,
  );

  return (
    <Box padding={2} width="100%">
      <Typography variant="h4" gutterBottom>
        Top 10 Slowest Nodes
      </Typography>

      <FormControl sx={{ padding: 2 }}>
        <InputLabel id="query-plan-select-label">Select Query Plan</InputLabel>
        <Select
          labelId="query-plan-select-label"
          value={selectedIndex}
          onChange={(e) => {
            const selectedIndex = e.target.value as number;
            setSelectedIndex(selectedIndex);
          }}
          label="Select Query Plan"
        >
          {queryPlan.map((plan, index) => (
            <MenuItem key={index} value={index}>
              {queryPlan[index].planInfo.mdxPass}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
