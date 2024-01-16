<template>
  <div class="products--tiles">
    <template
      v-for="product in products"
      :key="product._clId"
    >
      <ProductTile
        :product="product"
      />
    </template>
  </div>
</template>
<script lang="ts" setup>
const content = await useContentLite({flattenData: true})
const products = await content.find("products")
</script>
<style lang="scss" scoped src="~/scss/products.scss" />
