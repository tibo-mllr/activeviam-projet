"use client";
import { FileUploader } from "@/components";
import { setQueryPlan, useAppDispatch } from "@/lib/redux";
import {
  Button,
  CircularProgress,
  Grid2,
  TextField,
  Typography,
} from "@mui/material";
import { ReactElement, useCallback, useState } from "react";

type ManualModeProps = {
  setError: (error: string | null) => void;
};

export default function ManualMode({
  setError,
}: ManualModeProps): ReactElement {
  const dispatch = useAppDispatch();
  const [manualQueryPlan, setManualQueryPlan] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  const processQueryPlan = useCallback<(input: string) => Promise<void>>(
    async (input) => {
      setError(null);

      if (!input.trim()) {
        setError("Query plan cannot be empty.");
        return;
      }

      try {
        setProcessing(true);
        const response = await fetch("/api/process-query-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ queryPlan: input }),
        });

        const data = await response.json();

        if (response.ok) dispatch(setQueryPlan(data.queryPlan));
        else setError(data.error || "Unexpected error.");
      } catch (error) {
        setError((error as string) || "Unexpected error.");
      } finally {
        setProcessing(false);
      }
    },
    [dispatch, setError],
  );

  const handleManualSubmit = useCallback(() => {
    processQueryPlan(manualQueryPlan);
  }, [manualQueryPlan, processQueryPlan]);

  const handleFileUpload = useCallback(
    (fileContent: string) => {
      processQueryPlan(fileContent).then(() => setUploadSuccess(true));
      setTimeout(() => setUploadSuccess(false), 3000); // Hide after 3s
    },
    [processQueryPlan],
  );

  return (
    <Grid2>
      {/* Manual mode */}
      <Typography>Enter directly your Query Plan</Typography>
      <TextField
        multiline
        minRows={6}
        maxRows={12}
        placeholder="Enter Query Plan : JSON or V1 format"
        sx={{ width: "100%" }}
        value={manualQueryPlan}
        onChange={(e) => setManualQueryPlan(e.target.value)} // Update state
      />

      <FileUploader
        onFileLoad={handleFileUpload}
        accept=".txt,.json"
        label="Or upload a query plan file (.txt or .json)"
      />

      <Grid2 display="flex" alignItems="center">
        <Button variant="contained" onClick={handleManualSubmit} sx={{ mt: 2 }}>
          Submit Query Plan
        </Button>
        {processing && <CircularProgress sx={{ mt: 1, ml: 2 }} disableShrink />}
        {uploadSuccess && (
          <Typography sx={{ color: "green", mt: 1, ml: 2 }}>
            ✔ Uploaded!
          </Typography>
        )}
      </Grid2>
    </Grid2>
  );
}
