"use client";
import { getQueryPlan } from "@/lib/redux";
import {
  Card,
  CardContent,
  CardHeader,
  Grid2,
  Typography,
  Switch,
  Box,
  Button,
} from "@mui/material";
import { useState, ReactElement, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import HelpCard from "./ui/HelpCard";
import ManualMode from "./ui/ManualMode";
import QueryPlanMode from "./ui/QueryPlanMode";
import ResultQueryPlan from "./ui/ResultQueryPlan";

export default function SubmitQueryPage(): ReactElement {
  const [error, setError] = useState<string | null>(null);
  const [isManualMode, setIsManualMode] = useState<boolean>(false);
  const [showAdditionalCard, setShowAdditionalCard] = useState(false);
  const additionalCardRef = useRef<HTMLDivElement>(null);

  const queryPlan = useSelector(getQueryPlan);

  const handleClick = useCallback<() => void>(() => {
    setShowAdditionalCard((prev) => !prev);

    setTimeout(() => {
      if (additionalCardRef.current) {
        additionalCardRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  }, []);

  return (
    <Box padding={2} width="45%">
      <Card sx={{ padding: 4 }}>
        <CardHeader
          title={
            <>
              Send an MDX request <br /> or a Query Plan
            </>
          }
          action={
            // Toggle Switch
            <Grid2>
              <Grid2>
                <Typography>MDX request / Direct query plan</Typography>
              </Grid2>
              <Grid2 textAlign={"right"} sx={{ marginRight: 1 }}>
                <Switch
                  checked={isManualMode}
                  onChange={() => setIsManualMode((prev) => !prev)}
                />
              </Grid2>
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

            <Button
              variant="contained"
              color="info"
              sx={{ mt: 2 }}
              onClick={handleClick}
            >
              {showAdditionalCard ? "Hide" : "Show"} help about types
            </Button>

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

            {queryPlan && <ResultQueryPlan queryPlan={queryPlan} />}
          </Grid2>
        </CardContent>
      </Card>
      {showAdditionalCard && <HelpCard ref={additionalCardRef} />}
    </Box>
  );
}
