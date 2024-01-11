<template>
  <div class="awesome--component">
    <h1>Awesome Component</h1>
    <p>This is an awesome component!</p>
    {{ data }}
  </div>
</template>
<script lang="ts" setup>
import { useContentLite } from "../../../src/runtime/composables/useContentLite"

const content = await useContentLite()
const data = content.contentData
</script>
