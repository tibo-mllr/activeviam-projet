import { Box } from "@mui/material";
import { ReactElement } from "react";

type CoreTimelineProps = {
  core: string;
  timings: [number, number][];
  scale: number;
};

export function CoreTimeline({
  core,
  timings,
  scale,
}: CoreTimelineProps): ReactElement {
  return (
    <Box
      position="relative"
      width="100%"
      height={30}
      border={1}
      borderColor="black"
      bgcolor="primary.main"
      borderRadius={2}
      overflow="hidden"
    >
      {timings.map(([start, end]) => (
        <Box
          key={`${core}-${start}-${end}`}
          width={(end - start) * scale}
          height="100%"
          position="absolute"
          left={start * scale}
          border={1}
          borderColor="black"
          borderRadius={2}
          bgcolor="primary.dark"
        />
      ))}
    </Box>
  );
}
