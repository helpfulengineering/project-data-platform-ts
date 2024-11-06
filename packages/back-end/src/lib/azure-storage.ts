// Used to get read-only SAS token URL
import {
  BlobSASPermissions,
  BlobServiceClient,
  ContainerClient,
  SASProtocol,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

import { DefaultAzureCredential } from "@azure/identity";

import { parse as parseYAML } from "yaml";

function getBlobServiceClient(serviceName: string) {
  // Acquire a credential object
  const tokenCredential = new DefaultAzureCredential();

  const blobServiceClient = new BlobServiceClient(serviceName, tokenCredential);
  return blobServiceClient;
}

async function createContainer(
  containerName: string,
  blobServiceClient: BlobServiceClient
): Promise<ContainerClient> {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists();

  return containerClient;
}

export async function uploadBlob(
  serviceName: string,
  fileName: string,
  containerName: string,
  blob: Buffer
): Promise<string> {
  if (!serviceName || !fileName || !containerName || !blob) {
    return "Upload function missing parameters";
  }

  const blobServiceClient = getBlobServiceClient(serviceName);

  const containerClient = await createContainer(
    containerName,
    blobServiceClient
  );
  const blockBlobClient = await containerClient.getBlockBlobClient(fileName);
  const response = await blockBlobClient.uploadData(blob);

  return response.errorCode ? response.errorCode : "Success";
}

export const generateSASUrl = async (
  serviceName: string,
  serviceKey: string,
  containerName: string,
  fileName: string, // hierarchy of folders and file name: 'folder1/folder2/filename.ext'
  permissions = "r", // default read only
  timerange = 1 // default 1 minute
): Promise<string> => {
  if (!serviceName || !serviceKey || !fileName || !containerName) {
    return "Generate SAS function missing parameters";
  }

  const blobServiceClient = getBlobServiceClient(serviceName);
  const containerClient = await createContainer(
    containerName,
    blobServiceClient
  );
  const blockBlobClient = await containerClient.getBlockBlobClient(fileName);

  // Best practice: create time limits
  const SIXTY_MINUTES = timerange * 60 * 1000;
  const NOW = new Date();

  // Create SAS URL
  const accountSasTokenUrl = await blockBlobClient.generateSasUrl({
    startsOn: NOW,
    expiresOn: new Date(new Date().valueOf() + SIXTY_MINUTES),
    permissions: BlobSASPermissions.parse(permissions), // Read only permission to the blob
    protocol: SASProtocol.Https, // Only allow HTTPS access to the blob
  });

  return accountSasTokenUrl;
};

type ListFilesInContainerResponse = {
  error: boolean;
  errorMessage: string;
  data: string[];
};

export const listFilesInContainer = async (
  serviceName: string,
  containerName: string
): Promise<ListFilesInContainerResponse> => {
  if (!serviceName || !containerName) {
    return {
      error: true,
      errorMessage: "List files in container function missing parameters",
      data: [],
    };
  }

  const blobServiceClient = getBlobServiceClient(serviceName);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const data = [];

  for await (const response of containerClient
    .listBlobsFlat()
    .byPage({ maxPageSize: 20 })) {
    for (const blob of response.segment.blobItems) {
      data.push(`${containerClient.url}/${blob.name}`);
    }
  }

  return {
    error: false,
    errorMessage: "",
    data,
  };
};

export const downloadBlobToJson = async (
  serviceName: string,
  containerName: string,
  blobName: string
): Promise<JSON> => {
  const blobServiceClient = getBlobServiceClient(serviceName);

  const containerClient = await blobServiceClient.getContainerClient(
    containerName
  );

  const downloadResponse = await containerClient
    .getBlockBlobClient(blobName)
    .download();

  if (!downloadResponse.errorCode && downloadResponse.readableStreamBody) {
    const downloaded = await streamToJson(downloadResponse.readableStreamBody);
    if (downloaded) {
      console.log("Downloaded blob content:", downloaded);
      return downloaded;
    }
  }
  return JSON.parse(
    "{error:'downloadBlobToJson could not download blob to JSON}"
  );
};

export const downloadBlobYamlToJSON = async (
  serviceName: string,
  containerName: string,
  blobName: string
): Promise<JSON> => {
  const blobServiceClient = getBlobServiceClient(serviceName);

  const containerClient = await blobServiceClient.getContainerClient(
    containerName
  );

  const downloadResponse = await containerClient
    .getBlockBlobClient(blobName)
    .download();

  if (!downloadResponse.errorCode && downloadResponse.readableStreamBody) {
    const downloaded = await streamFromYamlToJson(
      downloadResponse.readableStreamBody
    );
    if (downloaded) {
      console.log("Downloaded blob content:", downloaded);
      return downloaded;
    }
  }
  return JSON.parse(
    "{error:'downloadBlobToYaml could not download blob to YAML}"
  );
};

async function streamToBuffer(
  readableStream: NodeJS.ReadableStream
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    readableStream.on("data", (data) => {
      const content: Buffer = data instanceof Buffer ? data : Buffer.from(data);
      chunks.push(content);
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on("error", reject);
  });
}

// Convert stream to text
async function streamToText(readable: NodeJS.ReadableStream): Promise<string> {
  readable.setEncoding("utf8");
  const data = await readableStreamToText(readable);
  return data;
}

// Convert stream to JSON
async function streamToJson(readable: NodeJS.ReadableStream): Promise<JSON> {
  const data = await readableStreamToText(readable);
  return JSON.parse(data);
}

// TODO create a function that streams to TEXT and then reads AS YAML and converts to JSON... perfect world is typed OKH
async function streamFromYamlToJson(
  readable: NodeJS.ReadableStream
): Promise<JSON> {
  const data = await readableStreamToText(readable);
  return parseYAML(data);
}

async function readableStreamToText(
  readable: NodeJS.ReadableStream
): Promise<string> {
  let text = "";
  for await (const chunk of readable) {
    text += chunk;
  }
  return text;
}
