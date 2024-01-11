<template>
  <NuxtLink
    :to="post.path"
    class="blog--tile"
  >
    <h3>{{ post.title }}</h3>
    <time>{{ new Date(post.date).toLocaleDateString() }}</time>
    <p>{{ post.description }}</p>
    <div
      v-if="showAuthor"
      class="blog--tile--author"
    >
      <span :to="author.path">
        {{ author.name }}
      </span>
    </div>
  </NuxtLink>
</template>
<script lang="ts" setup>
const passed = defineProps<{
    post: {
        title: string;
        date: string;
        description: string;
        path: string;
    },
    showAuthor?: boolean
}>()

const content = await useContentLite({flattenData: true})
const author: Ref<any> = ref()
if (passed.showAuthor) {
    author.value = passed.post?.author?.slug ? passed.post?.author : await content.find("authors").then((authors) => authors.find((author) => author.slug === passed.post.author))
}
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
