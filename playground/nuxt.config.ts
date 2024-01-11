export default defineNuxtConfig({
    modules: ["../src/module"],
    contentLite: {
        contentDir: "playground/content",
    },
    extends: [
        "github:L422Y/nuxt-layer-fake-blog",
    ],

    devtools: {enabled: true}
})
