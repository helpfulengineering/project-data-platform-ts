<script setup lang="ts">
    import { onMounted, ref, computed } from 'vue';

/**
 * Supply Graph AI Integration Notes:
 *
 * This component demonstrates integration between project-data-platform-ts and the supply-graph-ai service.
 * The integration flow is:
 * 1. Fetch OKH data from project-data-platform-ts backend (/api/getOKHs)
 * 2. POST selected OKH to supply-graph-ai endpoint (/v1/supply-tree/create)
 * 3. Display the resulting supply tree
 *
 * Integration attempts:
 * - Initial attempt used direct fetch to supply-graph-ai at /supply-tree/create
 * - Second attempt tried adding /api prefix: /api/supply-tree/create
 * - Current attempt uses versioned endpoint: /v1/supply-tree/create
 * - Added CORS headers and mode: 'cors' to fetch options
 * - Added fallback to mock data when API calls fail
 *
 * Known issues:
 * - CORS preflight OPTIONS requests return 404
 * - Direct API access fails with "Failed to fetch"
 * - May need proxy configuration in development or proper CORS setup on supply-graph-ai
 */

const data1 = ref<any>(null);
const data2 = ref<any>(null);
const okhData = ref<any>([]);
const supplyTreeData = ref<any>(null);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const selectedOkh = ref<any>(null);

// API configuration
const apiBaseUrl = ref(process.env.VITE_API_BASE_URL || 'http://localhost:7071/api');
// TODO: make this configurable, and understand if it will always be 8001.
const supplyGraphApiUrl = ref(process.env.VITE_SUPPLY_GRAPH_AI_URL || 'http://localhost:8001');
const supplyGraphApiEndpoint = ref('/v1/supply-tree/create'); // Path to the versioned supply tree creation endpoint

// Example OKH data
const mockOKHData = [
  {
    id: 1,
    name: "N95 Respirator",
    shortDescription: "Medical-grade respiratory protection against airborne particles",
    image: "https://example.com/n95.jpg",
    keywords: ["mask", "medical", "protection", "respirator"],
    maker: "3M Healthcare",
    whereToFind: "Medical supply distributors"
  },
  {
    id: 2,
    name: "Ventilator",
    shortDescription: "Medical device for assisting or replacing breathing function",
    image: "https://example.com/ventilator.jpg",
    keywords: ["medical", "breathing", "emergency", "hospital"],
    maker: "Philips Respironics",
    whereToFind: "Hospital equipment suppliers"
  },
  {
    id: 3,
    name: "Pulse Oximeter",
    shortDescription: "Non-invasive device measuring oxygen saturation in the blood",
    image: "https://example.com/oximeter.jpg",
    keywords: ["medical", "oxygen", "monitoring"],
    maker: "Nonin Medical",
    whereToFind: "Medical retailers"
  },
  {
    id: 4,
    name: "Face Shield",
    shortDescription: "Protective equipment covering the entire face from splashes and sprays",
    image: "https://example.com/faceshield.jpg",
    keywords: ["protection", "face", "medical", "PPE"],
    maker: "Various manufacturers",
    whereToFind: "Medical supply stores"
  },
  {
    id: 5,
    name: "Hand Sanitizer",
    shortDescription: "Alcohol-based hand rub for disinfection",
    image: "https://example.com/sanitizer.jpg",
    keywords: ["hygiene", "disinfectant", "cleaning"],
    maker: "Various manufacturers",
    whereToFind: "Pharmacies, grocery stores"
  }
];

const fetchData = async () => {
  try {
    // Use mock data examples to simulate API responses
    data1.value = { message: "Mock OKH data response" };
    data2.value = { message: "Mock OKW creation response", status: "success" };

    console.log('Mock Data1:', data1.value);
    console.log('Mock Data2:', data2.value);
  } catch (error) {
    console.error('Error with mock data:', error);
  }
};

const fetchOkhData = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Make real API call to fetch OKH data
      //    const response = await fetch(`${apiBaseUrl.value}/getOKHs`);
    const response = await fetch(`${apiBaseUrl.value}/listOKHsummaries`);

    if (!response.ok) {
      throw new Error(`Error fetching OKH data: ${response.statusText}`);
    }

    const data = await response.json();

    // Check if data is in the expected format
    if (data && Array.isArray(data.summaries)) {
      okhData.value = data.summaries;
    } else if (data && data.items && Array.isArray(data.items)) {
      // Handle potential API response format with items array
      okhData.value = data.items;
    } else {
      // Fallback to mock data if API doesn't return expected format
      console.warn('API response format unexpected, using mock data instead');
      okhData.value = mockOKHData;
    }

    console.log('OKH Data:', okhData.value);
  } catch (err) {
    console.error('Error fetching OKH data:', err);
    error.value = `Failed to load OKH data: ${err.message}`;

    // Fallback to mock data in case of error
    console.warn('Using mock data due to API error');
    okhData.value = mockOKHData;
  } finally {
    loading.value = false;
  }
};

const sendToSupplyGraphAI = async (okhItem) => {
  if (!okhItem) {
    error.value = "No OKH item selected";
    return;
  }

  loading.value = true;
  error.value = null;
  selectedOkh.value = okhItem;

  try {
    // Prepare the request payload for supply-graph-ai
    // Using the model from the supply-graph-ai API
    const payload = {
      okh_reference: okhItem.id?.toString() || okhItem.fname,
      required_quantity: 1,
      deadline: null,
      metadata: {
        name: okhItem.name,
        shortDescription: okhItem.shortDescription,
        keywords: okhItem.keywords || [],
        maker: okhItem.maker,
        source: "project-data-platform"
      }
    };

    console.log('Sending payload to Supply Graph AI:', payload);

    // Make POST request to supply-graph-ai endpoint
    // Using the corrected endpoint path with v1 prefix
    const response = await fetch(`${supplyGraphApiUrl.value}${supplyGraphApiEndpoint.value}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Add CORS headers if needed for local development
        'Origin': window.location.origin,
      },
      mode: 'cors', // Explicitly request CORS mode
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Error from supply-graph-ai: ${response.status} ${response.statusText}` +
        (errorData ? ` - ${JSON.stringify(errorData)}` : '')
      );
    }

    // Parse the response
    const supplyTreeResponse = await response.json();
    console.log('Supply Graph AI Response:', supplyTreeResponse);

    // Format the response for our UI
    // Adjust this based on the actual response format from the API
    supplyTreeData.value = {
      rootItem: selectedOkh.value,
      relatedComponents: supplyTreeResponse.components || [],
      supplyChainDepth: supplyTreeResponse.depth || 1,
      analysisTimestamp: supplyTreeResponse.creation_time || new Date().toISOString(),
      analysisMethod: "supply-graph-ai"
    };

    // Fallback to mock data if API returns empty response
    if (!supplyTreeResponse || Object.keys(supplyTreeResponse).length === 0) {
      console.warn('Empty response from Supply Graph AI API, generating mock data');

      // Generate mock related components based on the selected item's keywords
      const relatedComponents = mockOKHData
        .filter(item => item.id !== okhItem.id) // Don't include the current item
        .filter(item => {
          // Simple keyword matching logic
          if (!okhItem.keywords || !item.keywords) return false;

          return okhItem.keywords.some(keyword =>
            item.keywords.includes(keyword));
        })
        .map(item => ({
          id: item.id,
          name: item.name,
          shortDescription: item.shortDescription,
          image: item.image,
          maker: item.maker,
          supplyRelation: Math.random() > 0.5 ? "component" : "accessory"
        }));

      // Add fallback components if needed
      if (relatedComponents.length < 2) {
        const randomItems = mockOKHData
          .filter(item =>
            item.id !== okhItem.id &&
            !relatedComponents.find(rc => rc.id === item.id))
          .slice(0, 2)
          .map(item => ({
            id: item.id,
            name: item.name,
            shortDescription: item.shortDescription,
            image: item.image,
            maker: item.maker,
            supplyRelation: "alternative"
          }));

        relatedComponents.push(...randomItems);
      }
      // Create mock supply tree response
      supplyTreeData.value = {
        rootItem: selectedOkh.value,
        relatedComponents,
        supplyChainDepth: Math.floor(Math.random() * 3) + 1,
        analysisTimestamp: new Date().toISOString(),
        analysisMethod: "fallback-mock-data"
      };
    }

    console.log('Final Supply Tree Data:', supplyTreeData.value);
  } catch (err) {
    console.error('Error generating supply tree:', err);
    error.value = `Failed to generate supply tree: ${err.message}`;

    // Optionally fall back to mock data on error
    // Uncomment this if you want fallback behavior on API errors
    /*
    console.warn('Using mock data due to API error');
    // Create mock supply tree response similar to above
    */
  } finally {
    loading.value = false;
  }
};

// Add a function to check if the supply graph API is available
const checkSupplyGraphApiAvailability = async () => {
  try {
    // Try to check API health/availability endpoints
    // Common FastAPI health endpoints or OpenAPI docs paths
    const endpoints = [
      '/docs',
      '/openapi.json',
      '/health',
      '/v1/docs',
      '/v1/openapi.json'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${supplyGraphApiUrl.value}${endpoint}`, {
          method: 'HEAD',
          timeout: 1000 // Short timeout for quick check
        });
        if (response.ok) {
          console.log(`Supply Graph AI API is available at endpoint: ${endpoint}`);
          return true;
        }
      } catch (e) {
        // Ignore individual endpoint errors and try next
      }
    }

    // No endpoint was successful
    console.warn('Could not verify supply-graph-ai availability on any endpoint');
    return false;
  } catch (error) {
    console.warn('Supply Graph AI API may not be available:', error);
    return false;
  }
};

onMounted(async () => {
  // Check if supply graph API is available
  const isSupplyGraphApiAvailable = await checkSupplyGraphApiAvailability();
  if (!isSupplyGraphApiAvailable) {
    console.warn('Supply Graph AI API is not available. Will use mock data as fallback.');
  }

//  fetchData();
  fetchOkhData();
});
</script>

<template>
  <section>
    <h1 class="text-2xl font-bold tracking-tight text-red-900">
      Supply Graph API Test Page
    </h1>
    <p class="mb-4">
      This page allows testing of
      <a href="https://github.com/helpfulengineering/supply-graph-ai" class="text-blue-600 hover:underline">
        Supply Graph AI API
      </a>
    </p>

    <!-- API endpoint info -->
    <div class="p-2 bg-yellow-50 text-yellow-700 text-sm rounded mb-4">
      <span class="font-semibold">Note:</span> Using supply-graph-ai endpoint: {{ supplyGraphApiUrl }}{{ supplyGraphApiEndpoint }}
      <br>
      <span class="text-xs">This page attempts to make real API calls but will fall back to mock data if needed.</span>
    </div>

    <!-- Loading and Error Messages -->
    <div v-if="loading" class="p-4 bg-blue-100 rounded mb-4">
      Loading data...
    </div>
    <div v-if="error" class="p-4 bg-red-100 text-red-700 rounded mb-4">
      {{ error }}
    </div>

    <!-- OKH Data Display -->
    <div class="mt-6">
      <h2 class="text-xl font-semibold mb-2">Available OKH Items:</h2>
      <div v-if="okhData && okhData.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="(item, index) in okhData"
          :key="index"
          class="p-4 border rounded shadow hover:shadow-md cursor-pointer"
          :class="{ 'bg-blue-50': selectedOkh === item }"
          @click="sendToSupplyGraphAI(item)">
          <h3 class="font-semibold">{{ item.name || 'Unknown Item' }}</h3>
          <p class="text-sm text-gray-600">{{ item.shortDescription || 'No description available' }}</p>
          <p class="text-xs text-gray-500 mt-2">Click to generate supply tree</p>
        </div>
      </div>
      <div v-else-if="!loading && !error" class="p-4 bg-gray-100 rounded">
        No OKH items available
      </div>
    </div>

    <!-- Supply Tree Data Display -->
    <div v-if="supplyTreeData" class="mt-8">
      <h2 class="text-xl font-semibold mb-2">Supply Tree for: {{ selectedOkh?.name }}</h2>

      <!-- Visual representation of the supply tree -->
      <div class="p-4 bg-white rounded shadow mb-4">
        <div class="flex flex-col">
          <!-- Root node -->
          <div class="bg-blue-100 p-4 rounded mb-4 border border-blue-300">
            <h3 class="font-bold">{{ supplyTreeData.rootItem.name }}</h3>
            <p class="text-sm text-gray-600">{{ supplyTreeData.rootItem.shortDescription }}</p>
          </div>

          <!-- Related components/nodes -->
          <div class="pl-8 border-l-2 border-blue-300">
            <h4 class="font-semibold mb-2">Related Components:</h4>
            <div class="grid grid-cols-1 gap-2">
              <div
                v-for="(component, index) in supplyTreeData.relatedComponents"
                :key="index"
                class="bg-gray-50 p-3 rounded border border-gray-300"
              >
                <h5 class="font-medium">{{ component.name }}</h5>
                <p class="text-xs text-gray-500">{{ component.shortDescription }}</p>
              </div>
            </div>
          </div>

          <!-- Analysis info -->
          <div class="mt-4 text-xs text-gray-500">
            <p>Supply chain depth: {{ supplyTreeData.supplyChainDepth }}</p>
            <p>Analysis timestamp: {{ supplyTreeData.analysisTimestamp }}</p>
            <p>Method: {{ supplyTreeData.analysisMethod }}</p>
          </div>
        </div>
      </div>

      <!-- JSON representation -->
      <details>
        <summary class="cursor-pointer text-blue-600 hover:text-blue-800">Show raw data</summary>
        <pre class="p-4 bg-gray-100 rounded overflow-auto max-h-96 mt-2">{{ JSON.stringify(supplyTreeData, null, 2) }}</pre>
      </details>
    </div>

    <!-- Mock API Test Data -->
    <div class="mt-8 pt-6 border-t">
      <h2 class="text-xl font-semibold mb-4">Mock API Test Data</h2>

      <div class="mb-6">
        <h3 class="text-lg font-semibold">Mock Data 1 (GET /api/getOKH):</h3>
        <pre class="p-4 bg-gray-100 rounded overflow-auto max-h-60">{{ data1 }}</pre>
      </div>

      <div>
        <h3 class="text-lg font-semibold">Mock Data 2 (POST /api/createOKW):</h3>
        <pre class="p-4 bg-gray-100 rounded overflow-auto max-h-60">{{ data2 }}</pre>
      </div>
    </div>
  </section>
</template>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
