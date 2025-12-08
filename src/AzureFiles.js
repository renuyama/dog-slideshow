import React, { useState, useEffect } from "react";

const baseUrl = process.env.REACT_APP_BLOB_BASE_URL;
const container = process.env.REACT_APP_BLOB_CONTAINER;
const sasToken = process.env.REACT_APP_BLOB_SAS_TOKEN;

export default function AzureFiles() {
  const [file, setFile] = useState(null);
  const [blobs, setBlobs] = useState([]);
  const [status, setStatus] = useState("");

  const containerUrl = `${baseUrl}/${container}${sasToken}`;

  async function handleUpload() {
    if (!file) return;
    try {
      setStatus("Uploading...");
      const uploadUrl = `${baseUrl}/${container}/${encodeURIComponent(
        file.name
      )}${sasToken}`;

      await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      });

      setStatus("Upload complete");
      setFile(null);
      await loadBlobs();
    } catch (error) {
      console.error(error);
      setStatus("Upload failed");
    }
  }

  async function loadBlobs() {
    try {
      setStatus("Loading files...");
      const listUrl = `${containerUrl}&restype=container&comp=list`;
      const response = await fetch(listUrl);
      const text = await response.text();

      const parser = new DOMParser();
      const xml = parser.parseFromString(text, "application/xml");
      const blobNodes = Array.from(xml.getElementsByTagName("Name"));
      const names = blobNodes.map((n) => n.textContent);

      setBlobs(names);
      setStatus("");
    } catch (error) {
      console.error(error);
      setStatus("Error loading files");
    }
  }

  useEffect(() => {
    loadBlobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section style={{ marginTop: "20px" }}>
      <h2>Azure Blob Storage — File Upload</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={!file}>
        Upload
      </button>

      <p>{status}</p>

      <h3>Uploaded Files</h3>
      <ul>
        {blobs.map((name) => {
          const downloadUrl = `${baseUrl}/${container}/${encodeURIComponent(
            name
          )}${sasToken}`;
          return (
            <li key={name}>
              <a href={downloadUrl} target="_blank" rel="noreferrer">
                {name}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
