// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
      // Private keys are only available on the server
      public: {
          apiSecret: '456',
          baseUrl: 'http://localhost:7071/api',
          //      baseUrl: process.env.NUXT_PUBLIC_BACKEND_URL || ''
      },
      compatibilityDate: '2024-04-03',
      devtools: { enabled: true },
  },

  compatibilityDate: '2024-08-20',
})