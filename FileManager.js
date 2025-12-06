import React, { useEffect, useState } from "react";
import { uploadFile, listFiles } from "./azureStorage";

export default function FileManager() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const loadFiles = async () => {
    const result = await listFiles();
    setFiles(result);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleUpload = async () => {
    if (!selectedFiles.length) return;

    setUploading(true);

    for (const file of selectedFiles) {
      await uploadFile(file);
    }

    setUploading(false);
    setSelectedFiles([]);
    loadFiles();
  };

  return (
    <div style={{ padding: 20, background: "#eee", marginTop: 20 }}>
      <h2>File Upload & Download</h2>

      <input
        type="file"
        multiple
        onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
      />

      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>

      <h3>Uploaded Files</h3>

      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <ul>
          {files.map((f) => (
            <li key={f.name}>
              {f.name} —{" "}
              <a href={f.url} target="_blank" rel="noopener noreferrer">
                Download
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
