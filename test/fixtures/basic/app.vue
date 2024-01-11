<template>
  <div>basic</div>
  <div>
    {{ products }}
  </div>
  <ContentLiteDoc :item="awesomePost" />
</template>

<script setup>
const content = await useContentLite({flattenData: true})
const products = await content.find("products")
const awesomePost = await content.findOne("blog/awesome-post")

</script>
