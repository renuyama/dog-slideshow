import { BlobServiceClient } from "@azure/storage-blob";

// This uses the connection string stored in Azure Static Web App
const connectionString = process.env.REACT_APP_AZURE_STORAGE_CONNECTION_STRING;

if (!connectionString) {
  console.warn("Missing connection string: REACT_APP_AZURE_STORAGE_CONNECTION_STRING");
}

export async function uploadFile(file) {
  const blobService = BlobServiceClient.fromConnectionString(connectionString);

  const containerClient = blobService.getContainerClient("uploads");

  const blobName = `${Date.now()}_${file.name}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(file);

  return blobName;
}

export async function listFiles() {
  const blobService = BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobService.getContainerClient("uploads");

  const files = [];

  for await (const blob of containerClient.listBlobsFlat()) {
    files.push({
      name: blob.name,
      url: containerClient.getBlockBlobClient(blob.name).url,
    });
  }

  return files;
}
