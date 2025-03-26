"use client";
import { getIsLargeQueryPlan, getQueryPlan } from "@/lib/redux";
import {
  Card,
  CardContent,
  CardHeader,
  Grid2,
  Typography,
  Switch,
} from "@mui/material";
import { useState, ReactElement } from "react";
import { useSelector } from "react-redux";
import ManualMode from "./ui/ManualMode";
import QueryPlanMode from "./ui/QueryPlanMode";
import ResultQueryPlan from "./ui/ResultQueryPlan";

export default function SubmitQueryPage(): ReactElement {
  const [error, setError] = useState<string | null>(null);
  const [isManualMode, setIsManualMode] = useState<boolean>(false);

  const queryPlan = useSelector(getQueryPlan);
  const isLargeQueryPlan = useSelector(getIsLargeQueryPlan);

  return (
    <Card sx={{ width: "40%", padding: 4 }}>
      <CardHeader
        title="Send an MDX request"
        action={
          // Toggle Switch
          <Grid2>
            <Typography>Query plan mode</Typography>
            <Switch
              checked={isManualMode}
              onChange={() => setIsManualMode((prev) => !prev)}
            />
          </Grid2>
        }
      />

      <CardContent>
        <Grid2 container spacing={4}>
          {!isManualMode ? (
            <QueryPlanMode setError={setError} />
          ) : (
            <ManualMode setError={setError} />
          )}

          {error && (
            <Grid2
              size={12}
              padding={2}
              borderRadius={1}
              className="bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300"
            >
              <p>{error}</p>
            </Grid2>
          )}

          {queryPlan &&
            (!isLargeQueryPlan ? (
              <ResultQueryPlan queryPlan={queryPlan} />
            ) : (
              <Typography>
                We don&apos;t display the query plan here because it is too
                large, but it has been processed and is ready for you!
              </Typography>
            ))}
        </Grid2>
      </CardContent>
    </Card>
  );
}
