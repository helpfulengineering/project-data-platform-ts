<script setup lang="ts">
import { useRoute } from "#app";
import type { OKH_TYPE } from "../../types/OKH.type";
import {ref, computed } from 'vue';
import { formatKeywords, formatImages } from "~/utils/utils";

const route = useRoute();

const baseUrl = useRuntimeConfig().public.baseUrl;

const productFilename = route.params.id as string;
// const [fname, fileExt] = productFilename.split(".");

// const url = baseUrl + "/getFile/okh/" + fname + "/" + fileExt;

const url = baseUrl + "/getFile/okh/" + productFilename



const { data, status, error } = await useFetch(url, {
  lazy: true,
});

const sliderImages = ref<string[]>([]);
const product = ref<any>({});

watchEffect(() => {
  product.value = data.value?.product;
  sliderImages.value = formatImages(data.value?.product?.image);
});
console.log("sliderImages",sliderImages)
// const { data, status, error, refresh   } = useAsyncData(url, () =>
//   $fetch(url)
// );
</script>

<template>
  <div class="product-detail-page">
    <div v-if="status === 'error'" class="error">
      error : {{ error?.message }}
    </div>
    <div
      v-if="status === 'pending'"
      class="loader skelton-card-group"
    >
    </div>
    <div v-else-if="product === null" class="no-product">
      <p>Product Not found.</p>
      <p>{{ url }}</p>
    </div>
    <div
      v-else-if="status === 'success'"
      class="product-detail container center m-10"
    >
      <div class="left">
        <Slider v-if="sliderImages.length > 0" :images="sliderImages"/>

        <div class="specification">Specifications</div>
        <div class="okh-details">
          <div>version</div>
          <div class="value">{{product?.version }}</div>
        </div>
        <div class="okh-details">
          <div>License</div>
          <div class="value">{{product?.license }}</div>
        </div>
        <div class="okh-details">
          <div>Licensor</div>
          <div class="value">
            <div>{{ product?.licensor?.name }}</div>
            <div>{{ product?.licensor?.email }}</div>
            <div>{{ product?.licensor?.affiliation }}</div>
          </div>
        </div>
        <div class="okh-details">
          <div>manifest author</div>
          <div class="value">
            <div>{{ product["manifest-author"]?.name }}</div>
            <div>{{ product["manifest-author"]?.email }}</div>
            <div>{{ product["manifest-author"]?.affiliation }}</div>
          </div>
        </div>
        <div class="okh-details">
          <div>manifest language</div>
          <div class="value">{{ product["manifest-language"] }}</div>
        </div>
        <div class="okh-details">
          <div>okh manifest version</div>
          <div class="value">{{ product["okh-manifest-version"] }}</div>
        </div>
        <div class="okh-details">
          <div>date created</div>
          <div class="value">{{ product["date-created"] }}</div>
        </div>
        <div class="okh-details">
          <div>date updated</div>
          <div class="value">{{ product["date-updated"] }}</div>
        </div>
        <div class="okh-details">
          <div>keywords</div>
          <div class="value">{{ formatKeywords(product?.keywords) }}</div>
          {{ console.log('Keywords:', formatKeywords(product?.keywords)) }}
        </div>
        <div class="okh-details">
          <div>contact</div>
          <div class="value">
            <div>{{ product?.contact?.name }}</div>
            <div>{{ product?.contact?.email }}</div>
            <div>{{ product?.contact?.affiliation }}</div>
          </div>
        </div>
        <div class="okh-details">
          <div>development stage</div>
          <div class="value">{{ product["development-stage"] }}</div>
        </div>
        <div class="okh-details">
          <div>health safety notice</div>
          <div class="value">{{ product["health-safety-notice"] }}</div>
        </div>
      </div>
      <div class="center">
        <h1 class="title">{{ product?.title }}</h1>

        <div class="location">Location, Country</div>
        <p>{{ product?.description }}</p>
        <div class="review-wrap">
          <Reviews />
          <Reviews />
        </div>
        <RelatedItems />
      </div>
      <div class="right">
        <button class="btn-primary">ORDER</button>
        <button class="btn-secondary">CONTACT SUPPLIER</button>
      </div>
      <!-- <NuxtLink to="/">Back to List</NuxtLink> -->
    </div>
  </div>
</template>

<style scoped>
.product-detail-page {
  margin: 130px auto 0 auto;

  .loading {
    font-size: 30px;
    color: red;
    background-color: green;
    margin: 100px 0;
    padding: 10px;
    z-index: 10000;
  }

  .error {
    margin: 100px 0;
    color: red;
    font-size: 20px;
  }
}

.product-detail {
  background-color: white;
  display: flex;
  justify-content: space-between;
  margin: 0px auto 40px auto;
  padding: 30px;

  .btn-primary {
    border-radius: 6px;
    background-color: #a6f671;
    color: black;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 10px;
    padding: 6px 20px;
    width: 100%;
  }

  .btn-secondary {
    border: 2px solid #d9d9d9;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 700;
    padding: 6px 20px;
  }

  .left {
    width: 300px;

    .okh-details {
      display: flex;
      font-weight: 500;
      justify-content: space-between;
      padding: 8px 4px;

      .value {
        color: #2a3952;
        font-size: 14px;
        font-weight: 400;
        text-align: right;
      }

      &:nth-child(even) {
        background-color: #ebebeb;
      }
    }

    .specification {
      color: #2a3952;
      font-size: 18px;
      font-weight: 700;
      margin: 30px 0 5px 0;
    }
  }

  .location {
    padding-bottom: 25px;
  }

  .center {
    width: calc(100% - 600px);
  }

  .review-wrap {
    display: flex;
    justify-content: space-between;
    margin: 40px 0 20px 0;
  }

  .right {
    align-items: start;
    display: flex;
    flex-direction: column;
    padding-top: 84px;
  }

  .title {
    color: #2a3952;
    font-size: 24px;
    font-weight: 700;
  }


}

.loader {
  --d:22px;
  width: 4px;
  height: 4px;
  margin: 300px auto 0 auto;
  border-radius: 50%;
  color: #25b09b;
  box-shadow:
    calc(1*var(--d))      calc(0*var(--d))     0 0,
    calc(0.707*var(--d))  calc(0.707*var(--d)) 0 1px,
    calc(0*var(--d))      calc(1*var(--d))     0 2px,
    calc(-0.707*var(--d)) calc(0.707*var(--d)) 0 3px,
    calc(-1*var(--d))     calc(0*var(--d))     0 4px,
    calc(-0.707*var(--d)) calc(-0.707*var(--d))0 5px,
    calc(0*var(--d))      calc(-1*var(--d))    0 6px;
  animation: loader 1s infinite steps(8);
}

@keyframes loader {
  100% {transform: rotate(1turn)}
}

@media only screen and (min-width: 1536px) {
  .product-detail {
    &.container {
      max-width: 1400px;
    }
  }
}
</style>
