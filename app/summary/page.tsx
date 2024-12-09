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
} from "@mui/material";
import { ReactElement } from "react";
import { useSelector } from "react-redux";

export default function SummaryPage(): ReactElement {
  const queryPlan = useSelector(getQueryPlan);
  console.log(queryPlan);

  if (queryPlan !== "") {
    // If we have a queryPlan loaded
    const [SelectPass_0] = queryPlan;
    const totalAggregateRetrievals = SelectPass_0.aggregateRetrievals.length;
    const totalDatabaseRetrievals = SelectPass_0.databaseRetrievals.length;

    const counts: Record<string, number> = {};

    SelectPass_0.aggregateRetrievals.forEach((item) => {
      const type_name = item.type;
      if (!counts[type_name]) {
        counts[type_name] = 0;
      }
      counts[type_name]++;
    });

    console.log("Counts:", counts);

    return (
      <Card>
        <CardContent>
          <Grid2 container spacing={2}>
            <Grid2>
              <Typography variant="h6">Summary</Typography>
            </Grid2>
            <Grid2>
              <Typography variant="body1">
                Total Aggregate Retrievals: {totalAggregateRetrievals}
              </Typography>
              <List dense sx={{ marginLeft: 4 }}>
                {Object.entries(counts).map(([type, count]) => (
                  <ListItem key={type} disablePadding>
                    <ListItemText primary={`${type}: ${count}`} />
                  </ListItem>
                ))}
              </List>
            </Grid2>
          </Grid2>
        </CardContent>
        <CardContent>
          <Grid2 container spacing={2}>
            <Grid2>
              <Typography variant="body1">
                Total Database Retrievals: {totalDatabaseRetrievals}
              </Typography>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>
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
