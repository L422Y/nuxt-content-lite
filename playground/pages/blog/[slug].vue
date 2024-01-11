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
      <ContentLite :doc="post"/>
    </template>
    <template v-else>
      <h1>Not Found</h1>
      <p>Sorry, that product doesn't exist.</p>
    </template>
  </div>
</template>
<script lang="ts" setup>
const content = await useContentLite()
const post = await content.findOne(useRoute().path)
</script>
<style lang="scss" scoped>
.categories {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  gap: 0.5rem;

  a {
    padding: 0.25rem 0.5rem;
    text-decoration: none;
    color: var(--c1);
    border-radius: 0.25rem;
    text-transform: uppercase;
    font-size: 0.8rem;
    background: #eee;
    color: #333;
    &:hover {
      background-color: var(--hc2);
    }
  }
}
</style>
