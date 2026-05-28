<script setup lang="ts">
import { useRoute } from "#app";
import { ref, onMounted } from "vue";
import D3SupplyTree from "../../../components/D3Tree.vue";

import {
  buildManufacturingMatchPayload,
  parseOhmMatchBody,
  postOhmMatch,
} from "~/utils/ohmMatch";

const route = useRoute();

const okh = useState("okh");

console.log("Shared product:", okh.value);

const productFilename = route.params.id as string;

console.log("productFilename", productFilename);

const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const selectedOkh = ref<any>(null);

var selectedOKHname : string;

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
    selectedOKHname = selectedOkh.value.name;

    try {
        const payload = buildManufacturingMatchPayload(productFilename);

        console.log("OHM match payload:", payload);
        const response = await postOhmMatch(payload as Record<string, unknown>);

        if (!response.ok) {
            let errorData: unknown = null;
            try {
                errorData = await response.json();
            } catch {
                console.warn("Could not parse error response as JSON");
            }
            throw new Error(
                `OHM match error: ${response.status} ${response.statusText}` +
                    (errorData ? ` — ${JSON.stringify(errorData)}` : "")
            );
        }

        const supplyTreeResponse = await response.json();

        const { solutions } = parseOhmMatchBody(supplyTreeResponse);

        if (!solutions.length) {
            // HTTP 200 with empty solutions is valid; not a client/transport error.
            error.value = null;
            treeData.value = {
                name: selectedOkh.value?.name || "Supply Tree",
                children: [{ image: "/okh.png", children: [] }],
            };
            return;
        }

        const formattedSolutions: any[] = [];
        var key_num = 0;
        for (const solution of solutions) {
            const tree = (solution.tree as Record<string, unknown> | undefined) || {};
            const capRaw = tree.capabilities_used;
            const caps = Array.isArray(capRaw) ? capRaw : [];
            const children = caps.map((capability: unknown) => ({
                name: String(capability),
                image: "/OKP_icon.png",
            }));

            formattedSolutions.push({
                name: String(solution.facility_name ?? "Facility"),
                confidence: solution.confidence,
                image: "/okw_maker.png",
                class: "test",
                children,
            });



            treeData.push({
                key: key_num++,
                name: formattedSolutions[key_num-1].name || "Supply Tree",
                confidence: formattedSolutions[key_num-1].confidence || "NA",
                children: [
                    {
                        image: "/okh.png",
                        children: [formattedSolutions[key_num-1]],
                    },
                ],
            });
            console.log("OKW name",formattedSolutions[key_num-1].name);
        }

        // I think this triggers the "watch" method
        // in the component
        solutionDataHolder.value = {
            fake: "spud",
            image:  "/okh.png",
            treeDataObjects: treeData,
        };
    } catch (err) {
        console.error("Error generating supply tree:", err);
        error.value = `Failed to generate supply tree: ${err instanceof Error ? err.message : String(err)}`;
    } finally {
        loading.value = false;
    }
};

let treeData : ref<any>[] = [];


// This class should not be needed, but due to Vue's reactive nature,
// we have to have an object that we can set the ".value" of.
// We actually are setting "treeData" into this object.
const solutionDataHolder = ref<any>({
    treeDataObjects: [],
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
    <h1>{{ selectedOKHname }}</h1>
    <div class="content">

    <p>
    </p>
    <div>
    <!-- In the code below, why can't I use
solution instead of treeData?
<div  v-for="(solution,index) in treeData">
<p>index {{ index }}</p>
<p>solution {{solution}}</p>
<p>treeData {{solution}}</p>
</div>
 -->
<D3SupplyTree
v-for="(treeDataObject,index) in solutionDataHolder.treeDataObjects"
:data="treeDataObject"
:key="treeDataObject.key"
            :width="808"
            :height="600"
            class="supply-tree"
/>
    </div>
<!--
<div class="right">
            <button class="btn-primary">ORDER</button>
            <button class="btn-secondary">EDIT SUPPLY TREE</button>
</div>
-->
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
