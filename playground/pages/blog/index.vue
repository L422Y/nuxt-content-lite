<template>
  <div class="page blog">
    <h1>Blog</h1>
    <div class="blog--tiles">
      <BlogTile
        v-for="post in posts"
        :key="post.title"
        :post="post"
        :show-author="true"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
const content = await useContentLite({flattenData: true})
const posts = await content.find("blog")
</script>
<style lang="scss" scoped src="~/scss/blog.scss" />
