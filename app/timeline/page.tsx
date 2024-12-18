"use client";

import { CoreTimeline } from "@/components";
import RetrievalDialog from "@/components/timeline/RetrievalDialog";
import { buildTimeline } from "@/lib/functions";
import { getQueryPlan } from "@/lib/redux";
import {
  AggregateRetrieval,
  DatabaseRetrieval,
  emptyAggregateRetrieval,
  TimingType,
} from "@/lib/types";
import {
  Box,
  Button,
  FormControl,
  FormGroup,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Typography,
} from "@mui/material";
import { ReactElement, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function TimelinePage(): ReactElement {
  const queryPlan = useSelector(getQueryPlan);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

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

      const { deltaX, deltaY } = event;

      // Prevent horizontal scrolling (with trackpad)
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        event.preventDefault(); // Prevent page scroll
        const direction = event.deltaY > 0 ? -1 : 1;
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
    setScale(containerWidth / maxEnd);
  }, [containerWidth, maxEnd]);

  if (!queryPlan) return <>Please send a query to see the graph</>;

  const { aggregateRetrievals, databaseRetrievals } = queryPlan[selectedIndex];

  const openRetrievalDialog = (retrievalId: number, type: TimingType): void => {
    let retrieval: AggregateRetrieval | DatabaseRetrieval | undefined;
    if (type === "AggregateRetrieval")
      retrieval = aggregateRetrievals.find(
        (r) => r.retrievalId === retrievalId,
      );
    else if (type === "DatabaseRetrieval")
      retrieval = databaseRetrievals.find((r) => r.retrievalId === retrievalId);

    if (retrieval) {
      setSelectedRetrieval(retrieval);
      setShowDialog(true);
    }
  };

  const timeline = buildTimeline(aggregateRetrievals, databaseRetrievals);

  // Find the maximum end time to calculate the content width
  maxEnd = Math.max(
    ...Object.values(timeline).flatMap((timings) =>
      timings.map(({ end }) => end),
    ),
  );
  const contentWidth = maxEnd * scale;

  return (
    <Box padding={2} width="100%">
      <Typography variant="h4" gutterBottom>
        Timeline
      </Typography>
      <FormControl sx={{ padding: 2 }}>
        <InputLabel id="query-plan-select-label">Select Query Plan</InputLabel>
        <Select
          labelId="query-plan-select-label"
          value={selectedIndex}
          onChange={(e) => {
            const selectedIndex = e.target.value as number;
            setSelectedIndex(selectedIndex);
          }}
          label="Select Query Plan"
        >
          {queryPlan.map((plan, index) => (
            <MenuItem key={index} value={index}>
              {queryPlan[index].planInfo.mdxPass}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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
              openRetrievalDialog={openRetrievalDialog}
            />
          ))}
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
