"use client";

import { getQueryPlan, getSelectedIndex } from "@/lib/redux";
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
} from "@mui/material";
import { ReactElement, useState } from "react";
import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = [
  "#800080",
  "#FFA500",
  "#0000FF",
  "#FF0000",
  "#00FF00",
  "#FFFF00",
  "#808080",
  "#A52A2A",
];

const GROUP_COLORS: Record<string, string> = {
  Database: COLORS[0],
  Engine: COLORS[1],
  Network: COLORS[2],
  Providers: COLORS[3],
};

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
  const selectedQueryPlan = queryPlan[selectedIndex];
  const filteredMeasures = Object.entries(
    selectedQueryPlan.querySummary.measures,
  ).filter(
    ([key, value]) =>
      key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      value.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const {
    aggregateRetrievals,
    databaseRetrievals,
    querySummary: { retrievalsCountByType },
  } = selectedQueryPlan;

  // Grouped data records about the retrievals
  const groupedRetrievalsElapsedTimings: Record<string, number> = {
    Database: 0,
    Engine: 0,
    Network: 0,
    Providers: 0,
  };
  const groupedRetrievalsExecutionContextElapsedTimings: Record<
    string,
    number
  > = {
    Database: 0,
    Engine: 0,
    Network: 0,
    Providers: 0,
  };
  const groupedRetrievalsTypeCounts: Record<string, number> = {
    Database: 0,
    Engine: 0,
    Network: 0,
    Providers: 0,
  };

  // Detailed data (not grouped) about the retrievals
  // There is an aggregate retrievals variable and a database retrievals variable
  // aggregate
  const aggregateRetrievalsElapsedTimings: Record<string, number> = {};
  const aggregateRetrievalsExecutionContextElapsedTimings: Record<
    string,
    number
  > = {};

  // Database: only one type and it needs to be directly specified since it is not in the JSON
  const databaseRetrievalsElapsedTimings = {
    DatabaseRetrieval: 0,
  };
  const databaseRetrievalsExecutionContextElapsedTimings = {
    DatabaseRetrieval: 0,
  };
  const retrievalsTypeCounts = retrievalsCountByType;

  // Filling the records
  aggregateRetrievals.forEach(({ timingInfo, type }) => {
    const elapsedTimeSum = timingInfo.elapsedTime.reduce(
      (acc, num) => acc + num,
      0,
    );

    aggregateRetrievalsElapsedTimings[type] =
      (aggregateRetrievalsElapsedTimings[type] ?? 0) + elapsedTimeSum;

    if (type == "JITPrimitiveAggregatesRetrieval")
      groupedRetrievalsElapsedTimings["Database"] += elapsedTimeSum;
    else if (type == "PartialPrimitiveAggregatesRetrieval")
      groupedRetrievalsElapsedTimings["Providers"] += elapsedTimeSum;
    else groupedRetrievalsElapsedTimings["Engine"] += elapsedTimeSum;

    if (timingInfo.executionContextElapsedTime !== undefined) {
      const executionContextElapsedTimeSum =
        timingInfo.executionContextElapsedTime.reduce(
          (acc, num) => acc + num,
          0,
        );

      aggregateRetrievalsExecutionContextElapsedTimings[type] =
        (aggregateRetrievalsExecutionContextElapsedTimings[type] ?? 0) +
        executionContextElapsedTimeSum;

      if (type == "JITPrimitiveAggregatesRetrieval")
        groupedRetrievalsExecutionContextElapsedTimings["Database"] +=
          executionContextElapsedTimeSum;
      else if (type == "PartialPrimitiveAggregatesRetrieval")
        groupedRetrievalsExecutionContextElapsedTimings["Providers"] +=
          executionContextElapsedTimeSum;
      else
        groupedRetrievalsExecutionContextElapsedTimings["Engine"] +=
          executionContextElapsedTimeSum;
    }
  });

  databaseRetrievals.forEach(({ timingInfo }) => {
    const databaseRetrievalsElapsedTime = timingInfo.elapsedTime.reduce(
      (acc, num) => acc + num,
      0,
    );
    groupedRetrievalsElapsedTimings["Database"] +=
      databaseRetrievalsElapsedTime;
    databaseRetrievalsElapsedTimings["DatabaseRetrieval"] +=
      databaseRetrievalsElapsedTime;

    if (timingInfo.executionContextElapsedTime !== undefined) {
      const databaseRetrievalsExecutionContextElapsedTime =
        timingInfo.executionContextElapsedTime.reduce(
          (acc, num) => acc + num,
          0,
        );
      groupedRetrievalsExecutionContextElapsedTimings["Database"] +=
        databaseRetrievalsExecutionContextElapsedTime;
      databaseRetrievalsExecutionContextElapsedTimings["DatabaseRetrieval"] +=
        databaseRetrievalsExecutionContextElapsedTime;
    }
  });

  Object.entries(retrievalsTypeCounts).forEach(([key, value]) => {
    if (
      key === "JITPrimitiveAggregatesRetrieval" ||
      key === "DatabaseRetrieval"
    )
      groupedRetrievalsTypeCounts["Database"] += value;
    else if (key === "PartialPrimitiveAggregatesRetrieval")
      groupedRetrievalsTypeCounts["Providers"] += value;
    else groupedRetrievalsTypeCounts["Engine"] += value;
  });

  // Associating a color for each retrieval type
  let colorIndex = 0;
  const retrievalsColors: Record<string, string> = {};
  Object.entries(retrievalsCountByType).forEach(([key]) => {
    retrievalsColors[key] = COLORS[colorIndex % COLORS.length];
    colorIndex++;
  });

  // Data for the PieCharts
  const pieDataElapsedTimings = [
    ...Object.entries(aggregateRetrievalsElapsedTimings)
      .sort((a, b) => b[1] - a[1])
      .map(([key, value]) => ({
        name: key,
        value,
        fill: retrievalsColors[key],
      })),
    ...Object.entries(databaseRetrievalsElapsedTimings)
      .sort((a, b) => b[1] - a[1])
      .map(([key, value]) => ({
        name: key,
        value,
        fill: retrievalsColors[key],
      })),
  ];

  const groupedPieDataElaspedTimings = Object.entries(
    groupedRetrievalsElapsedTimings,
  )
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => ({
      name: key,
      value,
      fill: GROUP_COLORS[key],
    }));

  const pieDataRetrievalsTypeCounts = Object.entries(retrievalsTypeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => ({
      name: key,
      value,
      fill: retrievalsColors[key],
    }));

  const groupedPieDataRetrievalsTypeCounts = Object.entries(
    retrievalsTypeCounts,
  )
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => ({
      name: key,
      value,
      fill: GROUP_COLORS[key],
    }));

  return (
    <Grid2 container spacing={1}>
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
                    Aggregate
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
                    Database
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
          )}
        </CardContent>
      </Card>
    </Grid2>
  );
}
