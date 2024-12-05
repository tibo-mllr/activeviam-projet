"use client";
import { postRequest } from "@/lib/functions";
import { getQueryPlan, setQueryPlan, useAppDispatch } from "@/lib/redux";
import { CopyAll } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { isAxiosError } from "axios";
import { Formik, Form, Field } from "formik";
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
    try {
      setError(null);
      dispatch(setQueryPlan(""));

      const payload = { mdx: values.text };

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
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Send an MDX request
        </h1>

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

        {queryPlan && (
          <div className="mt-6 p-4 bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-medium text-lg">Server reply:</h2>
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
                Copy response
              </Button>
            </div>
            <pre className="whitespace-pre-wrap text-sm bg-white p-2 rounded-md text-gray-800 dark:bg-gray-900 dark:text-gray-100">
              {JSON.stringify(queryPlan, null, 2)}
            </pre>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300 rounded-md">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
