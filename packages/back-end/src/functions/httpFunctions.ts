import {
  app,
  HttpHandler,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import {
  downloadBlobToJson,
  downloadBlobToYaml,
  listFilesInContainer,
} from "../lib/azure-storage.js";
import { DICT_TYPE } from "../types/generalTypes.js";

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
};
//create route for each
for (let key in routeFunctions) {
  app.http(key, {
    methods: ["GET", "POST"],
    authLevel: "anonymous",
    handler: routeFunctions[key],
  });
}

const example_products = [
  {
    medical_products: [
      {
        id: 1,
        name: "IV Bag Hook",
        image:
          "https://field-ready-projects.openknowhow.org/images/HL003-attC88mXadLwq4sLy-400x300.jpg",
        shortDescription: "For IV bags to be hung",
      },
      {
        id: 2,
        name: "Oxygen Supply Fitting",
        image:
          "https://field-ready-projects.openknowhow.org/images/HL002-attmlR243asYolZRO-400x300.jpg",
        shortDescription:
          "Adapter that connects oxygen supply tubing to standard oxygen systems",
      },
      {
        id: 3,
        name: "Umbilical Cord Clamp",
        image:
          "https://field-ready-projects.openknowhow.org/images/HL001-attG43ftDEHSUFPVG-400x300.jpg",
        shortDescription:
          "Enclosure of umbilical cords of newborns to prevent sepsis",
      },
      {
        id: 4,
        name: "Finger Brace",
        image:
          "https://field-ready-projects.openknowhow.org/images/HL005-attgxsUzHxoTnTmSP-400x300.jpg",
        shortDescription: "In order to keep a injured index finger immobile",
      },
    ],
    automotive_products: [
      {
        id: 5,
        name: "Water Truck Clamp",
        image:
          "https://field-ready-projects.openknowhow.org/images/WA012-attbQe9vW0QdVGkqD-400x300.jpg",
        shortDescription:
          "Clamps over the hose on the outlet of a water distribution truck to create a seal",
      },
      {
        id: 6,
        name: "Jerry Can Roller",
        image:
          "https://field-ready-projects.openknowhow.org/images/WA013-attjDSod18c5Ru8PN-400x300.jpeg",
        shortDescription: "Transports 80 litres of drinking water",
      },
      {
        id: 7,
        name: "Make-Fit Pipe Fitting",
        image:
          "https://field-ready-projects.openknowhow.org/images/WA016-attP4Uy56ROfYjAjF-400x300.jpg",
        shortDescription:
          "Using Make-Fit app a range of 3DP pipe fitting can be produced",
      },
      {
        id: 8,
        name: "Straight Coupler",
        image:
          "https://field-ready-projects.openknowhow.org/images/WA010-attuWhYn15CARwJu4-400x300.jpg",
        shortDescription: "20.5/16.5 straight coupler used to join to pipes.",
      },
    ],
    consumer_products: [
      {
        id: 9,
        name: "Baby Crib",
        image:
          "https://field-ready-projects.openknowhow.org/images/CP002-attt4t66rFpYaqdTj-400x300.jpeg",
        shortDescription: "Provides a safe area for a baby to sleep",
      },
      {
        id: 10,
        name: "Play Pen",
        image:
          "https://field-ready-projects.openknowhow.org/images/CP003-attz3CoRAhIzA5x9v-400x300.jpeg",
        shortDescription: "Provides a safe area for a child to play",
      },
      {
        id: 11,
        name: "Duoband Yagi Antenna",
        image:
          "https://field-ready-projects.openknowhow.org/images/DR002-attJBcwM43eItgWAE-400x300.jpg",
        shortDescription:
          "3D printed bespoke parts to construct standard antenna design",
      },
      {
        id: 12,
        name: "Rescue Airbag",
        image:
          "https://field-ready-projects.openknowhow.org/images/DR001-att5yL3AEAbc3wDh2-400x300.png",
        shortDescription:
          "For first responders to remove large blocks of debris",
      },
    ],
  },
];

export async function getOKH(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  // get the name of the item
  const name =
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

    const okh = await getOKHByName(name, OKHcontainerName);
    //bread.yml
    // context.log("before bread");

    const breadYAML = await getOKHByName(yamlFileName, OKHcontainerName);
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
      image: "",
      shortDescription: okh["description"] as string,
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

// HELPER FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////

async function getOKHByName(name: string, containerName: string): Promise<any> {
  const fileType = name.split(".").pop();
  // // Warning!! This function does NOT match the apparent
  // // documentation: https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-download-javascript
  // // I had to figure it out by guessing. The documentation there
  // // gives the arguments as "containerClient, blobName, fileNameWithPath"
  // // I can't explain this discrepancy.
  if (fileType === "json") {
    return await downloadBlobToJson(
      process.env?.Azure_Storage_ServiceName as string,
      containerName,
      name
    );
  } else if (fileType === "yml" || fileType === "yaml") {
    return await downloadBlobToYaml(
      process.env?.Azure_Storage_ServiceName as string,
      containerName,
      name
    );
  }

  // return await downloadBlobToJson(
  //   process.env?.Azure_Storage_ServiceName as string,
  //   containerName,
  //   name
  // );
}

async function getAllFileNamesInContainer() {}

function convertYAMLToJson(yaml: string): Promise<any> {
  const obj: any = {
    id: "6",
    name: "Ghanian Super Bread",
    image: "",
    shortDescription: yaml,
  };

  // context.log(okh["title"]);
  // context.log(okh["description"]);

  obj.id = "6";

  // medical_products.push({
  //   id: 5,
  //   name: okh["title"] as string,
  //   image: "",
  //   shortDescription: okh["description"] as string,
  // });

  return obj;
}
