<template>
  <div class="product-detail container center m-10">
    <div class="left">
<!--    <Slider :images="data.product?.image" /> -->

      <div class="specification">Specifications</div>
      <div class="okh-details">
        <div>version</div>
        <div class="value">{{ data.product?.version }}</div>
      </div>
      <div class="okh-details">
        <div>License</div>
        <div class="value">{{ data.product?.license }}</div>
      </div>
      <div class="okh-details">
        <div>Licensor</div>
        <div class="value">
          <div>{{ data.product?.licensor.name }}</div>
          <div>{{ data.product?.licensor.email }}</div>
          <div>{{ data.product?.licensor.affiliation }}</div>
        </div>
      </div>
      <div class="okh-details">
        <div>manifest author</div>
        <div class="value">
          <div>{{ data.product["manifest-author"].name }}</div>
          <div>{{ data.product["manifest-author"].email }}</div>
          <div>{{ data.product["manifest-author"].affiliation }}</div>
        </div>
      </div>
      <div class="okh-details">
        <div>manifest language</div>
        <div class="value">{{ data.product["manifest-language"] }}</div>
      </div>
      <div class="okh-details">
        <div>okh manifest version</div>
        <div class="value">{{ data.product["okh-manifest-version"] }}</div>
      </div>
      <div class="okh-details">
        <div>date created</div>
        <div class="value">{{ data.product["date-created"] }}</div>
      </div>
      <div class="okh-details">
        <div>date updated</div>
        <div class="value">{{ data.product["date-updated"] }}</div>
      </div>
      <div class="okh-details">
        <div>keywords</div>
        <div class="value">{{ data.product?.keywords?.join(", ") }}</div>
      </div>
      <div class="okh-details">
        <div>contact</div>
        <div class="value">
          <div>{{ data.product.contact.name }}</div>
          <div>{{ data.product.contact.email }}</div>
          <div>{{ data.product.contact.affiliation }}</div>
        </div>
      </div>
      <div class="okh-details">
        <div>development stage</div>
        <div class="value">{{ data.product["development-stage"] }}</div>
      </div>
      <div class="okh-details">
        <div>health safety notice</div>
        <div class="value">{{ data.product["health-safety-notice"] }}</div>
      </div>
    </div>
    <div class="center">
      <h1 class="title">{{ data.product?.title }}</h1>

      <div class="location">Location, Country</div>
      <p>{{ data.product?.description }}</p>
      <div class="review-wrap">
        <Reviews />
        <Reviews />
      </div>
 <!--  <RelatedItems /> -->
    </div>
    <div class="right">
      <button class="btn-primary">ORDER</button>
      <button class="btn-secondary">CONTACT SUPPLIER</button>
    </div>
    <!-- <NuxtLink to="/">Back to List</NuxtLink> -->
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "#app";
import type { OKH_TYPE } from "../../types/OKH.type";

const route = useRoute();

// Apparently This is being called with a large number of values which
// are incorrect. I do not know why. I suppose this might have to
// do with the idea of "eager fetching". I am going to attempt
// to at least have this identify this and fail!

// changing this to a filename..
const productFilename = route.params.id as string;

console.log("productFilename", productFilename);

const productId = route.params.id as string;

const baseUrl = useRuntimeConfig().public.baseUrl;

const [fname, fileExt] = productFilename.split(".");

console.log("fname", fname);
console.log("fileext", fileExt);

//if (!fileExt) {
//    console.log("no fileExt, we are returning in hopes of avoiding problems. Why this URL is provided, we know not:\n");
//    console.log(route);
//} else {

    const url = baseUrl + "/getFile/okh/" + fname + "/" + fileExt;
    const loading = "loading";
    const success = "success";
    console.log("url", url);
    const { data, status, error, refresh, clear } = await useFetch(url);
    // const { data, status, error, refresh, clear } = await $fetch(url);

    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
//}
</script>

<style scoped>
.product-detail {
  background-color: white;
  display: flex;
  justify-content: space-between;
  margin: 130px auto 40px auto;
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

@media only screen and (min-width: 1536px) {
  .product-detail {
    &.container {
      max-width: 1400px;
    }
  }
}
</style>
