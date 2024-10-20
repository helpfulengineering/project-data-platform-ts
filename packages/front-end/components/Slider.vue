<template>
  <div class="slider-container">
    <button class="prev-button" @click="prevSlide">‹</button>
    
    <!-- Slider images -->
    <div class="slider" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div class="slide" v-for="(image, index) in images" :key="index">
        <img :src="image" alt="Slider Image" />
      </div>
    </div>

    <button class="next-button" @click="nextSlide">›</button>

    <!-- Circles (Indicators) -->
    <div class="indicators">
      <span
        v-for="(image, index) in images"
        :key="index"
        :class="{ active: currentIndex === index }"
        @click="goToSlide(index)"
        class="indicator"
      ></span>
    </div>
  </div>
</template>

<script>
import { ListBulletIcon } from '@heroicons/vue/20/solid';

export default {
  data() {
    return {
      currentIndex: 0,
      interval: null
    };
  },
  methods: {
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    },
    prevSlide() {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    },
    goToSlide(index) {
      this.currentIndex = index;
    },
    startAutoSlide() {
      this.interval = setInterval(() => {
        this.nextSlide();
      }, 3000);
    },
    stopAutoSlide() {
      clearInterval(this.interval);
    }
  },
  mounted() {
    this.startAutoSlide();
  },
  beforeDestroy() {
    this.stopAutoSlide();
  },
  props:{
    images: {
      type: Array,
      required: true,
    },
  }
};
</script>

<style scoped>
.slider-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  overflow: hidden;
}

.prev-button, .next-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: #EFEFEF;
  border-radius: 100%;
  color: #2A3952;
  border: none;
  font-weight: 700;
  font-size: 28px;
  cursor: pointer;
  line-height: 12px;
  padding-bottom: 4px;
  z-index: 1;
  outline: none; 
  height: 33px;
  width: 33px;
}

.next-button {
  right:0; 
}

.prev-button:hover, .next-button:hover {
  background-color: #e7e7e7;
}

.slider {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.slide {
  min-width: 100%;
  box-sizing: border-box;
}

img {
  width: 100%;
  display: block;
}

.indicators {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.indicator {
  width: 16px;
  height: 16px;
  background-color: #D9D9D9;
  border-radius: 50%;
  margin: 0 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.indicator.active {
  background-color: #2A3952;
}

.indicator:hover {
  background-color: #2A3952;
}
</style>
