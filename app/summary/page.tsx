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

export default function SummaryPage(): ReactElement {
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

  // grouped data about the retrievals
  const retrievalsGroupedElapsedTimeRecord: Record<string, number> = {
    Database: 0,
    Engine: 0,
    Network: 0,
    Providers: 0,
  };
  const retrievalsGroupedExecutionContextElapsedTimeRecord: Record<
    string,
    number
  > = {
    Database: 0,
    Engine: 0,
    Network: 0,
    Providers: 0,
  };
  const retrievalsGroupedNumberByTypeRecord: Record<string, number> = {
    Database: 0,
    Engine: 0,
    Network: 0,
    Providers: 0,
  };

  // detailed data about the retrievals
  const aggregateRetrievalsElapsedTimeRecord: Record<string, number> = {};
  const aggregateRetrievalsExecutionContextElapsedTimeRecord: Record<
    string,
    number
  > = {};

  let databaseRetrievalsElapsedTime = 0;
  let databaseRetrievalsExecutionContextElapsedTime = 0;
  const databaseRetrievalsElapsedTimeRecord = {
    DatabaseRetrieval: databaseRetrievalsElapsedTime,
  };
  const databaseRetrievalsExecutionContextElapsedTimeRecord = {
    DatabaseRetrieval: databaseRetrievalsExecutionContextElapsedTime,
  };

  const retrievalsNumberByTypeRecord =
    selectedQueryPlan.querySummary.retrievalsCountByType;

  // filling the records
  aggregateRetrievals.forEach((retrieval) => {
    const elapsedTimeSum = retrieval.timingInfo.elapsedTime.reduce(
      (acc, num) => acc + num,
      0,
    );

    if (aggregateRetrievalsElapsedTimeRecord[retrieval.type] !== undefined) {
      aggregateRetrievalsElapsedTimeRecord[retrieval.type] += elapsedTimeSum;
    } else {
      aggregateRetrievalsElapsedTimeRecord[retrieval.type] = elapsedTimeSum;
    }

    if (retrieval.type == "JITPrimitiveAggregatesRetrieval") {
      retrievalsGroupedElapsedTimeRecord["Database"] += elapsedTimeSum;
    } else if (retrieval.type == "PartialPrimitiveAggregatesRetrieval") {
      retrievalsGroupedElapsedTimeRecord["Providers"] += elapsedTimeSum;
    } else {
      retrievalsGroupedElapsedTimeRecord["Engine"] += elapsedTimeSum;
    }

    if (retrieval.timingInfo.executionContextElapsedTime !== undefined) {
      const executionContextElapsedTimeSum =
        retrieval.timingInfo.executionContextElapsedTime.reduce(
          (acc, num) => acc + num,
          0,
        );

      if (
        aggregateRetrievalsExecutionContextElapsedTimeRecord[retrieval.type] !==
        undefined
      ) {
        aggregateRetrievalsExecutionContextElapsedTimeRecord[retrieval.type] +=
          executionContextElapsedTimeSum;
      } else {
        aggregateRetrievalsExecutionContextElapsedTimeRecord[retrieval.type] =
          executionContextElapsedTimeSum;
      }
      if (retrieval.type == "JITPrimitiveAggregatesRetrieval") {
        retrievalsGroupedExecutionContextElapsedTimeRecord["Database"] +=
          executionContextElapsedTimeSum;
      } else if (retrieval.type == "PartialPrimitiveAggregatesRetrieval") {
        retrievalsGroupedExecutionContextElapsedTimeRecord["Providers"] +=
          executionContextElapsedTimeSum;
      } else {
        retrievalsGroupedExecutionContextElapsedTimeRecord["Engine"] +=
          executionContextElapsedTimeSum;
      }
    }
  });

  databaseRetrievals.forEach((retrieval) => {
    databaseRetrievalsElapsedTime += retrieval.timingInfo.elapsedTime.reduce(
      (acc, num) => acc + num,
      0,
    );
    retrievalsGroupedElapsedTimeRecord["Database"] +=
      retrieval.timingInfo.elapsedTime.reduce((acc, num) => acc + num, 0);

    if (retrieval.timingInfo.executionContextElapsedTime !== undefined) {
      databaseRetrievalsExecutionContextElapsedTime +=
        retrieval.timingInfo.executionContextElapsedTime.reduce(
          (acc, num) => acc + num,
          0,
        );
      retrievalsGroupedExecutionContextElapsedTimeRecord["Database"] +=
        retrieval.timingInfo.executionContextElapsedTime.reduce(
          (acc, num) => acc + num,
          0,
        );
    }
  });

  Object.entries(retrievalsNumberByTypeRecord).forEach(([key, value]) => {
    if (
      key === "JITPrimitiveAggregatesRetrieval" ||
      key === "DatabaseRetrieval"
    ) {
      retrievalsGroupedNumberByTypeRecord["Database"] += value;
    } else if (key === "PartialPrimitiveAggregatesRetrieval") {
      retrievalsGroupedNumberByTypeRecord["Providers"] += value;
    } else {
      retrievalsGroupedNumberByTypeRecord["Engine"] += value;
    }
  });

  // Data for the PieCharts
  const pieDataElapsedTimingsNotGrouped = [
    ...Object.entries(aggregateRetrievalsElapsedTimeRecord)
      .sort((a, b) => b[1] - a[1])
      .map(([key, value]) => ({
        name: key,
        value,
        fill: retrievalsColors[key],
      })),
    ...Object.entries(databaseRetrievalsElapsedTimeRecord)
      .sort((a, b) => b[1] - a[1])
      .map(([key, value]) => ({
        name: key,
        value,
        fill: retrievalsColors[key],
      })),
  ];

  const pieDataElaspedTimingsGrouped = Object.entries(
    retrievalsGroupedElapsedTimeRecord,
  )
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => ({
      name: key,
      value,
      fill: groupColors[key],
    }));

  const pieDataRetrievalsByTypeNotGrouped = Object.entries(
    retrievalsNumberByTypeRecord,
  )
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => ({
      name: key,
      value,
      fill: retrievalsColors[key],
    }));

  const pieDataRetrievalsByTypeGrouped = Object.entries(
    retrievalsGroupedNumberByTypeRecord,
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
                    {Object.entries(aggregateRetrievalsElapsedTimeRecord)
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
                    {Object.entries(databaseRetrievalsElapsedTimeRecord)
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
                      aggregateRetrievalsExecutionContextElapsedTimeRecord,
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
                      databaseRetrievalsExecutionContextElapsedTimeRecord,
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
                    {Object.entries(retrievalsGroupedElapsedTimeRecord)
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
                      retrievalsGroupedExecutionContextElapsedTimeRecord,
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
                      data={pieDataRetrievalsByTypeNotGrouped}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      isAnimationActive={false}
                    >
                      {pieDataRetrievalsByTypeNotGrouped.map((entry) => (
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
                    {Object.entries(retrievalsNumberByTypeRecord)
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
                      data={pieDataRetrievalsByTypeGrouped}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      isAnimationActive={false}
                    >
                      {pieDataRetrievalsByTypeGrouped.map((entry) => (
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
                    {Object.entries(retrievalsGroupedNumberByTypeRecord)
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
