import { getColor } from "@/lib/functions";
import { TimelineTiming, TimingType, TIMELINE_COLORS } from "@/lib/types";
import { Box, Tooltip } from "@mui/material";
import { memo, useCallback, useMemo } from "react";

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
    const filteredTimings = useMemo(
      () => timings.filter(({ start, end }) => end - start >= threshold),
      [threshold, timings],
    );

    // Function that returns a function.
    // So that we can use a callback and not an arrow function for the onClick prop.
    const handleClick = useCallback(
      (retrievalId: number, type: TimingType, pass: string) => () => {
        openRetrievalDialog(retrievalId, type, pass);
      },
      [openRetrievalDialog],
    );

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
        {filteredTimings.map(({ start, end, retrievalId, type, pass }) => (
          <Tooltip
            key={`${pass}-${core}-${start}-${end}`}
            title={
              <>
                Retrieval ID: {retrievalId},<br />
                Type: {type},<br />
                Start time: {start}, End time: {end}
              </>
            }
            sx={{ position: "absolute", left: start * scale }}
          >
            <Box
              component="button" // Behave like a button in a semantic way (cursor, focus, etc.) but no minimum size
              width={`${(end - start) * scale}px`}
              height="100%"
              position="absolute"
              left={start * scale}
              border={1}
              borderColor="black"
              borderRadius={2}
              bgcolor={
                timeMode
                  ? getColor(end - start, minDuration, maxDuration)
                  : TIMELINE_COLORS[type]
              }
              onClick={handleClick(retrievalId, type, pass)}
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
      prevProps.timings.length === nextProps.timings.length &&
      prevProps.timings.every((prev, index) => {
        const next = nextProps.timings[index];
        return (
          prev.start === next.start &&
          prev.end === next.end &&
          prev.retrievalId === next.retrievalId &&
          prev.type === next.type &&
          prev.pass === next.pass
        );
      })
    );
  },
);

CoreProcesses.displayName = "CoreProcesses";
