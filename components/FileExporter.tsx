import { Button } from "@mui/material";

export function FileExporter({
  data,
  filename = "data.json",
}: {
  data: any;
  filename?: string;
}) {
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
    <Button
      onClick={handleExport}
      variant="contained"
      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
    >
      Export as JSON
    </Button>
  );
}
