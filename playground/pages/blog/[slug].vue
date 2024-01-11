<template>
  <div class="page blog--post">
    <template v-if="post">
      <header class="blog--post__header">
        <h1>{{ post.title }}</h1>
        <div class="blog--post__meta">
          <div>
            By
            <NuxtLink
              :to="author.path"
              class="blog--post__author"
            >
              {{ author.name }}
            </NuxtLink>
          </div>
          <time>{{ timeAgo }}</time>
        </div>
        <p class="blog--post__desc">
          {{ post.description }}
        </p>
      </header>
      <div class="categories">
        <template
          v-for="category in post.categories"
          :key="category"
        >
          <NuxtLink :to="`/blog/categories/${category}`">
            {{ category }}
          </NuxtLink>
        </template>
      </div>
      <ContentLiteDoc :item="post" />
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
const author = await content.find("authors").then((authors) => authors.find((author) => author.slug === post.author))
const timeAgo = computed(() => {
    if(!post?.date) return "...unknown"
    const date = new Date(post.date)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)

    switch (true) {
        case months > 0:
            return `${months} month${months > 1 ? "s" : ""} ago`
        case days > 0:
            return `${days} day${days > 1 ? "s" : ""} ago`
        case hours > 0:
            return `${hours} hour${hours > 1 ? "s" : ""} ago`
        case minutes > 0:
            return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
        case seconds > 0:
            return `${seconds} second${seconds > 1 ? "s" : ""} ago`
        default:
            return "just now"
    }

})
</script>
<style lang="scss" scoped>
h1 {
  font-size: 3rem;
  font-weight: 100;
  margin: 0;
  padding: 0;
}

.blog--post {
  padding: 1rem;

  &__header {
    margin-bottom: 1rem;
    text-align: center;
  }

  &__meta {
    display: grid;
    justify-content: center;
    margin-bottom: 1rem;
    gap: 0.5rem;
    time {
        font-size: 0.8rem;
        color: #00000088;
    }
  }

  &__author {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #000000;
  }

  &__desc {
    font-size: 1.2rem;
    margin: 2rem;
    color: #00000088;
  }


}

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
