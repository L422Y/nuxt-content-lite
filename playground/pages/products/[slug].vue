<template>
  <div class="page">
    <template v-if="product">
      <h1>{{ product.title }}</h1>
      <h3>${{ product.price }}</h3>
      <ContentLiteDoc :item="product" />
    </template>
    <template v-else>
      <h1>Not Found</h1>
      <p>Sorry, that product doesn't exist.</p>
    </template>
  </div>
</template>
<script lang="ts" setup>
const content = await useContentLite()
const product = await content.findOne(useRoute().path)
</script>
