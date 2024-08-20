<template>
  <div>
    <NuxtRouteAnnouncer />
    <h1> Welcome to Project Data Web (PDW)! </h1>
<!--    <NuxtWelcome /> -->
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
        console.log("xxx",config);
</script>

      <script lang="ts">
import { useRoute } from 'vue-router'
import { getStatistics} from '~/services/azureFuncs';
import { ref, onMounted } from 'vue';



export default {
    data() {
        return {
            isLoading: true,
        }},

    methods: {
        async fetchData() {
            try {
                const config = useRuntimeConfig();
                const response = await getStatistics(config);
                return response;
            } catch (error) {
                console.log(error)
            }
        },
    },
    async mounted(){
        const data = await this.fetchData();
        if (!data) {
            console.log("erorr fetching data");
            return;
        }  else {
        console.log("data",data);

        }
    }
}

</script>
