<script setup lang="ts">
import { useRoute, useRouter } from "#app";
import type { OKH_TYPE } from "../../types/OKH.type";
import {ref, computed } from 'vue';
import { formatKeywords, formatImages, formatKeywordsForQueryParam } from "~/utils/utils";



const route = useRoute();
const router = useRouter();

const baseUrl = useRuntimeConfig().public.baseUrl;

const productFilename = route.params.id as string;

// Check if product data is available in route query parameters (from OKH page)
const product = ref<any>({});
const sliderImages = ref<string[]>([]);
const status = ref('pending');
const error = ref(null);

// Track all available products for navigation
const allProducts = ref<any[]>([]);
const currentProductIndex = ref<number>(-1);

// Navigation methods
const showPreviousProduct = () => {
  if (currentProductIndex.value > 0) {
    const prevProduct = allProducts.value[currentProductIndex.value - 1];
    // Create the filename based on product name
    const filename = `${prevProduct.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    navigateToProduct(filename);
  }
};

const showNextProduct = () => {
  if (currentProductIndex.value < allProducts.value.length - 1) {
    const nextProduct = allProducts.value[currentProductIndex.value + 1];
    // Create the filename based on product name
    const filename = `${nextProduct.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    navigateToProduct(filename);
  }
};

const navigateToProduct = (filename: string) => {
  router.push(`/products/${filename}`);
};

// Determine if we should fetch data or if we already have data from router
async function fetchProductData() {
  try {
    status.value = 'pending';
    
    // First attempt: Try to get product data directly from OKHs endpoint
    // This ensures we can get data even if the file doesn't exist in storage
    console.log("Fetching from OKHs endpoint first");
    const okhResponse = await fetch(`${baseUrl}/getOKHs`);
    
    if (okhResponse.ok) {
      const okhData = await okhResponse.json();
      
      // Store all products for navigation between products
      allProducts.value = [];
      const productCategories = ['medical_products', 'automotive_products', 'consumer_products'];
      productCategories.forEach(category => {
        if (okhData[0]?.[category] && Array.isArray(okhData[0][category])) {
          allProducts.value = [...allProducts.value, ...okhData[0][category]];
        }
      });
      
      // Extract purename (without extension) for matching
      let purename = productFilename;
      if (productFilename.endsWith(".yml")) {
        purename = productFilename.slice(0, -4);
      } else if (productFilename.endsWith(".json")) {
        purename = productFilename.slice(0, -5);
      }
      
      // Attempt to find a product by name or ID in the OKH data
      let foundProduct = null;
      
      // Check in all product categories
      for (const category of productCategories) {
        if (okhData[0]?.[category]) {
          foundProduct = okhData[0][category].find(p => {
            // Match by multiple criteria:
            // 1. Exact filename match
            // 2. Sanitized name match
            // 3. ID match
            const sanitizedName = p.name.toLowerCase().replace(/\s+/g, '-');
            const nameMatch = sanitizedName === purename || 
                             `${sanitizedName}.json` === productFilename ||
                             `${sanitizedName}.yml` === productFilename;
            const idMatch = p.id.toString() === purename || p.id.toString() === productFilename;
            
            return nameMatch || idMatch;
          });
          if (foundProduct) break;
        }
      }
      
      if (foundProduct) {
        console.log("Product found in OKHs data:", foundProduct.name);
        // Find the index of the current product for navigation
        currentProductIndex.value = allProducts.value.findIndex(p => p.id === foundProduct.id);
        
        // Format the product data to match the expected format for display
        status.value = 'success';
        product.value = {
          ...foundProduct,
          title: foundProduct.name,
          description: foundProduct.shortDescription,
          version: "1.0",
          license: "Open Source",
          keywords: [foundProduct.name.split(' ')[0], "OKH", foundProduct.name.split(' ').slice(-1)[0]], // Create keywords from the name
          "manifest-author": { name: foundProduct.manifestAuthor || 'Unknown' },
          "manifest-language": "en",
          "okh-manifest-version": "1.0",
          "date-created": new Date().toISOString().split('T')[0],
          "date-updated": new Date().toISOString().split('T')[0],
          "development-stage": "prototype",
          "health-safety-notice": "Standard safety practices apply"
        };
        sliderImages.value = foundProduct.image ? [foundProduct.image] : [];
        return;
      }
    }
    
    // Second attempt: If product wasn't found in OKHs, try the getFile endpoint
    // Parse the filename to extract parts
    let purename = "";
    let fileExt = "";
    if (productFilename.endsWith(".yml")) {
      purename = productFilename.slice(0,-4);
      fileExt = "yml";
    } else if (productFilename.endsWith(".json")) {
      purename = productFilename.slice(0,-5);
      fileExt = "json";
    } else {
      // Default to treating it as a JSON file
      purename = productFilename;
      fileExt = "json";
    }
    
    // If we reach here, proceed with normal file fetching
    const url = baseUrl + "/getFile/okh/" + purename + "/" + fileExt;
    console.log("Fetching product from URL:", url);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Product not found. Please check the URL or return to the products page.`);
    }
    
    const data = await response.json();
    product.value = data.product;
    sliderImages.value = formatImages(data.product?.image);
    status.value = 'success';
  } catch (err) {
    console.error('Error fetching product:', err);
    error.value = err;
    status.value = 'error';
  }
}

// Fetch product data on component mount
fetchProductData();
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
        <!-- Custom Slider with Navigation -->  
        <div class="slider-container">
          <button class="prev-button" @click="showPreviousProduct" :disabled="currentProductIndex <= 0">
            ‹
          </button>
          
          <!-- Slider images -->
          <div class="slider">
            <div class="slide" v-for="(image, index) in sliderImages" :key="index">
              <img :src="image" alt="Product Image" />
            </div>
          </div>

          <button class="next-button" @click="showNextProduct" :disabled="currentProductIndex >= allProducts.length - 1">
            ›
          </button>
        </div>

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

        <div class="location">Available for use during crisis response</div>
        <p>{{ product?.description }}</p>
        <!-- <div class="review-wrap">
          <Reviews />
          <Reviews />
        </div> -->
        <div class="related-section">
          <h2 class="related-title">RELATED ITEMS</h2>
          <RelatedItems :keywords="formatKeywordsForQueryParam(product?.keywords)"/>
        </div>
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
/* Slider container styles */
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
  background-color: #FFFFFF;
  border-radius: 100%;
  color: #333333;
  border: none;
  font-weight: 700;
  font-size: 28px;
  cursor: pointer;
  line-height: 12px;
  padding-bottom: 4px;
  z-index: 10;
  outline: none; 
  height: 40px;
  width: 40px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}

.next-button {
  right: 10px;
}

.prev-button {
  left: 10px;
}

.prev-button:hover, .next-button:hover {
  background-color: #f0f0f0;
}

.prev-button:disabled, .next-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.slider {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.slide {
  min-width: 100%;
  box-sizing: border-box;
}

.slide img {
  width: 100%;
  display: block;
  border-radius: 4px;
}

.related-section {
  width: 100%;
  margin-top: 40px;
  border-top: 1px solid #e5e5e5;
  padding-top: 20px;
}

.related-title {
  color: #2a3952;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 20px 0;
  text-transform: uppercase;
  font-family: Arial, sans-serif;
}
</style>
