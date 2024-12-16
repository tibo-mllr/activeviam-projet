import { TimelineTiming, TimingType } from "@/lib/types";
import { Box, Button, Tooltip } from "@mui/material";
import { ReactElement } from "react";

type CoreTimelineProps = {
  core: string;
  timings: TimelineTiming[];
  scale: number;
  openRetrievalDialog: (retrievalId: number, type: TimingType) => void;
};

export function CoreTimeline({
  core,
  timings,
  scale,
  openRetrievalDialog,
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
          <Button
            sx={{
              width: (end - start) * scale,
              height: "100%",
              position: "absolute",
              left: start * scale,
              border: 1,
              borderColor: "black",
              borderRadius: 2,
              bgcolor: "primary.dark",
              padding: 0,
            }}
            onClick={() => openRetrievalDialog(retrievalId, type)}
          />
        </Tooltip>
      ))}
    </Box>
  );
}
