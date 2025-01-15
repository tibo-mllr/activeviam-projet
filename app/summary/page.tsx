"use client";

import {
  aggregateData,
  buildPieCharts,
  buildSummary,
  GROUP_COLORS,
} from "@/lib/functions";
import { getQueryPlan, getSelectedIndex } from "@/lib/redux";
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
  const [isDataAggregated, setIsDataAggregated] = useState<boolean>(false);
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

  let selectedQueryPlan = queryPlan[selectedIndex];
  if (isDataAggregated) {
    selectedQueryPlan = aggregateData(queryPlan);
  }
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
    <Grid2 container spacing={1}>
      {queryPlan.length >= 2 && (
        <Card
          style={{
            backgroundColor: isDataAggregated
              ? "rgb(40, 40, 40)"
              : "rgb(20, 20, 20)",
          }}
        >
          <CardContent>
            <Typography display="flex" alignItems="center">
              Aggregate all parts
              <Tooltip title="Toggle this switch to aggregate all the data in one single page. Measures appearing twice will be excluded">
                <IconButton size="small" style={{ marginLeft: 8 }}>
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
            <Switch
              checked={isDataAggregated}
              onChange={() => setIsDataAggregated((prev) => !prev)}
            />
            <Typography>There is {queryPlan.length} query plans</Typography>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6">Elapsed timings of retrievals</Typography>
          <Grid2>
            <Typography>Group retrievals</Typography>
            <Switch
              checked={isGroupedTimings}
              onChange={() => setIsGroupedTimings((prev) => !prev)}
            />
          </Grid2>
          <Grid2 container spacing={2}>
            {!isGroupedTimings ? (
              <Box
                sx={{
                  border: "1px solid #ccc",
                  padding: 2,
                  marginTop: 2,
                  display: "flex",
                }}
              >
                <ResponsiveContainer width={300} height={300}>
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
                          <ListItemText primary={`${key} : ${value} ms`} />
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
                          <ListItemText primary={`${key} : ${value} ms`} />
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
                          <ListItemText primary={`${key} : ${value} ms`} />
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
                          <ListItemText primary={`${key} : ${value} ms`} />
                        </ListItem>
                      ))}
                  </List>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  border: "1px solid #ccc",
                  padding: 2,
                  marginTop: 2,
                  display: "flex",
                }}
              >
                <ResponsiveContainer width={300} height={300}>
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
                          <ListItemText primary={`${key} : ${value} ms`} />
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
                          <ListItemText primary={`${key} : ${value} ms`} />
                        </ListItem>
                      ))}
                  </List>
                </Box>
              </Box>
            )}
          </Grid2>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Grid2 container spacing={2}>
            <Grid2>
              <Typography variant="h6">Global timings</Typography>
              {selectedQueryPlan.planInfo?.globalTimings ? (
                <List dense sx={{ marginLeft: 4 }}>
                  {Object.entries(selectedQueryPlan.planInfo.globalTimings).map(
                    ([key, value]) => (
                      <ListItem key={key} disablePadding>
                        <ListItemText primary={`${key} : ${value} ms`} />
                      </ListItem>
                    ),
                  )}
                </List>
              ) : (
                <Typography variant="body2" sx={{ marginLeft: 4 }}>
                  No global timings available.
                </Typography>
              )}
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Grid2 container direction="column" spacing={2}>
            <Grid2>
              <Typography variant="h6">Measures</Typography>
            </Grid2>
            <Grid2>
              <TextField
                fullWidth
                label="Search Measures"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid2>
            <Box
              sx={{
                border: "1px solid #ccc",
                padding: 2,
                marginTop: 2,
              }}
            >
              <Grid2>
                <List dense sx={{ marginLeft: 4 }}>
                  {filteredMeasures.map(([key, value]) => (
                    <ListItem key={key} disablePadding>
                      <ListItemText primary={`- ${value}`} />
                    </ListItem>
                  ))}
                </List>
              </Grid2>
            </Box>
          </Grid2>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6">Summary information</Typography>
          <Grid2>
            <Typography>Group retrievals</Typography>
            <Switch
              checked={isGroupedNumbers}
              onChange={() => setIsGroupedNumbers((prev) => !prev)}
            />
          </Grid2>

          {!isGroupedNumbers ? (
            <Grid2 container spacing={2}>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  padding: 2,
                  marginTop: 2,
                  display: "flex",
                }}
              >
                <ResponsiveContainer width={300} height={300}>
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
                    Retrievals ({selectedQueryPlan.querySummary.totalRetrievals}
                    ) :
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
            </Grid2>
          ) : (
            <Grid2 container spacing={2}>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  padding: 2,
                  marginTop: 2,
                  display: "flex",
                }}
              >
                <ResponsiveContainer width={300} height={300}>
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
                    Retrievals ({selectedQueryPlan.querySummary.totalRetrievals}
                    ) :
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
            </Grid2>
          )}
        </CardContent>
      </Card>

      {!isDataAggregated && (
        <Card>
          <CardContent>
            <Grid2>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  padding: 2,
                  marginTop: 2,
                }}
              >
                <Typography variant="body1" fontWeight="bold">
                  Partial Providers (
                  {selectedQueryPlan.querySummary?.partialProviders?.length ||
                    0}
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
          </CardContent>
        </Card>
      )}
    </Grid2>
  );
}
