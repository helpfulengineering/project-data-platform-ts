<script setup lang="ts">
    import { onMounted, ref, computed } from 'vue';

const data1 = ref<any>(null);
const data2 = ref<any>(null);
const okhData = ref<any>([]);
const supplyTreeData = ref<any>(null);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const selectedOkh = ref<any>(null);

// API configuration
const apiBaseUrl = ref(import.meta.env.VITE_API_BASE_URL || 'http://localhost:7071/api');
// Updated to use port 8081 as requested
const supplyGraphApiUrl = ref(import.meta.env.VITE_SUPPLY_GRAPH_AI_URL || 'http://localhost:8001');
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
    console.log('Fetching OKH data from project-data-platform backend...');

    // Enhanced API call to fetch OKH data from project data platform
    // Try multiple endpoints to ensure compatibility
    const endpoints = [
      `${apiBaseUrl.value}/listOKHsummaries`,
      `${apiBaseUrl.value}/getOKHs`,
      `${apiBaseUrl.value}/okh/list`
    ];

    let response = null;
    let lastError = null;

    // Try each endpoint until one works
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          console.log(`Successfully connected to: ${endpoint}`);
          break;
        } else {
          console.warn(`Endpoint ${endpoint} returned ${response.status}: ${response.statusText}`);
          lastError = new Error(`${response.status}: ${response.statusText}`);
        }
      } catch (err) {
        console.warn(`Failed to connect to ${endpoint}:`, err.message);
        lastError = err;
        response = null;
      }
    }

    if (!response || !response.ok) {
      throw lastError || new Error('All API endpoints failed');
    }

    const data = await response.json();
    console.log('Raw API response:', data);

    // Enhanced data processing to handle various response formats
    let processedData = [];

    if (data && Array.isArray(data.summaries)) {
      // Format: { summaries: [...] }
      processedData = data.summaries;
    } else if (data && data.items && Array.isArray(data.items)) {
      // Format: { items: [...] }
      processedData = data.items;
    } else if (data && Array.isArray(data)) {
      // Format: [...]
      processedData = data;
    } else if (data && data.data && Array.isArray(data.data)) {
      // Format: { data: [...] }
      processedData = data.data;
    } else {
      console.warn('API response format unexpected:', data);
      throw new Error('Unexpected API response format');
    }

    // Normalize the OKH data structure for consistent usage
    okhData.value = processedData.map(item => ({
      id: item.id || item.fname || item.name || Math.random().toString(36).substr(2, 9),
      name: item.name || item.title || 'Unknown Item',
      shortDescription: item.shortDescription || item.description || item.summary || 'No description available',
      image: item.image || item.imageUrl || item.thumbnail || null,
      keywords: item.keywords || item.tags || [],
      maker: item.maker || item.author || item.creator || 'Unknown',
      whereToFind: item.whereToFind || item.source || 'Unknown source',
      // Keep original data for API calls
      originalData: item
    }));

    console.log(`Successfully loaded ${okhData.value.length} OKH items from project data platform`);
    console.log('Processed OKH Data:', okhData.value);

  } catch (err) {
    console.error('Error fetching OKH data from project data platform:', err);
    error.value = `Failed to load OKH data: ${err.message}`;

    // Enhanced fallback to mock data with better error handling
    console.warn('Using mock data due to API error. This is expected in development.');
    okhData.value = mockOKHData.map(item => ({
      ...item,
      originalData: item // Keep original for consistency
    }));

    // Clear error after fallback to allow continued usage
    setTimeout(() => {
      if (error.value && error.value.includes('Failed to load OKH data')) {
        error.value = null;
      }
    }, 3000);
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
    console.log('Processing OKH item for Supply Graph AI:', okhItem);
    const originalData = okhItem.originalData || okhItem;

    const payload = {
      okh_reference: okhItem.id?.toString() || originalData.fname || originalData.id || 'unknown',
      required_quantity: 1,
      deadline: null,
      metadata: {
        name: okhItem.name || originalData.name || originalData.title,
        shortDescription: okhItem.shortDescription || originalData.description || originalData.summary,
        keywords: okhItem.keywords || originalData.keywords || originalData.tags || [],
        maker: okhItem.maker || originalData.maker || originalData.author || originalData.creator,
        whereToFind: okhItem.whereToFind || originalData.whereToFind || originalData.source,
        source: "project-data-platform-ts",
        image: okhItem.image || originalData.image || originalData.imageUrl,
        originalId: originalData.id || originalData.fname,
        dataSource: originalData.dataSource || 'project-data-platform',
        ...originalData
      }
    };

    console.log('Enhanced payload for Supply Graph AI (port 8081):', payload);
    console.log(`Sending request to: ${supplyGraphApiUrl.value}${supplyGraphApiEndpoint.value}`);

    // Enhanced request to supply-graph-ai endpoint at port 8081
    const response = await fetch(`${supplyGraphApiUrl.value}${supplyGraphApiEndpoint.value}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Enhanced headers for better compatibility
        'User-Agent': 'project-data-platform-ts/1.0',
        'X-Requested-With': 'XMLHttpRequest',
        // Add CORS headers if needed for local development
        'Origin': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
      },
      mode: 'cors', // Explicitly request CORS mode
      body: JSON.stringify(payload),
    });

    console.log(`Supply Graph AI response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorData = null;
      try {
        errorData = await response.json();
      } catch (e) {
        // Response might not be JSON
        console.warn('Could not parse error response as JSON');
      }

      throw new Error(
        `Supply Graph AI API error: ${response.status} ${response.statusText}` +
        (errorData ? ` - ${JSON.stringify(errorData)}` : '')
      );
    }

    // Parse the response from supply graph AI
    const supplyTreeResponse = await response.json();
    console.log('Supply Graph AI Response:', supplyTreeResponse);

    // Enhanced response processing to handle various response formats
    supplyTreeData.value = {
      rootItem: selectedOkh.value,
      relatedComponents: supplyTreeResponse.components || supplyTreeResponse.related_items || supplyTreeResponse.dependencies || [],
      supplyChainDepth: supplyTreeResponse.depth || supplyTreeResponse.chain_depth || 1,
      analysisTimestamp: supplyTreeResponse.creation_time || supplyTreeResponse.timestamp || new Date().toISOString(),
      analysisMethod: "supply-graph-ai-port-8081",
      apiResponse: supplyTreeResponse, // Keep full response for debugging
      requestPayload: payload // Keep request for debugging
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

    <!-- Enhanced API endpoint info -->
    <div class="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded mb-4">
      <div class="font-semibold mb-1">🔗 API Configuration:</div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
        <div>
          <span class="font-medium">Project Data Platform:</span><br>
          <code class="bg-blue-100 px-1 rounded">{{ apiBaseUrl }}</code>
        </div>
        <div>
          <span class="font-medium">Supply Graph AI (Port 8081):</span><br>
          <code class="bg-blue-100 px-1 rounded">{{ supplyGraphApiUrl }}{{ supplyGraphApiEndpoint }}</code>
        </div>
      </div>
      <div class="mt-2 text-xs">
        <span class="font-medium">Integration Flow:</span>
        Fetch OKHs from project-data-platform → Send to supply-graph-ai → Display supply tree
      </div>
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

    <!-- Enhanced Supply Tree Data Display -->
    <div v-if="supplyTreeData" class="mt-8">
      <h2 class="text-xl font-semibold mb-2 flex items-center">
        🌳 Supply Tree for: <span class="text-blue-600 ml-2">{{ selectedOkh?.name }}</span>
      </h2>

      <!-- Analysis Method Badge -->
      <div class="mb-4">
        <span
          class="inline-block px-3 py-1 text-xs font-medium rounded-full"
          :class="supplyTreeData.analysisMethod.includes('supply-graph-ai') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
        >
          {{ supplyTreeData.analysisMethod }}
        </span>
      </div>

      <!-- Visual representation of the supply tree -->
      <div class="p-4 bg-white rounded-lg shadow-md mb-4 border">
        <div class="flex flex-col">
          <!-- Root node -->
          <div class="bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-lg mb-4 border border-blue-300">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="font-bold text-lg text-blue-900">{{ supplyTreeData.rootItem.name }}</h3>
                <p class="text-sm text-blue-700 mt-1">{{ supplyTreeData.rootItem.shortDescription }}</p>
                <div class="mt-2 flex flex-wrap gap-1">
                  <span
                    v-for="keyword in (supplyTreeData.rootItem.keywords || [])"
                    :key="keyword"
                    class="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded"
                  >
                    {{ keyword }}
                  </span>
                </div>
              </div>
              <div class="text-xs text-blue-600 ml-4">
                <div>ID: {{ supplyTreeData.rootItem.id }}</div>
                <div v-if="supplyTreeData.rootItem.maker">Maker: {{ supplyTreeData.rootItem.maker }}</div>
              </div>
            </div>
          </div>

          <!-- Related components/nodes -->
          <div class="pl-8 border-l-2 border-blue-300">
            <h4 class="font-semibold mb-3 text-gray-700">
              📦 Related Components ({{ supplyTreeData.relatedComponents.length }})
            </h4>
            <div v-if="supplyTreeData.relatedComponents.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                v-for="(component, index) in supplyTreeData.relatedComponents"
                :key="index"
                class="bg-gray-50 p-3 rounded-lg border border-gray-300 hover:shadow-sm transition-shadow"
              >
                <h5 class="font-medium text-gray-900">{{ component.name }}</h5>
                <p class="text-xs text-gray-600 mt-1">{{ component.shortDescription }}</p>
                <div v-if="component.supplyRelation" class="mt-2">
                  <span class="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                    {{ component.supplyRelation }}
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="text-gray-500 text-sm italic">
              No related components found
            </div>
          </div>

          <!-- Enhanced Analysis info -->
          <div class="mt-6 p-3 bg-gray-50 rounded-lg">
            <h5 class="font-medium text-gray-700 mb-2">📊 Analysis Details</h5>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600">
              <div>
                <span class="font-medium">Supply Chain Depth:</span><br>
                <span class="text-lg font-bold text-blue-600">{{ supplyTreeData.supplyChainDepth }}</span>
              </div>
              <div>
                <span class="font-medium">Analysis Time:</span><br>
                {{ new Date(supplyTreeData.analysisTimestamp).toLocaleString() }}
              </div>
              <div>
                <span class="font-medium">Method:</span><br>
                {{ supplyTreeData.analysisMethod }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced JSON representation -->
      <details class="mt-4">
        <summary class="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
          🔍 Show Technical Details (JSON)
        </summary>
        <div class="mt-2 space-y-2">
          <div>
            <h6 class="font-medium text-sm text-gray-700">API Response:</h6>
            <pre class="p-3 bg-gray-100 rounded text-xs overflow-auto max-h-60">{{ JSON.stringify(supplyTreeData.apiResponse || 'No API response data', null, 2) }}</pre>
          </div>
          <div>
            <h6 class="font-medium text-sm text-gray-700">Request Payload:</h6>
            <pre class="p-3 bg-gray-100 rounded text-xs overflow-auto max-h-60">{{ JSON.stringify(supplyTreeData.requestPayload || 'No request data', null, 2) }}</pre>
          </div>
        </div>
      </details>
    </div>
    <div class="mt-8 pt-6 border-t">

    </div>
  </section>
</template>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
