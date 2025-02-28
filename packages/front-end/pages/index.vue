<script setup lang="ts">
const baseUrl = useRuntimeConfig().public.baseUrl;
// const baseUrl = 'http://demo4460398.mockable.io/api';

const url = baseUrl + "/listOKHsummaries";
const {
  data: okhdata,
  error,
  status,
} = await useFetch(url);
</script>

<template>
  <div class="container">
    <h1 class="main-title text-center m-8 text-2xl font-bold">
      HELPFUL TAGLINE / DESCRIPTION
    </h1>
    {{console.log("status", status)}}
    <div v-if="status === 'error'">error : {{ error?.message }}</div>
    <!-- loading -->
    <div v-if="status === 'pending'" class="loading skelton-card-group" style="color: red">
      loading
      {{console.log("status loading", status)}}
      <!-- <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard /> -->
    </div>
    <div v-else-if="status === 'success'"  class="product-categories">
      {{ console.log("XXXXXXXXXXXXXXXX", okhdata) }}
      <ProductGroup :products="okhdata.productSummaries" title="Products" />
    </div>

    <div v-if="status === 'success'" class="related-items">
      <RelatedItems />
    </div>
    <!-- <div v-if="loading" class="loading related-items">
      <SkeletonRelatedItems />
    </div> -->
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

.loading {
  font-size: 30px;
  color: red;
  background-color: green;
}
</style>
