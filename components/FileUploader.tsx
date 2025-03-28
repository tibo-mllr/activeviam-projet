"use client";
import { setIsLargeQueryPlan, useAppDispatch } from "@/lib/redux";
import { Input, LinearProgress } from "@mui/material";
import { ChangeEvent, ReactElement, useState } from "react";

type FileUploaderProps = {
  onFileLoad: (content: string) => void;
  accept?: string;
  label?: string;
};

export function FileUploader({
  onFileLoad,
  accept = ".txt",
  label = "Upload a file:",
}: FileUploaderProps): ReactElement {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setIsLoading(true);
    setProgress(0);
    const chunkSize = 5 * 1024 * 1024; // 5MB (adjust based on your requirements)
    const totalChunks = Math.ceil(file.size / chunkSize);
    const chunkProgress = 100 / totalChunks;
    let start = 0;
    let end = chunkSize;
    let fileContent = "";

    // We consider files bigger than 1MB as large
    if (file.size > 1 * 1000 * 1000) dispatch(setIsLargeQueryPlan(true));

    const uploadNextChunk = (): void => {
      if (start < file.size) {
        const chunk = file.slice(start, end);
        const reader = new FileReader();
        reader.onload = (event) => {
          fileContent += event.target?.result as string;
          setProgress((prevProgress) =>
            Math.min(100, prevProgress + chunkProgress),
          );

          start = end;
          end = start + chunkSize;

          uploadNextChunk();
        };
        reader.readAsText(chunk);
      } else {
        setProgress(100);
        onFileLoad(fileContent);
        setIsLoading(false);
      }
    };

    uploadNextChunk();
  };

  return (
    <div>
      <label htmlFor="file-upload" style={{ marginBottom: "8px" }}>
        {label}
      </label>
      <Input
        type="file"
        id="file-upload"
        inputProps={{ accept, onChange: handleFileChange }}
        style={{
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: "transparent",
          fontSize: "14px",
          width: "100%",
        }}
      />
      {isLoading && (
        <LinearProgress
          variant="determinate"
          value={progress}
          className="mt-2"
        />
      )}
    </div>
  );
}
