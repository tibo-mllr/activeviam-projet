"use client";

import { CoreTimeline, RetrievalDialog, TimeScale } from "@/components";
import { buildTimeline } from "@/lib/functions";
import { getQueryPlan, getSelectedIndex } from "@/lib/redux";
import {
  AggregateRetrieval,
  DatabaseRetrieval,
  emptyAggregateRetrieval,
  TimingType,
} from "@/lib/types";
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
  const selectedIndex = useSelector(getSelectedIndex);

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [selectedRetrieval, setSelectedRetrieval] = useState<
    AggregateRetrieval | DatabaseRetrieval
  >(emptyAggregateRetrieval);

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

  // Handle zoom with mouse wheel
  useEffect(() => {
    function handleWheel(event: WheelEvent): void {
      if (!containerRef.current) return;

      const { deltaY, ctrlKey } = event;

      // Zoom in/out only when holding Ctrl or Pinching on touchpad (it seems `ctrlKey` handles both)
      if (ctrlKey) {
        event.preventDefault(); // Prevent page scroll
        const direction = deltaY > 0 ? -1 : 1;
        const zoomFactor = 0.8;
        const newScale = Math.max(
          0,
          Math.min(100, scale + direction * zoomFactor),
        );
        setScale(newScale);
      }
    }

    const container = containerRef.current;
    if (container) container.addEventListener("wheel", handleWheel);

    return () => {
      if (container) container.removeEventListener("wheel", handleWheel);
    };
  }, [scale]);

  // Adjust scale at render and when container width changes
  useEffect(() => {
    setScale((containerWidth / maxEnd) * (11 / 12));
  }, [containerWidth, maxEnd]);

  if (!queryPlan) return <>Please send a query to see the graph</>;

  const { aggregateRetrievals, databaseRetrievals } = queryPlan[selectedIndex];

  const openRetrievalDialog = (retrievalId: number, type: TimingType): void => {
    let retrieval: AggregateRetrieval | DatabaseRetrieval | undefined;
    if (type.startsWith("AggregateRetrieval"))
      retrieval = aggregateRetrievals.find(
        (r) => r.retrievalId === retrievalId,
      );
    else if (type.startsWith("DatabaseRetrieval"))
      retrieval = databaseRetrievals.find((r) => r.retrievalId === retrievalId);

    if (retrieval) {
      setSelectedRetrieval(retrieval);
      setShowDialog(true);
    }
  };

  const timeline = buildTimeline(aggregateRetrievals, databaseRetrievals);

  const { nbCores, ...coresTimeline } = timeline;

  // Find the maximum end time to calculate the content width
  maxEnd = Math.max(
    ...Object.values(coresTimeline).flatMap((timings) =>
      timings.map(({ end }) => end),
    ),
  );
  const contentWidth = maxEnd * scale * (12 / 11);

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
          onClick={() => setScale((containerWidth / maxEnd) * (11 / 12))}
        >
          Fit entire timeline
        </Button>
      </FormGroup>
      <Box
        width="100%"
        maxHeight="67vh"
        marginTop={2}
        overflow="auto"
        borderRadius={2}
        ref={containerRef}
      >
        {Array.from({ length: nbCores }).map((_, index) => (
          <Grid2
            container
            key={index}
            alignItems="center"
            width={`${contentWidth}px`}
          >
            {contentWidth > 200 && (
              <Grid2 size={1}>
                <Typography variant="body2">
                  {contentWidth > 700 ? `Core ${index + 1}` : index + 1}
                </Typography>
              </Grid2>
            )}
            <Grid2 size={11}>
              <Box
                sx={{
                  width: `${scale * maxEnd}px`,
                  overflowX: "auto",
                  paddingY: 2,
                }}
              >
                <CoreTimeline
                  core={index}
                  timings={coresTimeline[index] || []}
                  scale={scale}
                  openRetrievalDialog={openRetrievalDialog}
                />
              </Box>
            </Grid2>
          </Grid2>
        ))}
        <Grid2
          container
          spacing={2}
          alignItems="center"
          position="sticky"
          bgcolor="var(--background)"
          bottom={0}
          width={`${contentWidth}px`}
        >
          {contentWidth > 200 && (
            <Grid2 size={1}>
              {contentWidth > 520 && (
                <Typography variant="subtitle2" fontStyle="italic">
                  Time (ms)
                </Typography>
              )}
            </Grid2>
          )}
          <Grid2 size={11}>
            <TimeScale maxEnd={maxEnd} scale={scale} />
          </Grid2>
        </Grid2>
      </Box>
      <RetrievalDialog
        retrieval={selectedRetrieval}
        open={showDialog}
        setOpen={setShowDialog}
      />
    </Box>
  );
}
