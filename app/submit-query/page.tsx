"use client";
import { QueryPlan } from "@/lib";
import { postData } from "@/lib";
import { Formik, Form, Field } from "formik";
import { useState, ReactElement } from "react";

const DEFAULT_URL =
  "https://activepivot-ranch.activeviam.com:6100/activeviam/pivot/rest/v9/cube/query/mdx/queryplan";

export default function SubmitQueryPage(): ReactElement {
  const [response, setResponse] = useState<QueryPlan | null>();
  const [error, setError] = useState<string | null>(null);

  // Formular submission
  const handleSubmit = async (values: {
    url: string;
    username: string;
    password: string;
    text: string;
  }): Promise<void> => {
    try {
      setError(null);
      setResponse(null);

      const payload = { mdx: values.text };

      // POST using Axios
      const res = await postData<QueryPlan>(
        values.url,
        payload,
        values.username,
        values.password,
      );
      setResponse(res);
    } catch (err) {
      setError("Error: " + String(err));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-gray-100">
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
                id="url"
                name="url"
                placeholder={DEFAULT_URL}
                className="block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400"
              />

              <Field
                id="username"
                name="username"
                placeholder="Enter user"
                className="block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400"
              />

              <Field
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                className="block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400"
              />

              <Field
                as="textarea"
                id="text"
                name="text"
                placeholder="Enter MDX request"
                className="block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400"
                rows="6"
              />

              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Send
              </button>
            </Form>
          )}
        </Formik>

        {response && (
          <div className="mt-6 p-4 bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-medium text-lg">Server reply:</h2>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    JSON.stringify(response, null, 2),
                  )
                }
                className="text-sm text-blue-600 hover:text-blue-800 underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                Copy response
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm bg-white p-2 rounded-md text-gray-800 dark:bg-gray-900 dark:text-gray-100">
              {JSON.stringify(response, null, 2)}
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
