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
import { type ComputedRef, defineComponent, h, type Ref, ref } from "vue"
import { useRoute } from "#app/composables/router"

const content = await useContentLite({filterable: false})
const $route = useRoute()

const passed = withDefaults(defineProps<{
    item?: IContentLiteItem
}>(), {
    item: undefined
})

let actualItem: Ref<IContentLiteItem | undefined> | ComputedRef<IContentLiteItem | undefined>
const idx = {
    get() {
        return new Date().getTime()
    }
}

if (passed.item) {
    actualItem = ref(passed.item)
} else {
    actualItem = computed(() =>
        content.contentData?.value?.find(a => a.path === $route.path)
    )
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
            content: "An unusual error occurred."
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
