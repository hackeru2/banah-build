import colors from "vuetify/es5/util/colors";

export default async () => {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  return {
    target: "server",
    generate: { fallback: true },
    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
      titleTemplate: "%s - banahnuxt",
      title: "banahnuxt",
      htmlAttrs: {
        lang: "en"
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { hid: "description", name: "description", content: "" },
        { name: "format-detection", content: "telephone=no" }
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
      "~/plugins/chartist.js",
      "~/plugins/ckeditor.js",
      "~/plugins/lodash.js",
      { src: "~/plugins/vue-typer", ssr: false },

      { src: "~/plugins/infiniteloading", ssr: false },
      { src: "~/plugins/faker", ssr: false }
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: {
      dirs: ["~/components", "~/components/modified"]
    },

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
      // https://go.nuxtjs.dev/vuetify
      "@nuxtjs/vuetify"
    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: ["@nuxtjs/axios", "@nuxt/http"],

    // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
    vuetify: {
      customVariables: ["~/assets/variables.scss"],
      theme: {
        dark: true,
        themes: {
          dark: {
            primary: colors.blue.darken2,
            accent: colors.grey.darken3,
            secondary: colors.amber.darken3,
            info: colors.teal.lighten1,
            warning: colors.amber.base,
            error: colors.deepOrange.accent4,
            success: colors.green.accent3
          }
        }
      }
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
      extend(config, { isDev, isClient }) {
        config.resolve.alias["vue"] = "vue/dist/vue.common";
      }
    },
    serverMiddleware: {
      "/api": "~/api",
      "/api/crypts": "~/api"
    }
  };
};
