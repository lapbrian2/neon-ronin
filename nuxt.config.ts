export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  app: {
    head: {
      title: 'NEON RONIN — A Scroll-Driven Experience',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A masterless blade in a city of electric ghosts. Scroll-driven experience built with Nuxt 4, GSAP, and Three.js.' },
        { name: 'theme-color', content: '#f2ebe0' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Noto+Serif+JP:wght@200;400;700;900&display=swap',
        },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  tailwindcss: { configPath: '~/tailwind.config.ts' },
  ssr: true,
  nitro: { preset: 'vercel' },
  vite: { optimizeDeps: { include: ['three', 'gsap'] } },
})
