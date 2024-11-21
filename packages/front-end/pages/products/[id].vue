<template>
  <div class="product-detail container center m-10">
    <div class="left">
      <Slider :images="product?.image" />
      <div class="specification">Specifications</div>
      <div class="okh-details">
        <div>version</div>
        <div class="value">{{ product?.version }}</div>
      </div>
      <div class="okh-details">
        <div>License</div>
        <div class="value">{{ product?.license }}</div>
      </div>
      <div class="okh-details">
        <div>Licensor</div>
        <div class="value">
          <div>{{ product?.licensor.name }}</div>
          <div>{{ product?.licensor.email }}</div>
          <div>{{ product?.licensor.affiliation }}</div>
        </div>
      </div>
      <div class="okh-details">
        <div>manifest author</div>
        <div class="value">
          <div>{{ product["manifest-author"].name }}</div>
          <div>{{ product["manifest-author"].email }}</div>
          <div>{{ product["manifest-author"].affiliation }}</div>
        </div>
      </div>
      <div class="okh-details">
        <div>manifest language</div>
        <div class="value">{{ product["manifest-language"] }}</div>
      </div>
      <div class="okh-details">
        <div>okh manifest version</div>
        <div class="value">{{ product["okh-manifest-version"] }}</div>
      </div>
      <div class="okh-details">
        <div>date created</div>
        <div class="value">{{ product["date-created"] }}</div>
      </div>
      <div class="okh-details">
        <div>date updated</div>
        <div class="value">{{ product["date-updated"] }}</div>
      </div>
      <div class="okh-details">
        <div>keywords</div>
        <div class="value">{{ product?.keywords?.join(', ') }}</div>
      </div>
      <div class="okh-details">
        <div>contact</div>
        <div class="value">
          <div>{{ product.contact.name }}</div>
          <div>{{ product.contact.email }}</div>
          <div>{{ product.contact.affiliation }}</div>
        </div>
      </div>
      <div class="okh-details">
        <div>development stage</div>
        <div class="value">{{ product["development-stage"] }}</div>
      </div>
      <div class="okh-details">
        <div>health safety notice</div>
        <div class="value">{{ product["health-safety-notice"] }}</div>
      </div>
    </div>
    <div class="center">
      <h1 class="title">{{ product?.title }}</h1>
      <div class="location">Location, Country</div>
      <p>{{ product?.description }}</p>
      <div class="review-wrap">
        <Reviews />
        <Reviews />
      </div>
      <RelatedItems />
    </div>
    <div class="right">
      <button class="btn-primary">ORDER</button>
      <button class="btn-secondary">CONTACT SUPPLIER</button>
    </div>
    <!-- <NuxtLink to="/">Back to List</NuxtLink> -->
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "#app";
import type { OKH_TYPE } from "../../types/OKH.type";

const route = useRoute();
const productId = route.params.id as string;

// Mock product data
const products: OKH_TYPE[] = [
  {
    id: 1,
    title: "IV Bag Hook",
    description: "For IV bags to be hung. Lorem ipsum dolor sit amet consectetur. Quis risus enim aliquam feugiat aliquam vulputate placerat sed. Consectetur pellentesque dis nunc sit et odio non viverra. Facilisi vitae sed in massa nibh elit. Bibendum massa nunc lorem mattis bibendum malesuada ac magna lorem. Morbi in a faucibus cum diam aliquam mi faucibus. Dapibus id maecenas aliquet quis arcu tempor nisi risus.",
    "intended-use": "",
    keywords: ["IV", "hook", "medical"],
    "project-link": "",
    image: [
      "https://field-ready-projects.openknowhow.org/images/HL003-attC88mXadLwq4sLy-400x300.jpg",
      "https://field-ready-projects.openknowhow.org/images/HL003-attnOADswJg8Z1Tkr-400x300.jpg",
      "https://field-ready-projects.openknowhow.org/images/HL003-attTWOBTURxhJke0d-400x300.jpg",
    ],
    made: true,
    "made-independently": false,
    license: "CC BY-SA 4.0",
    licensor: {
      name: "Medical Supply Co.",
      email: "contact@medicalco.com",
      affiliation: "",
    },
    "okh-manifest-version": "1.0",
    "date-created": "2024-11-17",
    "date-updated": "2024-11-17",
    "manifest-author": {
      name: "John Doe",
      email: "johndoe@example.com",
      affiliation: "",
    },
    "manifest-language": "en",
    contact: {
      name: "Support Team",
      email: "support@medicalco.com",
      affiliation: "",
    },
    version: "2.0",
    "development-stage": "Production",
    "documentation-home": "",
    bom: "",
    "bom-atoms": {
      identifier: "",
      description: "",
      link: "",
    },
    "tool-list": "",
    "tool-list-atoms": {
      identifier: "",
      description: "",
      link: "",
    },
    "product-atom": {
      identifier: "",
      description: "",
      link: "",
    },
    "making-instructions": [],
    "maintenance-instructions": "",
    "health-safety-notice": "",
    "standards-used": "",
  },
  {
    id: 2,
    title: "Oxygen Supply Fitting",
    description:
      "Adapter that connects oxygen supply tubing to standard oxygen systems",
    "intended-use": "",
    keywords: ["IV", "hook", "medical"],
    "project-link": "",
    image: [
      "https://field-ready-projects.openknowhow.org/images/HL002-attmlR243asYolZRO-400x300.jpg",
      "https://field-ready-projects.openknowhow.org/images/HL002-attEl2ohzRMv9ARYL-400x300.jpg",
      "https://field-ready-projects.openknowhow.org/images/HL002-att6KspJ44bsDBbTY-400x300.jpg",
    ],
    made: true,
    "made-independently": false,
    license: "CC BY-SA 4.0",
    licensor: {
      name: "Medical Supply Co.",
      email: "contact@medicalco.com",
      affiliation: "",
    },
    "okh-manifest-version": "1.0",
    "date-created": "2024-11-17",
    "date-updated": "2024-11-17",
    "manifest-author": {
      name: "John Doe",
      email: "johndoe@example.com",
      affiliation: "",
    },
    "manifest-language": "en",
    contact: {
      name: "Support Team",
      email: "support@medicalco.com",
      affiliation: "",
    },
    version: 2.0,
    "development-stage": "",
    "documentation-home": "",
    bom: "",
    "bom-atoms": {
      identifier: "",
      description: "",
      link: "",
    },
    "tool-list": "",
    "tool-list-atoms": {
      identifier: "",
      description: "",
      link: "",
    },
    "product-atom": {
      identifier: "",
      description: "",
      link: "",
    },
    "making-instructions": [],
    "maintenance-instructions": "",
    "health-safety-notice": "",
    "standards-used": "",
  },
  {
    id: 3,
    title: "Umbilical Cord Clamp",
    "intended-use": "",
    keywords: ["IV", "hook", "medical"],
    "project-link": "",
    image: [
      "https://field-ready-projects.openknowhow.org/images/HL001-attG43ftDEHSUFPVG-400x300.jpg",
      "https://field-ready-projects.openknowhow.org/images/HL001-attf3p6aS1A0NgjXH-400x300.jpg",
      "https://field-ready-projects.openknowhow.org/images/HL001-attQY27dM3l2ON5Ao-400x300.jpg",
    ],
    description: "Enclosure of umbilical cords of newborns to prevent sepsis",
    made: true,
    "made-independently": false,
    license: "CC BY-SA 4.0",
    licensor: {
      name: "Medical Supply Co.",
      email: "contact@medicalco.com",
      affiliation: "",
    },
    "okh-manifest-version": "1.0",
    "date-created": "2024-11-17",
    "date-updated": "2024-11-17",
    "manifest-author": {
      name: "John Doe",
      email: "johndoe@example.com",
      affiliation: "",
    },
    "manifest-language": "en",
    contact: {
      name: "Support Team",
      email: "support@medicalco.com",
      affiliation: "",
    },
    version: 2.0,
    "development-stage": "",
    "documentation-home": "",
    bom: "",
    "bom-atoms": {
      identifier: "",
      description: "",
      link: "",
    },
    "tool-list": "",
    "tool-list-atoms": {
      identifier: "",
      description: "",
      link: "",
    },
    "product-atom": {
      identifier: "",
      description: "",
      link: "",
    },
    "making-instructions": [],
    "maintenance-instructions": "",
    "health-safety-notice": "",
    "standards-used": "",
  },
  {
    id: 4,
    title: "Finger Brace",
    "intended-use": "",
    keywords: ["IV", "hook", "medical"],
    "project-link": "",
    image: [
      "https://field-ready-projects.openknowhow.org/images/HL005-attgxsUzHxoTnTmSP-400x300.jpg",
      "https://field-ready-projects.openknowhow.org/images/HL005-att5gRPVVqNrEdNzQ-400x300.jpg",
      "https://field-ready-projects.openknowhow.org/images/HL005-att7KSVbxiaJwycvm-400x300.jpg",
    ],
    description: "In order to keep a injured index finger immobile",
    made: true,
    "made-independently": false,
    license: "CC BY-SA 4.0",
    licensor: {
      name: "Medical Supply Co.",
      email: "contact@medicalco.com",
      affiliation: "",
    },
    "okh-manifest-version": "1.0",
    "date-created": "2024-11-17",
    "date-updated": "2024-11-17",
    "manifest-author": {
      name: "John Doe",
      email: "johndoe@example.com",
      affiliation: "",
    },
    "manifest-language": "en",
    contact: {
      name: "Support Team",
      email: "support@medicalco.com",
      affiliation: "",
    },
    version: 2.0,
    "development-stage": "",
    "documentation-home": "",
    bom: "",
    "bom-atoms": {
      identifier: "",
      description: "",
      link: "",
    },
    "tool-list": "",
    "tool-list-atoms": {
      identifier: "",
      description: "",
      link: "",
    },
    "product-atom": {
      identifier: "",
      description: "",
      link: "",
    },
    "making-instructions": [],
    "maintenance-instructions": "",
    "health-safety-notice": "",
    "standards-used": "",
  },
  {
    id: 5,
    title: "Water Truck Clamp",
    "intended-use": "",
    keywords: ["IV", "hook", "medical"],
    "project-link": "",
    image: [
      "https://field-ready-projects.openknowhow.org/images/WA012-attbQe9vW0QdVGkqD-400x300.jpg",
      "https://field-ready-projects.openknowhow.org/images/WA012-attOlLPPqg7ONAQBC-400x300.jpg",
      "https://field-ready-projects.openknowhow.org/images/WA012-attr7TkuBVgBqtkoP-400x300.jpg",
    ],
    description:
      "Clamps over the hose on the outlet of a water distribution truck to create a seal",
    made: true,
    "made-independently": false,
    license: "CC BY-SA 4.0",
    licensor: {
      name: "Medical Supply Co.",
      email: "contact@medicalco.com",
      affiliation: "",
    },
    "okh-manifest-version": "1.0",
    "date-created": "2024-11-17",
    "date-updated": "2024-11-17",
    "manifest-author": {
      name: "John Doe",
      email: "johndoe@example.com",
      affiliation: "",
    },
    "manifest-language": "en",
    contact: {
      name: "Support Team",
      email: "support@medicalco.com",
      affiliation: "",
    },
    version: 2.0,
    "development-stage": "",
    "documentation-home": "",
    bom: "",
    "bom-atoms": {
      identifier: "",
      description: "",
      link: "",
    },
    "tool-list": "",
    "tool-list-atoms": {
      identifier: "",
      description: "",
      link: "",
    },
    "product-atom": {
      identifier: "",
      description: "",
      link: "",
    },
    "making-instructions": [],
    "maintenance-instructions": "",
    "health-safety-notice": "",
    "standards-used": "",
  },
  {
    id: 6,
    title: "Jerry Can Roller",
    "intended-use": "",
    keywords: ["IV", "hook", "medical"],
    "project-link": "",
    image: [
      "https://field-ready-projects.openknowhow.org/images/WA013-attjDSod18c5Ru8PN-400x300.jpeg",
    ],
    description: "Transports 80 litres of drinking water",
    made: true,
    "made-independently": false,
    license: "CC BY-SA 4.0",
    licensor: {
      name: "Medical Supply Co.",
      email: "contact@medicalco.com",
      affiliation: "",
    },
    "okh-manifest-version": "1.0",
    "date-created": "2024-11-17",
    "date-updated": "2024-11-17",
    "manifest-author": {
      name: "John Doe",
      email: "johndoe@example.com",
      affiliation: "",
    },
    "manifest-language": "en",
    contact: {
      name: "Support Team",
      email: "support@medicalco.com",
      affiliation: "",
    },
    version: 2.0,
    "development-stage": "",
    "documentation-home": "",
    bom: "",
    "bom-atoms": {
      identifier: "",
      description: "",
      link: "",
    },
    "tool-list": "",
    "tool-list-atoms": {
      identifier: "",
      description: "",
      link: "",
    },
    "product-atom": {
      identifier: "",
      description: "",
      link: "",
    },
    "making-instructions": [],
    "maintenance-instructions": "",
    "health-safety-notice": "",
    "standards-used": "",
  },
  {
    id: 7,
    title: "Make-Fit Pipe Fitting",
    "intended-use": "",
    keywords: ["IV", "hook", "medical"],
    "project-link": "",
    image: [
      "https://field-ready-projects.openknowhow.org/images/WA016-attP4Uy56ROfYjAjF-400x300.jpg",
    ],
    description:
      "Using Make-Fit app a range of 3DP pipe fitting can be produced",
    made: true,
    "made-independently": false,
    license: "CC BY-SA 4.0",
    licensor: {
      name: "Medical Supply Co.",
      email: "contact@medicalco.com",
      affiliation: "",
    },
    "okh-manifest-version": "1.0",
    "date-created": "2024-11-17",
    "date-updated": "2024-11-17",
    "manifest-author": {
      name: "John Doe",
      email: "johndoe@example.com",
      affiliation: "",
    },
    "manifest-language": "en",
    contact: {
      name: "Support Team",
      email: "support@medicalco.com",
      affiliation: "",
    },
    version: 2.0,
    "development-stage": "",
    "documentation-home": "",
    bom: "",
    "bom-atoms": {
      identifier: "",
      description: "",
      link: "",
    },
    "tool-list": "",
    "tool-list-atoms": {
      identifier: "",
      description: "",
      link: "",
    },
    "product-atom": {
      identifier: "",
      description: "",
      link: "",
    },
    "making-instructions": [],
    "maintenance-instructions": "",
    "health-safety-notice": "",
    "standards-used": "",
  },
  {
    id: 8,
    title: "Straight Coupler",
    "intended-use": "",
    keywords: ["IV", "hook", "medical"],
    "project-link": "",
    image: [
      "https://field-ready-projects.openknowhow.org/images/WA010-attuWhYn15CARwJu4-400x300.jpg",
    ],
    description: "20.5/16.5 straight coupler used to join to pipes.",
    made: true,
    "made-independently": false,
    license: "CC BY-SA 4.0",
    licensor: {
      name: "Medical Supply Co.",
      email: "contact@medicalco.com",
      affiliation: "",
    },
    "okh-manifest-version": "1.0",
    "date-created": "2024-11-17",
    "date-updated": "2024-11-17",
    "manifest-author": {
      name: "John Doe",
      email: "johndoe@example.com",
      affiliation: "",
    },
    "manifest-language": "en",
    contact: {
      name: "Support Team",
      email: "support@medicalco.com",
      affiliation: "",
    },
    version: 2.0,
    "development-stage": "",
    "documentation-home": "",
    bom: "",
    "bom-atoms": {
      identifier: "",
      description: "",
      link: "",
    },
    "tool-list": "",
    "tool-list-atoms": {
      identifier: "",
      description: "",
      link: "",
    },
    "product-atom": {
      identifier: "",
      description: "",
      link: "",
    },
    "making-instructions": [],
    "maintenance-instructions": "",
    "health-safety-notice": "",
    "standards-used": "",
  },
  {
    id: 9,
    title: "Baby Crib",
    "intended-use": "",
    keywords: ["IV", "hook", "medical"],
    "project-link": "",
    image: [
      "https://field-ready-projects.openknowhow.org/images/CP002-attt4t66rFpYaqdTj-400x300.jpeg",
    ],
    description: "Provides a safe area for a baby to sleep",
    made: true,
    "made-independently": false,
    license: "CC BY-SA 4.0",
    licensor: {
      name: "Medical Supply Co.",
      email: "contact@medicalco.com",
      affiliation: "",
    },
    "okh-manifest-version": "1.0",
    "date-created": "2024-11-17",
    "date-updated": "2024-11-17",
    "manifest-author": {
      name: "John Doe",
      email: "johndoe@example.com",
      affiliation: "",
    },
    "manifest-language": "en",
    contact: {
      name: "Support Team",
      email: "support@medicalco.com",
      affiliation: "",
    },
    version: 2.0,
    "development-stage": "",
    "documentation-home": "",
    bom: "",
    "bom-atoms": {
      identifier: "",
      description: "",
      link: "",
    },
    "tool-list": "",
    "tool-list-atoms": {
      identifier: "",
      description: "",
      link: "",
    },
    "product-atom": {
      identifier: "",
      description: "",
      link: "",
    },
    "making-instructions": [],
    "maintenance-instructions": "",
    "health-safety-notice": "",
    "standards-used": "",
  },
  {
    id: 10,
    title: "Play Pen",
    "intended-use": "",
    keywords: ["IV", "hook", "medical"],
    "project-link": "",
    image: [
      "https://field-ready-projects.openknowhow.org/images/CP003-attz3CoRAhIzA5x9v-400x300.jpeg",
    ],
    description: "Provides a safe area for a child to play",
    made: true,
    "made-independently": false,
    license: "CC BY-SA 4.0",
    licensor: {
      name: "Medical Supply Co.",
      email: "contact@medicalco.com",
      affiliation: "",
    },
    "okh-manifest-version": "1.0",
    "date-created": "2024-11-17",
    "date-updated": "2024-11-17",
    "manifest-author": {
      name: "John Doe",
      email: "johndoe@example.com",
      affiliation: "",
    },
    "manifest-language": "en",
    contact: {
      name: "Support Team",
      email: "support@medicalco.com",
      affiliation: "",
    },
    version: 2.0,
    "development-stage": "",
    "documentation-home": "",
    bom: "",
    "bom-atoms": {
      identifier: "",
      description: "",
      link: "",
    },
    "tool-list": "",
    "tool-list-atoms": {
      identifier: "",
      description: "",
      link: "",
    },
    "product-atom": {
      identifier: "",
      description: "",
      link: "",
    },
    "making-instructions": [],
    "maintenance-instructions": "",
    "health-safety-notice": "",
    "standards-used": "",
  },
  {
    id: 11,
    title: "Duoband Yagi Antenna",
    "intended-use": "",
    keywords: ["IV", "hook", "medical"],
    "project-link": "",
    image: [
      "https://field-ready-projects.openknowhow.org/images/DR002-attJBcwM43eItgWAE-400x300.jpg",
    ],
    description:
      "3D printed bespoke parts to construct standard antenna design",
    made: true,
    "made-independently": false,
    license: "CC BY-SA 4.0",
    licensor: {
      name: "Medical Supply Co.",
      email: "contact@medicalco.com",
      affiliation: "",
    },
    "okh-manifest-version": "1.0",
    "date-created": "2024-11-17",
    "date-updated": "2024-11-17",
    "manifest-author": {
      name: "John Doe",
      email: "johndoe@example.com",
      affiliation: "",
    },
    "manifest-language": "en",
    contact: {
      name: "Support Team",
      email: "support@medicalco.com",
      affiliation: "",
    },
    version: 2.0,
    "development-stage": "",
    "documentation-home": "",
    bom: "",
    "bom-atoms": {
      identifier: "",
      description: "",
      link: "",
    },
    "tool-list": "",
    "tool-list-atoms": {
      identifier: "",
      description: "",
      link: "",
    },
    "product-atom": {
      identifier: "",
      description: "",
      link: "",
    },
    "making-instructions": [],
    "maintenance-instructions": "",
    "health-safety-notice": "",
    "standards-used": "",
  },
  {
    id: 12,
    title: "Rescue Airbag",
    "intended-use": "",
    keywords: ["IV", "hook", "medical"],
    "project-link": "",
    image: [
      "https://field-ready-projects.openknowhow.org/images/DR001-att5yL3AEAbc3wDh2-400x300.png",
    ],
    description: "For first responders to remove large blocks of debris",
    made: true,
    "made-independently": false,
    license: "CC BY-SA 4.0",
    licensor: {
      name: "Medical Supply Co.",
      email: "contact@medicalco.com",
      affiliation: "",
    },
    "okh-manifest-version": "1.0",
    "date-created": "2024-11-17",
    "date-updated": "2024-11-17",
    "manifest-author": {
      name: "John Doe",
      email: "johndoe@example.com",
      affiliation: "",
    },
    "manifest-language": "en",
    contact: {
      name: "Support Team",
      email: "support@medicalco.com",
      affiliation: "",
    },
    version: 2.0,
    "development-stage": "",
    "documentation-home": "",
    bom: "",
    "bom-atoms": {
      identifier: "",
      description: "",
      link: "",
    },
    "tool-list": "",
    "tool-list-atoms": {
      identifier: "",
      description: "",
      link: "",
    },
   "product-atom": {
      identifier: "",
      description: "",
      link: "",
    },
    "making-instructions": [],
    "maintenance-instructions": "",
    "health-safety-notice": "",
    "standards-used": "",
  },
  // Add more products here
];

const product = products.find((p) => p.id === parseInt(productId));

// const baseUrl = useRuntimeConfig().public.baseUrl;
// const url = baseUrl + "/getOKH/"+ productId;
// console.log("url",url);
// const loading = "loading";
// const success = "success";
// console.log("url", url);
// const { data: product, status, error, refresh, clear } = await useFetch(url);
// console.log("product",product);
</script>

<style scoped>
.product-detail {
  background-color: white;
  display: flex;
  justify-content: space-between;
  margin: 130px auto 40px auto;
  padding: 30px;

  .btn-primary {
    border-radius: 6px;
    background-color: #a6f671;
    color: black;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 10px;
    padding: 6px 20px;
    width: 100%;
  }

  .btn-secondary {
    border: 2px solid #d9d9d9;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 700;
    padding: 6px 20px;
  }

  .left {
    width: 300px;

    .okh-details {
      display: flex;
      font-weight: 500;
      justify-content: space-between;
      padding: 8px 4px;

      .value {
        color: #2a3952;
        font-size: 14px;
        font-weight: 400;
        text-align: right;
      }

      &:nth-child(even) {
        background-color: #ebebeb;
      }
    }

    .specification {
      color: #2a3952;
      font-size: 18px;
      font-weight: 700;
      margin: 30px 0 5px 0;
    }
  }

  .location {
    padding-bottom: 25px;
  }

  .center {
    width: calc(100% - 600px);
  }

  .review-wrap {
    display: flex;
    justify-content: space-between;
    margin: 40px 0 20px 0;
  }

  .right {
    align-items: start;
    display: flex;
    flex-direction: column;
    padding-top: 84px;
  }

  .title {
    color: #2a3952;
    font-size: 24px;
    font-weight: 700;
  }
}

@media only screen and (min-width: 1536px) {
  .product-detail {
    &.container {
      max-width: 1400px;
    }
  }
}
</style>
