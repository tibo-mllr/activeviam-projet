import {
  TIMELINE_COLORS,
  TIMELINE_MAX_GREEN,
  TIMELINE_MAX_RED,
  TIMELINE_MIN_GREEN,
  TIMELINE_MIN_RED,
} from "@/lib/types";
import { Box, Grid2, Typography } from "@mui/material";
import { ReactElement } from "react";

type TimelineLegendProps = {
  timeMode: boolean;
  minDuration: number;
  maxDuration: number;
  threshold: number;
};

export function TimelineLegend({
  timeMode,
  minDuration,
  maxDuration,
  threshold,
}: TimelineLegendProps): ReactElement {
  if (timeMode)
    // Gradient scale from minDuration to maxDuration
    return (
      <Grid2
        container
        width="100%"
        marginTop={2}
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
            background: `linear-gradient(to right, rgb(${TIMELINE_MIN_RED}, ${TIMELINE_MAX_GREEN}, 0), rgb(${TIMELINE_MAX_RED}, ${TIMELINE_MIN_GREEN}, 0))`,
          }}
          position="relative"
        >
          {/* Threshold line */}
          {threshold >= minDuration && threshold <= maxDuration && (
            <Box
              position="absolute"
              left={`${((threshold - minDuration) / (maxDuration - minDuration)) * 200}px`}
              style={{ transform: "translateX(-50%)" }}
              width="3px"
              height="20px"
              bgcolor="black"
            />
          )}
        </Grid2>
        <Typography>{maxDuration}ms</Typography>
      </Grid2>
    );

  // Legend for each type
  return (
    <Grid2
      container
      width="100%"
      marginTop={2}
      flexDirection="row"
      justifyContent="center"
    >
      {Object.entries(TIMELINE_COLORS).map(([type, color]) => (
        <Grid2
          container
          key={type}
          marginX={2}
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
        >
          <Grid2
            width={60}
            height={20}
            bgcolor={color}
            borderRadius={4}
            marginRight={1}
          />
          <Typography>{type}</Typography>
        </Grid2>
      ))}
    </Grid2>
  );
}
