<script setup lang="ts">
import { useRouter, useRoute } from "#app";
import D3SupplyTree from "../../../components/D3Tree.vue";

const route = useRoute();
const productFilename = route.params.id as string;
// now you have  route.params.id   → same product id

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
