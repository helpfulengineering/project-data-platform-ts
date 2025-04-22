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
import _ from "lodash";

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
  test,
  listRoutes,
  getOKH,
  getOKHs,
  getExampleProducts,
  "getFile/{containerName}/{fileName}/{fileType}": getFile, // Example: "getFile/okh/bread/yml"
    "listFiles/{containerName}": listFilesByContainerName, // Example: http://localhost:7071/api/listFiles/okw OR http://localhost:7071/api/listFiles/okh
    listOKHsummaries, // This is specifically meant to provide thumbnails for the frontend
    getRelatedOKH,
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

export async function listRoutes(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  let routes = [];

  for (let r in routeFunctions) {
    let base = request.url.split("/").slice(0, -1).join("/");
    let route = `${base}/${r}`;
    routes.push(route);
    // Adding some example routes.
    if (r.includes("listFiles")) {
      routes.push(route.replace("{containerName}", "okh"));
      routes.push(route.replace("{containerName}", "okw"));
    } else if (r.includes("getFile")) {
      routes.push(
        route
          .replace("{containerName}", "okh")
          .replace("{fileName}", "bread")
          .replace("{fileType}", "yml")
      );
    }
  }
  return { jsonBody: routes };
}

// This route is currently meant for the front-end to provide dummy data (with some real data sprinkled in)
export async function getOKH(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  // item from azure
  // const jsonFileName =
  // request.query.get("name")
  // || (await request.text())

  try {
    // Note okh is of type JSON. Decoding into a type correct
    // object requires a lot of complexity as explained in this issue:
    // https://stackoverflow.com/questions/22885995/how-do-i-initialize-a-typescript-object-with-a-json-object
    const itemFromAzure = await getOKHByFileName(
      "okh-ventilator",
      "okh",
      "json"
    );

    const breadData = await getOKHByFileName("bread", "okh", "yml");

    // duplicate example data so you don't modify it
    const cloned_products = _.cloneDeep(example_products);
    cloned_products[0].medical_products.push(
        convertToProduct(
            "bread.yml",
        itemFromAzure,
        cloned_products[0].medical_products.length + 1
      )
    );
    cloned_products[0].medical_products.push(
        convertToProduct(
             "bread.yml",
        breadData,
        cloned_products[0].medical_products.length + 1
      )
    );

    return {
      jsonBody: cloned_products,
    };
  } catch (error) {
    return {
      status: 500,
      jsonBody: error,
    };
  }
}

export async function getExampleProducts(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  return { jsonBody: example_products };
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

export async function listFilesByContainerName(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const { containerName } = request.params;

  console.log("listFilesByContainerName", serviceName, containerName);
  const { error, errorMessage, data } = await listFilesInContainer(
    serviceName,
    containerName
  );
  if (error) {
      return { jsonBody: error };

  }
    let productsObj = { products: data };
    console.log("YYYYYYYYYYYYYYYYYYYYY",productsObj);
  return { jsonBody: productsObj };
}

function hasOverlapKeywords(arr1: string[], arr2: string[]): boolean {
  const set1 = new Set(arr1.map(str => str.toLowerCase().trim()));
  return arr2.some(str => set1.has(str.toLowerCase().trim()));
}

function normalizeKeywords(keywords: string | string[] | null | undefined): string[] {
  if (!keywords) {
      return []; // Return an empty array if null or undefined
  }

  if (typeof keywords === "string") {
      return keywords
          .split(",") // Split by comma
          .map(keyword => keyword.trim()) // Trim spaces
          .filter(keyword => keyword.length > 0); // Remove empty strings
  }

  return keywords.filter(keyword => typeof keyword === "string" && keyword.trim().length > 0);
}


export async function getRelatedOKH(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
    const containerName = "okh";
    const keywords: string[] = normalizeKeywords(decodeURIComponent(request.params.keywords))

  const { error, errorMessage, data } = await listFilesInContainer(
    serviceName,
    containerName
  );
  if (error) {
      return { jsonBody: error };
  }


    let summaries = [];
    let id_cnt = 0;
    for (let index in data) {
        const longfilename = data[index];

        console.log(longfilename)

        const shortname = longfilename.split("/").pop() || "";
        const fnameAtoms = shortname.split(".");
        const extension = fnameAtoms.pop() || "";
        const fname = fnameAtoms.join(".") || "";
       
        const fdata = await getOKHByFileName(fname, "okh", extension);
        if ( fdata.keywords && hasOverlapKeywords(normalizeKeywords(fdata.keywords),keywords)) {
          const product_summary = convertToProduct(fname+"."+extension,fdata, id_cnt++);
          summaries.push(product_summary);
        }
       
      
        console.log(index)
   
    }
    let productsObj = { relatedOKH: summaries };
  return { jsonBody: productsObj,
    headers: { "Access-Control-Allow-Origin" : "*"}
  };
}

export async function listOKHsummaries(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
    const containerName = "okh";
  console.log("listFilesByContainerName", serviceName, containerName);
  const { error, errorMessage, data } = await listFilesInContainer(
    serviceName,
    containerName
  );
  if (error) {
      return { jsonBody: error };
  }
    // Now we want to add in the things a product card needs.
    // "data" now contains the files we need, we need to enumerate over it
    //

    let summaries = [];
    let id_cnt = 0;
    for (let index in data) {
        const longfilename = data[index];
        // now we need to get the shortname and the extention from the filename
        // this should use pattenmatching, and may already be written...
        const shortname = longfilename.split("/").pop() || "";


        const fnameAtoms = shortname.split(".");
        const extension = fnameAtoms.pop() || "";
        const fname = fnameAtoms.join(".") || "";
       
        const fdata = await getOKHByFileName(fname, "okh", extension);
        const product_summary = convertToProduct(fname+"."+extension,fdata, id_cnt++);
        summaries.push(product_summary);
        console.log("SUMMARY",product_summary);

    }
    let productsObj = { productSummaries: summaries };
  return { jsonBody: productsObj,
    headers: { "Access-Control-Allow-Origin" : "*"}
  };
}

export async function getFile(
  request: HttpRequest,
  context: any
): Promise<HttpResponseInit> {
  context.log("getFile");
  const { containerName, fileName, fileType } = request.params;
  context.log(containerName, fileName, fileType);

  if (!containerName || !fileName || !fileType) {
    return { jsonBody: "error, no containerName or fileName" };
  }
  const data = await getOKHByFileName(fileName, containerName, fileType);

  let productObj = { product: data };
    return { jsonBody: productObj,
             headers: { "Access-Control-Allow-Origin" : "*"}
           };
}

// HELPER FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////

const cache: Map<string, any> = new Map();

async function getOKHByFileName(
  name: string,
  containerName: string,
  fileType?: string
): Promise<any> {
  const fileExt: string = fileType || name.split(".").pop() || "";

  // Create a cache key based on the name and fileType
  const cacheKey = `${name}-${fileExt}`;

  // Check if the result is already cached
  if (cache.has(cacheKey)) {
    console.log("Returning cached result for:", cacheKey);
    return cache.get(cacheKey); // Return the cached result
  }

  let result: any = null;

  // Perform the actual request if not cached
  if (fileExt === "json") {
    result = await downloadBlobToJson(
      process.env?.Azure_Storage_ServiceName as string,
      containerName,
      name + "." + fileExt
    );
  } else if (fileExt === "yml" || fileExt === "yaml") {
    result = await downloadBlobYamlToJSON(
      process.env?.Azure_Storage_ServiceName as string,
      containerName,
      name + "." + fileExt
    );
  }

  // Cache the result if it's not null
  if (result !== null) {
    cache.set(cacheKey, result);
  }

  return result;
}

// will need proper typing once types have been shared with back-end
function convertToProduct(fname:string, obj: any, id: number): any | null {
  if (!obj || typeof obj !== "object") return null;
  return {
      id,
      fname: fname,
    name: obj["title"] as string,
    image:obj.image || "https://placecats.com/300/200",
    shortDescription: obj["description"] as string,
    projectLink: obj["project-link"],
    manifestAuthor: obj["manifest-author"]?.name || "none",
  };
}
