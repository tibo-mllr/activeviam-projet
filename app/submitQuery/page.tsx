"use client";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import { FC, useState } from "react";

const DEFAULT_URL =
  "https://activepivot-ranch.activeviam.com:6100/activeviam/pivot/rest/v9/cube/query/mdx/queryplan";

const SubmitQueryPage: FC = () => {
  const [response, setResponse] = useState<string | null>(null);
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
      // POST using Axios
      const res = await axios.post(values.url, values.text, {
        auth: {
          username: values.username,
          password: values.password,
        },
        headers: {
          "Content-Type": "application/json", // Json type
        },
      });

      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err) {
      setError("Error: " + String(err));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8">
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
                id="url"
                name="url"
                placeholder={DEFAULT_URL}
                className="block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />

              <Field
                id="username"
                name="username"
                placeholder="Enter user"
                className="block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />

              <Field
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                className="block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />

              <Field
                as="textarea"
                id="text"
                name="text"
                placeholder="Enter MDX request"
                className="block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                rows="6"
              />

              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Envoyer
              </button>
            </Form>
          )}
        </Formik>

        {response && (
          <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-medium text-lg">Server reply:</h2>
              <button
                onClick={() => navigator.clipboard.writeText(response)}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Copy response
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm bg-white p-2 rounded-md text-gray-800">
              {response}
            </pre>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-md">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitQueryPage;
