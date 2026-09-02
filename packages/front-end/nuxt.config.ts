// https://nuxt.com/docs/api/configuration/nuxt-config
const globalBaseUrl = 'https://backend4.blackdune-e38fce01.westus3.azurecontainerapps.io/api';

export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
    css: ['~/assets/css/main.css'],
     runtimeConfig: {
        public: {
            baseUrl: process.env.BACKEND_URL ? process.env.BACKEND_URL : globalBaseUrl,
            // Supply Graph AI configuration
            supplyGraphAiUrl: process.env.SUPPLY_GRAPH_AI_URL || 'https://openhardwaremanager-cooking-fe.blackdune-e38fce01.westus3.azurecontainerapps.io'
//            apiBase: '/api'
        }
    },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
