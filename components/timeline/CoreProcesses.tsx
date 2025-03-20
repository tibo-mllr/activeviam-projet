import {
  TimelineTiming,
  TimingType,
  TIMELINE_COLORS,
  MAX_GREEN,
  MAX_RED,
  MIN_GREEN,
  MIN_RED,
} from "@/lib/types";
import { Box, Tooltip } from "@mui/material";
import { memo } from "react";

type CoreProcessesProps = {
  core: number;
  timings: TimelineTiming[];
  scale: number;
  openRetrievalDialog: (
    retrievalId: number,
    type: TimingType,
    pass: string,
  ) => void;
  timeMode: boolean;
  minDuration: number;
  maxDuration: number;
  threshold: number;
};

export const CoreProcesses = memo(
  ({
    core,
    timings,
    scale,
    openRetrievalDialog,
    timeMode,
    minDuration,
    maxDuration,
    threshold,
  }: CoreProcessesProps) => {
    const getColor = (start: number, end: number): string => {
      const duration = end - start;
      const percentage = (duration - minDuration) / (maxDuration - minDuration);

      const red = MIN_RED + Math.floor((MAX_RED - MIN_RED) * percentage);
      const green =
        MAX_GREEN - Math.floor((MAX_GREEN - MIN_GREEN) * percentage);

      return `rgb(${red}, ${green}, 0)`;
    };

    return (
      <Box
        position="relative"
        width="100%"
        height="100%"
        border={1}
        borderColor="primary.main"
        borderRadius={2}
        overflow="hidden"
      >
        {timings
          .filter(({ start, end }) => end - start >= threshold)
          .map(({ start, end, retrievalId, type, pass }) => (
            <Tooltip
              key={`${pass}-${core}-${start}-${end}`}
              title={
                <>
                  Retrieval ID: {retrievalId},<br />
                  Type: {type},<br />
                  Start time: {start}, End time: {end}
                </>
              }
            >
              <Box
                component="button" // Behave like a button in a semantic way (cursor, focus, etc.) but no minimum size
                width={(end - start) * scale}
                height="100%"
                position="absolute"
                left={start * scale}
                border={1}
                borderColor="black"
                borderRadius={2}
                bgcolor={
                  timeMode ? getColor(start, end) : TIMELINE_COLORS[type]
                }
                onClick={() => openRetrievalDialog(retrievalId, type, pass)}
              />
            </Tooltip>
          ))}
      </Box>
    );
  },
  (prevProps, nextProps) => {
    // Check if any props have changed
    return (
      prevProps.core === nextProps.core &&
      prevProps.scale === nextProps.scale &&
      prevProps.openRetrievalDialog === nextProps.openRetrievalDialog &&
      prevProps.timeMode === nextProps.timeMode &&
      prevProps.minDuration === nextProps.minDuration &&
      prevProps.maxDuration === nextProps.maxDuration &&
      prevProps.threshold === nextProps.threshold &&
      JSON.stringify(prevProps.timings) === JSON.stringify(nextProps.timings) // Expensive, but works for shallow arrays
    );
  },
);

CoreProcesses.displayName = "CoreProcesses";
