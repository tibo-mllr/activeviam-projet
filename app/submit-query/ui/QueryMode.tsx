"use client";
import { FileUploader } from "@/components";
import { postRequest } from "@/lib/functions";
import { setQueryPlan, useAppDispatch } from "@/lib/redux";
import {
  Box,
  Button,
  CircularProgress,
  Fade,
  Grid2,
  TextField,
} from "@mui/material";
import { isAxiosError } from "axios";
import { Field, Form, Formik } from "formik";
import { ReactElement, useCallback } from "react";

const DEFAULT_URL =
  "https://activepivot-ranch.activeviam.com:6100/activeviam/pivot/rest/v9/cube/query/mdx/queryplan";

type QueryModeProps = {
  setError: (error: string | null) => void;
};

export default function QueryMode({ setError }: QueryModeProps): ReactElement {
  const dispatch = useAppDispatch();

  const handleSubmit = useCallback<
    (values: {
      url: string;
      username: string;
      password: string;
      text: string;
    }) => Promise<void>
  >(
    async (values) => {
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
    },
    [dispatch, setError],
  );

  return (
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
  );
}
