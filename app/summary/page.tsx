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
} from "@mui/material";
import { ReactElement, useState } from "react";
import { useSelector } from "react-redux";

export default function SummaryPage(): ReactElement {
  const queryPlan = useSelector(getQueryPlan);
  console.log(queryPlan);
  const [searchTerm, setSearchTerm] = useState("");
  if (queryPlan !== "") {
    // If we have a queryPlan loaded
    const [SelectPass_0] = queryPlan;
    const filteredMeasures = Object.entries(
      SelectPass_0.querySummary.measures,
    ).filter(
      ([key, value]) =>
        key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        value.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    let aggregateRetrievalsElapsedTime = 0;
    let aggregateRetrievalsExecutionContextElapsedTime = 0;

    for (let i = 0; i < SelectPass_0.aggregateRetrievals.length; i++) {
      aggregateRetrievalsElapsedTime += SelectPass_0.aggregateRetrievals[
        i
      ].timingInfo.elapsedTime.reduce((acc, num) => acc + num, 0);

      if (
        SelectPass_0.aggregateRetrievals[i].timingInfo
          .executionContextElapsedTime !== undefined
      ) {
        aggregateRetrievalsExecutionContextElapsedTime +=
          SelectPass_0.aggregateRetrievals[
            i
          ].timingInfo.executionContextElapsedTime.reduce(
            (acc, num) => acc + num,
            0,
          );
      }
    }
    let databaseRetrievalsElapsedTime = 0;
    let databaseRetrievalsExecutionContextElapsedTime = 0;
    for (let i = 0; i < SelectPass_0.databaseRetrievals.length; i++) {
      databaseRetrievalsElapsedTime += SelectPass_0.databaseRetrievals[
        i
      ].timingInfo.elapsedTime.reduce((acc, num) => acc + num, 0);

      if (
        SelectPass_0.databaseRetrievals[i].timingInfo
          .executionContextElapsedTime !== undefined
      ) {
        databaseRetrievalsExecutionContextElapsedTime +=
          SelectPass_0.databaseRetrievals[
            i
          ].timingInfo.executionContextElapsedTime.reduce(
            (acc, num) => acc + num,
            0,
          );
      }
    }

    const TimeElapsedMetrics = {
      "Total elasped time from aggregateRetrievals":
        aggregateRetrievalsElapsedTime,
      "Total elasped time from aggregate Retrievals (execution context)":
        aggregateRetrievalsExecutionContextElapsedTime,
      "Total elasped time from databaseRetrievals":
        databaseRetrievalsElapsedTime,
      "Total elasped time from database Retrievals (execution context)":
        databaseRetrievalsExecutionContextElapsedTime,
    };

    return (
      <Grid2 container spacing={1}>
        <Card>
          <CardContent>
            <Grid2 container spacing={2}>
              <Grid2>
                <Typography variant="h6">Elapsed timings</Typography>
                <List dense sx={{ marginLeft: 4 }}>
                  {Object.entries(TimeElapsedMetrics).map(([key, value]) => (
                    <ListItem key={key} disablePadding>
                      <ListItemText primary={`${key} : ${value} ms`} />
                    </ListItem>
                  ))}
                </List>
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Grid2 container spacing={2}>
              <Grid2>
                <Typography variant="h6">Global timings</Typography>
                <List dense sx={{ marginLeft: 4 }}>
                  {Object.entries(SelectPass_0.planInfo.globalTimings).map(
                    ([key, value]) => (
                      <ListItem key={key} disablePadding>
                        <ListItemText primary={`${key} : ${value} ms`} />
                      </ListItem>
                    ),
                  )}
                </List>
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
                }}
              >
                <Typography variant="body1" fontWeight="bold">
                  Retrievals ({SelectPass_0.querySummary.totalRetrievals}) :
                </Typography>
                <List dense sx={{ marginLeft: 4 }}>
                  {Object.entries(
                    SelectPass_0.querySummary.retrievalsCountByType,
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
                  Partial Providers (
                  {SelectPass_0.querySummary.partialProviders.length}) :
                </Typography>
                <List dense sx={{ marginLeft: 4 }}>
                  {Object.entries(
                    SelectPass_0.querySummary.partialProviders,
                  ).map(([key, value]) => (
                    <ListItem key={key} disablePadding>
                      <ListItemText primary={value} />
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
                  Partitioning Count by Type:
                </Typography>
                <List dense sx={{ marginLeft: 4 }}>
                  {Object.entries(
                    SelectPass_0.querySummary.partitioningCountByType,
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
                    SelectPass_0.querySummary.resultSizeByPartitioning,
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

  // Default display
  return (
    <Card>
      <CardContent>
        <Typography variant="body1">No data available</Typography>
      </CardContent>
    </Card>
  );
}
