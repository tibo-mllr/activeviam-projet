import {
  TimelineTiming,
  TimingType,
  TIMELINE_COLORS,
  TIMELINE_MAX_GREEN,
  TIMELINE_MAX_RED,
  TIMELINE_MIN_GREEN,
  TIMELINE_MIN_RED,
} from "@/lib/types";
import { Box, Tooltip } from "@mui/material";
import { ReactElement } from "react";

type CoreProcessesProps = {
  core: number;
  timings: TimelineTiming[];
  scale: number;
  openRetrievalDialog: (retrievalId: number, type: TimingType) => void;
  timeMode: boolean;
  minDuration: number;
  maxDuration: number;
  threshold: number;
};

export function CoreProcesses({
  core,
  timings,
  scale,
  openRetrievalDialog,
  timeMode,
  minDuration,
  maxDuration,
  threshold,
}: CoreProcessesProps): ReactElement {
  const getColor = (start: number, end: number): string => {
    const duration = end - start;
    const percentage = (duration - minDuration) / (maxDuration - minDuration);

    const red =
      TIMELINE_MIN_RED +
      Math.floor((TIMELINE_MAX_RED - TIMELINE_MIN_RED) * percentage);
    const green =
      TIMELINE_MAX_GREEN -
      Math.floor((TIMELINE_MAX_GREEN - TIMELINE_MIN_GREEN) * percentage);

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
      {timings.map(({ start, end, retrievalId, type }) => (
        <Tooltip
          key={`${core}-${start}-${end}`}
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
              end - start < threshold
                ? "gray"
                : timeMode
                  ? getColor(start, end)
                  : TIMELINE_COLORS[type]
            }
            onClick={() => openRetrievalDialog(retrievalId, type)}
          />
        </Tooltip>
      ))}
    </Box>
  );
}
