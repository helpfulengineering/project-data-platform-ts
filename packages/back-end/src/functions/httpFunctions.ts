import {
  app,
  HttpHandler,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import {
  downloadBlobToJson,
  downloadBlobYamlToJSON,
  listFilesInContainer,
} from "../lib/azure-storage.js";
import { DICT_TYPE } from "../types/generalTypes.js";
import { example_products } from "../dummyData/exampleProducts.js";

// make sure important environment variables are present
const serviceName: string = process.env?.Azure_Storage_ServiceName || "";
const OKHcontainerName: string =
  process.env?.Azure_Storage_OKH_ContainerName || "";
const OKWcontainerName: string =
  process.env?.Azure_Storage_OKW_ContainerName || "";

if (!serviceName) {
  throw new Error("No Azure_Storage_ServiceName in process.env");
}
if (!OKHcontainerName) {
  throw new Error("No Azure_Storage_OKH_ContainerName in process.env");
}
if (!OKWcontainerName) {
  throw new Error("No Azure_Storage_OKW_ContainerName in process.env");
}

//stores all the route functions/names... must list the functions here
const routeFunctions: DICT_TYPE = {
  getOKH,
  getOKHs,
  test,
  getMicroscope,
  getVentilator,
  listOKHFiles,
  listOKWFiles,
  "getFile/{containerName:alpha}/{fileName:alpha}/{fileType:alpha}": getFile,
};
//create route for each
for (let key in routeFunctions) {
  const func = routeFunctions[key];
  app.http(func.name, {
    methods: ["GET", "POST"],
    authLevel: "anonymous",
    route: key,
    handler: func,
  });
}

// app.http("params", {
//   methods: ["GET", "POST"],
//   authLevel: "anonymous",
//   route: "params/{containerName:alpha}/{fileName:alpha}",
//   handler: (request: HttpRequest, context: InvocationContext) => {
//     context.log(request.params.containerName, request.params.fileName);
//     return { jsonBody: "params" };
//   },
// });

export async function getOKH(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  // get the name of the item
  const jsonFileName =
    request.query.get("name") ||
    (await request.text()) ||
    "okh-ventilator.json";
  // get the name of the item
  const yamlFileName = "bread.yml";

  try {
    const { error, errorMessage, data } = await listFilesInContainer(
      serviceName,
      OKHcontainerName
    );

    // context.log(`Here are the listed container items`);
    // context.log(typeof data, data);

    if (error) {
      return {
        status: 500,
        jsonBody: errorMessage,
      };
    }

    const okh = await getOKHByFileName(jsonFileName, OKHcontainerName);
    //bread.yml
    // context.log("before bread");

    const breadYAML = await getOKHByFileName(yamlFileName, OKHcontainerName);
    // context.log("after bread");

    // context.log("OKH", okh);
    context.log("breadYAML", breadYAML);

    // Note okh is of type JSON. Decoding into a type correct
    // object requires a lot of complexity as explained in this issue:
    // https://stackoverflow.com/questions/22885995/how-do-i-initialize-a-typescript-object-with-a-json-object

    const breadAsJson: any = convertYAMLToJson(breadYAML);

    // context.log(okh["title"]);
    // context.log(okh["description"]);

    example_products[0].medical_products.push({
      id: 5,
      name: okh["title"] as string,
      image: "https://placecats.com/300/200",
      shortDescription: okh["description"] as string,
      projectLink: "",
      manifestAuthor: "",
    });

    example_products[0].medical_products.push(breadAsJson);
    return {
      jsonBody: example_products,
    };
  } catch (error) {
    return {
      status: 500,
      jsonBody: error,
    };
  }
}

export async function getOKHs(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  return { jsonBody: example_products };
}

export async function test(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`this is a test of the endpoint: "${request.url}"`);
  return { jsonBody: { test: true } };
}

export async function getMicroscope(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  return { jsonBody: null };
}

export async function getVentilator(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  return { jsonBody: null };
}

// TODO: Paramaterize this function so that it can handle both OKH and OKW container names
export async function listOKHFiles(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  console.log("list", serviceName, OKHcontainerName);
  const { error, errorMessage, data } = await listFilesInContainer(
    serviceName,
    OKHcontainerName
  );
  if (error) {
    return { jsonBody: error };
  }
  return { jsonBody: data };
}

// TODO: Paramaterize this function so that it can handle both OKH and OKW container names
export async function listOKWFiles(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  console.log("list", serviceName, OKWcontainerName);
  const { error, errorMessage, data } = await listFilesInContainer(
    serviceName,
    OKWcontainerName
  );
  if (error) {
    return { jsonBody: error };
  }
  return { jsonBody: data };
}

export async function getFile(
  request: HttpRequest,
  context: any
): Promise<HttpResponseInit> {
  context.log("getFile");
  context.log(request.params.containerName, request.params.fileName);
  const { containerName, fileName, fileType } = request.params;
  context.log(containerName, fileName, fileType);

  if (!containerName || !fileName || !fileType)
    return { jsonBody: "error, no containerName or fileName" };
  const data = await getOKHByFileName(fileName, containerName, fileType);

  return { jsonBody: data };
}

// HELPER FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////

async function getOKHByFileName(
  name: string,
  containerName: string,
  fileType?: string
): Promise<any> {
  const fileExt = fileType || name.split(".").pop();
  // // Warning!! This function does NOT match the apparent
  // // documentation: https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-download-javascript
  // // I had to figure it out by guessing. The documentation there
  // // gives the arguments as "containerClient, blobName, fileNameWithPath"
  // // I can't explain this discrepancy.
  if (fileExt === "json") {
    return await downloadBlobToJson(
      process.env?.Azure_Storage_ServiceName as string,
      containerName,
      name + "." + fileExt
    );
  } else if (fileExt === "yml" || fileExt === "yaml") {
    return await downloadBlobYamlToJSON(
      process.env?.Azure_Storage_ServiceName as string,
      containerName,
      name + "." + fileExt
    );
  }

  // return await downloadBlobToJson(
  //   process.env?.Azure_Storage_ServiceName as string,
  //   containerName,
  //   namelllllllllllllllllllllllllk
  // );
}

async function getAllFileNamesInContainer() {}

function convertYAMLToJson(yaml: string): Promise<any> {
  const obj: any = {
    id: "6",
    name: "Ghanian Super Bread",
    image: "",
    shortDescription: yaml,
    projectLink: "project-link",
    manifestAuthor: "manifest-author",
  };

  return obj;
}
