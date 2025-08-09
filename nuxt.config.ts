export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/main.css'],

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/cloudinary'
  ],

  cloudinary: {
    cloudName: 'fesfese4324',
    uploadPreset: 'upload_preset', 
    apiKey: '12345',                
    analytics: true,
    cloud: {},
    url: {}
  },

  plugins: ['~/plugins/fontawesome'],
})
