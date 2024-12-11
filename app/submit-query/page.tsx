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
  TextField,
  Typography,
} from "@mui/material";
import { isAxiosError } from "axios";
import { Field, Form, Formik } from "formik";
import { useState, ReactElement } from "react";
import { useSelector } from "react-redux";

const DEFAULT_URL =
  "https://activepivot-ranch.activeviam.com:6100/activeviam/pivot/rest/v9/cube/query/mdx/queryplan";

export default function SubmitQueryPage(): ReactElement {
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const queryPlan = useSelector(getQueryPlan);

  // Formular submission
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

  return (
    <Card sx={{ width: "40%", padding: 4 }}>
      <CardHeader title="Send an MDX request" />

      <CardContent>
        <Grid2 container spacing={4}>
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
              {() => (
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

                  <Button type="submit" variant="contained" className="w-full">
                    Send
                  </Button>
                </Form>
              )}
            </Formik>
          </Grid2>

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
                <Grid2 className="font-medium text-lg">Server reply:</Grid2>
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
