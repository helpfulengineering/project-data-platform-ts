<template>
  <div class="related-product-list loading">
    <h2 class="skeleton skeleton-card-title">
      <!-- TRENDING: {{ title }} -->
    </h2>
    <div class="skeleton-related-products">
      <div class="skeleton skeleton-card"></div>
      <div class="skeleton skeleton-card"></div>
      <div class="skeleton skeleton-card"></div>
      <div class="skeleton skeleton-card"></div>
      <div class="skeleton skeleton-card"></div>
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

.skeleton-related-products {
  display: flex;
  justify-content: space-between;
}

.skeleton-card-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.skeleton-card {
  border-radius: 8px;
  padding-top: 50px;
  margin-top: 10px;
  height: 200px;
  width: 200px;
}
.skeleton-product-list {
  margin: 0 10px 50px 10px;
}
.skeleton-card-title {
  height: 20px;
}
.related-product-list.loading {
  background-color: white;
  padding: 20px;
  width: auto;
}
.skeleton {
  animation: skeleton-loading 1s linear infinite alternate;
}

@keyframes skeleton-loading {
  0% {
    background-color: hsl(240, 37%, 97%);
  }
  100% {
    background-color: hsl(0, 0%, 86%);
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
</style>
