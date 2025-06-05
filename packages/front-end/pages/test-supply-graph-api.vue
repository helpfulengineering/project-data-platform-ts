<script setup lang="ts">
    import { onMounted } from 'vue';


const data1 = ref<any>(null);
const data2 = ref<any>(null);

const fetchData = async () => {
  try {
    const [res1, res2] = await Promise.all([
      fetch("http://127.0.0.1:8001/v1/okh"),
      fetch("http://127.0.0.1:8001/v1/okw/create", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              "name": "New Manufacturing Facility",
              "location": {"place": "Austin"}
          })
      })
    ]);

      data1.value = await res1.json();
      data2.value = await res2.json();

      console.log('Data1:', data1);
      console.log('Data1:', data2);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <section>
    <h1 class="about-us text-2xl font-bold tracking-tight text-red-900">
      About Us
    </h1>
    <p>
      This is a throw-away page designed to test
      <a href="https://github.com/helpfulengineering/supply-graph-ai">
        Nathan&#39;s Supply Graph API
      </a>
    </p>


    <div class="mt-4">
      <h2 class="text-lg font-semibold">Data 1:</h2>
      <pre>{{ data1 }}</pre>

      <h2 class="text-lg font-semibold mt-2">Data 2:</h2>
      <pre>{{ data2 }}</pre>
    </div>
  </section>
</template>
