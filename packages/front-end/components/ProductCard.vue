<!-- components/ProductCard.vue -->
<template>
  <NuxtLink :to="`/products/${product.id}`" class="product-card">
    <img :src="product.image" alt="Product Image" class="product-image" />
    <h3>{{ product.name }}</h3>
    <!-- <p>{{ product.shortDescription }}</p> -->
  </NuxtLink>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  width: 200px;
  margin-bottom: 15px;
  text-align: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
}

.view-details {
  display: inline-block;
  margin-top: 10px;
  color: #007bff;
  text-decoration: none;
}

.view-details:hover {
  text-decoration: underline;
}
</style>
