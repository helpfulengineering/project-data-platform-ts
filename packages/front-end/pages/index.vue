<script setup lang="ts">
     const baseUrl = useRuntimeConfig().public.baseUrl;
     const url = baseUrl + '/getOKHs';
     console.log("url",url);
const { data : products, status, error, refresh, clear } =
    await useFetch(url);
</script>


<template>
  <div class="container">
    <h1 class="main-title text-center m-8 text-2xl font-bold">
      HELPFUL TAGLINE / DESCRIPTION
</h1>
    <div class="product-categories">
      <ProductGroup
:products = products[0].medical_products
      title="MEDICAL SUPPLIES"
      />
      <ProductGroup
      :products =  products[0].automotive_products
      title="AUTOMOTIVE"
      />
      <ProductGroup
      :products =  products[0].consumer_products
      title="CONSUMER GOODS"
      />
    </div>
    <div class="related-items">
      <RelatedItems/>
    </div>
  </div>
</template>

<script lang="ts">
import ProductGroup from "~/components/ProductGroup.vue"; // Import the ProductCard component

export default {
  components: {
    ProductGroup, // Register the component
  },
};
</script>

<style scoped>
.container {
  margin: 0 auto;
}

.main-title {
  color: #2A3952;
  margin-top: 130px;
}

.product-list {
  background-color: white;
  padding: 15px;
  margin-bottom: 50px;
  width: 450px;
}

.product-categories {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
