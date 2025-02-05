import { Box, Typography } from "@mui/material";
import { type ReactElement } from "react";

type TimeScaleProps = {
  maxEnd: number;
  scale: number;
};

const PIXELS_PER_TICK = 100;

export function TimeScale({ maxEnd, scale }: TimeScaleProps): ReactElement {
  // Dynamically calculate interval based on the desired number of ticks
  const interval = Math.ceil(PIXELS_PER_TICK / scale);
  const ticks = Array.from(
    { length: Math.ceil(maxEnd / interval) },
    (_, i) => i * interval,
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
