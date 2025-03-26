import { FileExporter } from "@/components";
import { QueryPlan } from "@/lib/types";
import { CopyAll } from "@mui/icons-material";
import { Button, Grid2, Tooltip, Typography } from "@mui/material";
import { ReactElement } from "react";

type ResultQueryPlanProps = {
  queryPlan: QueryPlan[];
};

export default function ResultQueryPlan({
  queryPlan,
}: ResultQueryPlanProps): ReactElement {
  return (
    <Grid2
      container
      spacing={2}
      padding={3}
      borderRadius={2}
      className="bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
    >
      <Grid2 container size={12} spacing={2} justifyContent="space-between">
        <Grid2 className="font-medium text-lg">Saved query plan :</Grid2>
        <Grid2 container direction="row" spacing={1}>
          <Tooltip title="Copy query plan">
            <Button
              onClick={() =>
                navigator.clipboard.writeText(
                  JSON.stringify(queryPlan, null, 2),
                )
              }
              variant="outlined"
              className="text-blue-600
            dark:text-blue-400 hover:text-blue-800
            dark:hover:text-blue-300"
            >
              <CopyAll />
            </Button>
          </Tooltip>
          <FileExporter data={queryPlan} filename="queryPlan.json" />
        </Grid2>
      </Grid2>
      <Typography
        whiteSpace="pre-wrap"
        borderRadius={1}
        padding={2}
        className="text-sm bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100"
        width="100%"
        sx={{ overflowX: "auto" }}
      >
        {JSON.stringify(queryPlan, null, 2)}
      </Typography>
    </Grid2>
  );
}
