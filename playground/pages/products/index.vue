<template>
  <div class="products">
    <h1>Products</h1>
    <div class="products--tiles">
      <ProductTile
        v-for="product in products"
        :key="product._clId"
        :product
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
const content = await useContentLite({flattenData: true})
const products = await content.routeContent()
</script>
<style lang="scss" scoped src="~/scss/products.scss"/>
