"use client";
import { postRequest } from "@/lib/functions";
import { getQueryPlan, setQueryPlan, useAppDispatch } from "@/lib/redux";
import { CopyAll } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid2,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { isAxiosError } from "axios";
import { Formik, Field, Form } from "formik";
import { useState, ReactElement } from "react";
import { useSelector } from "react-redux";

const DEFAULT_URL =
  "https://activepivot-ranch.activeviam.com:6100/activeviam/pivot/rest/v9/cube/query/mdx/queryplan";

export default function SubmitQueryPage(): ReactElement {
  const [error, setError] = useState<string | null>(null);
  const [isManualMode, setIsManualMode] = useState<boolean>(false);
  const [manualQueryPlan, setManualQueryPlan] = useState<string>("");

  const dispatch = useAppDispatch();
  const queryPlan = useSelector(getQueryPlan);

  const handleSubmit = async (values: {
    url: string;
    username: string;
    password: string;
    text: string;
  }): Promise<void> => {
    setError(null);
    dispatch(setQueryPlan(""));
    if (values.text != "") {
      const payload = { mdx: values.text };
      try {
        // POST using Axios
        const res = await postRequest(
          values.url,
          payload,
          values.username,
          values.password,
        );
        dispatch(setQueryPlan(res));
      } catch (err) {
        if (isAxiosError(err)) setError(`Error: ${err.message}`);
        else setError(`Error: ${err}`);

        console.error(err);
      }
    } else {
      setError(`Query area is empty`);
    }
  };

  const handleManualSubmit = (): void => {
    try {
      setError(null);
      dispatch(setQueryPlan(""));
      if (!manualQueryPlan.trim()) {
        setError("Query plan cannot be empty.");
        return;
      }

      dispatch(setQueryPlan(JSON.parse(manualQueryPlan)));
    } catch {
      setError("Invalid JSON format in query plan.");
    }
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
          Formik.setFieldValue("text", text); // Update the MDX text field
        }
      };
      reader.onerror = () => {
        setError("Failed to read file. Please try again.");
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card sx={{ width: "40%", padding: 4 }}>
      <CardHeader
        title="Send an MDX request"
        action={
          // Toggle Switch
          <Grid2>
            <Typography>Manual Mode</Typography>
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
            <Grid2>
              <Formik
                initialValues={{
                  url: DEFAULT_URL,
                  username: "",
                  password: "",
                  text: "",
                }}
                onSubmit={handleSubmit}
              >
                {({ setFieldValue }) => (
                  <Form className="space-y-4">
                    <Field
                      as={TextField}
                      id="url"
                      name="url"
                      label="URL"
                      placeholder="Enter URL"
                      sx={{ width: "100%" }}
                    />

                    <Field
                      as={TextField}
                      id="username"
                      name="username"
                      label="Username"
                      placeholder="Enter user"
                      sx={{ width: "100%" }}
                    />

                    <Field
                      as={TextField}
                      id="password"
                      name="password"
                      label="Password"
                      type="password"
                      placeholder="Enter password"
                      sx={{ width: "100%" }}
                    />

                    <Field
                      as={TextField}
                      id="text"
                      name="text"
                      multiline
                      minRows={6}
                      maxRows={12}
                      label="MDX request"
                      placeholder="Enter MDX request"
                      sx={{ width: "100%" }}
                    />

                    <Button
                      variant="outlined"
                      component="label"
                      className="w-full"
                    >
                      Upload Query File
                      <input
                        type="file"
                        accept=".txt"
                        hidden
                        onChange={(e) => handleFileUpload(e)}
                      />
                    </Button>

                    <Button
                      type="submit"
                      variant="contained"
                      className="w-full"
                    >
                      Send and receive query plan
                    </Button>
                  </Form>
                )}
              </Formik>
            </Grid2>
          ) : (
            <Grid2>
              {/* Manual mode */}
              <Typography>Enter your Query Plan manually:</Typography>
              <TextField
                multiline
                minRows={6}
                maxRows={12}
                placeholder="Enter Query Plan JSON"
                sx={{ width: "100%" }}
                value={manualQueryPlan}
                onChange={(e) => setManualQueryPlan(e.target.value)} // Update state
              />

              <Button
                variant="contained"
                onClick={handleManualSubmit}
                sx={{ mt: 2 }}
              >
                Submit Query Plan
              </Button>
            </Grid2>
          )}

          {queryPlan && (
            <Grid2
              container
              spacing={2}
              padding={3}
              borderRadius={2}
              className="bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
            >
              <Grid2
                container
                size={12}
                spacing={2}
                justifyContent="space-between"
              >
                <Grid2 className="font-medium text-lg">
                  Saved query plan :
                </Grid2>
                <Grid2>
                  <Button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        JSON.stringify(queryPlan, null, 2),
                      )
                    }
                    variant="text"
                    endIcon={<CopyAll />}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    Copy Query Plan
                  </Button>
                </Grid2>
              </Grid2>
              <Typography
                whiteSpace="pre-wrap"
                borderRadius={1}
                padding={2}
                className="text-sm bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100"
              >
                {JSON.stringify(queryPlan, null, 2)}
              </Typography>
            </Grid2>
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
        </Grid2>
      </CardContent>
    </Card>
  );
}
