import {
  ProcessedNode,
  AggregateRetrieval,
  DatabaseRetrieval,
} from "@/lib/types";
import InfoIcon from "@mui/icons-material/Info";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { ReactElement } from "react";

interface NodesTableProps {
  displayedNodes: ProcessedNode[];
  sortColumn: keyof ProcessedNode;
  sortOrder: "asc" | "desc";
  handleSort: (column: keyof ProcessedNode) => void;
  getRetrievalFromNode: (
    node: ProcessedNode,
  ) => AggregateRetrieval | DatabaseRetrieval;
  setSelectedRetrieval: (
    retrieval: AggregateRetrieval | DatabaseRetrieval,
  ) => void;
  setShowDialog: (open: boolean) => void;
  selectedIndex: number;
}

export function NodesTable({
  displayedNodes,
  sortColumn,
  sortOrder,
  handleSort,
  getRetrievalFromNode,
  setSelectedRetrieval,
  setShowDialog,
  selectedIndex,
}: NodesTableProps): ReactElement {
  return (
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
              key={`${node.pass} ${node.type} ${node.id}`}
              onClick={() => {
                setSelectedRetrieval(getRetrievalFromNode(node));
                setShowDialog(true);
              }}
              sx={{
                cursor: "pointer",
                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
              }}
            >
              <TableCell>
                {selectedIndex === -1 && `${node.pass} `}
                {node.type} {node.id}
              </TableCell>
              <TableCell align="right">{node.maxTiming.toFixed(2)}</TableCell>
              <TableCell align="right">{node.totalTiming.toFixed(2)}</TableCell>
              <TableCell align="right">{node.mean.toFixed(2)}</TableCell>
              <TableCell align="right">{node.stdDev.toFixed(2)}</TableCell>
              <TableCell align="right">{node.parallelCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
