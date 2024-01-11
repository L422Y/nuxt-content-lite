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

const idx = {
    get() {
        return Math.random()
    }
}

const passed = withDefaults(defineProps<{
    item?: IContentLiteItem
}>(), {
    item: undefined
})


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
