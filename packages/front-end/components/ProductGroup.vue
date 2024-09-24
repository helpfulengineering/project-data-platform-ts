<template>
  <div class="product-list">
    <h2 class="card-title uppercase text-center font-semibold">
      TRENDING: {{ title }}
    </h2>
    <div class="flex flex-wrap justify-between">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    products: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style>
.card-title {
  color: #2a3952;
  font-weight: 700;
  margin-bottom: 5px;
}
</style>
