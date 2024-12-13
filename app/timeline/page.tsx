"use client";

import { CoreTimeline } from "@/components";
import { buildTimeline } from "@/lib/functions";
import { getQueryPlan } from "@/lib/redux";
import {
  Box,
  Button,
  FormGroup,
  Grid2,
  Slider,
  Typography,
} from "@mui/material";
import { ReactElement, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function TimelinePage(): ReactElement {
  const queryPlan = useSelector(getQueryPlan);

  const [scale, setScale] = useState<number>(50);

  const [containerWidth, setContainerWidth] = useState<number>(50);
  const containerRef = useRef<HTMLDivElement>(null);
  let maxEnd = 0;

  // Keep track of container width
  useEffect(() => {
    function handleResize(): void {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }

    const resizeObserver = new ResizeObserver(() => handleResize());
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
      handleResize();
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    setScale(containerWidth / maxEnd);
  }, [containerWidth, maxEnd]);

  if (!queryPlan) return <>Please send a query to see the graph</>;

  const [{ aggregateRetrievals }] = queryPlan;

  const timeline = buildTimeline(aggregateRetrievals);

  maxEnd = Math.max(
    ...Object.values(timeline).flatMap((timings) =>
      timings.map(([, end]) => end),
    ),
  );

  const contentWidth = maxEnd * scale;

  return (
    <Box padding={2} width="100%">
      <Typography variant="h4" gutterBottom>
        Timeline
      </Typography>
      <FormGroup row sx={{ justifyContent: "space-between" }}>
        <Slider
          sx={{ width: { xs: "100%", md: "80%" } }}
          value={scale}
          onChange={(_event, value) => setScale(value as number)}
        />
        <Button
          variant="outlined"
          onClick={() => setScale(containerWidth / maxEnd)}
        >
          Fit entire timeline
        </Button>
      </FormGroup>
      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
          paddingY: 2,
        }}
        ref={containerRef}
      >
        <Grid2
          container
          spacing={2}
          direction="column"
          width={`${contentWidth}px`}
          marginY={2}
        >
          {Object.entries(timeline).map(([core, timings]) => (
            <CoreTimeline
              key={core}
              core={core}
              timings={timings}
              scale={scale}
            />
          ))}
        </Grid2>
      </Box>
    </Box>
  );
}
