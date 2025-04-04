import { FileDownload } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";
import { ReactElement } from "react";
import { QueryPlan } from "../lib/types";

type FileExporterProps = {
  data: QueryPlan[];
  filename?: string;
};

export function FileExporter({
  data,
  filename = "data.json",
}: FileExporterProps): ReactElement {
  const handleExport = (): void => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Tooltip title="Export as JSON">
      <Button onClick={handleExport} variant="outlined">
        <FileDownload />
      </Button>
    </Tooltip>
  );
}
