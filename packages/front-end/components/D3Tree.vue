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

      const margin = { top: 100, right: 50, bottom: 50, left: 150 };
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
      const treeLayout = d3
        .tree()
        .size([innerHeight, innerWidth - 100])
        .separation((a, b) => (a.parent === b.parent ? 2 : 3)); // Increased spacing

      // Create root hierarchy
      const root = d3.hierarchy(treeData, (d) => d.children);
      root.x0 = innerHeight / 2;
      root.y0 = 0;

      // Collapse nodes deeper than depth 3
      root.children?.forEach((child) => this.collapse(child, 1));

      // Initial tree update
      this.update(root, g, treeLayout, root);
    },

    update(source, g, treeLayout, root) {
      // Assigns the x and y position for the nodes
      const treeData = treeLayout(root);

      // Compute the new tree layout
      const nodes = treeData.descendants();
      const links = treeData.links();

      // Normalize for fixed-depth
      nodes.forEach((d) => {
        d.y = d.depth * 140; // Adjust spacing between levels
        d.x = d.x * 2; // Increase horizontal gap
      });

      // JOIN: Nodes
      const node = g
        .selectAll(".node")
        .data(nodes, (d) => d.id || (d.id = Math.random()));

      // ENTER: Nodes
      const nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${source.x0},${source.y0})`)
        .on("click", (event, d) => this.toggleNode(d, g, treeLayout, root));

      // Add image to node
      nodeEnter
        .append("image")
        .attr("xlink:href", (d) => d.data.image)
        .attr("width", this.nodeSize)
        .attr("height", this.nodeSize)
        .attr("x", -this.nodeSize / 2)
        .attr("y", -this.nodeSize / 2);

      // Add labels
      nodeEnter
        .append("text")
        .attr("dy", (d) =>
          d.children ? -this.nodeSize / 2 - 10 : this.nodeSize / 2 + 5
        ) // Adjust position
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text((d) => d.data.name);

      // UPDATE: Transition nodes to their new position
      const nodeUpdate = nodeEnter.merge(node);
      nodeUpdate
        .transition()
        .duration(500)
        .attr("transform", (d) => `translate(${d.x},${d.y})`);

      // EXIT: Remove exiting nodes
      node
        .exit()
        .transition()
        .duration(500)
        .attr("transform", (d) => `translate(${source.x},${source.y})`)
        .remove();

      // JOIN: Links
      const link = g.selectAll(".link").data(links, (d) => d.target.id);

      // ENTER: Links
      const linkEnter = link
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", (d) => {
          const o = { x: source.x0, y: source.y0 };
          return this.diagonal({ source: o, target: o });
        });

      // UPDATE: Transition links to new positions
      linkEnter
        .merge(link)
        .transition()
        .duration(500)
        .attr("d", (d) => this.diagonal(d));

      // EXIT: Remove old links
      link
        .exit()
        .transition()
        .duration(500)
        .attr("d", (d) => {
          const o = { x: source.x, y: source.y };
          return this.diagonal({ source: o, target: o });
        })
        .remove();

      // Store old positions for transition
      nodes.forEach((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    },

    // Toggle node
    toggleNode(d, g, treeLayout, root) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      this.update(d, g, treeLayout, root);
    },

    // Collapse nodes deeper than depth 3
    collapse(d, depth) {
      if (depth >= 3) {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        }
      } else {
        if (d.children) {
          d.children.forEach((child) => this.collapse(child, depth + 1));
        }
      }
    },

    // Create curved diagonal path
    diagonal(d) {
      return `M${d.source.x},${d.source.y} C${d.source.x},${
        (d.source.y + d.target.y) / 2
      } ${d.target.x},${(d.source.y + d.target.y) / 2} ${d.target.x},${
        d.target.y
      }`;
    },
  },
};
</script>

<style>
.tree-container {
  border: 1px solid #ccc;
  overflow: hidden;
}

.link {
  fill: none;
  stroke: #aaa;
  stroke-width: 2px;
  transition: stroke 0.3s;
}

.link:hover {
  stroke: #4169e1;
}

.node image {
  cursor: pointer;
  transition: transform 0.2s;
}

.node:hover image {
  transform: scale(1.1);
}

.parent-node {
  border-radius: 50%;
}

.node text {
  font: 14px sans-serif;
}
</style>
