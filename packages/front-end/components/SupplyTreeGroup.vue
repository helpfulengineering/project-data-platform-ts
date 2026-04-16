<template>
  <div>
    <h2 class="card-title uppercase text-center font-semibold">
    SUPPLY TREE GROUP
    </h2>
    <div class="flex flex-wrap justify-between">
    Solutions are equal to: {{ solutions }}
      <SupplyTree>
        v-for="solution in solutions"
      </SupplyTree>
    </div>
  </div>
</template>

<script setup>
defineProps({
  solutions: {
    type: Array,
    required: true,
  },
});
</script>

<style>
.card-title {
  color: #2a3952;
  font-weight: 700;
  margin-bottom: 5px;
}
</style>
