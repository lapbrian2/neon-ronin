// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss'],

  app: {
    head: {
      title: 'NEON RONIN — A Scroll-Driven Anime Experience',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A masterless samurai navigates a cyberpunk Tokyo. Scroll-driven anime experience built with Nuxt 4, Three.js, and GSAP.' },
        { name: 'theme-color', content: '#08080F' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500&family=Outfit:wght@600;700&family=Noto+Serif+JP:wght@400;700&display=swap',
        },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  tailwindcss: {
    configPath: '~/tailwind.config.ts',
  },

  // SSR with client-only Three.js components
  ssr: true,

  nitro: {
    preset: 'vercel',
  },

  vite: {
    optimizeDeps: {
      include: ['three', 'gsap'],
    },
  },
})
