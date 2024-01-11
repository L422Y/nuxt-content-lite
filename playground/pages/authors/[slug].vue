<template>
  <div class="page">
    <template v-if="author">
      <h1>
        {{ author.name }}
        <small>{{ author.title }}</small>
      </h1>
      <div class="posts">
        <template v-for="post in posts" :key="post._clId">
          <BlogTile :post :showAuthor="false" />
        </template>
      </div>
    </template>
    <template v-else>
      <h1>Not Found</h1>
      <p>Sorry, that post doesn't exist.</p>
    </template>
  </div>
</template>
<script lang="ts" setup>
const content = await useContentLite()
const author = await content.singleRouteContent()
const posts = await content.find("blog").then((posts) => {
    return posts.filter((post) => post.author === author.slug)
})
</script>
<style lang="scss" scoped>
h1 {
  margin-bottom: 0;
  text-align: center;

  small {
    font-size: 0.75rem;
    font-weight: 400;
    display: block;
    margin-top: 0.5rem;
  }
}
</style>
