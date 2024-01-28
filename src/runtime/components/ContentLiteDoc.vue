<template>
  <component
    :is="contentVNode"
    v-if="contentVNode"
  />
</template>
<script lang="ts" setup>
import type { IContentLiteItem } from "../types"
import { _Parser } from "../src/vueMarked/Parser"
import { useContentLite } from "../composables/useContentLite"
import { computed, h, ref, watch } from "vue"
import { useRoute } from "nuxt/app"

const content = await useContentLite({filterable: false})
const passed = withDefaults(defineProps<{
    item?: IContentLiteItem
}>(), {
    item: undefined
})

const actualItem = ref(passed.item)

if (!passed.item) {
    if (process.dev) {
        watch(() => content.contentData.value, async () => {
            actualItem.value = await content.singleRouteContent(useRoute().path)
        }, {
            immediate: true,
            deep: true
        })
    } else {
        actualItem.value = await content.singleRouteContent(useRoute().path)
    }
}
const contentVNode = computed(() => {
    if (actualItem.value) {
        const lexed = actualItem.value.lexedContent
        return () => h("div", {class: "content-lite-doc"}, _Parser.parse(lexed))
    } else {
        console.log("no item", actualItem.value, useRoute().path)
    }
    return undefined
})


</script>
