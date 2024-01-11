<template>
  <div class="page">
    <template v-if="post">
      <h1>{{ post.title }}</h1>
      <div class="categories">
        <template v-for="category in post.categories" :key="category">
          <NuxtLink :to="`/blog/categories/${category}`">
            {{ category }}
          </NuxtLink>
        </template>
      </div>
      <ContentLiteDoc :item="post"/>
    </template>
    <template v-else>
      <h1>Not Found</h1>
      <p>Sorry, that post doesn't exist.</p>
    </template>
  </div>
</template>
<script lang="ts" setup>
const content = await useContentLite()
const post = await content.singleRouteContent()
</script>
<style lang="scss" scoped>
.categories {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  gap: 0.5rem;

  a {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
    text-decoration: none;
    text-transform: uppercase;
    color: #333;
    border-radius: 0.25rem;
    background: #eee;
  }
}
</style>
