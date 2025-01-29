<template>
  <div ref="tree" style="border: 1px solid #ccc; overflow: hidden"></div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "D3SupplyTree",
  props: {
    data: {
      type: Object,
      required: true,
    },
    width: {
      type: Number,
      default: 800,
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
  mounted() {
    this.drawTree();
  },
  methods: {
    drawTree() {
      const treeData = this.data;

      // Clear any existing SVG
      d3.select(this.$refs.tree).selectAll("*").remove();

      const margin = { top: 20, right: 20, bottom: 20, left: 20 };
      const innerWidth = this.width - margin.left - margin.right;
      const innerHeight = this.height - margin.top - margin.bottom;

      // Create SVG container
      const svg = d3
        .select(this.$refs.tree)
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height);

      // Add a group for zoomable content
      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Add zoom and pan functionality
      svg.call(
        d3.zoom().on("zoom", (event) => {
          g.attr("transform", event.transform);
        })
      );

      // Create a tree layout
      const treeLayout = d3.tree().size([innerHeight, innerWidth]);

      // Create root hierarchy
      const root = d3.hierarchy(treeData);

      // Generate tree layout
      treeLayout(root);

      // Links (lines connecting nodes)
      g.selectAll(".link")
        .data(root.links())
        .enter()
        .append("path")
        .attr("class", "link")
        .attr(
          "d",
          d3
            .linkVertical()
            .x((d) => d.x)
            .y((d) => d.y)
        )
        .style("fill", "none")
        .style("stroke", "#ccc")
        .style("stroke-width", 2);

      // Nodes
      const node = g
        .selectAll(".node")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("class", (d) =>
          d.children
            ? "node parent"
            : `node child ${d.data.className || ""}` // Add class from data
        )
        .attr("transform", (d) => `translate(${d.x},${d.y})`);

      // Images for nodes
      node
        .append("image")
        .attr("xlink:href", (d) => d.data.image) // Use the 'image' property in data
        .attr("width", this.nodeSize)
        .attr("height", this.nodeSize)
        .attr("x", -this.nodeSize / 2) // Center the image
        .attr("y", -this.nodeSize / 2);

      // Labels for nodes
      node
        .append("text")
        .attr("dy", this.nodeSize / 2 + 15) // Position below the image
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text((d) => d.data.name);
    },
  },
};
</script>

<style>
.link {
  fill: none;
  stroke: #ccc;
  stroke-width: 2px;
}
.node image {
  cursor: pointer;
}
.node text {
  font: 12px sans-serif;
}

.node.parent {
  background-color: red;
  fill: red;
  text {
    background-color: red;
    fill: red;
    z-index: 1000;
    font-size: 20px;
  }
}

.node.child {

}
</style>
