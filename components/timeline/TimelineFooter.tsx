import { Grid2, Typography } from "@mui/material";
import { ReactElement, RefObject } from "react";
import { TimeScale } from "./TimeScale";

type TimelineFooterProps = {
  contentWidth: number;
  maxEnd: number;
  scale: number;
  ref: RefObject<HTMLDivElement>;
  onScroll: () => void;
};

export function TimelineFooter({
  contentWidth,
  maxEnd,
  scale,
  ref,
  onScroll,
}: TimelineFooterProps): ReactElement {
  return (
    <Grid2
      container
      alignItems="center"
      width="100%"
      flexDirection="row"
      overflow="hidden"
    >
      <Grid2 size={1}>
        <Typography variant="subtitle2" fontStyle="italic">
          Time (ms)
        </Typography>
      </Grid2>
      <Grid2
        size={11}
        sx={{
          overflowX: "auto",
          overflowY: "hidden",
          overscrollBehaviorX: "none",
        }}
        onScroll={onScroll}
        ref={ref}
      >
        <Grid2 width={`${contentWidth}px`}>
          <TimeScale maxEnd={maxEnd} scale={scale} />
        </Grid2>
      </Grid2>
    </Grid2>
  );
}
