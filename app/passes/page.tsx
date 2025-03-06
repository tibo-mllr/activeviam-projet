"use client";

import { getPassesTimings } from "@/lib/functions";
import { getQueryPlan } from "@/lib/redux";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ReactElement } from "react";
import { useSelector } from "react-redux";

export default function PassesPage(): ReactElement {
  const queryPlan = useSelector(getQueryPlan);

  if (!queryPlan || queryPlan.length === 0) {
    return (
      <Typography>
        The query plan is empty. Please run a query to see the passes.
      </Typography>
    );
  }

  const passesTimings = getPassesTimings(queryPlan);

  return (
    <Box padding={2} width="100%">
      <Typography variant="h4" gutterBottom>
        Passes Timings
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Pass Name</TableCell>
              <TableCell align="right">Total Timing (ms)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {passesTimings.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.passName}</TableCell>
                <TableCell align="right">{row.totalTiming}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
