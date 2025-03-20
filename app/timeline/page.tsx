"use client";

import {
  CoreProcesses,
  RetrievalDialog,
  TimelineDiv,
  TimelineFooter,
  TimelineLegend,
} from "@/components";
import { aggregateData, buildTimeline } from "@/lib/functions";
import { getQueryPlan, getSelectedIndex } from "@/lib/redux";
import {
  AggregatedAggregateRetrieval,
  AggregatedDatabaseRetrieval,
  AggregateRetrieval,
  DatabaseRetrieval,
  emptyAggregateRetrieval,
  emptyQueryPlan,
  QueryPlan,
  TimingType,
} from "@/lib/types";
import InfoIcon from "@mui/icons-material/Info";
import {
  Box,
  Button,
  FormGroup,
  Grid2,
  Input,
  Slider,
  Switch,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import { ReactElement, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function TimelinePage(): ReactElement {
  const queryPlan = useSelector(getQueryPlan);
  const selectedIndex = useSelector(getSelectedIndex);

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [timeMode, setTimeMode] = useState<boolean>(false);
  const [selectedRetrieval, setSelectedRetrieval] = useState<
    AggregateRetrieval | DatabaseRetrieval
  >(emptyAggregateRetrieval);

  const [scale, setScale] = useState<number>(50);
  const minScale = 10;

  const [containerWidth, setContainerWidth] = useState<number>(50);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
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

    const newScrollLeft =
      source === "container" ? containerDiv.scrollLeft : scaleDiv.scrollLeft;
    setScrollLeft(newScrollLeft);

    if (containerDiv.scrollLeft !== scaleDiv.scrollLeft) {
      if (source === "container") scaleDiv.scrollLeft = newScrollLeft;
      else containerDiv.scrollLeft = newScrollLeft;
    }
  }

  let selectedQueryPlan: QueryPlan;
  if (selectedIndex == -1) selectedQueryPlan = aggregateData(queryPlan || []);
  else if (!queryPlan) selectedQueryPlan = emptyQueryPlan;
  else selectedQueryPlan = queryPlan[selectedIndex];

  const { aggregateRetrievals, databaseRetrievals } = selectedQueryPlan;

  const timeline = buildTimeline(selectedQueryPlan);

  const { maxDuration, minDuration, totalProcesses, ...coresTimeline } =
    timeline;

  const maxItems = 100;
  const [threshold, setThreshold] = useState<number>(0.9 * maxDuration);
  const [hiddenNodes, setHiddenNodes] = useState<boolean>(true);

  useEffect(() => {
    if (totalProcesses < maxItems && threshold !== 0) {
      setThreshold(0);
      setHiddenNodes(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalProcesses, maxItems]);

  // Find the maximum end time to calculate the content width
  maxEnd = Math.max(
    ...Object.values(coresTimeline).flatMap((timings) =>
      timings.map(({ end }) => end),
    ),
  );
  const contentWidth = maxEnd * scale;

  const openRetrievalDialog = (
    retrievalId: number,
    type: TimingType,
    pass: string,
  ): void => {
    let retrieval: AggregateRetrieval | DatabaseRetrieval | undefined;

    if (selectedIndex !== -1) {
      if (type.startsWith("AggregateRetrieval"))
        retrieval = aggregateRetrievals.find(
          (r) => r.retrievalId === retrievalId,
        );
      else if (type.startsWith("DatabaseRetrieval"))
        retrieval = databaseRetrievals.find(
          (r) => r.retrievalId === retrievalId,
        );
    } else {
      if (type.startsWith("AggregateRetrieval"))
        retrieval = (
          aggregateRetrievals as AggregatedAggregateRetrieval[]
        ).find((r) => r.retrievalId === retrievalId && r.pass === pass);
      else if (type.startsWith("DatabaseRetrieval"))
        retrieval = (databaseRetrievals as AggregatedDatabaseRetrieval[]).find(
          (r) => r.retrievalId === retrievalId && r.pass === pass,
        );
    }

    if (retrieval) {
      setSelectedRetrieval(retrieval);
      setShowDialog(true);
    }
  };

  if (!queryPlan) return <>Please send a query to see the graph</>;

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
          <Tooltip title="Color depending on types. Retrievals can have different types: Aggregate, Database, and can be of ExecutionContext or not">
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Switch
            checked={timeMode}
            onChange={() => setTimeMode(!timeMode)}
            color="primary"
          />
          <Typography>Show time mode</Typography>
          <Tooltip title="Color depending on the time length">
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
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
          <Tooltip title="Selecting only retrievals with a minimum timing">
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Typography variant="body2">Use a threshold:</Typography>
          <Input
            type="number"
            value={threshold}
            onChange={(event) => {
              const value = Number(event.target.value);
              if (value >= minDuration && value <= maxDuration) {
                setThreshold(value);
                setHiddenNodes(false);
              }
            }}
            sx={{ width: "50px", marginX: 1 }}
          />
          <Typography variant="body2">ms</Typography>
          <Slider
            sx={{ width: 200, marginLeft: 2 }}
            min={minDuration}
            max={maxDuration}
            value={threshold}
            onChange={(_event, value) => {
              setThreshold(value as number);
              setHiddenNodes(false);
            }}
          />
        </FormGroup>
      </Grid2>

      {hiddenNodes && (
        <Typography variant="caption" color="warning">
          Careful! As there is a large number of processes, we hid the smaller
          ones. To see them, change the threshold.
        </Typography>
      )}

      <TimelineLegend
        timeMode={timeMode}
        minDuration={minDuration}
        maxDuration={maxDuration}
        threshold={threshold}
      />
      <Grid2
        container
        width="100%"
        maxHeight={hiddenNodes ? "48vh" : "53vh"}
        marginTop={2}
        flexDirection="row"
        sx={{ overflowY: "auto", overflowX: "hidden" }}
      >
        {/* First column: core labels */}
        <Grid2 container size={1} flexDirection="column">
          {Object.keys(coresTimeline).map((_, index) => (
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
          {Object.values(coresTimeline).map((timings, index) => (
            <TimelineDiv container key={index} width={`${contentWidth}px`}>
              <CoreProcesses
                core={index}
                timings={timings}
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
        containerWidth={containerWidth}
        scale={scale}
        maxEnd={maxEnd}
        onScroll={() => handleScroll("scale")}
        scrollLeft={scrollLeft}
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
