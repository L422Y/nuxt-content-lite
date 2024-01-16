<template>
  <div>
    <template
      v-for="c in elements"
      :key="c.type + idx"
    >
      <component
        :is="makeComponent(c)"
        v-if="c.type === 'html'"
      />
      <template v-if="c.type === 'component'">
        <component :is="c.component" />
      </template>
    </template>
  </div>
</template>
<script lang="ts" setup>
import type { IContentLiteItem } from "~/dist/runtime/types"
import { useContentLite } from "../composables/useContentLite"
import { computed, defineComponent, h, ref } from "vue"
import { useRoute } from "#app/composables/router"

const content = await useContentLite({filterable: false})
const $route = useRoute()

const passed = withDefaults(defineProps<{
    item?: IContentLiteItem
}>(), {
    item: undefined
})

const actualItem = ref(passed.item)

const idx = {
    get() {
        return new Date().getTime()
    }
}

if (!passed.item) {
    if (process.dev) {
        watch(() => content.contentData.value, async () => {
            actualItem.value = await content.singleRouteContent()
        }, {
            immediate: true,
            deep: true
        })
    } else {
        actualItem.value = await content.singleRouteContent()
    }
}


const elements = computed(() => {
    if (actualItem.value?.content) {
        return actualItem.value.content
            .split(/<p>(:[-a-zA-Z0-9]+)<\/p>/g)
            .map((c: any) => {
                const match = c.match(/^:([-a-zA-Z0-9]+)$/)
                if (match) {
                    return {
                        type: "component",
                        component: match[1]
                    }
                } else {
                    return {
                        type: "html",
                        content: c
                    }
                }
            })
    } else {
        return [{
            type: "html",
            content: "Content not found for `" + $route.path + "`"
        }]
    }
})

const makeComponent = (c: any) => {
    return defineComponent({
        props: {
            content: {
                type: String,
                default: c.content
            }
        },
        render() {
            return h("div", {
                innerHTML: c.content
            })
        }
    })
}
</script>
