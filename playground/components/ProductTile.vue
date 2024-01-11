<template>
  <NuxtLink
    :to="product.path"
    class="products--tile"
  >
    <h2 class="products--tile--title">
      {{ product.title }}
    </h2>
    <p>
      {{ product.description }}
    </p>
    <div class="products--tile--price">
      {{ product.price }}
    </div>
  </NuxtLink>
</template>
<script lang="ts" setup>
defineProps<{
    product: {
        title: string
        description: string
        price: number
        path: string
    }
}>()
</script>
<style lang="scss" scoped>
.products--tile {
  padding: 1rem;
  text-decoration: none;
  color: #000;
  border-radius: 0.5rem;
  background-color: #ccc;

  &--title {
    font-size: 1.8rem;
    margin: 0;
    padding: 0;
  }

  &--price {
    font-size: 1.4rem;
    font-weight: bold;
  }
}
</style>
