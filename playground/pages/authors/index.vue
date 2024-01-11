<template>
  <div class="page blog">
    <h1>Blog</h1>
    <div class="blog--tiles">
      <template
        v-for="post in posts"
        :key="post.title"
      >
        <NuxtLink
          :to="post.path"
          class="blog--tile"
        >
          <h2>
            {{ post.title }}
          </h2>
          <time>
            {{ new Date(post.date).toLocaleDateString() }}
          </time>
          <p>
            {{ post.description }}
          </p>
          <div class="blog--tile--author">
            <span>
              <NuxtLink :to="post.author.path">
                {{ post.author.name }}
              </NuxtLink>
            </span>
          </div>
        </NuxtLink>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>

const content = await useContentLite({flattenData: true})
const posts = await content.routeContent()
const authors = await content.find("authors")

posts.forEach((post) => post.author = authors.find((author) => author.slug === post.author))

</script>
<style lang="scss" scoped src="~/scss/blog.scss" />
