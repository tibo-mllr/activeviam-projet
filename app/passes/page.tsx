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
  Tooltip,
  IconButton,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
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
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  Pass Name
                  <Tooltip title="Names of the several passes of the query plan">
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                  gap={1}
                >
                  Total Timing (ms)
                  <Tooltip title="Total execution time for each pass in milliseconds">
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
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
