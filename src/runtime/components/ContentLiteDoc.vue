<template>
  <div>
    <template v-for="c in elements" :key="`${idx}`">
      <div v-if="c.type === 'html'" v-html="c.content"/>
      <template v-if="c.type === 'component'">
        <component :is="c.component"/>
      </template>
    </template>
  </div>
</template>
<script lang="ts" setup>
import type { IContentLiteItem } from "~/dist/runtime/types"

const idx = {
    get() {
        return Math.random()
    },
    set() {
        // do nothing
    }
}

const passed = withDefaults(defineProps<{
    item?: IContentLiteItem
}>(), {})


let elements

if (passed.item?.content) {
    elements = passed.item.content
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
    elements = [{
        type: "html",
        content: "An unusual error occurred."
    }]
}

</script>
