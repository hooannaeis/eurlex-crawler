export default defineNuxtConfig({
    modules: [
        '@nuxt/content', '@nuxtjs/tailwindcss',
    ],
    tailwindcss: {
        cssPath: '~/assets/css/main.css',
    }
})