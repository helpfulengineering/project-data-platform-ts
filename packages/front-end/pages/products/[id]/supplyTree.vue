<script setup lang="ts">
import { useRouter, useRoute } from "#app";
import { ref, reactive, computed, onMounted } from "vue";
import D3SupplyTree from "../../../components/D3Tree.vue";

const route = useRoute();

const okh = useState("okh");

console.log("Shared product:", okh.value);

const productFilename = route.params.id as string;
// now you have  route.params.id   → same product id
const okhData = ref<any>([]);
const supplyTreeData = ref<any>(null);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const selectedOkh = ref<any>(null);
// API configuration
const apiBaseUrl = ref(
  import.meta.env.VITE_API_BASE_URL || "http://localhost:7071/api"
);
// Updated to use port 8001 as requested
const supplyGraphApiUrl = ref(
  import.meta.env.VITE_SUPPLY_GRAPH_AI_URL || "http://localhost:8001"
);
const supplyGraphApiEndpoint = ref("/v1/supply-tree/create"); // Path to the versioned supply tree creation endpoint

const sendToSupplyGraphAI = async (o: any) => {
  if (!o) {
    error.value = "No OKH item selected";
    return;
  }

  const okhItem = {
    id: o.id || o.fname || o.name || Math.random().toString(36).substr(2, 9),
    name: o.name || o.title || "Unknown Item",
    shortDescription:
      o.shortDescription ||
      o.description ||
      o.summary ||
      "No description available",
    image: o.image || o.imageUrl || o.thumbnail || null,
    keywords: o.keywords || o.tags || [],
    maker: o.maker || o.author || o.creator || "Unknown",
    whereToFind: o.whereToFind || o.source || "Unknown source",
    // Keep original data for API calls
    originalData: o,
  };

  loading.value = true;
  error.value = null;
  selectedOkh.value = okhItem;
  try {
    const originalData = okhItem.originalData || okhItem;

    const payload = {
      okh_reference:
        okhItem.id?.toString() ||
        originalData.fname ||
        originalData.id ||
        "unknown",
      // required_quantity: 1,
      deadline: null,
      // metadata: {
      //   name: okhItem.name || originalData.name || originalData.title,
      //   shortDescription:
      //     okhItem.shortDescription ||
      //     originalData.description ||
      //     originalData.summary,
      //   keywords:
      //     okhItem.keywords || originalData.keywords || originalData.tags || [],
      //   maker:
      //     okhItem.maker ||
      //     originalData.maker ||
      //     originalData.author ||
      //     originalData.creator,
      //   whereToFind:
      //     okhItem.whereToFind ||
      //     originalData.whereToFind ||
      //     originalData.source,
      //   source: "project-data-platform-ts",
      //   image: okhItem.image || originalData.image || originalData.imageUrl,
      //   originalId: originalData.id || originalData.fname,
      //   dataSource: originalData.dataSource || "project-data-platform",
      //   ...originalData,
      // },
    };

    console.log("Enhanced payload for Supply Graph AI (port 8001):", payload);
    console.log(
      `Sending request to: ${supplyGraphApiUrl.value}${supplyGraphApiEndpoint.value}`
    );
    // Enhanced request to supply-graph-ai endpoint at port 8001
    const response = await fetch(
      `${supplyGraphApiUrl.value}${supplyGraphApiEndpoint.value}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // Enhanced headers for better compatibility
          "User-Agent": "project-data-platform-ts/1.0",
          "X-Requested-With": "XMLHttpRequest",
          // Add CORS headers if needed for local development
          Origin:
            typeof window !== "undefined"
              ? window.location.origin
              : "http://localhost:3000",
        },
        mode: "cors", // Explicitly request CORS mode
        body: JSON.stringify(payload),
      }
    );

    console.log(
      `Supply Graph AI response status: ${response.status} ${response.statusText}`
    );

    if (!response.ok) {
      let errorData = null;
      try {
        errorData = await response.json();
      } catch (e) {
        // Response might not be JSON
        console.warn("Could not parse error response as JSON");
      }

      throw new Error(
        `Supply Graph AI API error: ${response.status} ${response.statusText}` +
          (errorData ? ` - ${JSON.stringify(errorData)}` : "")
      );
    }

    // Parse the response from supply graph AI
    const supplyTreeResponse = await response.json();
    console.log("Supply Graph AI Response:", supplyTreeResponse);

    // Enhanced response processing to handle various response formats
    supplyTreeData.value = {
      rootItem: selectedOkh.value,
      relatedComponents:
        supplyTreeResponse.components ||
        supplyTreeResponse.related_items ||
        supplyTreeResponse.dependencies ||
        [],
      supplyChainDepth:
        supplyTreeResponse.depth || supplyTreeResponse.chain_depth || 1,
      analysisTimestamp:
        supplyTreeResponse.creation_time ||
        supplyTreeResponse.timestamp ||
        new Date().toISOString(),
      analysisMethod: "supply-graph-ai-port-8001",
      apiResponse: supplyTreeResponse, // Keep full response for debugging
      requestPayload: payload, // Keep request for debugging
    };

    console.log("Final Supply Tree Data:", supplyTreeData.value);
  } catch (err) {
    console.error("Error generating supply tree:", err);
    error.value = `Failed to generate supply tree: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

const treeData = reactive({
  name: "Oatmeal raisin cookie",

  children: [
    {
      // name: "OKW",
      image: "/okw.png",
      children: [
        {
          name: "cinnamon",
          class: "test",
          children: [
            {
              image: "/okw.png",
              children: [
                {
                  name: "testA",
                  children: [
                    {
                      image: "/okw.png",
                      children: [
                        {
                          name: "test1",
                        },
                      ],
                    },
                    { image: "/okw.png" },
                    { image: "/okw.png" },
                    { image: "/okw.png" },
                  ],
                },
              ],
            },
            { image: "/okw.png", children: [{ name: "testB" }] },
            { image: "/okw.png" },
            { image: "/okw.png" },
          ],
        },
        { name: "vanilla extract", children: [{ image: "/okw.png" }] },
        { name: "white sugar", children: [{ image: "/okw.png" }] },
        { name: "raisin", children: [{ image: "/okw.png" }] },
        { name: "egg", children: [{ image: "/okw.png" }] },
        { name: "shipping supply", children: [{ image: "/okw.png" }] },
        { name: "butter", children: [{ image: "/okw.png" }] },
        { name: "oats", children: [{ image: "/okw.png" }] },
        {
          name: "all purpose flour",
          children: [{ image: "/okw.png" }],
        },
        { name: "brown sugar", children: [{ image: "/okw.png" }] },
      ],
    },
  ],
});

onMounted(() => {
  // auto-load on mount; remove if you only want manual load via button
  sendToSupplyGraphAI(okh.value);
});
</script>

<template>
  <section>
    <div class="supply-tree-page">
      <div class="section">
        <h1>Cookie Supply Tree 1</h1>

        <div class="content">
          <D3SupplyTree
            :data="treeData"
            :width="800"
            :height="600"
            class="supply-tree"
          />

          <div class="right">
            <button class="btn-primary">ORDER</button>
            <button class="btn-secondary">EDIT SUPPLY TREE</button>
          </div>
        </div>
        <div class="details">
          <div class="overview">
            <h2 class="title">Overview</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur. Quis risus enim aliquam
              feugiat aliquam vulputate placerat sed. Consectetur pellentesque
              dis nunc sit et odio non viverra. Facilisi vitae sed in massa nibh
              elit. Bibendum massa nunc lorem mattis bibendum malesuada ac magna
              lorem. Morbi in a faucibus cum diam aliquam mi faucibus. Dapibus
              id maecenas aliquet quis arcu tempor nisi risus. Suspendisse at
              sed gravida ut eget ornare netus. Condimentum purus.
            </p>
          </div>
          <div class="contact-info">
            <h2 class="title">Contact Information</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur. bibendum malesuada ac
              magna lorem. Morbi in a faucibus cum diam aliquam mi faucibus.
              Dapibus id maecenas aliquet quis arcu tempor nisi risus.
              Suspendisse at sed gravida ut eget ornare netus.
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- <SupplyTree :product-id="route.params.id" /> -->
  </section>
</template>

<style>
.supply-tree-page {
  padding: 150px 0 0 0;

  .supply-tree {
    width: 75%;
    svg {
      overflow: visible;
    }
  }

  .section {
    background-color: white;
    margin: 20px 150px;
    padding: 30px;

    .details {
      display: flex;
      justify-content: space-between;
      padding-top: 20px;

      .contact-info {
        width: 45%;
      }

      .overview {
        width: 45%;
      }

      .title {
        color: #2a3952;
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 10px;
      }
    }
  }

  .content {
    display: flex;
  }
  .right {
    align-items: start;
    display: flex;
    flex-direction: column;
    padding-top: 84px;

    .btn-primary {
      border-radius: 6px;
      background-color: #a6f671;
      color: black;
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 10px;
      padding: 6px 20px;
      width: 162px;
    }

    .btn-secondary {
      border: 2px solid #d9d9d9;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 700;
      padding: 6px 20px;
    }
  }
}
</style>
