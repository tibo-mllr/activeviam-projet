"use client";
import { Box, Typography } from "@mui/material";
import { useMemo, type ReactElement } from "react";

type TimeScaleProps = {
  maxEnd: number;
  scale: number;
  containerWidth: number;
  scrollLeft: number;
};

const PIXELS_PER_TICK = 100;

export function TimeScale({
  maxEnd,
  scale,
  containerWidth,
  scrollLeft,
}: TimeScaleProps): ReactElement {
  // Dynamically calculate interval based on the desired number of ticks
  const interval = useMemo(() => Math.ceil(PIXELS_PER_TICK / scale), [scale]);

  const numVisibleTicks = Math.ceil(containerWidth / PIXELS_PER_TICK);

  const startTick = Math.floor(scrollLeft / (interval * scale)) * interval;
  const ticks = useMemo(
    () =>
      Array.from(
        {
          length: Math.min(
            numVisibleTicks,
            Math.ceil(maxEnd / interval) - startTick / interval,
          ),
        },
        (_, i) => startTick + i * interval,
      ),
    [interval, maxEnd, numVisibleTicks, startTick],
  );

  return (
    <Box
      display="flex"
      position="relative"
      height="30px"
      borderTop={1}
      borderColor="primary.main"
      marginTop={2}
    >
      {ticks.map((time) => (
        <Box
          key={time}
          position="absolute"
          left={`${time * scale}px`}
          textAlign="center"
          style={{ transform: "translateX(-50%)" }}
        >
          <Box width="1px" height="10px" bgcolor="primary.main" margin="auto" />
          <Typography variant="caption" marginLeft={time === 0 ? "0.6em" : "0"}>
            {time}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
