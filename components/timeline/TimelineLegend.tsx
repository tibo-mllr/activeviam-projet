import {
  TIMELINE_COLORS,
  TIMELINE_MAX_GREEN,
  TIMELINE_MAX_RED,
  TIMELINE_MIN_GREEN,
  TIMELINE_MIN_RED,
} from "@/lib/types";
import { Grid2, Typography } from "@mui/material";
import { ReactElement } from "react";

type TimelineLegendProps = {
  timeMode: boolean;
  minTiming: number;
  maxTiming: number;
};

export function TimelineLegend({
  timeMode,
  minTiming,
  maxTiming,
}: TimelineLegendProps): ReactElement {
  if (timeMode)
    // Gradient scale from minTiming to maxTiming
    return (
      <Grid2
        container
        width="100%"
        marginTop={2}
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <Typography>{minTiming}ms</Typography>
        <Grid2
          width={200}
          height={20}
          borderRadius={4}
          marginX={1}
          sx={{
            background: `linear-gradient(to right, rgb(${TIMELINE_MIN_RED}, ${TIMELINE_MAX_GREEN}, 0), rgb(${TIMELINE_MAX_RED}, ${TIMELINE_MIN_GREEN}, 0))`,
          }}
        />
        <Typography>{maxTiming}ms</Typography>
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
