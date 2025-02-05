"use client";

import {
  CoreProcesses,
  RetrievalDialog,
  TimelineDiv,
  TimelineFooter,
} from "@/components";
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
  const minScale = 10;

  const [containerWidth, setContainerWidth] = useState<number>(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
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
          minScale,
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

  // Adjust scale at render and when container's width changes
  useEffect(() => {
    setScale(containerWidth / maxEnd);
  }, [containerWidth, maxEnd]);

  // Synchronize horizontal scroll between timeline and scale
  useEffect(() => {
    const container = containerRef.current;
    const scaleDiv = scaleRef.current;

    function handleScroll(source: "container" | "scale"): void {
      if (!container || !scaleDiv) return;

      if (container.scrollLeft !== scaleDiv.scrollLeft) {
        if (source === "container") scaleDiv.scrollLeft = container.scrollLeft;
        else container.scrollLeft = scaleDiv.scrollLeft;
      }
    }

    if (!container || !scaleDiv) return;

    container.addEventListener("scroll", () => handleScroll("container"));
    scaleDiv.addEventListener("scroll", () => handleScroll("scale"));

    return () => {
      container.removeEventListener("scroll", () => handleScroll("container"));
      scaleDiv.removeEventListener("scroll", () => handleScroll("scale"));
    };
  }, []);

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
  const contentWidth = maxEnd * scale;

  return (
    <Box padding={2} paddingBottom={0} width="100%">
      <Typography variant="h4" gutterBottom>
        Timeline
      </Typography>
      <FormGroup row sx={{ justifyContent: "space-between" }}>
        <Slider
          sx={{ width: { xs: "100%", md: "80%" } }}
          value={scale}
          min={minScale}
          onChange={(_event, value) => setScale(value as number)}
        />
        <Button
          variant="outlined"
          onClick={() => setScale(containerWidth / maxEnd)}
        >
          Fit entire timeline
        </Button>
      </FormGroup>
      <Grid2
        container
        width="100%"
        maxHeight="64vh"
        marginTop={2}
        flexDirection="row"
        sx={{ overflowY: "auto", overflowX: "hidden" }}
      >
        {/* First column: core labels */}
        <Grid2 container size={1} flexDirection="column">
          {Array.from({ length: nbCores }).map((_, index) => (
            <TimelineDiv key={index}>
              <Typography
                variant="body2"
                sx={{ display: "inline-block", verticalAlign: "middle" }}
              >
                Core {index + 1}
              </Typography>
            </TimelineDiv>
          ))}
        </Grid2>
        {/* Second column: timeline */}
        <Grid2
          container
          size={11}
          flexDirection="column"
          sx={{
            overflowX: "auto",
            overflowY: "hidden",
            overscrollBehaviorX: "none",
          }}
          ref={containerRef}
        >
          {Array.from({ length: nbCores }).map((_, index) => (
            <TimelineDiv container key={index} width={`${contentWidth}px`}>
              <CoreProcesses
                core={index}
                timings={coresTimeline[index] || []}
                scale={scale}
                openRetrievalDialog={openRetrievalDialog}
              />
            </TimelineDiv>
          ))}
        </Grid2>
      </Grid2>
      {/* Time scale */}
      <TimelineFooter
        contentWidth={contentWidth}
        scale={scale}
        maxEnd={maxEnd}
        ref={scaleRef}
      />
      {/* Dialog for retrieval details */}
      <RetrievalDialog
        retrieval={selectedRetrieval}
        open={showDialog}
        setOpen={setShowDialog}
      />
    </Box>
  );
}
