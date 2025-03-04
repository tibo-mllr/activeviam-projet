"use client";

import {
  CoreProcesses,
  RetrievalDialog,
  TimelineDiv,
  TimelineFooter,
  TimelineLegend,
} from "@/components";
import { adjustTimings, buildTimeline } from "@/lib/functions";
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
  FormControlLabel,
  FormGroup,
  Grid2,
  Input,
  Slider,
  Switch,
  Typography,
} from "@mui/material";
import { ReactElement, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function TimelinePage(): ReactElement {
  const queryPlan = useSelector(getQueryPlan);
  const selectedIndex = useSelector(getSelectedIndex);
  const [combinePasses, setCombinePasses] = useState<boolean>(false);

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [timeMode, setTimeMode] = useState<boolean>(false);
  const [threshold, setThreshold] = useState<number>(0);
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
  function handleScroll(source: "container" | "scale"): void {
    const containerDiv = containerRef.current;
    const scaleDiv = scaleRef.current;

    if (!containerDiv || !scaleDiv) return;

    if (containerDiv.scrollLeft !== scaleDiv.scrollLeft) {
      if (source === "container") scaleDiv.scrollLeft = containerDiv.scrollLeft;
      else containerDiv.scrollLeft = scaleDiv.scrollLeft;
    }
  }

  if (!queryPlan) return <>Please send a query to see the graph</>;

  const adjustedQueryPlan = adjustTimings(queryPlan);

  const aggregateRetrievals = combinePasses
    ? adjustedQueryPlan.flatMap((qp) => qp.aggregateRetrievals)
    : queryPlan[selectedIndex].aggregateRetrievals;

  const databaseRetrievals = combinePasses
    ? adjustedQueryPlan.flatMap((qp) => qp.databaseRetrievals)
    : queryPlan[selectedIndex].databaseRetrievals;

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

  const { nbCores, maxDuration, minDuration, ...coresTimeline } = timeline;

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
        justifyContent="space-between"
        marginTop={2}
        marginBottom={2}
      >
        <FormControlLabel
          control={
            <Switch
              checked={combinePasses}
              onChange={() => setCombinePasses(!combinePasses)}
            />
          }
          label="Aggregate passes on the same timeline"
          sx={{
            borderWidth: 1,
            borderColor: "primary.main",
            borderRadius: 2,
            padding: 1,
          }}
        />
        <FormGroup
          row
          sx={{
            alignItems: "center",
            borderWidth: 1,
            borderColor: "primary.main",
            borderRadius: 2,
            padding: 1,
          }}
        >
          <Typography>Show type mode</Typography>
          <Switch
            checked={timeMode}
            onChange={() => setTimeMode(!timeMode)}
            color="primary"
          />
          <Typography>Show time mode</Typography>
        </FormGroup>
        <FormGroup
          row
          sx={{
            alignItems: "center",
            borderWidth: 1,
            borderColor: "primary.main",
            borderRadius: 2,
            padding: 1,
          }}
        >
          <Typography variant="body2">Use a threshold:</Typography>
          <Input
            type="number"
            value={threshold}
            onChange={(event) => {
              const value = Number(event.target.value);
              if (value >= minDuration && value <= maxDuration)
                setThreshold(value);
            }}
            sx={{ width: "50px", marginX: 1 }}
          />
          <Typography variant="body2">ms</Typography>
          <Slider
            sx={{ width: 200, marginLeft: 2 }}
            min={minDuration}
            max={maxDuration}
            value={threshold}
            onChange={(_event, value) => setThreshold(value as number)}
          />
        </FormGroup>
      </Grid2>
      <TimelineLegend
        timeMode={timeMode}
        minDuration={minDuration}
        maxDuration={maxDuration}
        threshold={threshold}
      />
      <Grid2
        container
        width="100%"
        maxHeight="51vh"
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
            scrollbarWidth: "none",
          }}
          onScroll={() => handleScroll("container")}
          ref={containerRef}
        >
          {Array.from({ length: nbCores }).map((_, index) => (
            <TimelineDiv container key={index} width={`${contentWidth}px`}>
              <CoreProcesses
                core={index}
                timings={coresTimeline[index] || []}
                scale={scale}
                openRetrievalDialog={openRetrievalDialog}
                timeMode={timeMode}
                minDuration={minDuration}
                maxDuration={maxDuration}
                threshold={threshold}
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
        onScroll={() => handleScroll("scale")}
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
