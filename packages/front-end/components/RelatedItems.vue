<template>
  <div class="related-products">
    <h1 class="title">Related to items you’ve viewed</h1>
    <div class="related-product-wrap">
      <div
        class="center m-6"
        v-for="related_product in related_products"
        :key="related_product.id"
        :product="related_product"
      >
        <img :src="related_product.image" alt="Product Image" class="size-48" />
        <h1 class="name">{{ related_product.name }}</h1>
    </div>
    </div>
  </div>
</template>

<script setup>
// Mock product data
const related_products = [
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
  {
    id: 5,
    name: "Water Truck Clamp",
    image:
      "https://field-ready-projects.openknowhow.org/images/WA012-attbQe9vW0QdVGkqD-400x300.jpg",
    shortDescription:
      "Clamps over the hose on the outlet of a water distribution truck to create a seal",
  },
];
</script>

<style scoped>
.related-products {
  background-color: white;
  margin-bottom: 40px;

  .name {
    font-size: 16px;
  }

  .title {
    color: #2a3952;
    font-size: 24px;
    font-weight: 700;
    padding: 20px 0 0 10px;
    text-align: center;
    text-transform: uppercase;
  }

  .related-product-wrap {
    display: flex;
    justify-content: space-between;
  }
}
</style>
