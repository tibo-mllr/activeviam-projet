import { getQueryPlan } from "@/lib/redux";
import { Typography, Card, CardContent } from "@mui/material";
import { ReactElement } from "react";
import { useSelector } from "react-redux";

export default function SummaryPage(): ReactElement {
  const queryPlan = useSelector(getQueryPlan);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Query Plan</Typography>
        {queryPlan ? (
          <pre>{JSON.stringify(queryPlan, null, 2)}</pre>
        ) : (
          <Typography>No query plan available.</Typography>
        )}
      </CardContent>
    </Card>
  );
}
