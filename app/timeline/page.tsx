"use client";

import { buildTimeline } from "@/lib/functions";
import { getQueryPlan } from "@/lib/redux";
import { Box, Grid2, Typography } from "@mui/material";
import { ReactElement } from "react";
import { useSelector } from "react-redux";

export default function TimelinePage(): ReactElement {
  const queryPlan = useSelector(getQueryPlan);

  if (!queryPlan) return <>Please send a query to see the graph</>;

  const [{ aggregateRetrievals }] = queryPlan;

  const timeline = buildTimeline(aggregateRetrievals);

  return (
    <Box padding={2} width="100%">
      <Typography variant="h4" gutterBottom>
        Timeline
      </Typography>
      <Grid2 container spacing={2} direction="column">
        {Object.entries(timeline).map(([core, timings]) => (
          <Grid2 key={core}>
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
                  width={(end - start) * 10}
                  height="100%"
                  position="absolute"
                  left={start * 10}
                  border={1}
                  borderColor="black"
                  borderRadius={2}
                  bgcolor="primary.dark"
                />
              ))}
            </Box>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
}
