"use client";

import {
  aggregateData,
  buildPieCharts,
  buildSummary,
  GROUP_COLORS,
} from "@/lib/functions";
import { getQueryPlan, getSelectedIndex } from "@/lib/redux";
import { AggregatedQueryPlan, emptyQueryPlan, QueryPlan } from "@/lib/types";
import InfoIcon from "@mui/icons-material/Info";
import {
  Card,
  CardContent,
  Grid2,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Box,
  Switch,
  Tooltip,
  IconButton,
} from "@mui/material";

import { ReactElement, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { SummarySection } from "./ui/SummarySection";
import { TimingList } from "./ui/TimingList";
import { TimingPieChart } from "./ui/TimingPieChart";

export default function SummaryPage(): ReactElement {
  const queryPlan = useSelector(getQueryPlan);
  const selectedIndex = useSelector(getSelectedIndex);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isGroupedTimings, setIsGroupedTimings] = useState<boolean>(false);
  const [isGroupedNumbers, setIsGroupedNumbers] = useState<boolean>(false);

  // Select the currently active query plan
  const selectedQueryPlan = useMemo<QueryPlan | AggregatedQueryPlan>(() => {
    if (!queryPlan) return emptyQueryPlan;
    if (selectedIndex == -1) return aggregateData(queryPlan);
    return queryPlan[selectedIndex];
  }, [queryPlan, selectedIndex]);

  const filteredMeasures = useMemo(
    () =>
      Object.entries(selectedQueryPlan.querySummary.measures).filter(
        ([key, value]) =>
          key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          value.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm, selectedQueryPlan.querySummary.measures],
  );

  const summary = useMemo(
    () => buildSummary(selectedQueryPlan),
    [selectedQueryPlan],
  );

  const pieData = useMemo(
    () =>
      buildPieCharts(
        selectedQueryPlan.querySummary.retrievalsCountByType,
        summary,
      ),
    [selectedQueryPlan.querySummary.retrievalsCountByType, summary],
  );

  const {
    aggregateRetrievalsElapsedTimings,
    aggregateRetrievalsExecutionContextElapsedTimings,
    databaseRetrievalsElapsedTimings,
    databaseRetrievalsExecutionContextElapsedTimings,
    groupedRetrievalsElapsedTimings,
    groupedRetrievalsExecutionContextElapsedTimings,
    groupedRetrievalsTypeCounts,
    retrievalsTypeCounts,
  } = summary;

  const {
    pieDataElapsedTimings,
    pieDataRetrievalsTypeCounts,
    groupedPieDataElaspedTimings,
    groupedPieDataRetrievalsTypeCounts,
    retrievalsColors,
  } = pieData;

  if (!queryPlan || queryPlan.length === 0)
    // Default display
    return (
      <Card>
        <CardContent>
          <Typography variant="body1">No data available</Typography>
        </CardContent>
      </Card>
    );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h4" gutterBottom>
        Summary information
      </Typography>
      {/* Principal card*/}
      <Card>
        <CardContent>
          <Grid2 container padding={1} spacing={2}>
            <Grid2 container padding={1} spacing={2} justifyContent="center">
              <Grid2 padding={1} spacing={1} direction="column">
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h6">
                    Elapsed timings of retrievals
                  </Typography>
                  <Tooltip title="How long do the retrievals take, by type. A retrieval is a data access operation.">
                    <IconButton size="small" style={{ marginLeft: 8 }}>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    border: "1px solid #ccc",
                    padding: 2,
                    marginTop: 2,
                  }}
                >
                  <Typography>Group retrievals</Typography>

                  <Switch
                    checked={isGroupedTimings}
                    onChange={() => setIsGroupedTimings((prev) => !prev)}
                  />

                  {!isGroupedTimings ? (
                    <Box
                      sx={{
                        padding: 2,
                        marginTop: 2,
                        display: "flex",
                        width: "40vw",
                        height: "40vh",
                        minWidth: "670px",
                        minHeight: "500px",
                      }}
                    >
                      <TimingPieChart data={pieDataElapsedTimings} />

                      <Box sx={{ marginLeft: 2, flex: 1 }}>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          marginBottom={1}
                        >
                          Elapsed timings
                        </Typography>
                        <Typography variant="body2" marginLeft={2}>
                          Aggregate retrievals
                        </Typography>
                        <TimingList
                          data={aggregateRetrievalsElapsedTimings}
                          colorMap={retrievalsColors}
                          unit="ms"
                        />

                        <Typography variant="body2" marginLeft={2}>
                          Database retrievals
                        </Typography>
                        <TimingList
                          data={databaseRetrievalsElapsedTimings}
                          colorMap={retrievalsColors}
                          unit="ms"
                        />

                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          marginBottom={1}
                        >
                          Elapsed timings (execution context)
                        </Typography>
                        <Typography variant="body2" marginLeft={2}>
                          Aggregate
                        </Typography>
                        <TimingList
                          data={
                            aggregateRetrievalsExecutionContextElapsedTimings
                          }
                          unit="ms"
                        />

                        <Typography variant="body2" marginLeft={2}>
                          Database
                        </Typography>
                        <TimingList
                          data={
                            databaseRetrievalsExecutionContextElapsedTimings
                          }
                          unit="ms"
                        />
                      </Box>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        padding: 2,
                        marginTop: 2,
                        display: "flex",
                        width: "40vw",
                        height: "40vh",
                        minWidth: "670px",
                        minHeight: "500px",
                      }}
                    >
                      <TimingPieChart data={groupedPieDataElaspedTimings} />

                      <Box sx={{ marginLeft: 2, flex: 1 }}>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          marginBottom={1}
                        >
                          Elapsed timings
                        </Typography>
                        <TimingList
                          data={groupedRetrievalsElapsedTimings}
                          colorMap={GROUP_COLORS}
                          unit="ms"
                        />

                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          marginBottom={1}
                        >
                          Elapsed timings (execution context)
                        </Typography>
                        <TimingList
                          data={groupedRetrievalsExecutionContextElapsedTimings}
                          unit="ms"
                        />
                      </Box>
                    </Box>
                  )}
                </Box>
              </Grid2>
              <Grid2 padding={1} spacing={1}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h6">Global timings</Typography>
                  <Tooltip title="Total timings of all the query plan">
                    <IconButton size="small" style={{ marginLeft: 8 }}>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                {selectedQueryPlan.planInfo?.globalTimings ? (
                  <Box
                    sx={{
                      border: "1px solid #ccc",
                      padding: 2,
                      marginTop: 2,
                    }}
                  >
                    <List dense sx={{ margin: 2 }}>
                      {Object.entries(
                        selectedQueryPlan.planInfo.globalTimings,
                      ).map(([key, value]) => (
                        <ListItem key={key} disablePadding>
                          <ListItemText primary={`${key} : ${value} ms`} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ marginLeft: 4 }}>
                    No global timings available.
                  </Typography>
                )}
              </Grid2>
            </Grid2>
            <Grid2 container padding={1} spacing={2} justifyContent="center">
              <Grid2 padding={1} spacing={1} direction="column">
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h6">Number of retrievals</Typography>
                  <Tooltip title="Number of retrievals, by type">
                    <IconButton size="small" style={{ marginLeft: 8 }}>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box
                  sx={{
                    border: "1px solid #ccc",
                    padding: 2,
                    marginTop: 2,
                    maxHeight: 500,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography>Group retrievals</Typography>
                  <Switch
                    checked={isGroupedNumbers}
                    onChange={() => setIsGroupedNumbers((prev) => !prev)}
                  />

                  <Box
                    sx={{
                      padding: 2,
                      marginTop: 2,
                      display: "flex",
                      width: "40vw",
                      minWidth: "670px",
                      flex: 1,
                      overflow: "hidden",
                    }}
                  >
                    <TimingPieChart
                      data={
                        isGroupedNumbers
                          ? groupedPieDataRetrievalsTypeCounts
                          : pieDataRetrievalsTypeCounts
                      }
                    />

                    <Box
                      sx={{
                        marginLeft: 2,
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography variant="body1" fontWeight="bold">
                        Retrievals (
                        {selectedQueryPlan.querySummary.totalRetrievals}) :
                      </Typography>
                      <TimingList
                        data={
                          isGroupedNumbers
                            ? groupedRetrievalsTypeCounts
                            : retrievalsTypeCounts
                        }
                        colorMap={
                          isGroupedNumbers ? GROUP_COLORS : retrievalsColors
                        }
                      />
                    </Box>
                  </Box>
                </Box>
              </Grid2>
              <Grid2 padding={1} spacing={1} direction="column">
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h6">Measures</Typography>
                  <Tooltip title="The different measures that are queried">
                    <IconButton size="small" style={{ marginLeft: 8 }}>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    border: "1px solid #ccc",
                    padding: 2,
                    marginTop: 2,
                    maxHeight: 500,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <TextField
                    fullWidth
                    label="Search Measures"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Box
                    sx={{
                      marginTop: 2,
                      overflowY: "auto",
                      flexGrow: 1,
                    }}
                  >
                    <List dense sx={{ marginLeft: 4 }}>
                      {filteredMeasures.map(([key, value]) => (
                        <ListItem key={key} disablePadding>
                          <ListItemText primary={`- ${value}`} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Box>
              </Grid2>
            </Grid2>
            {selectedIndex !== -1 && (
              <Grid2 container padding={1} spacing={2} justifyContent="center">
                <SummarySection
                  title={`Partial Providers (${selectedQueryPlan.querySummary?.partialProviders?.length || 0}) :`}
                  description={
                    "Data sources or operators that process only a subset of the required data."
                  }
                  data={selectedQueryPlan.querySummary?.partialProviders}
                />
                <SummarySection
                  title={"Partitioning Count by Type:"}
                  description={
                    "Different types of partitioning, and how much retrievals use each of them. Partitioning can be constant, single or multiple (separated with | )"
                  }
                  data={selectedQueryPlan.querySummary.partitioningCountByType}
                />
                <SummarySection
                  title={"Partitioning by result size:"}
                  description={
                    "Size of the results given by each type of partioning"
                  }
                  data={selectedQueryPlan.querySummary.resultSizeByPartitioning}
                />
              </Grid2>
            )}
          </Grid2>
        </CardContent>
      </Card>
    </Box>
  );
}
