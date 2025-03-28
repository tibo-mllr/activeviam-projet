"use client";
import { FileUploader } from "@/components";
import { convertV1toJson } from "@/lib/functions/convertV1ToJson";
import { setQueryPlan, useAppDispatch } from "@/lib/redux";
import { queryPlansSchema } from "@/lib/types";
import { Button, Grid2, TextField, Typography } from "@mui/material";
import { ReactElement, useCallback, useState } from "react";

type ManualModeProps = {
  setError: (error: string | null) => void;
};

function isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
  } catch {
    return false;
  }
  return true;
}

export default function ManualMode({
  setError,
}: ManualModeProps): ReactElement {
  const dispatch = useAppDispatch();
  const [manualQueryPlan, setManualQueryPlan] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const processQueryPlan = useCallback<(input: string) => Promise<void>>(
    async (input) => {
      setError(null);

      if (!input.trim()) {
        setError("Query plan cannot be empty.");
        return;
      }

      if (isJsonString(input)) {
        // JSON is valid
        try {
          const parsed = queryPlansSchema.safeParse(JSON.parse(input));
          if (!parsed.success) {
            setError("Failed to parse JSON to query plan schema.");
            console.error(parsed.error);
            return;
          }
          dispatch(setQueryPlan(parsed.data));
        } catch {
          setError("Unexpected error parsing JSON.");
        }
      } else {
        // Not a JSON, try V1 format conversion
        try {
          const convertedV1ToStringArray = JSON.stringify(
            await convertV1toJson(input),
          );
          const parsed = queryPlansSchema.safeParse(
            JSON.parse(convertedV1ToStringArray),
          );
          if (!parsed.success) {
            setError("Failed to parse JSON to query plan schema.");
            console.error(parsed.error);
            return;
          }
          dispatch(setQueryPlan(parsed.data));
        } catch {
          setError(
            "The input doesn't seem to be a JSON format or a valid V1 format.",
          );
        }
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
        {uploadSuccess && (
          <Typography sx={{ color: "green", mt: 1, ml: 2 }}>
            ✔ Uploaded!
          </Typography>
        )}
      </Grid2>
    </Grid2>
  );
}
