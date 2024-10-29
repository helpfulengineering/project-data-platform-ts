<template>
  <div class="product-detail container center m-10">
    <div class="left">
      <Slider :images="product.images" />
      <div>Specifications</div>
      <div>Detail</div>
    </div>
    <div class="center">
      <h1 class="title">{{ product.name }}</h1>
      <div class="location">Location, Country</div>
      <p>{{ product.shortDescription }}</p>
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

<script setup>
import { useRoute } from "#app";

const route = useRoute();
const productId = route.params.id;

// Mock product data
const products = [
  {
    id: 1,
    name: "IV Bag Hook",
    images:["https://field-ready-projects.openknowhow.org/images/HL003-attC88mXadLwq4sLy-400x300.jpg",
      "https://field-ready-projects.openknowhow.org/images/HL003-attnOADswJg8Z1Tkr-400x300.jpg",
      "https://field-ready-projects.openknowhow.org/images/HL003-attTWOBTURxhJke0d-400x300.jpg"
    ],
    shortDescription: "For IV bags to be hung",
  },
  {
    id: 2,
    name: "Oxygen Supply Fitting",
    images:
      ["https://field-ready-projects.openknowhow.org/images/HL002-attmlR243asYolZRO-400x300.jpg",
        "https://field-ready-projects.openknowhow.org/images/HL002-attEl2ohzRMv9ARYL-400x300.jpg",
        "https://field-ready-projects.openknowhow.org/images/HL002-att6KspJ44bsDBbTY-400x300.jpg"
      ],
    shortDescription:
      "Adapter that connects oxygen supply tubing to standard oxygen systems",
  },
  {
    id: 3,
    name: "Umbilical Cord Clamp",
    images:
      ["https://field-ready-projects.openknowhow.org/images/HL001-attG43ftDEHSUFPVG-400x300.jpg",
        "https://field-ready-projects.openknowhow.org/images/HL001-attf3p6aS1A0NgjXH-400x300.jpg",
        "https://field-ready-projects.openknowhow.org/images/HL001-attQY27dM3l2ON5Ao-400x300.jpg"
      ],
    shortDescription:
      "Enclosure of umbilical cords of newborns to prevent sepsis",
  },
  {
    id: 4,
    name: "Finger Brace",
    images:
      ["https://field-ready-projects.openknowhow.org/images/HL005-attgxsUzHxoTnTmSP-400x300.jpg",
        "https://field-ready-projects.openknowhow.org/images/HL005-att5gRPVVqNrEdNzQ-400x300.jpg",
        "https://field-ready-projects.openknowhow.org/images/HL005-att7KSVbxiaJwycvm-400x300.jpg"
      ],
    shortDescription: "In order to keep a injured index finger immobile",
  },
  {
    id: 5,
    name: "Water Truck Clamp",
    images:
      ["https://field-ready-projects.openknowhow.org/images/WA012-attbQe9vW0QdVGkqD-400x300.jpg",
        "https://field-ready-projects.openknowhow.org/images/WA012-attOlLPPqg7ONAQBC-400x300.jpg",
        "https://field-ready-projects.openknowhow.org/images/WA012-attr7TkuBVgBqtkoP-400x300.jpg"
      ],
    shortDescription:
      "Clamps over the hose on the outlet of a water distribution truck to create a seal",
  },
  {
    id: 6,
    name: "Jerry Can Roller",
    images:
      ["https://field-ready-projects.openknowhow.org/images/WA013-attjDSod18c5Ru8PN-400x300.jpeg"],
    shortDescription: "Transports 80 litres of drinking water",
  },
  {
    id: 7,
    name: "Make-Fit Pipe Fitting",
    images:
      ["https://field-ready-projects.openknowhow.org/images/WA016-attP4Uy56ROfYjAjF-400x300.jpg"],
    shortDescription:
      "Using Make-Fit app a range of 3DP pipe fitting can be produced",
  },
  {
    id: 8,
    name: "Straight Coupler",
    images:
      ["https://field-ready-projects.openknowhow.org/images/WA010-attuWhYn15CARwJu4-400x300.jpg"],
    shortDescription: "20.5/16.5 straight coupler used to join to pipes.",
  },
  {
    id: 9,
    name: "Baby Crib",
    images:
      ["https://field-ready-projects.openknowhow.org/images/CP002-attt4t66rFpYaqdTj-400x300.jpeg"],
    shortDescription: "Provides a safe area for a baby to sleep",
  },
  {
    id: 10,
    name: "Play Pen",
    images:
      ["https://field-ready-projects.openknowhow.org/images/CP003-attz3CoRAhIzA5x9v-400x300.jpeg"],
    shortDescription: "Provides a safe area for a child to play",
  },
  {
    id: 11,
    name: "Duoband Yagi Antenna",
    images:
      ["https://field-ready-projects.openknowhow.org/images/DR002-attJBcwM43eItgWAE-400x300.jpg"],
    shortDescription:
      "3D printed bespoke parts to construct standard antenna design",
  },
  {
    id: 12,
    name: "Rescue Airbag",
    images:
      ["https://field-ready-projects.openknowhow.org/images/DR001-att5yL3AEAbc3wDh2-400x300.png"],
    shortDescription: "For first responders to remove large blocks of debris",
  },
  // Add more products here
];

const product = products.find((p) => p.id === parseInt(productId));
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
  }

  .location {
    padding-bottom: 25px;
  }

  .center {
    width: calc(100% - 500px);
  }

  .review-wrap {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
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
</style>
