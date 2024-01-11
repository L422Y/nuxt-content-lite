<template>
  <div class="page blog">
    <h1>Blog</h1>
    <div class="blog--tiles">
      <template
        v-for="post in posts"
        :key="post.title"
      >
        <NuxtLink :to="post.path" class="blog--tile">
          <h2>
            {{ post.title }}
          </h2>
          <time>
            {{ new Date(post.date).toLocaleDateString() }}
          </time>
          <p>
            {{ post.description }}
          </p>
        </NuxtLink>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
const posts = ref()
const content = await useContentLite({flattenData: true})
posts.value = await content.routeContent()
</script>
<style lang="scss" scoped src="~/scss/blog.scss" />
