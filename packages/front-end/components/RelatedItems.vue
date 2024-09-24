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
    name: "Product A",
    description: "Description A",
    price: 10.0,
    image:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg",
  },
  {
    id: 2,
    name: "Product B",
    description: "Description B",
    price: 20.0,
    image:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg",
  },
  {
    id: 3,
    name: "Product C",
    description: "Description C",
    price: 10.0,
    image:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg",
  },
  {
    id: 4,
    name: "Product D",
    description: "Description D",
    price: 20.0,
    image:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg",
  },
  {
    id: 5,
    name: "Product A",
    description: "Description A",
    price: 10.0,
    image:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-05.jpg",
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
    color: #2A3952;
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
