"use client";

import {
  aggregateData,
  buildPieCharts,
  buildSummary,
  GROUP_COLORS,
} from "@/lib/functions";
import { getQueryPlan, getSelectedIndex } from "@/lib/redux";
import { AggregatedQueryPlan, QueryPlan } from "@/lib/types";
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

import { ReactElement, useState } from "react";
import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function SummaryPage(): ReactElement {
  const queryPlan = useSelector(getQueryPlan);
  const selectedIndex = useSelector(getSelectedIndex);
  const [searchTerm, setSearchTerm] = useState("");
  const [isGroupedTimings, setIsGroupedTimings] = useState<boolean>(false);
  const [isGroupedNumbers, setIsGroupedNumbers] = useState<boolean>(false);

  if (!queryPlan || queryPlan.length === 0) {
    // Default display
    return (
      <Card>
        <CardContent>
          <Typography variant="body1">No data available</Typography>
        </CardContent>
      </Card>
    );
  }

  // Select the currently active query plan

  let selectedQueryPlan: QueryPlan | AggregatedQueryPlan;
  if (selectedIndex === -1) selectedQueryPlan = aggregateData(queryPlan);
  else selectedQueryPlan = queryPlan[selectedIndex];

  const filteredMeasures = Object.entries(
    selectedQueryPlan.querySummary.measures,
  ).filter(
    ([key, value]) =>
      key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      value.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const {
    querySummary: { retrievalsCountByType },
  } = selectedQueryPlan;

  const summary = buildSummary(selectedQueryPlan);

  const pieData = buildPieCharts(retrievalsCountByType, summary);

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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h4" gutterBottom>
        Summary information
      </Typography>
      {/* Principal card*/}
      <Card>
        <CardContent>
          <Grid2 container padding={1} spacing={2}>
            {/* Line 1*/}
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
                      <ResponsiveContainer width={250} height={250}>
                        <PieChart>
                          <Pie
                            data={pieDataElapsedTimings}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            isAnimationActive={false}
                          >
                            {pieDataElapsedTimings.map((entry) => (
                              <Cell key={entry.name} fill={entry.fill} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>

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
                        <List dense sx={{ marginLeft: 4 }}>
                          {Object.entries(aggregateRetrievalsElapsedTimings)
                            .sort((a, b) => b[1] - a[1])
                            .map(([key, value]) => (
                              <ListItem key={key} disablePadding>
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    backgroundColor: retrievalsColors[key],
                                    marginRight: 1,
                                  }}
                                />
                                <ListItemText
                                  primary={`${key} : ${value} ms`}
                                />
                              </ListItem>
                            ))}
                        </List>
                        <Typography variant="body2" marginLeft={2}>
                          Database retrievals
                        </Typography>
                        <List dense sx={{ marginLeft: 4 }}>
                          {Object.entries(databaseRetrievalsElapsedTimings)
                            .sort((a, b) => b[1] - a[1])
                            .map(([key, value]) => (
                              <ListItem key={key} disablePadding>
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    backgroundColor: retrievalsColors[key],
                                    marginRight: 1,
                                  }}
                                />
                                <ListItemText
                                  primary={`${key} : ${value} ms`}
                                />
                              </ListItem>
                            ))}
                        </List>

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
                        <List dense sx={{ marginLeft: 4 }}>
                          {Object.entries(
                            aggregateRetrievalsExecutionContextElapsedTimings,
                          )
                            .sort((a, b) => b[1] - a[1])
                            .map(([key, value]) => (
                              <ListItem key={key} disablePadding>
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    marginRight: 1,
                                  }}
                                />
                                <ListItemText
                                  primary={`${key} : ${value} ms`}
                                />
                              </ListItem>
                            ))}
                        </List>
                        <Typography variant="body2" marginLeft={2}>
                          Database
                        </Typography>
                        <List dense sx={{ marginLeft: 4 }}>
                          {Object.entries(
                            databaseRetrievalsExecutionContextElapsedTimings,
                          )
                            .sort((a, b) => b[1] - a[1])
                            .map(([key, value]) => (
                              <ListItem key={key} disablePadding>
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    marginRight: 1,
                                  }}
                                />
                                <ListItemText
                                  primary={`${key} : ${value} ms`}
                                />
                              </ListItem>
                            ))}
                        </List>
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
                      <ResponsiveContainer width={250} height={250}>
                        <PieChart>
                          <Pie
                            data={groupedPieDataElaspedTimings}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            isAnimationActive={false}
                          >
                            {groupedPieDataElaspedTimings.map((entry) => (
                              <Cell key={entry.name} fill={entry.fill} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>

                      <Box sx={{ marginLeft: 2, flex: 1 }}>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          marginBottom={1}
                        >
                          Elapsed timings
                        </Typography>
                        <List dense sx={{ marginLeft: 2 }}>
                          {Object.entries(groupedRetrievalsElapsedTimings)
                            .sort((a, b) => b[1] - a[1])
                            .map(([key, value]) => (
                              <ListItem key={key} disablePadding>
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    backgroundColor: GROUP_COLORS[key],
                                    marginRight: 1,
                                  }}
                                />
                                <ListItemText
                                  primary={`${key} : ${value} ms`}
                                />
                              </ListItem>
                            ))}
                        </List>

                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          marginBottom={1}
                        >
                          Elapsed timings (execution context)
                        </Typography>
                        <List dense sx={{ marginLeft: 2 }}>
                          {Object.entries(
                            groupedRetrievalsExecutionContextElapsedTimings,
                          )
                            .sort((a, b) => b[1] - a[1])
                            .map(([key, value]) => (
                              <ListItem key={key} disablePadding>
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    marginRight: 1,
                                  }}
                                />
                                <ListItemText
                                  primary={`${key} : ${value} ms`}
                                />
                              </ListItem>
                            ))}
                        </List>
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
            {/* Line 2*/}
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
                  }}
                >
                  <Typography>Group retrievals</Typography>
                  <Switch
                    checked={isGroupedNumbers}
                    onChange={() => setIsGroupedNumbers((prev) => !prev)}
                  />

                  {!isGroupedNumbers ? (
                    <Box
                      sx={{
                        padding: 2,
                        marginTop: 2,
                        display: "flex",
                        width: "40vw",
                        minWidth: "670px",
                      }}
                    >
                      <ResponsiveContainer width={250} height={250}>
                        <PieChart>
                          <Pie
                            data={pieDataRetrievalsTypeCounts}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            isAnimationActive={false}
                          >
                            {pieDataRetrievalsTypeCounts.map((entry) => (
                              <Cell key={entry.name} fill={entry.fill} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <Box sx={{ marginLeft: 2, flex: 1 }}>
                        <Typography variant="body1" fontWeight="bold">
                          Retrievals (
                          {selectedQueryPlan.querySummary.totalRetrievals}) :
                        </Typography>
                        <List dense sx={{ marginLeft: 4 }}>
                          {Object.entries(retrievalsTypeCounts)
                            .sort((a, b) => b[1] - a[1])
                            .map(([key, value]) => (
                              <ListItem key={key} disablePadding>
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    backgroundColor: retrievalsColors[key],
                                    marginRight: 1,
                                  }}
                                />
                                <ListItemText primary={`${key} : ${value}`} />
                              </ListItem>
                            ))}
                        </List>
                      </Box>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        padding: 2,
                        marginTop: 2,
                        display: "flex",
                        width: "40vw",
                        minWidth: "670px",
                      }}
                    >
                      <ResponsiveContainer width={250} height={250}>
                        <PieChart>
                          <Pie
                            data={groupedPieDataRetrievalsTypeCounts}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            isAnimationActive={false}
                          >
                            {groupedPieDataRetrievalsTypeCounts.map((entry) => (
                              <Cell key={entry.name} fill={entry.fill} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <Box sx={{ marginLeft: 2, flex: 1 }}>
                        <Typography variant="body1" fontWeight="bold">
                          Retrievals (
                          {selectedQueryPlan.querySummary.totalRetrievals}) :
                        </Typography>
                        <List dense sx={{ marginLeft: 2 }}>
                          {Object.entries(groupedRetrievalsTypeCounts)
                            .sort((a, b) => b[1] - a[1])
                            .map(([key, value]) => (
                              <ListItem key={key} disablePadding>
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    backgroundColor: GROUP_COLORS[key],
                                    marginRight: 1,
                                  }}
                                />
                                <ListItemText primary={`${key} : ${value}`} />
                              </ListItem>
                            ))}
                        </List>
                      </Box>
                    </Box>
                  )}
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
                      padding: 2,
                      marginTop: 2,
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
            {/* Line 3*/}

            {selectedIndex !== -1 && (
              <Grid2 container padding={1} spacing={2} justifyContent="center">
                <Grid2 padding={1} spacing={1}>
                  <Box
                    sx={{
                      border: "1px solid #ccc",
                      padding: 2,
                      marginTop: 2,
                    }}
                  >
                    <Typography variant="body1" fontWeight="bold">
                      Partial Providers (
                      {selectedQueryPlan.querySummary?.partialProviders
                        ?.length || 0}
                      ) :
                    </Typography>
                    {selectedQueryPlan.querySummary?.partialProviders ? (
                      <List dense sx={{ marginLeft: 4 }}>
                        {Object.entries(
                          selectedQueryPlan.querySummary.partialProviders,
                        ).map(([key, value]) => (
                          <ListItem key={key} disablePadding>
                            <ListItemText primary={value} />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" sx={{ marginLeft: 4 }}>
                        No partial providers available.
                      </Typography>
                    )}
                  </Box>
                </Grid2>
                <Grid2 padding={1} spacing={1}>
                  <Box
                    sx={{
                      border: "1px solid #ccc",
                      padding: 2,
                      marginTop: 2,
                    }}
                  >
                    <Typography variant="body1" fontWeight="bold">
                      Partitioning Count by Type:
                    </Typography>

                    <List dense sx={{ marginLeft: 4 }}>
                      {Object.entries(
                        selectedQueryPlan.querySummary.partitioningCountByType,
                      ).map(([key, value]) => (
                        <ListItem key={key} disablePadding>
                          <ListItemText primary={`${key} : ${value}`} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Grid2>
                <Grid2 padding={1} spacing={1}>
                  <Box
                    sx={{
                      border: "1px solid #ccc",
                      padding: 2,
                      marginTop: 2,
                    }}
                  >
                    <Typography variant="body1" fontWeight="bold">
                      Result Size by Partitioning:
                    </Typography>
                    <List dense sx={{ marginLeft: 4 }}>
                      {Object.entries(
                        selectedQueryPlan.querySummary.resultSizeByPartitioning,
                      ).map(([key, value]) => (
                        <ListItem key={key} disablePadding>
                          <ListItemText primary={`${key} : ${value}`} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Grid2>
                <Grid2 padding={1} spacing={1}>
                  <Tooltip title="How much of each partitioning is used. Partitioning can be constant, single or multiple (separated with | )">
                    <IconButton size="small" style={{ marginLeft: 8 }}>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Grid2>
              </Grid2>
            )}
          </Grid2>
        </CardContent>
      </Card>
    </Box>
  );
}
