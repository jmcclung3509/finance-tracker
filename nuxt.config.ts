// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxtjs/color-mode", "@nuxtjs/supabase"],
  css: ["@/assets/scss/main.scss"],
  supabase:{
    redirect: false
  }

});
