import {
  app,
  HttpHandler,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import {
  downloadBlobToJson,
  downloadBlobYamlToJSON,
  listFilesInContainer,
} from '../lib/azure-storage.js';
import { DICT_TYPE, jsonType } from '../types/generalTypes.js';
import { example_products } from '../dummyData/exampleProducts.js';
import _ from 'lodash';
import { loadAllAsJSON, loadAsJSON, saveJSON } from '../util/utils.js';

// test save file
saveJSON('zintis.json', { a: 1 });
saveJSON('ellen.json', { b: 2 });

// make sure important environment variables are present
const serviceName: string = process.env?.Azure_Storage_ServiceName || '';
const OKHcontainerName: string =
  process.env?.Azure_Storage_OKH_ContainerName || '';
const OKWcontainerName: string =
  process.env?.Azure_Storage_OKW_ContainerName || '';

if (!serviceName) {
  throw new Error('No Azure_Storage_ServiceName in process.env');
}
if (!OKHcontainerName) {
  throw new Error('No Azure_Storage_OKH_ContainerName in process.env');
}
if (!OKWcontainerName) {
  throw new Error('No Azure_Storage_OKW_ContainerName in process.env');
}

//stores all the route functions/names... must list the functions here
const routeFunctions: DICT_TYPE = {
  test,
  listRoutes,
  getOKH,
  getOKHs,
  getExampleProducts,
  listProducts,
  'getFile/{containerName}/{fileName}/{fileType}': getFile, // Example: "getFile/okh/bread/yml"
  'listFiles/{containerName}': listFilesByContainerName, // Example: http://localhost:7071/api/listFiles/okw OR http://localhost:7071/api/listFiles/okh
};
//create route for each
for (let key in routeFunctions) {
  const func = routeFunctions[key];
  app.http(func.name, {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    route: key,
    handler: func,
  });
}

let productsArray: any[] = [];
let productDict: DICT_TYPE = {};
populateProductsLocally();

// Route Functions

export async function listRoutes(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  let routes = [];

  for (let r in routeFunctions) {
    let base = request.url.split('/').slice(0, -1).join('/');
    let route = `${base}/${r}`;
    routes.push(route);
    // Adding some example routes.
    if (r.includes('listFiles')) {
      routes.push(route.replace('{containerName}', 'okh'));
      routes.push(route.replace('{containerName}', 'okw'));
    } else if (r.includes('getFile')) {
      routes.push(
        route
          .replace('{containerName}', 'okh')
          .replace('{fileName}', 'bread')
          .replace('{fileType}', 'yml')
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
    const itemFromAzure = await getFileByName('okh-ventilator', 'okh', 'json');

    const breadData = await getFileByName('bread', 'okh', 'yml');

    // duplicate example data so you don't modify it
    const cloned_products = _.cloneDeep(example_products);
    cloned_products[0].medical_products.push(
      convertToProduct(
        itemFromAzure,
        cloned_products[0].medical_products.length + 1
      )
    );
    cloned_products[0].medical_products.push(
      convertToProduct(
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

  console.log('listFilesByContainerName', serviceName, containerName);
  const { error, errorMessage, data } = await listFilesInContainer(
    serviceName,
    containerName
  );
  if (error) {
    return { jsonBody: error };
  }
  return { jsonBody: data };
}

async function populateProductsLocally() {
  const {
    error: e1,
    errorMessage: em1,
    data: okhList,
  } = await listFilesInContainer(serviceName, 'okh');

  if (okhList) {
    console.log('got OKH data');
  } else if (e1) {
    console.log(em1);
  }
  console.log('okhData', okhList);

  const {
    error: e2,
    errorMessage: em2,
    data: okwList,
  } = await listFilesInContainer(serviceName, 'okw');
  if (okwList) {
    console.log('got OKH data');
  } else if (e2) {
    console.log(em2);
  }
  console.log('okwData', okwList);

  let allFiles = [...okhList, ...okwList];
  console.log('allFiles', allFiles);

  for (let f of allFiles) {
    console.log('getting next item:', f);
    let [containerName, file] = f?.split('/').slice(-2);
    let s = file.split('.');
    const fileType = s.pop() || '';
    const fileName = s.join('.');
    const localFile = loadAsJSON(fileName);
    if (localFile) {
      console.log('local file found:', fileName);
      continue;
    } else {
      console.log('localfile NOT found:', fileName);
    }
    try {
      const data = await getFileByName(fileName, containerName, fileType);
      if (data) {
        saveJSON(`${fileName}.json`, data);
        // const key = assembleFileName(fileName, fileType, containerName);
        productDict[fileName] = data;
        console.log('productDict', productDict);
      }
    } catch (err) {
      if (err) continue;
    }
  }
}

export async function listProducts(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  if (productsArray.length > 0) {
    return { jsonBody: productsArray };
  }
  const { containerName } = request.params;

  console.log('listProducts', serviceName, 'okh');
  const { error, errorMessage, data } = await listFilesInContainer(
    serviceName,
    'okh'
  );
  if (error) {
    return { jsonBody: error };
  }

  for (let fileUrl of data.slice(0, 3)) {
    let fileName = fileUrl.split('/').pop() || '';
    let fileType = fileName?.split('.').pop();
    let baseName = fileName?.split('.').slice(0, -1).join('.');
    console.log('fileName, fileType, baseName', fileName, fileType, baseName);

    if (!fileType || !baseName) {
      console.log('no fileType or baseName');
      continue;
    }
    console.log('start getOKHByFileName');
    const data = await getFileByName(baseName, 'okh', fileType);
    console.log('end getOKHByFileName');
    if (data) {
      console.log('data', data);
      productsArray.push(data);
      productDict[fileName] = data;
    } else {
      console.log('no data');
    }
  }
  console.log(productDict);
  let result = productsArray.map((item, index) =>
    convertToProduct(item, index)
  );

  return { jsonBody: result };
}

export async function getFile(
  request: HttpRequest,
  context: any
): Promise<HttpResponseInit> {
  context.log('getFile');
  const { containerName, fileName, fileType } = request.params;
  context.log(containerName, fileName, fileType);

  if (!containerName || !fileName || !fileType) {
    return { jsonBody: 'error, no containerName or fileName' };
  }
  const data = await getFileByName(fileName, containerName, fileType);

  return { jsonBody: data };
}

// HELPER FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////

async function getFileByName(
  name: string,
  containerName: string,
  fileType?: string
): Promise<any> {
  const fileExt: string = fileType || name.split('.').pop() || '';

  console.log('load as json', name);
  const localFile = loadAsJSON(name) || null;
  if (localFile) return localFile;

  // // Warning!! This function does NOT match the apparent
  // // documentation: https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-download-javascript
  // // I had to figure it out by guessing. The documentation there
  // // gives the arguments as "containerClient, blobName, fileNameWithPath"
  // // I can't explain this discrepancy.

  if (fileExt === 'json') {
    return await downloadBlobToJson(
      process.env?.Azure_Storage_ServiceName as string,
      containerName,
      name + '.' + fileExt
    );
  } else if (fileExt === 'yml' || fileExt === 'yaml') {
    return await downloadBlobYamlToJSON(
      process.env?.Azure_Storage_ServiceName as string,
      containerName,
      name + '.' + fileExt
    );
  }
  return null;
}

// will need proper typing once types have been shared with back-end
function convertToProduct(obj: any, id: number): any | null {
  if (!obj || typeof obj !== 'object') return null;
  return {
    id,
    name: obj['title'] as string,
    image: obj['image'] || 'https://placecats.com/300/200',
    shortDescription: obj['description'] as string,
    projectLink: obj['project-link'],
    manifestAuthor: obj['manifest-author']?.name || 'none',
  };
}

function assembleFileName(name: string, ext: string, container: string) {
  return `${container}/${name}.${ext}`;
}
