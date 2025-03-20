"use client";
import { FileExporter, FileUploader } from "@/components";
import { postRequest } from "@/lib/functions";
import { convertV1toJson } from "@/lib/functions/convertV1ToJson";
import { getQueryPlan, setQueryPlan, useAppDispatch } from "@/lib/redux";
import { queryPlansSchema } from "@/lib/types";
import { CopyAll } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid2,
  TextField,
  Tooltip,
  Typography,
  Switch,
  CircularProgress,
  Box,
  Fade,
  Link,
} from "@mui/material";
import { isAxiosError } from "axios";
import { Formik, Field, Form } from "formik";
import { useState, ReactElement, useRef } from "react";
import { useSelector } from "react-redux";

const DEFAULT_URL =
  "https://activepivot-ranch.activeviam.com:6100/activeviam/pivot/rest/v9/cube/query/mdx/queryplan";

function isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
  } catch {
    return false;
  }
  return true;
}

export default function SubmitQueryPage(): ReactElement {
  const [error, setError] = useState<string | null>(null);
  const [isManualMode, setIsManualMode] = useState<boolean>(false);
  const [manualQueryPlan, setManualQueryPlan] = useState<string>("");
  const [showAdditionalCard, setShowAdditionalCard] = useState(false);
  const additionalCardRef = useRef<HTMLDivElement>(null);

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

  const handleManualSubmit = async (): Promise<void> => {
    setError(null);
    dispatch(setQueryPlan(""));
    if (!manualQueryPlan.trim()) {
      setError("Query plan cannot be empty.");
      return;
    }
    if (isJsonString(manualQueryPlan)) {
      // JSON is valid
      // We expect the JSON query plan format given by the server
      try {
        const parsed = queryPlansSchema.safeParse(JSON.parse(manualQueryPlan));
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
      // Not a JSON, we try if it is a V1 format
      try {
        const convertedV1ToStringArray = JSON.stringify(
          await convertV1toJson(manualQueryPlan),
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
          "The input doesn't seem to be a JSON format or a valid V1 format",
        );
      }
    }
  };

  const handleClick = (): void => {
    setShowAdditionalCard((prev) => !prev);

    setTimeout(() => {
      if (additionalCardRef.current) {
        additionalCardRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

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
                <Typography>MDX request / Query plan</Typography>
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
                  {({ setFieldValue, isSubmitting }) => (
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
                      <FileUploader
                        onFileLoad={(content) => setFieldValue("text", content)}
                        label="Or upload an MDX request file (.txt)"
                      />
                      <Box position="relative">
                        <Button
                          type="submit"
                          variant="contained"
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          Send and receive query plan
                        </Button>
                        <Fade
                          in={isSubmitting}
                          style={{
                            transitionDelay: isSubmitting ? "800ms" : "0ms",
                          }}
                          unmountOnExit
                        >
                          <CircularProgress
                            size={24}
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              marginTop: "-12px",
                              marginLeft: "-12px",
                            }}
                          />
                        </Fade>
                      </Box>
                    </Form>
                  )}
                </Formik>
              </Grid2>
            ) : (
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
                  onFileLoad={(content) => setManualQueryPlan(content)}
                  accept=".txt,.json"
                  label="Or upload a query plan file (.txt or .json)"
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
            <Button variant="contained" sx={{ mt: 2 }} onClick={handleClick}>
              {showAdditionalCard ? "Hide" : "Show"} help about types
            </Button>
          </Grid2>
        </CardContent>
      </Card>
      {showAdditionalCard && (
        <Card ref={additionalCardRef} sx={{ padding: 4, marginTop: 2 }}>
          <CardContent>
            <Typography variant="body2" sx={{ marginBottom: 2 }}>
              You have two ways of loading a query plan: send an MDX request and
              get a JSON query plan, or enter yourself a JSON or V1 query plan.
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ textDecoration: "underline", marginBottom: 0.5 }}
            >
              1. MDX Request
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: 3 }}>
              Send an MDX request to an Atoti server and get a query plan back.
              You can paste text or enter a .txt file. You might need server
              credentials. You will receive a query plan in JSON format as a
              reply.
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: 1 }}>
              MDX Structure:
            </Typography>
            <Box p={2} borderRadius={2} border={1} marginBottom={0.5}>
              <Typography variant="body2" component="pre">
                {`SELECT 
      { [Measures].[Measure1], [Measures].[Measure2] } ON COLUMNS, 
      { [Dimension1].[Hierarchy1].[Member1], [Dimension1].[Hierarchy1].[Member2] } ON ROWS 
FROM [Cube1]
WHERE ( [Dimension2].[Hierarchy2].[Filter1] )`}
              </Typography>
            </Box>
            <Box p={2} borderRadius={2} border={1} marginBottom={4}>
              <Link
                href="https://learn.microsoft.com/en-us/analysis-services/multidimensional-models/mdx/mdx-query-the-basic-query?view=asallproducts-allversions"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </Link>
            </Box>
            <Typography
              variant="subtitle1"
              sx={{
                textDecoration: "underline",
                marginBottom: 0.5,
              }}
            >
              2. Query plan
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: 3 }}>
              Enter directly a query plan, that can be in JSON format, the
              format that is given by the Atoti server API or in V1 format, the
              format given by the tool logs when enabled. You can paste text or
              enter a .txt or .json file. The tool will try to detect the
              format. If V1 format, it will be converted in JSON for our
              analysis.
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: 1 }}>
              JSON structure:
            </Typography>
            <Box p={2} borderRadius={2} border={1} marginBottom={2}>
              <Link
                href="https://activepivot-ranch.activeviam.com:6100/activeviam/swagger-ui/index.html#/queries-rest-service-controller/mdxQueryPlan"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </Link>
            </Box>
            <Typography variant="body2" sx={{ marginBottom: 1 }}>
              V1 structure:
            </Typography>
            <Box p={2} borderRadius={2} border={1} marginBottom={2}>
              <Link
                href="https://docs.activeviam.com/products/atoti/server/5.9.14/docs/monitoring/query_execution_plan.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </Link>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
