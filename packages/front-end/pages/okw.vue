<script setup lang="ts">
import ProductGroup from "~/components/ProductGroup.vue";

const okwdata = {
  okwSummaries: [
    {
      id: 0,
      title: "Open Ventilator Project",
      description:
        "An open-source ventilator developed by Helpful Engineering.",
      version: "1.2.0",
      keywords: ["ventilator", "open-source", "medical", "COVID-19"],
      contact: "openventilator@helpfulengineering.org",
      contributors: ["Alice Kim", "Dr. John Doe"],
      license: "CC-BY-SA-4.0",
      documentationHome: "https://docs.helpfulengineering.org/open-ventilator",
    },
    {
      id: 1,
      title: "3D Face Shield",
      description:
        "A lightweight, printable face shield frame for medical use.",
      version: "0.9",
      keywords: ["PPE", "face shield", "3D print"],
      contact: "faceshield@helpfulengineering.org",
      contributors: "Design Team 4",
      license: "MIT",
      documentationHome: "https://docs.helpfulengineering.org/face-shield",
    },
  ],
};

const error = null;
const status = "success";
</script>

<template>
  <div class="container">
    <h1 class="main-title text-center m-8 text-2xl font-bold">OKW</h1>

    <div v-if="status === 'success'" class="product-categories">
      <ProductGroup :products="okwdata.okwSummaries" title="Products" />
      {{ console.log("uuuuuuuuuuuuuuuuuuu", okwdata.okwSummaries) }}
    </div>

    <!-- <div v-if="status === 'success'" class="related-items">
      <RelatedItems />
    </div> -->

    <!-- <div v-if="loading" class="loading related-items">
      <SkeletonRelatedItems />
    </div> -->
  </div>
</template>

<!-- <script lang="ts">
import ProductGroup from "~/components/ProductGroup.vue"; // Import the ProductCard component

export default {
  components: {
    ProductGroup, // Register the component
  },
};
</script> -->

<style scoped>
.container {
  margin: 0 auto;
}

.main-title {
  color: #2a3952;
  margin-top: 130px;
}

.product-list {
  background-color: white;
  padding: 15px;
  margin-bottom: 50px;
  /* width: 450px; */
}
/*
.product-list.skelton {
  margin: 10px 10px 50px 10px;
} */

.product-categories {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.skeleton {
  animation: skeleton-loading 1s linear infinite alternate;
}

.skelton-card-group {
  display: flex;
  flex: 1;
  justify-content: space-between;
  margin-bottom: 20px;
}

@keyframes skeleton-loading {
  0% {
    background-color: hsl(200, 20%, 80%);
  }
  100% {
    background-color: hsl(200, 20%, 95%);
  }
}

.skeleton-text {
  width: 100%;
  height: 0.7rem;
  margin-bottom: 0.5rem;
  border-radius: 0.25rem;
}

.skeleton-text__body {
  width: 75%;
}

.skeleton-footer {
  width: 30%;
}

.loader {
  --d: 22px;
  width: 4px;
  height: 4px;
  margin: 150px auto 0 auto;
  border-radius: 50%;
  color: #25b09b;
  box-shadow: calc(1 * var(--d)) calc(0 * var(--d)) 0 0,
    calc(0.707 * var(--d)) calc(0.707 * var(--d)) 0 1px,
    calc(0 * var(--d)) calc(1 * var(--d)) 0 2px,
    calc(-0.707 * var(--d)) calc(0.707 * var(--d)) 0 3px,
    calc(-1 * var(--d)) calc(0 * var(--d)) 0 4px,
    calc(-0.707 * var(--d)) calc(-0.707 * var(--d)) 0 5px,
    calc(0 * var(--d)) calc(-1 * var(--d)) 0 6px;
  animation: loader 1s infinite steps(8);
}

@keyframes loader {
  100% {
    transform: rotate(1turn);
  }
}
</style>
