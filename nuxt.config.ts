// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ["@nuxt/ui", "@nuxtjs/color-mode", "@nuxtjs/supabase", 'nuxt-icon'],
  css: ["@/assets/scss/main.scss"],
  supabase: {
    redirect: false,
  },

  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400;500;600;700&display=swap'
        },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/@mdi/font/css/materialdesignicons.min.css'
        }
      ]
    }
  }
});
