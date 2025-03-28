import { Grid2, Grid2Props } from "@mui/material";
import { memo, ReactNode } from "react";

type TimelineDivProps = {
  children: Readonly<ReactNode>;
} & Omit<Grid2Props, "paddingY" | "height" | "minHeight">;

/**
 * A styled `Grid2` component for the timeline, so that legend and graph
 * are displayed correctly.
 * Change this single component instead of changing all the `Grid2` components.
 */
export const TimelineDiv = memo(({ children, ...props }: TimelineDivProps) => {
  return (
    <Grid2 paddingY={2} height="7vh" minHeight="50px" {...props}>
      {children}
    </Grid2>
  );
});

TimelineDiv.displayName = "TimelineDiv";
