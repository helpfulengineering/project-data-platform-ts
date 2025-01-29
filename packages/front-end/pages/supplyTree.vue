<template>
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
            feugiat aliquam vulputate placerat sed. Consectetur pellentesque dis
            nunc sit et odio non viverra. Facilisi vitae sed in massa nibh elit.
            Bibendum massa nunc lorem mattis bibendum malesuada ac magna lorem.
            Morbi in a faucibus cum diam aliquam mi faucibus. Dapibus id
            maecenas aliquet quis arcu tempor nisi risus. Suspendisse at sed
            gravida ut eget ornare netus. Condimentum purus.
          </p>
        </div>
        <div class="contact-info">
          <h2 class="title">Contact Information</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur. bibendum malesuada ac magna
            lorem. Morbi in a faucibus cum diam aliquam mi faucibus. Dapibus id
            maecenas aliquet quis arcu tempor nisi risus. Suspendisse at sed
            gravida ut eget ornare netus.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import D3SupplyTree from "@/components/D3Tree.vue";

export default {
  components: {
    D3SupplyTree,
  },
  data() {
    return {
      treeData: {
        name: "Oatmeal raisin cookie",
       
        children: [
          {
            // name: "OKW",
            image: "png_okw.png",
            children: [
              { name: "cinnamon", class:"test", children: [{image: "png_okw.png"},{image: "png_okw.png"},{image: "png_okw.png"},{image: "png_okw.png"}] },
              { name: "vanilla extract", children: [{image: "png_okw.png" }] },
              { name: "white sugar", children: [{image: "png_okw.png" }] },
              { name: "raisin", children: [{image: "png_okw.png" }] },
              { name: "egg", children: [{image: "png_okw.png" }] },
              { name: "shipping supply", children: [{ image: "png_okw.png" }] },
              { name: "butter", children: [{image: "png_okw.png" }] },
              { name: "oats", children: [{image: "png_okw.png" }] },
              { name: "all purpose flour", children: [{image: "png_okw.png" }] },
              { name: "brown sugar", children: [{image: "png_okw.png" }] },
            ],
          },
        ],
      },
    };
  },
};
</script>

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
