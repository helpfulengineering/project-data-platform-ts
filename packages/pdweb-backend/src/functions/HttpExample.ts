import { app, HttpRequest, HttpResponseInit, InvocationContext,
       } from "@azure/functions";


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

export async function getOKHs(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    return  { jsonBody: example_products };
};

app.http('getOKHs', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: getOKHs
});
