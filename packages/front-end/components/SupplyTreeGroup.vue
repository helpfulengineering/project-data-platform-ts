<template>
  <div>
    <h2 class="card-title uppercase text-center font-semibold">
    SUPPLY TREE GROUP
    </h2>
    <div class="flex flex-wrap justify-between">
    <!-- Number of solutions: {{ solutions.length() }} -->
    Single Value:
   | {{ data }}|
<!--      <SupplyTree>
        v-for="solution in solutions"
      </SupplyTree>
    -->
    </div>
  </div>
</template>

<script>
    export default {
    name: "SupplyTreeGroup",
    props: {
    data: {
      type: Object,
      required: true,
    },
    width: {
      type: Number,
      default: 2600,
    },
    height: {
      type: Number,
      default: 600,
    },
    nodeSize: {
      type: Number,
      default: 40, // Default size of the image node
    },
  },
  watch: {
    data: {
      handler() {
      const stg = this.data;
        console.log("supply tree group watch",stg);
       console.log("watching supply tree fake",stg.fake);
       console.log("watching supply tree width",this.width);
      },
      deep: true, // Watch nested properties for changes
    },
  },
  mounted() {
    console.log("mounted supply tree solutions", this.solutions);
   console.log("mounted supply tree fake",this.data.fake);
   console.log("mounted supply tree solution",this.data.solutions);
   console.log("mounted supply tree width",this.width);
  },
    }
</script>

<style>
.card-title {
  color: #2a3952;
  font-weight: 700;
  margin-bottom: 5px;
}
</style>
