"use client";

import { getQueryPlan } from "@/lib/redux";
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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

export default function SummaryPage(): ReactElement {
  let colorIndex = 0;
  const queryPlan = useSelector(getQueryPlan);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isGroupedTimings, setIsGroupedTimings] = useState<boolean>(false);
  const [isGroupedNumbers, setIsGroupedNumbers] = useState<boolean>(false);

  if (queryPlan == "" || queryPlan.length === 0) {
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

  const { aggregateRetrievals, databaseRetrievals } = selectedQueryPlan;

  // associating a color for each retrieval type
  const retrievalsColors: Record<string, string> = {};
  Object.entries(selectedQueryPlan.querySummary.retrievalsCountByType).forEach(
    ([key]) => {
      retrievalsColors[key] = COLORS[colorIndex % COLORS.length];
      colorIndex++;
    },
  );
  // associating a color for each group type
  const groupColors: Record<string, string> = {
    Database: COLORS[0],
    Engine: COLORS[1],
    Network: COLORS[2],
    Providers: COLORS[3],
  };

  // grouped data records about the retrievals
  const retrievalsElapsedTimingsRecordGrouped: Record<string, number> = {
    Database: 0,
    Engine: 0,
    Network: 0,
    Providers: 0,
  };
  const retrievalsExecutionContextElapsedTimingsRecordGrouped: Record<
    string,
    number
  > = {
    Database: 0,
    Engine: 0,
    Network: 0,
    Providers: 0,
  };
  const retrievalsTypeCountsRecordGrouped: Record<string, number> = {
    Database: 0,
    Engine: 0,
    Network: 0,
    Providers: 0,
  };

  // detailed data (not grouped) about the retrievals
  // there is a aggregate retrievals variable and a database retrievals variable
  // aggregate
  const aggregateRetrievalsElapsedTimingsRecordNotGrouped: Record<
    string,
    number
  > = {};
  const aggregateRetrievalsExecutionContextElapsedTimingsRecordNotGrouped: Record<
    string,
    number
  > = {};

  // database: only one type and it needs to be directly specified since it is not in the JSON
  let databaseRetrievalsElapsedTime = 0;
  let databaseRetrievalsExecutionContextElapsedTime = 0;
  const databaseRetrievalsElapsedTimingsRecordNotGrouped = {
    DatabaseRetrieval: databaseRetrievalsElapsedTime,
  };
  const databaseRetrievalsExecutionContextElapsedTimingsRecordNotGrouped = {
    DatabaseRetrieval: databaseRetrievalsExecutionContextElapsedTime,
  };

  const retrievalsTypeCountsRecordNotGrouped =
    selectedQueryPlan.querySummary.retrievalsCountByType;

  // filling the records
  aggregateRetrievals.forEach((retrieval) => {
    const elapsedTimeSum = retrieval.timingInfo.elapsedTime.reduce(
      (acc, num) => acc + num,
      0,
    );

    if (
      aggregateRetrievalsElapsedTimingsRecordNotGrouped[retrieval.type] !==
      undefined
    ) {
      aggregateRetrievalsElapsedTimingsRecordNotGrouped[retrieval.type] +=
        elapsedTimeSum;
    } else {
      aggregateRetrievalsElapsedTimingsRecordNotGrouped[retrieval.type] =
        elapsedTimeSum;
    }

    if (retrieval.type == "JITPrimitiveAggregatesRetrieval") {
      retrievalsElapsedTimingsRecordGrouped["Database"] += elapsedTimeSum;
    } else if (retrieval.type == "PartialPrimitiveAggregatesRetrieval") {
      retrievalsElapsedTimingsRecordGrouped["Providers"] += elapsedTimeSum;
    } else {
      retrievalsElapsedTimingsRecordGrouped["Engine"] += elapsedTimeSum;
    }

    if (retrieval.timingInfo.executionContextElapsedTime !== undefined) {
      const executionContextElapsedTimeSum =
        retrieval.timingInfo.executionContextElapsedTime.reduce(
          (acc, num) => acc + num,
          0,
        );

      if (
        aggregateRetrievalsExecutionContextElapsedTimingsRecordNotGrouped[
          retrieval.type
        ] !== undefined
      ) {
        aggregateRetrievalsExecutionContextElapsedTimingsRecordNotGrouped[
          retrieval.type
        ] += executionContextElapsedTimeSum;
      } else {
        aggregateRetrievalsExecutionContextElapsedTimingsRecordNotGrouped[
          retrieval.type
        ] = executionContextElapsedTimeSum;
      }
      if (retrieval.type == "JITPrimitiveAggregatesRetrieval") {
        retrievalsExecutionContextElapsedTimingsRecordGrouped["Database"] +=
          executionContextElapsedTimeSum;
      } else if (retrieval.type == "PartialPrimitiveAggregatesRetrieval") {
        retrievalsExecutionContextElapsedTimingsRecordGrouped["Providers"] +=
          executionContextElapsedTimeSum;
      } else {
        retrievalsExecutionContextElapsedTimingsRecordGrouped["Engine"] +=
          executionContextElapsedTimeSum;
      }
    }
  });

  databaseRetrievals.forEach((retrieval) => {
    databaseRetrievalsElapsedTime += retrieval.timingInfo.elapsedTime.reduce(
      (acc, num) => acc + num,
      0,
    );
    retrievalsElapsedTimingsRecordGrouped["Database"] +=
      retrieval.timingInfo.elapsedTime.reduce((acc, num) => acc + num, 0);

    if (retrieval.timingInfo.executionContextElapsedTime !== undefined) {
      databaseRetrievalsExecutionContextElapsedTime +=
        retrieval.timingInfo.executionContextElapsedTime.reduce(
          (acc, num) => acc + num,
          0,
        );
      retrievalsExecutionContextElapsedTimingsRecordGrouped["Database"] +=
        retrieval.timingInfo.executionContextElapsedTime.reduce(
          (acc, num) => acc + num,
          0,
        );
    }
  });

  Object.entries(retrievalsTypeCountsRecordNotGrouped).forEach(
    ([key, value]) => {
      if (
        key === "JITPrimitiveAggregatesRetrieval" ||
        key === "DatabaseRetrieval"
      ) {
        retrievalsTypeCountsRecordGrouped["Database"] += value;
      } else if (key === "PartialPrimitiveAggregatesRetrieval") {
        retrievalsTypeCountsRecordGrouped["Providers"] += value;
      } else {
        retrievalsTypeCountsRecordGrouped["Engine"] += value;
      }
    },
  );

  // Data for the PieCharts
  const pieDataElapsedTimingsNotGrouped = [
    ...Object.entries(aggregateRetrievalsElapsedTimingsRecordNotGrouped)
      .sort((a, b) => b[1] - a[1])
      .map(([key, value]) => ({
        name: key,
        value,
        fill: retrievalsColors[key],
      })),
    ...Object.entries(databaseRetrievalsElapsedTimingsRecordNotGrouped)
      .sort((a, b) => b[1] - a[1])
      .map(([key, value]) => ({
        name: key,
        value,
        fill: retrievalsColors[key],
      })),
  ];

  const pieDataElaspedTimingsGrouped = Object.entries(
    retrievalsElapsedTimingsRecordGrouped,
  )
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => ({
      name: key,
      value,
      fill: groupColors[key],
    }));

  const pieDataRetrievalsTypeCountsNotGrouped = Object.entries(
    retrievalsTypeCountsRecordNotGrouped,
  )
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => ({
      name: key,
      value,
      fill: retrievalsColors[key],
    }));

  const pieDataRetrievalsTypeCountsGrouped = Object.entries(
    retrievalsTypeCountsRecordGrouped,
  )
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => ({
      name: key,
      value,
      fill: groupColors[key],
    }));

  return (
    <Grid2 container spacing={1}>
      {queryPlan.length >= 2 && (
        <Card>
          <CardContent>
            <FormControl fullWidth>
              <InputLabel id="query-plan-select-label">
                Select Query Plan
              </InputLabel>
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
                      data={pieDataElapsedTimingsNotGrouped}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      isAnimationActive={false}
                    >
                      {pieDataElapsedTimingsNotGrouped.map((entry) => (
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
                    {Object.entries(
                      aggregateRetrievalsElapsedTimingsRecordNotGrouped,
                    )
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
                    {Object.entries(
                      databaseRetrievalsElapsedTimingsRecordNotGrouped,
                    )
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
                      aggregateRetrievalsExecutionContextElapsedTimingsRecordNotGrouped,
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
                      databaseRetrievalsExecutionContextElapsedTimingsRecordNotGrouped,
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
                      data={pieDataElaspedTimingsGrouped}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      isAnimationActive={false}
                    >
                      {pieDataElaspedTimingsGrouped.map((entry) => (
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
                    {Object.entries(retrievalsElapsedTimingsRecordGrouped)
                      .sort((a, b) => b[1] - a[1])
                      .map(([key, value]) => (
                        <ListItem key={key} disablePadding>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              backgroundColor: groupColors[key],
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
                      retrievalsExecutionContextElapsedTimingsRecordGrouped,
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
                      data={pieDataRetrievalsTypeCountsNotGrouped}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      isAnimationActive={false}
                    >
                      {pieDataRetrievalsTypeCountsNotGrouped.map((entry) => (
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
                    {Object.entries(retrievalsTypeCountsRecordNotGrouped)
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
                      data={pieDataRetrievalsTypeCountsGrouped}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      isAnimationActive={false}
                    >
                      {pieDataRetrievalsTypeCountsGrouped.map((entry) => (
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
                    {Object.entries(retrievalsTypeCountsRecordGrouped)
                      .sort((a, b) => b[1] - a[1])
                      .map(([key, value]) => (
                        <ListItem key={key} disablePadding>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              backgroundColor: groupColors[key],
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
