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

// Define interfaces for Azure storage results
interface AzureStorageResult {
  error: boolean;
  errorMessage: string;
  data: any;
}

// HELPER FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////

const cache: Map<string, any> = new Map();

async function getOKHByFileName(
  name: string,
  containerName: string,
  fileType?: string
): Promise<any> {
  const cacheKey = `${containerName}-${name}-${fileType}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    let data;
    if (fileType === "yml") {
      const result = await downloadBlobYamlToJSON(
        serviceName,
        containerName,
        name
      ) as unknown as AzureStorageResult;
      
      if (result.error) {
        throw new Error(result.errorMessage);
      }
      data = result.data;
    } else {
      const result = await downloadBlobToJson(
        serviceName,
        containerName,
        name
      ) as unknown as AzureStorageResult;
      
      if (result.error) {
        throw new Error(result.errorMessage);
      }
      data = result.data;
    }
    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    throw error;
  }
}

function convertToProduct(fname: string, obj: any, id: number): any | null {
  if (!obj) return null;

  return {
    id,
    name: obj["title"] || "Untitled Product",
    time: obj["date-created"] || new Date().toLocaleDateString(),
    image: obj["image"] || "https://www.medicalproductguide.com/itmimg/1600/products/product_1490022230_Riester.jpg",
    maker: obj["contributors"] || "Anonymous",
    description: obj["description"] || "No description available.",
    slug: fname,
    keywords: obj["keywords"] || [],
    whereToFind: obj["source"] || "Check local relief organizations.",
  };
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

// FUNCTION DEFINITIONS AND REGISTRATIONS ////////////////////////////////////////////////////////////////////

// Test endpoint
export async function test(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`this is a test of the endpoint: "${request.url}"`);
  return { jsonBody: { test: true } };
}

app.http('test', {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "test",
  handler: test
});

// List Routes endpoint
export async function listRoutes(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const routes = [
    `${request.url.split("/api/")[0]}/api/test`,
    `${request.url.split("/api/")[0]}/api/listRoutes`,
    `${request.url.split("/api/")[0]}/api/getOKH`,
    `${request.url.split("/api/")[0]}/api/getOKHs`,
    `${request.url.split("/api/")[0]}/api/getExampleProducts`,
    `${request.url.split("/api/")[0]}/api/getFile/okh/bread/yml`,
    `${request.url.split("/api/")[0]}/api/listFiles/okh`,
    `${request.url.split("/api/")[0]}/api/listFiles/okw`,
    `${request.url.split("/api/")[0]}/api/listOKHsummaries`,
    `${request.url.split("/api/")[0]}/api/getRelatedOKH`
  ];
  
  return { jsonBody: routes };
}

app.http('listRoutes', {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "listRoutes",
  handler: listRoutes
});

// Get OKH endpoint
export async function getOKH(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
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

app.http('getOKH', {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "getOKH",
  handler: getOKH
});

// Get OKHs endpoint
export async function getOKHs(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  return { jsonBody: example_products };
}

app.http('getOKHs', {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "getOKHs",
  handler: getOKHs
});

// Get example products endpoint
export async function getExampleProducts(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  return { jsonBody: example_products };
}

app.http('getExampleProducts', {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "getExampleProducts",
  handler: getExampleProducts
});

// Get file endpoint
export async function getFile(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const { containerName, fileName, fileType } = request.params;
  context.log(`Getting file: ${fileName}.${fileType} from container ${containerName}`);
  
  try {
    const data = await getOKHByFileName(fileName, containerName, fileType);
    return { jsonBody: { product: data } };
  } catch (error) {
    return {
      status: 500,
      jsonBody: error
    };
  }
}

app.http('getFile', {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "getFile/{containerName}/{fileName}/{fileType}",
  handler: getFile
});

// List files endpoint
export async function listFilesByContainerName(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const { containerName } = request.params;

  console.log("listFilesByContainerName", serviceName, containerName);
  const result = await listFilesInContainer(
    serviceName,
    containerName
  ) as unknown as AzureStorageResult;
  
  if (result.error) {
    return { jsonBody: result.error };
  }
  let productsObj = { products: result.data };
  console.log("YYYYYYYYYYYYYYYYYYYYY", productsObj);
  return { jsonBody: productsObj };
}

app.http('listFiles', {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "listFiles/{containerName}",
  handler: listFilesByContainerName
});

// List OKH summaries endpoint
export async function listOKHsummaries(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Listing OKH summaries for critical supplies`);
  
  try {
    // Get the example products data
    const products = _.cloneDeep(example_products);
    
    // Extract medical products as our critical supplies
    const medicalProducts = products[0]?.medical_products || [];
    
    // Format them for the frontend
    const productSummaries = medicalProducts.map(product => ({
      id: product.id,
      name: product.name,
      description: product.shortDescription,
      image: product.image,
      importance: 'Critical', // Default importance
      quantity: 'Needed urgently', // Default quantity
      whereToFind: 'Check local relief organizations', // Default location
      keywords: []
    }));
    
    // Add example automotive products as well
    const automotiveProducts = products[0]?.automotive_products || [];
    automotiveProducts.forEach(product => {
      productSummaries.push({
        id: product.id,
        name: product.name,
        description: product.shortDescription,
        image: product.image,
        importance: 'High', // Different importance for automotive
        quantity: 'Limited supply', // Different quantity info
        whereToFind: 'Local mechanics or transportation centers',
        keywords: []
      });
    });
    
    return { 
      jsonBody: { productSummaries },
      headers: { "Access-Control-Allow-Origin": "*" }
    };
  } catch (error) {
    context.log(`Error providing OKH summaries: ${error}`);
    return {
      status: 500,
      jsonBody: { error: "Failed to provide OKH summaries" },
      headers: { "Access-Control-Allow-Origin": "*" }
    };
  }
}

app.http('listOKHsummaries', {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "listOKHsummaries",
  handler: listOKHsummaries
});

// Get related OKH endpoint
export async function getRelatedOKH(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);
  return { 
    jsonBody: { message: "Related OKH endpoint" },
    headers: { "Access-Control-Allow-Origin": "*" }
  };
}

app.http('getRelatedOKH', {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "getRelatedOKH",
  handler: getRelatedOKH
});
