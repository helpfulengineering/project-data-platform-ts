// https://nuxt.com/docs/api/configuration/nuxt-config
// WARNING!!!
// BLACK MAGIC ALERT!!!
// Changing from "localhost" to 127.0.0.1
// made a huge difference here.
// This is totally unexplained and complete nonsense, but true.
const globalBaseUrl = 'http://localhost:7071/api';

export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
    css: ['~/assets/css/main.css'],
     runtimeConfig: {
        public: {
            baseUrl: process.env.BACKEND_URL ? process.env.BACKEND_URL : globalBaseUrl,
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
