import {
  Box,
  Card,
  CardContent,
  DialogContent,
  Link,
  Typography,
} from "@mui/material";
import { ReactElement, RefObject } from "react";

const SAMPLE_DATA = [
  {
    planInfo: {},
    aggregateRetrievals: [],
    dependencies: {},
    databaseRetrievals: [],
    databaseDependencies: {},
    queryFilters: [],
    querySummary: {},
  },
];

type HelpCardProps = {
  ref: RefObject<HTMLDivElement>;
};

export default function HelpCard({ ref }: HelpCardProps): ReactElement {
  return (
    <Card ref={ref} sx={{ padding: 4, marginTop: 2 }}>
      <CardContent>
        <Typography variant="body2" sx={{ marginBottom: 6 }}>
          You have two ways of loading a query plan: send an MDX request and get
          a JSON query plan, or enter yourself a JSON or V1 query plan.
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ textDecoration: "underline", marginBottom: 0.5 }}
        >
          1. MDX Request
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: 3 }}>
          Send an MDX request to an Atoti server and get a query plan back. You
          can paste text or enter a .txt file. You might need server
          credentials. You will receive a query plan in JSON format as a reply.
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: 1 }}>
          MDX Structure:
        </Typography>
        <DialogContent
          dividers
          sx={{
            maxHeight: "400px",
            overflow: "auto",
          }}
        >
          <Box component="pre" sx={{ whiteSpace: "pre", overflowX: "auto" }}>
            {`SELECT 
{ [Measures].[Measure1], [Measures].[Measure2] } ON COLUMNS, 
{ [Dimension1].[Hierarchy1].[Member1], [Dimension1].[Hierarchy1].[Member2] } ON ROWS 
FROM [Cube1]
WHERE ( [Dimension2].[Hierarchy2].[Filter1] )`}
          </Box>
        </DialogContent>
        <Box p={2} borderRadius={2} border={1} marginBottom={6}>
          <Link
            href="https://learn.microsoft.com/en-us/analysis-services/multidimensional-models/mdx/mdx-query-the-basic-query?view=asallproducts-allversions"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ fontSize: "0.875rem" }}
          >
            Complete documentation
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
          Enter directly a query plan, that can be in JSON format, the format
          that is given by the Atoti server API or in V1 format, the format
          given by the tool logs when enabled. You can paste text or enter a
          .txt or .json file. The tool will try to detect the format. If V1
          format, it will be converted in JSON for our analysis.
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: 1 }}>
          JSON structure : this is the structure given by the Atoti server
        </Typography>
        <DialogContent dividers sx={{ maxHeight: "400px", overflow: "auto" }}>
          <Box component="pre" sx={{ whiteSpace: "pre", overflowX: "auto" }}>
            {JSON.stringify(SAMPLE_DATA, null, 2)}
          </Box>
        </DialogContent>
        <Box p={2} borderRadius={2} border={1} marginBottom={2}>
          <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
            Detailed types in the{" "}
            <Link
              href="https://activepivot-ranch.activeviam.com:6100/activeviam/swagger-ui/index.html#/queries-rest-service-controller/mdxQueryPlan"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ fontSize: "0.875rem" }}
            >
              documentation
            </Link>{" "}
            , in the section JsonQueryPlanData.
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ marginBottom: 1 }}>
          V1 structure : given by the logs
        </Typography>
        <DialogContent
          dividers
          sx={{
            maxHeight: "400px",
            overflow: "auto",
          }}
        >
          <Box component="pre" sx={{ whiteSpace: "pre", overflowX: "auto" }}>
            {`==============================
General information:
-------------------
Context values:
--------------
Additional properties:
---------------------
Planning:
--------
Execution:
---------
Query plan:
----------
Query Plan Summary:
-------------------`}
          </Box>
        </DialogContent>
        <Box p={2} borderRadius={2} border={1} marginBottom={2}>
          <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
            This type is complex, here is the{" "}
            <Link
              href="https://docs.activeviam.com/products/atoti/server/5.9.14/docs/monitoring/query_execution_plan.html"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ fontSize: "0.875rem" }}
            >
              documentation
            </Link>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
