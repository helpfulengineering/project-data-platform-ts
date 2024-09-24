<template>
  <div class="container">
    <h1 class="main-title text-center m-8 text-2xl font-bold">
      HELPFUL TAGLINE / DESCRIPTION
    </h1>
    <div class="product-categories">
      <ProductGroup
      :products = medical_products
      title="MEDICAL SUPPLIES"
      />
      <ProductGroup
      :products = automotive_products
      title="AUTOMOTIVE"
      />
      <ProductGroup
      :products =consumer_products
      title="CONSUMER GOODS"
      />
    </div>
    <div class="related-items">
      <RelatedItems/>
    </div>
  </div>
</template>

<script>
import ProductGroup from "~/components/ProductGroup.vue"; // Import the ProductCard component

export default {
  components: {
    ProductGroup, // Register the component
  },
  data() {
    return {
      medical_products: [
        {
          id: 1,
          name: "Product A",
          image:
            "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg",
          shortDescription: "This is Product A",
        },
        {
          id: 2,
          name: "Product B",
          image:
            "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg",
          shortDescription: "This is Product B",
        },
        {
          id: 3,
          name: "Product C",
          image:
            "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg",
          shortDescription: "This is Product C",
        },
        {
          id: 4,
          name: "Product D",
          image:
            "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg",
          shortDescription: "This is Product D",
        },
      ],
      automotive_products: [
        {
          id: 5,
          name: "Product A",
          image:
            "https://tailwindui.com/img/ecommerce-images/category-page-05-image-card-01.jpg",
          shortDescription: "This is Product A",
        },
        {
          id: 6,
          name: "Product B",
          image:
            "https://tailwindui.com/img/ecommerce-images/category-page-05-image-card-05.jpg",
          shortDescription: "This is Product B",
        },
        {
          id: 7,
          name: "Product C",
          image:
            "https://tailwindui.com/img/ecommerce-images/category-page-05-image-card-07.jpg",
          shortDescription: "This is Product C",
        },
        {
          id: 8,
          name: "Product D",
          image:
            "https://tailwindui.com/img/ecommerce-images/category-page-05-image-card-08.jpg",
          shortDescription: "This is Product D",
        },
      ],
      consumer_products: [
        {
          id: 9,
          name: "Product A",
          image:
            "https://tailwindui.com/img/ecommerce-images/category-page-07-product-01.jpg",
          shortDescription: "This is Product A",
        },
        {
          id: 10,
          name: "Product B",
          image:
            "https://tailwindui.com/img/ecommerce-images/category-page-07-product-02.jpg",
          shortDescription: "This is Product B",
        },
        {
          id: 11,
          name: "Product C",
          image:
            "https://tailwindui.com/img/ecommerce-images/category-page-07-product-03.jpg",
          shortDescription: "This is Product C",
        },
        {
          id: 12,
          name: "Product D",
          image:
            "https://tailwindui.com/img/ecommerce-images/category-page-07-product-04.jpg",
          shortDescription: "This is Product D",
        },
      ],
    };
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
