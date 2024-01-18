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
import type { Ref } from "vue"

const content = await useContentLite()
const product = await content.findOne(useRoute().path)
if (!product) {
    showError({
        statusMessage: "Not Found",
        statusCode: 404,
        message: "Sorry, that product doesn't exist.",
    })
}
const currentProductPrice: Ref<any> = useState("currentProductPrice", () => product.price)
currentProductPrice.value = product.price
</script>
