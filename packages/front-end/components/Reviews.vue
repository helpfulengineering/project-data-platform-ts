<template>
  <div class="review-section">
    <h2>Customer Reviews</h2>
    <div v-for="(review, index) in reviews" :key="index" class="review">
      <h3>{{ review.name }}</h3>
      <div class="rating">
        <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= review.rating }">&#9733;</span>
      </div>
      <p>{{ review.comment }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      reviews: [
        { name: "Alice", comment: "Great service!", rating: 5 },
        { name: "John", comment: "Good experience, but could be better.", rating: 4 },
      ],
      newReview: {
        name: "",
        comment: "",
        rating: 0,
      },
    };
  },
  methods: {
    addReview() {
      if (this.newReview.name && this.newReview.comment && this.newReview.rating) {
        this.reviews.push({ ...this.newReview });
        this.newReview = { name: "", comment: "", rating: 0 };
      } else {
        alert("Please fill in all fields before submitting.");
      }
    },
  },
};
</script>

<style scoped>
.review-section {
  background-color: #EBEBEB;
  padding: 20px;
  width: 48%;
}

.review {
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.rating .star {
  color: #ddd;
}

.rating .star.filled {
  color: gold;
}

.add-review input,
.add-review textarea,
.add-review select {
  display: block;
  width: 100%;
  margin-bottom: 10px;
}
</style>
