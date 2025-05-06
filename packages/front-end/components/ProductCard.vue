<!-- components/ProductCard.vue -->
<template>
  <NuxtLink :to="`/products/${product?.fname}`" class="product-card">
    <img :src="product?.image" alt="Product Image" class="product-image" />
    <h3 class="title">{{ product?.name }}</h3>
    <p class="author">{{ product?.manifestAuthor }}</p>
    <p class="description">{{ product?.shortDescription }}</p>
    <p class="project-link">{{ product?.projectLink }}</p>
  </NuxtLink>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  width: 23%;
  margin-bottom: 15px;
  text-align: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);

  .product-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 10px;
  }

  .author {
    font-size: 14px;
    /* font-weight: 500; */
    margin-bottom: 5px;
    text-align: left;
  }

  .description {
    color: #898888;
    font-size: 12px;
    font-weight: 500;
    text-align: left;
  }

  .project-link {
    color: #007bff;
    font-size: 12px;
    font-weight: 500;
    overflow-wrap: break-word;
    text-decoration: underline;
    text-align: left;
  }

  .title {
    color: #2a3952;
    font-size: 18px;
    font-weight: 600;
    text-align: left;
  }
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
