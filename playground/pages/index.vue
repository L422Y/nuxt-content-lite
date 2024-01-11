<template>
  <div class="page">
    Welcome to zombo.com
    <pre>{{ content.contentData }}</pre>
  </div>
</template>
<script lang="ts" setup>
const content = await useContentLite({flattenData: true, filterable: true})

</script>
<style lang="scss" scoped>
pre {
  background: #eee;
  padding: 1rem;
  max-width: 100%;
  overflow: scroll;
  white-space: pre-wrap;

}
</style>
