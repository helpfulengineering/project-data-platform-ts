import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { BlockBlobClient, ContainerClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import * as JSON5 from 'json5';

// To deploy this project from the command line, you need:
//  * Azure CLI : https://learn.microsoft.com/en-us/cli/azure/
//  * Azure Functions Core Tools: https://github.com/Azure/azure-functions-core-tools/blob/v4.x/README.md

// Once you've logged into Azure via 'az login' to an Azure account w/ PubInv permissions,
// you deploy this function project via this command:
//  > func azure functionapp publish gosqasbe


const accountName = process.env["AZURE_STORAGE_ACCOUNT_NAME"] ?? "";
const accountKey = process.env["AZURE_STORAGE_ACCOUNT_KEY"] ?? "";
const baseUrl = accountName === "devstoreaccount1"
    ? `http://127.0.0.1:10000/devstoreaccount1`
    : `https://${accountName}.blob.core.windows.net`;

const cred = new StorageSharedKeyCredential(accountName, accountKey);
const containerClient = new ContainerClient(`${baseUrl}/pdweb`, cred);

function findDeviceIdFromName(blobName : string) : string {
    return blobName.split("/",4)[1];
}

async function getStatistics(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    const containerExists = await containerClient.exists();
    if (!containerExists) { return { jsonBody: [] }; }

    // Build up a JSON return value
    // NOTE: We seem to have to read the properties of the blob to get the
    // metadata.  There is a field called "metadata" on the blob itself
    // which does not contain our metadata. I don't know if this is terribly
    // expensive, or if we could improve it. I insist we should not worry about
    // performance until we measure it to be a problem, but this is an "orang flag"--
    // some caution around this issue is warranted.
    var records = [];
    for await (const blob of containerClient.listBlobsFlat()) {
        const blobClient = containerClient.getBlockBlobClient(blob.name);
        const props = await blobClient.getProperties();
        const metadata = props.metadata;
        // now we want to build up an object that we can return as statistics
        // that inlcudes the id and the timestamp, though really the timestamp
        // is enough. We would like to distinguish the additon of a device
        // from the addition of new provenance, I supoose.
        const id = findDeviceIdFromName(blob.name);
        // We could do some sorting in this function, but that is more or less
        // easily done by whomever is using this. So I think it better to just
        // return the data in  a fairly raw form, as an array of {timestamp, id} tuples.
        // Eventually, this function may have to only look back X days or X hours,
        // but until it gets unwieldy we can return everything.
        // I think the proper way to test this is to build a test program that
        // puts 1000s of objects into the database and see where performance becomes a problem.
        records.push({ timestamp: metadata.gdttimestamp, deviceID: id});
    }

    const contentType = "application/json";

    return {
        jsonBody: records,
        headers: { "Content-Type": contentType }
    };
};

app.get("getStatistics", {
    authLevel: 'anonymous',
    route: 'statistics',
    handler: getStatistics
})
