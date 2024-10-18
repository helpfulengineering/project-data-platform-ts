import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { downloadBlobToJson, listFilesInContainer } from '../lib/azure-storage.js';


const example_products = [
        {
     medical_products: [
        {
          id: 1,
          name: "Product A",
          image:
            "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg",
          shortDescription: "This is Product A",
        },
        {
          id: 2,
          name: "Product B",
          image:
            "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg",
          shortDescription: "This is Product B",
        },
        {
          id: 3,
          name: "Product C",
          image:
            "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg",
          shortDescription: "This is Product C",
        },
        {
          id: 4,
          name: "Product D",
          image:
            "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg",
          shortDescription: "This is Product D",
        },
      ],
      automotive_products: [
        {
          id: 5,
          name: "Product A",
          image:
            "https://tailwindui.com/img/ecommerce-images/category-page-05-image-card-01.jpg",
          shortDescription: "This is Product A",
        },
        {
          id: 6,
          name: "Product B",
          image:
            "https://tailwindui.com/img/ecommerce-images/category-page-05-image-card-05.jpg",
          shortDescription: "This is Product B",
        },
        {
          id: 7,
          name: "Product C",
          image:
            "https://tailwindui.com/img/ecommerce-images/category-page-05-image-card-07.jpg",
          shortDescription: "This is Product C",
        },
        {
          id: 8,
          name: "Product D",
          image:
            "https://tailwindui.com/img/ecommerce-images/category-page-05-image-card-08.jpg",
          shortDescription: "This is Product D",
        },
      ],
      consumer_products: [
        {
          id: 9,
          name: "Product A",
          image:
            "https://tailwindui.com/img/ecommerce-images/category-page-07-product-01.jpg",
          shortDescription: "This is Product A",
        },
        {
          id: 10,
          name: "Product B",
          image:
            "https://tailwindui.com/img/ecommerce-images/category-page-07-product-02.jpg",
          shortDescription: "This is Product B",
        },
        {
          id: 11,
          name: "Product C",
          image:
            "https://tailwindui.com/img/ecommerce-images/category-page-07-product-03.jpg",
          shortDescription: "This is Product C",
        },
        {
          id: 12,
          name: "Product D",
          image:
            "https://tailwindui.com/img/ecommerce-images/category-page-07-product-04.jpg",
          shortDescription: "This is Product D",
        },
      ],
        }
];


export async function getOKH(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

        example_products[0].medical_products.push(
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
    handler: getOKH
});

export async function getOKHs(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    return  { jsonBody: example_products };
};

app.http('getOKHs', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: getOKHs
});
