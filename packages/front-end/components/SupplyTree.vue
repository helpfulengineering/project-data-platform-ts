<!-- components/SupplyTree.vue -->
<template>
    This is a Supply Tree:
     |{{ name }}|
</template>

<script setup>
// Define props to receive data from the parent
defineProps({
  name: String,
  role: String
})
</script>
