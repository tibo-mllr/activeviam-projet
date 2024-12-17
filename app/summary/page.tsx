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
} from "@mui/material";
import { ReactElement, useState } from "react";
import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#FF6666",
  "#A8DADC",
  "#457B9D",
  "#F1FAEE",
  "#1D3557",
  "#E63946",
  "#F4A261",
  "#2A9D8F",
  "#264653",
  "#E76F51",
  "#F1C6C6",
];

export default function SummaryPage(): ReactElement {
  const queryPlan = useSelector(getQueryPlan);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

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

  // aggregate retrievals calculations
  const aggregateRetrievalsElapsedTimeRecord: Record<string, number> = {};
  const aggregateRetrievalsExecutionContextElapsedTimeRecord: Record<
    string,
    number
  > = {};

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
    }
  });
  // database retrievals calculation
  let databaseRetrievalsElapsedTime = 0;
  let databaseRetrievalsExecutionContextElapsedTime = 0;
  const databaseRetrievalsElapsedTimeRecord = {
    databaseRetrieval: databaseRetrievalsElapsedTime,
  };
  const databaseRetrievalsExecutionContextElapsedTimeRecord = {
    databaseRetrieval: databaseRetrievalsExecutionContextElapsedTime,
  };

  databaseRetrievals.forEach((retrieval) => {
    databaseRetrievalsElapsedTime += retrieval.timingInfo.elapsedTime.reduce(
      (acc, num) => acc + num,
      0,
    );

    if (retrieval.timingInfo.executionContextElapsedTime !== undefined) {
      databaseRetrievalsExecutionContextElapsedTime +=
        retrieval.timingInfo.executionContextElapsedTime.reduce(
          (acc, num) => acc + num,
          0,
        );
    }
  });

  // Data for the PieCharts
  const pieDataElapsedTimings = [
    ...Object.entries(aggregateRetrievalsElapsedTimeRecord)
      .sort((a, b) => b[1] - a[1])
      .map(([key, value], index) => ({
        name: key,
        value,
        fill: COLORS[index % COLORS.length],
      })),
    ...Object.entries(databaseRetrievalsElapsedTimeRecord)
      .sort((a, b) => b[1] - a[1])
      .map(([key, value], index) => ({
        name: key,
        value,
        fill: COLORS[
          (index +
            Object.entries(aggregateRetrievalsElapsedTimeRecord).length) %
            COLORS.length
        ],
      })),
  ];

  const pieDataRetrievalsByType = Object.entries(
    selectedQueryPlan.querySummary.retrievalsCountByType,
  )
    .sort((a, b) => b[1] - a[1])
    .map(([key, value], index) => ({
      name: key,
      value,
      fill: COLORS[index % COLORS.length],
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
          <Grid2 container spacing={2}>
            <Box
              sx={{
                border: "1px solid #ccc",
                padding: 2,
                marginTop: 2,
                display: "flex",
              }}
            >
              <ResponsiveContainer width="40%" height={300}>
                <PieChart>
                  <Pie
                    data={pieDataElapsedTimings}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                  >
                    {pieDataElapsedTimings.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <Box sx={{ marginLeft: 2, flex: 1 }}>
                <Typography variant="body1" fontWeight="bold" marginBottom={1}>
                  Elapsed timings
                </Typography>
                <Typography variant="body2" marginLeft={2}>
                  Aggregate
                </Typography>
                <List dense sx={{ marginLeft: 4 }}>
                  {Object.entries(aggregateRetrievalsElapsedTimeRecord)
                    .sort((a, b) => b[1] - a[1])
                    .map(([key, value], index) => (
                      <ListItem key={key} disablePadding>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            backgroundColor: COLORS[index % COLORS.length],
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
                    .map(([key, value], index) => (
                      <ListItem key={key} disablePadding>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            backgroundColor:
                              COLORS[
                                (index +
                                  Object.entries(
                                    aggregateRetrievalsElapsedTimeRecord,
                                  ).length) %
                                  COLORS.length
                              ],
                            marginRight: 1,
                          }}
                        />
                        <ListItemText primary={`${key} : ${value} ms`} />
                      </ListItem>
                    ))}
                </List>

                <Typography variant="body1" fontWeight="bold" marginBottom={1}>
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
          <Grid2 container spacing={2}>
            <Box
              sx={{
                border: "1px solid #ccc",
                padding: 2,
                marginTop: 2,
                display: "flex",
              }}
            >
              <ResponsiveContainer width="40%" height={300}>
                <PieChart>
                  <Pie
                    data={pieDataRetrievalsByType}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                  >
                    {pieDataRetrievalsByType.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ marginLeft: 2, flex: 1 }}>
                <Typography variant="body1" fontWeight="bold">
                  Retrievals ({selectedQueryPlan.querySummary.totalRetrievals})
                  :
                </Typography>
                <List dense sx={{ marginLeft: 4 }}>
                  {Object.entries(
                    selectedQueryPlan.querySummary.retrievalsCountByType,
                  )
                    .sort((a, b) => b[1] - a[1])
                    .map(([key, value], index) => (
                      <ListItem key={key} disablePadding>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            backgroundColor: COLORS[index % COLORS.length],
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
                {selectedQueryPlan.querySummary?.partialProviders?.length || 0})
                :
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
    </Grid2>
  );
}
