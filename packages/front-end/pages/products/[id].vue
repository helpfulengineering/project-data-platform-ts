<template>
  <div class="center m-10">
    <h1 class="text-xl pb-8">{{ product.name }}</h1>
    <img :src="product.image" alt="Product Image" class="size-48"/>
    <p>{{ product.description }}</p>
    <p>${{ product.price }}</p>
    <NuxtLink to="/">Back to List</NuxtLink>
  </div>
</template>

<script setup>
import { useRoute } from '#app'

const route = useRoute()
const productId = route.params.id

// Mock product data
const products = [
  { id: 1, name: 'Product A', description: 'Description A', price: 10.00, image: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg' },
  { id: 2, name: 'Product B', description: 'Description B', price: 20.00, image: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg' },
  { id: 3, name: 'Product C', description: 'Description C', price: 10.00, image: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg' },
  { id: 4, name: 'Product D', description: 'Description D', price: 20.00, image: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg' },
  { id: 5, name: 'Product A', description: 'Description A', price: 10.00, image: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-05.jpg' },
  { id: 6, name: 'Product B', description: 'Description B', price: 20.00, image: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-06.jpg' },
  { id: 7, name: 'Product C', description: 'Description C', price: 10.00, image: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-07.jpg' },
  { id: 8, name: 'Product D', description: 'Description D', price: 20.00, image: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-08.jpg' },
  { id: 9, name: 'Product A', description: 'Description A', price: 10.00, image: 'https://tailwindui.com/img/ecommerce-images/category-page-07-product-01.jpg' },
  { id: 10, name: 'Product B', description: 'Description B', price: 20.00, image: 'https://tailwindui.com/img/ecommerce-images/category-page-07-product-02.jpg' },
  { id: 11, name: 'Product C', description: 'Description C', price: 10.00, image: 'https://tailwindui.com/img/ecommerce-images/category-page-07-product-03.jpg' },
  { id: 12, name: 'Product D', description: 'Description D', price: 20.00, image: 'https://tailwindui.com/img/ecommerce-images/category-page-07-product-04.jpg' },
  // Add more products here
]

const product = products.find(p => p.id === parseInt(productId))
</script>

<style scoped>
/* Add your styles here */
</style>
