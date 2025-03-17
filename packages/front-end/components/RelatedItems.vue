<template>
  <div class="related-products">
    <h1 class="title">Related to items you’ve viewed</h1>
    <!-- error -->
    <div v-if="status === 'error'">error : {{ error?.message }}</div>
    <!-- loading -->
    <div v-if="status === 'pending'" class="loader"></div>
  <!-- success -->
    <div v-else-if="status === 'success'" class="related-product-wrap">
      <NuxtLink
        v-for="productSummary in okhdata.productSummaries"
        :to="`/products/${productSummary.fname}`"
        class="related-okh center mt-6"
        :key="productSummary.fname"
        :product="productSummary"
      >
        <img
          :src="productSummary.image"
          alt="Product Image"
          class="img-product"
        />
        <h1 class="name">{{ productSummary.name }}</h1>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  keywords: {
    type: String,
    required: true,
  },
});
console.log("props k", props);
const baseUrl = useRuntimeConfig().public.baseUrl;
const url = baseUrl + "/listOKHsummaries";
const {
  data: okhdata,
  error,
  status,
} = await useFetch(url, {
  lazy: true,
  query: {
    keywords: encodeURIComponent(props.keywords),
  },
});

watch(okhdata, (newData) => {
  if (newData) {
    console.log("Fetched Data: ", newData.productSummaries);
  }
});

// Mock product data
// const related_products = [
//   {
//     id: 1,
//     name: "IV Bag Hook",
//     image:
//       "https://field-ready-projects.openknowhow.org/images/HL003-attC88mXadLwq4sLy-400x300.jpg",
//     shortDescription: "For IV bags to be hung",
//   },
//   {
//     id: 2,
//     name: "Oxygen Supply Fitting",
//     image:
//       "https://field-ready-projects.openknowhow.org/images/HL002-attmlR243asYolZRO-400x300.jpg",
//     shortDescription:
//       "Adapter that connects oxygen supply tubing to standard oxygen systems",
//   },
//   {
//     id: 3,
//     name: "Umbilical Cord Clamp",
//     image:
//       "https://field-ready-projects.openknowhow.org/images/HL001-attG43ftDEHSUFPVG-400x300.jpg",
//     shortDescription:
//       "Enclosure of umbilical cords of newborns to prevent sepsis",
//   },
//   {
//     id: 4,
//     name: "Finger Brace",
//     image:
//       "https://field-ready-projects.openknowhow.org/images/HL005-attgxsUzHxoTnTmSP-400x300.jpg",
//     shortDescription: "In order to keep a injured index finger immobile",
//   },
//   {
//     id: 5,
//     name: "Water Truck Clamp",
//     image:
//       "https://field-ready-projects.openknowhow.org/images/WA012-attbQe9vW0QdVGkqD-400x300.jpg",
//     shortDescription:
//       "Clamps over the hose on the outlet of a water distribution truck to create a seal",
//   },
// ];
</script>

<style scoped>
.related-products {
  background-color: white;
  margin-bottom: 40px;

  .name {
    color: #2a3952;
    font-size: 16px;
  }

  .related-okh {
    margin: 20px 5px;
    width: 15%;
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
    flex-wrap: wrap;
  }
}
.loader {
  --d:22px;
  width: 4px;
  height: 4px;
  margin: 150px auto 0 auto;
  border-radius: 50%;
  color: #25b09b;
  box-shadow: 
    calc(1*var(--d))      calc(0*var(--d))     0 0,
    calc(0.707*var(--d))  calc(0.707*var(--d)) 0 1px,
    calc(0*var(--d))      calc(1*var(--d))     0 2px,
    calc(-0.707*var(--d)) calc(0.707*var(--d)) 0 3px,
    calc(-1*var(--d))     calc(0*var(--d))     0 4px,
    calc(-0.707*var(--d)) calc(-0.707*var(--d))0 5px,
    calc(0*var(--d))      calc(-1*var(--d))    0 6px;
  animation: loader 1s infinite steps(8);
}

@keyframes loader {
  100% {transform: rotate(1turn)}
}
</style>
