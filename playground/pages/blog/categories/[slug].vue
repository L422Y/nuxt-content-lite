<template>
  <div class="page">
    <template v-if="posts">
      <h1>{{ slug }}</h1>
      {{ posts.length }} posts
      <template v-for="post in posts" :key="post._clId">
        <div>
          <NuxtLink :to="post.path">
            {{ post.title }}
          </NuxtLink>
        </div>
      </template>
    </template>
    <template v-else>
      <h1>Not Found</h1>
      <p>Sorry, that product doesn't exist.</p>
    </template>
  </div>
</template>
<script lang="ts" setup>
const slug = useRoute().params.slug as string
const content = await useContentLite()
const posts = await content.find("blog").then((posts) => {
    return posts.filter((post) => post.categories?.includes(slug))
})
</script>
<style lang="scss" scoped>

</style>
