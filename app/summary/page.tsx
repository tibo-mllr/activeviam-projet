"use client";

import { getQueryPlan } from "@/lib/redux";
import { Card, CardContent, Grid2, Typography } from "@mui/material";
import { ReactElement } from "react";
import { useSelector } from "react-redux";

export default function SummaryPage(): ReactElement {
  const queryPlan = useSelector(getQueryPlan);

  if (queryPlan !== "") {
    // If we have a queryPlan loaded
    const totalAggregateRetrievals = queryPlan.reduce((total, qP) => {
      return total + qP.aggregateRetrievals.length;
    }, 0);

    const totalDatabaseRetrievals = queryPlan.reduce((total, qP) => {
      return total + qP.databaseRetrievals.length;
    }, 0);

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
            </Grid2>
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
