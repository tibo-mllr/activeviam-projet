"use client";

import {
  CoreProcesses,
  RetrievalDialog,
  TimelineDiv,
  TimelineFooter,
  TimelineLegend,
} from "@/components";
import { aggregateData } from "@/lib/functions";
import { getQueryPlan, getSelectedIndex } from "@/lib/redux";
import {
  AggregatedAggregateRetrieval,
  AggregatedDatabaseRetrieval,
  AggregatedQueryPlan,
  AggregateRetrieval,
  DatabaseRetrieval,
  emptyAggregateRetrieval,
  emptyQueryPlan,
  QueryPlan,
  Timeline,
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
  CircularProgress,
} from "@mui/material";
import { debounce } from "lodash";
import {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";

const MAX_ITEMS = 100;
const ZOOM_FACTOR = 0.8;

export default function TimelinePage(): ReactElement {
  const queryPlan = useSelector(getQueryPlan);
  const selectedIndex = useSelector(getSelectedIndex);

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [timeMode, setTimeMode] = useState<boolean>(false);
  const [selectedRetrieval, setSelectedRetrieval] = useState<
    AggregateRetrieval | DatabaseRetrieval
  >(emptyAggregateRetrieval);

  // Carefull, always use both at the same time
  const [scaleSliderValue, setScaleSliderValue] = useState<number>(50);
  const [scale, setScale] = useState<number>(50);
  const [debouncedSetScale] = useState(() =>
    debounce(setScale, 300, {
      leading: false,
      trailing: true,
    }),
  );

  const [timeline, setTimeline] = useState<Timeline>({
    minDuration: 0,
    maxDuration: 0,
    totalProcesses: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  const [containerWidth, setContainerWidth] = useState<number>(50);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);

  const selectedQueryPlan = useMemo<QueryPlan | AggregatedQueryPlan>(() => {
    if (!queryPlan) return emptyQueryPlan;
    if (selectedIndex == -1) return aggregateData(queryPlan);
    return queryPlan[selectedIndex];
  }, [queryPlan, selectedIndex]);

  const memoizedAggregateRetrievals = useMemo(
    () => selectedQueryPlan.aggregateRetrievals,
    [selectedQueryPlan.aggregateRetrievals],
  );
  const memoizedDatabaseRetrievals = useMemo(
    () => selectedQueryPlan.databaseRetrievals,
    [selectedQueryPlan.databaseRetrievals],
  );

  useEffect(() => {
    const fetchTimeline = async (): Promise<void> => {
      setLoading(true);
      const res = await fetch("/api/timeline", {
        method: "POST",
        body: JSON.stringify({ queryPlan: selectedQueryPlan }),
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      setTimeline(result);
    };
    if (selectedQueryPlan) {
      fetchTimeline().finally(() => setLoading(false));
    }
  }, [selectedQueryPlan]);

  useEffect(() => {
    if (!loading && containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, [loading]);

  const { maxDuration, minDuration, totalProcesses, ...coresTimeline } =
    timeline;

  // Carefull, always use both at the same time
  const [thresholdInputValue, setThresholdInputValue] = useState<number>(
    Number.MAX_SAFE_INTEGER,
  );
  const [threshold, setThreshold] = useState<number>(Number.MAX_SAFE_INTEGER);
  const [debouncedSetThreshold] = useState(() =>
    debounce(setThreshold, 300, {
      leading: false,
      trailing: true,
    }),
  );
  const [hiddenNodes, setHiddenNodes] = useState<boolean>(true);

  useEffect(() => {
    if (!loading) {
      if (totalProcesses < MAX_ITEMS) {
        setThreshold((prev) => (prev !== 0 ? 0 : prev));
        setThresholdInputValue((prev) => (prev !== 0 ? 0 : prev));
        setHiddenNodes(false);
      } else if (totalProcesses > MAX_ITEMS) {
        setThreshold((prev) =>
          prev !== 0.95 * maxDuration ? 0.95 * maxDuration : prev,
        );
        setThresholdInputValue((prev) =>
          prev !== 0.95 * maxDuration ? 0.95 * maxDuration : prev,
        );
        setHiddenNodes(true);
      }
    }
  }, [totalProcesses, loading, maxDuration]);

  // Find the maximum end time to calculate the content width
  const maxEnd = useMemo(() => {
    const allEnds = Object.values(coresTimeline)
      .flatMap((timings) => timings.map(({ end }) => end))
      .filter((end) => typeof end === "number"); // Remove undefined values

    return allEnds.length > 0 ? Math.max(...allEnds) : 1; // Avoid -Infinity
  }, [coresTimeline]);
  const contentWidth = useMemo(() => maxEnd * scale, [maxEnd, scale]);

  // Keep track of container width
  const handleResize = useCallback<() => void>(() => {
    if (containerRef.current)
      setContainerWidth(containerRef.current.offsetWidth);
  }, []);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => handleResize());
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
      handleResize();
    }

    return () => resizeObserver.disconnect();
  }, [handleResize]);

  // Handle zoom with mouse wheel
  const handleWheel = useCallback<(event: WheelEvent) => void>((event) => {
    if (!containerRef.current) return;

    const { deltaY, ctrlKey } = event;

    // Zoom in/out only when holding Ctrl or Pinching on touchpad (it seems `ctrlKey` handles both)
    if (ctrlKey) {
      event.preventDefault(); // Prevent page scroll
      setScale((prevScale) => {
        const newScale = Math.min(
          100,
          prevScale + (deltaY > 0 ? -ZOOM_FACTOR : ZOOM_FACTOR),
        );

        setScaleSliderValue(newScale);
        return newScale;
      });
    }
  }, []);
  useEffect(() => {
    const container = containerRef.current;
    if (container) container.addEventListener("wheel", handleWheel);

    return () => {
      if (container) container.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  // Adjust scale at render and when container's width changes
  useEffect(() => {
    if (maxEnd > 0)
      setScale((prevScale) => {
        const newScale = containerWidth / maxEnd;
        setScaleSliderValue(newScale);
        return prevScale !== newScale ? newScale : prevScale;
      });
  }, [containerWidth, maxEnd]);

  // Synchronize horizontal scroll between timeline and scale
  const handleScroll = useCallback<(source: "container" | "scale") => void>(
    (source) => {
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
    },
    [],
  );
  const onScaleScroll = useCallback(
    () => handleScroll("scale"),
    [handleScroll],
  );
  const onContainerScroll = useCallback(
    () => handleScroll("container"),
    [handleScroll],
  );

  const openRetrievalDialog = useCallback<
    (retrievalId: number, type: TimingType, pass: string) => void
  >(
    (retrievalId, type, pass) => {
      let retrieval: AggregateRetrieval | DatabaseRetrieval | undefined;

      if (selectedIndex !== -1) {
        if (type.startsWith("AggregateRetrieval"))
          retrieval = memoizedAggregateRetrievals.find(
            (r) => r.retrievalId === retrievalId,
          );
        else if (type.startsWith("DatabaseRetrieval"))
          retrieval = memoizedDatabaseRetrievals.find(
            (r) => r.retrievalId === retrievalId,
          );
      } else {
        if (type.startsWith("AggregateRetrieval"))
          retrieval = (
            memoizedAggregateRetrievals as AggregatedAggregateRetrieval[]
          ).find((r) => r.retrievalId === retrievalId && r.pass === pass);
        else if (type.startsWith("DatabaseRetrieval"))
          retrieval = (
            memoizedDatabaseRetrievals as AggregatedDatabaseRetrieval[]
          ).find((r) => r.retrievalId === retrievalId && r.pass === pass);
      }

      if (retrieval) {
        setSelectedRetrieval(retrieval);
        setShowDialog(true);
      }
    },
    [memoizedAggregateRetrievals, memoizedDatabaseRetrievals, selectedIndex],
  );

  if (!queryPlan || queryPlan.length == 0)
    return <>Please send a query to see the graph</>;

  if (loading)
    return (
      <Grid2
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress size="15rem" disableShrink />
        <Typography variant="h4" marginTop={2}>
          Computing timeline... Please be patient.
        </Typography>
      </Grid2>
    );

  return (
    <Box padding={2} paddingBottom={0} width="100%">
      <Typography variant="h4" gutterBottom>
        Timeline
      </Typography>
      <FormGroup row sx={{ justifyContent: "space-between" }}>
        <Slider
          sx={{ width: { xs: "100%", md: "80%" } }}
          value={scaleSliderValue}
          min={containerWidth / maxEnd}
          max={25} // With this setting, the smaller nodes (1ms) are maximum ~1cm wide when zoomed in
          onChange={(_event, value) => {
            setScaleSliderValue(value as number);
            debouncedSetScale(value as number);
          }}
        />
        <Button
          variant="outlined"
          onClick={() => {
            setScaleSliderValue(containerWidth / maxEnd);
            setScale(containerWidth / maxEnd);
          }}
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
            value={thresholdInputValue}
            onChange={(event) => {
              const value = Number(event.target.value);
              if (value >= minDuration && value <= maxDuration) {
                setThresholdInputValue(value);
                debouncedSetThreshold(value);
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
            value={thresholdInputValue}
            onChange={(_event, value) => {
              setThresholdInputValue(value as number);
              debouncedSetThreshold(value as number);
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
          onScroll={onContainerScroll}
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
        onScroll={onScaleScroll}
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
