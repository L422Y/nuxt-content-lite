<template>
  <div v-html="doc.content"/>
</template>
<script lang="ts" setup>
defineProps<{
    doc: any
}>()
</script>
