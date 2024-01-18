<template>
  <div class="products--tiles">
    <ProductTile v-for="product in products" :key="product._clId" :product="product" />
  </div>
</template>
<script lang="ts" setup>
const content = await useContentLite({flattenData: true})
const products = await content.find("products")
</script>
<style lang="scss" scoped src="~/scss/products.scss"/>
