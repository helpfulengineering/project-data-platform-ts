import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { downloadBlobToJson, listFilesInContainer } from '../lib/azure-storage.js';


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
          shortDescription:  "Adapter that connects oxygen supply tubing to standard oxygen systems",
        },
        {
          id: 3,
          name: "Umbilical Cord Clamp",
          image:
            "https://field-ready-projects.openknowhow.org/images/HL001-attG43ftDEHSUFPVG-400x300.jpg",
          shortDescription: "Enclosure of umbilical cords of newborns to prevent sepsis",
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
          id: 6,
          name: "Water Truck Clamp",
          image:
            "https://field-ready-projects.openknowhow.org/images/WA012-attbQe9vW0QdVGkqD-400x300.jpg",
          shortDescription: "Clamps over the hose on the outlet of a water distribution truck to create a seal",
        },
        {
          id: 7,
          name: "Jerry Can Roller",
          image:
            "https://field-ready-projects.openknowhow.org/images/WA013-attjDSod18c5Ru8PN-400x300.jpeg",
          shortDescription: "Transports 80 litres of drinking water",
        },
        {
          id: 8,
          name: "Make-Fit Pipe Fitting",
          image:
            "https://field-ready-projects.openknowhow.org/images/WA016-attP4Uy56ROfYjAjF-400x300.jpg",
          shortDescription: "Using Make-Fit app a range of 3DP pipe fitting can be produced",
        },
        {
          id: 9,
          name: "Straight Coupler",
          image:
            "https://field-ready-projects.openknowhow.org/images/WA010-attuWhYn15CARwJu4-400x300.jpg",
          shortDescription: "20.5/16.5 straight coupler used to join to pipes.",
        },
      ],
      consumer_products: [
        {
          id: 10,
          name: "Baby Crib",
          image:
            "https://field-ready-projects.openknowhow.org/images/CP002-attt4t66rFpYaqdTj-400x300.jpeg",
          shortDescription: "Provides a safe area for a baby to sleep",
        },
        {
          id: 11,
          name: "Play Pen",
          image:
            "https://field-ready-projects.openknowhow.org/images/CP003-attz3CoRAhIzA5x9v-400x300.jpeg",
          shortDescription: "Provides a safe area for a child to play",
        },
        {
          id: 12,
          name: "Duoband Yagi Antenna",
          image:
            "https://field-ready-projects.openknowhow.org/images/DR002-attJBcwM43eItgWAE-400x300.jpg",
          shortDescription: "3D printed bespoke parts to construct standard antenna design",
        },
        {
          id: 13,
          name: "Rescue Airbag",
          image:
            "https://field-ready-projects.openknowhow.org/images/DR001-att5yL3AEAbc3wDh2-400x300.png",
          shortDescription: "For first responders to remove large blocks of debris",
        },
      ],
        }
];


export async function getOKHs(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get('name') || await request.text() || 'ventilator';

    try {
        if (
          !process.env?.Azure_Storage_ServiceName ||
                !process.env?.Azure_Storage_ContainerName
        ) {
          return {
            status: 405,
            jsonBody: 'Missing required app configuration'
          };
        }

        const containerName = process.env?.Azure_Storage_ContainerName;
        context.log(`containerName: ${containerName}`);``

        if (!containerName) {
          return {
            status: 405,
            jsonBody: 'Missing required container name'
          };
        }

        const { error, errorMessage, data } = await listFilesInContainer(
          process.env?.Azure_Storage_ServiceName as string,
          containerName
        );
        context.log(errorMessage);
        context.log("files",JSON.stringify(data));

        // Warning!! This function does NOT match the apparent
        // documentation: https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-download-javascript
        // I had to figure it out by guessing. The documentation there
        // gives the arguments as "containerClient, blobName, fileNameWithPath"
        // I can't explain this discrepancy.
        const okh = await downloadBlobToJson(
            process.env?.Azure_Storage_ServiceName as string,
            containerName,
            `okh-${name}.json`
        );

        // Note okh is of type JSON. Decoding into a type correct
        // object requires a lot of complexity as explained in this issue:
        // https://stackoverflow.com/questions/22885995/how-do-i-initialize-a-typescript-object-with-a-json-object


        context.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
        context.log(okh);


        context.log(okh['title' as keyof JSON]);
        context.log(okh['description' as keyof JSON]);

        example_products[0].medical_products.unshift(
            {
                id: 5,
                name: okh['title' as keyof JSON] as string,
                image: "",
                shortDescription: okh['description' as keyof JSON] as string
            }
        );


        context.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

//        context.log("example_products",JSON.stringify(example_products));
        if (!error) {
          return {
            jsonBody: example_products
          };
        } else {
          return {
            status: 500,
            jsonBody: errorMessage
          };
        }
      } catch (error) {
        return {
          status: 500,
          jsonBody: error
        };
      }
// This is obsolete, we should not here
    return { body: `Hello, ${name}!` };
};

app.http('getOKH', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: getOKHs
});

export async function getOKHs_old(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    return  { jsonBody: example_products };
};

app.http('getOKHs', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: getOKHs
});
