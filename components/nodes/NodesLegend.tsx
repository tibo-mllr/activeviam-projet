import {
  NODES_MAX_GREEN,
  NODES_MAX_RED,
  NODES_MIN_GREEN,
  NODES_MIN_RED,
} from "@/lib/types";
import { Grid2, Typography } from "@mui/material";
import { ReactElement } from "react";

type NodesLegendProps = {
  minDuration: number;
  maxDuration: number;
};

export function NodesLegend({
  minDuration,
  maxDuration,
}: NodesLegendProps): ReactElement {
  // Gradient scale from minDuration to maxDuration
  return (
    <Grid2
      container
      width="100%"
      marginY={2}
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
    >
      <Typography>{minDuration}ms</Typography>
      <Grid2
        width={200}
        height={20}
        borderRadius={4}
        marginX={1}
        sx={{
          background: `linear-gradient(to right, rgba(${NODES_MIN_RED}, ${NODES_MAX_GREEN}, 0.8), rgba(${NODES_MAX_RED}, ${NODES_MIN_GREEN}, 0.8))`,
        }}
        position="relative"
      ></Grid2>
      <Typography>{maxDuration}ms</Typography>
    </Grid2>
  );
}
