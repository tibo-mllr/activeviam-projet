export function FileUploader({
  onFileLoad,
  accept = ".txt, .json",
  label = "Or upload a file:",
}: {
  onFileLoad: (content: string) => void;
  accept?: string;
  label?: string;
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          onFileLoad(reader.result as string);
        }
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid file.");
    }
  };

  return (
    <div>
      <label htmlFor="file-upload" style={{ marginBottom: "8px" }}>
        {label}
      </label>
      <input
        type="file"
        id="file-upload"
        accept={accept}
        onChange={handleFileChange}
        style={{
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: "transparent",
          fontSize: "14px",
          width: "100%",
        }}
      />
    </div>
  );
}
