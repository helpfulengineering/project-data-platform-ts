<template>
  <section>
    <h1 class="about-us text-2xl font-bold tracking-tight text-red-900">
      TEST NATHAN'S API
    </h1>
  </section>
</template>

 <script setup lang="ts">
import jquery;

const url = "http://0.0.0.0:8000/";

 $.post("demo_test_post.asp",
  {
    name: "Donald Duck",
    city: "Duckburg"
  },
  function(data, status){
    alert("Data: " + data + "\nStatus: " + status);
  });


<style>
.about-us {
  margin: 150px;
}
</style>
