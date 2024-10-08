// create-container.js
import {
  BlobServiceClient,
  ContainerClient,
  ContainerCreateOptions,
    ContainerCreateResponse,
    StorageSharedKeyCredential
} from '@azure/storage-blob';
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config();

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME as string;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY as string;
if (!accountName) throw Error('Azure Storage accountName not found');
if (!accountKey) throw Error('Azure Storage accountKey not found');

const sharedKeyCredential = new StorageSharedKeyCredential(
  accountName,
  accountKey
);

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

async function createContainer(
  blobServiceClient: BlobServiceClient,
  containerName: string
): Promise<ContainerClient> {
  // public access at container level
  const options: ContainerCreateOptions = {
    access: 'container'
  };

  // creating client also creates container
  const {
    containerClient,
    containerCreateResponse
  }: {
    containerClient: ContainerClient;
    containerCreateResponse: ContainerCreateResponse;
  } = await blobServiceClient.createContainer(containerName, options);

  if (containerCreateResponse.errorCode)
    throw Error(containerCreateResponse.errorCode);

  console.log(`container ${containerName} created`);

  // do something with container
  // ...
  // containerClient.listBlobsFlat({    includeMetadata: true,
  // includeSnapshots: false,
  // includeTags: true,
  // includeVersions: false,
  // prefix: ''});

  return containerClient;
}

async function createRootContainer(blobServiceClient): Promise<void> {
  // create container
  const timestamp = Date.now();
  const containerName = `create-container-${timestamp}`;
  console.log(`creating container ${containerName}`);

  // create containers
  const containerClient = await createContainer(
    blobServiceClient,
    containerName
  );

  // Do something with containerClient

  // only 1 $root per blob storage resource
  const containerRootName = '$root';

  // create root container
  await createContainer(blobServiceClient, containerRootName);

}

async function main(): Promise<void> {

    console.log(
        `Beginning Main`
    );

    const containerName = 'my-container';
    const blobName = 'my-blob';

    const timestamp = Date.now();
    const fileName = path.join(
        __dirname,
        '../files',
        `my-new-file-${timestamp}.txt`
    );

    console.log(
        `about to use createRootContainer`
    );
    await createRootContainer(blobServiceClient);
    console.log(
        `createRootContainer done`
    );

    // create container client
    const containerClient = await blobServiceClient.getContainerClient(
        '$root'
    );

    const options: ContainerCreateOptions = {
        access: 'container'
    };

    await createContainer(blobServiceClient,'containerForNumbers');

    // create blob client
    const blobClient = await containerClient.getBlockBlobClient(blobName);

    // download file
    const downloadResult = await blobClient.downloadToFile(fileName);

    if (downloadResult.errorCode) throw Error(downloadResult.errorCode);

    console.log(
        `${fileName} downloaded, created on ${downloadResult.createdOn}}`
    );
}

main()
  .then(() => console.log(`success`))
  .catch((err: unknown) => {
    if (err instanceof Error) {
      console.log(err.message);
    }
  });
