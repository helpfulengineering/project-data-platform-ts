<script setup lang="ts">
     const baseUrl = useRuntimeConfig().public.baseUrl;
     const url = baseUrl + '/HttpExample';
//    const url = '/api/HttpExample';
     console.log("url",url);
     const { data, status, error, refresh, clear } =
    await useFetch(url,
                   // {fetchOptions:
                   //  {
                   //      cache: 'no-cache', // Disable caching
                   // }
                   // }
                  );
</script>

<template>
    <h1>XXXXXXXXX</h1>
    <h1>XXXXXXXXX</h1>
    <h1>XXXXXXXXX</h1>
    <h1>XXXXXXXXX</h1>
    <h1>XXXXXXXXX</h1>
    <h1>XXXXXXXXX</h1>
    <h1>XXXXXXXXX</h1>
    <h1>XXXXXXXXX</h1>
    <h1>XXXXXXXXX</h1>
    <h1>XXXXXXXXX</h1>
    <h1>XXXXXXXXX</h1>
    <h1>XXXXXXXXX</h1>
    <h1> LOOK HERE: ->  {{ error }} . </h1>
    <h1> LOOK HERE: ->  {{ data }} . </h1>
    <h1> LOOK HERE: ->  {{ status }} . </h1>
</template>
