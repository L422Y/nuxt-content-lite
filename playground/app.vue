<template>
  <main>
    <nav>
      <NuxtLink to="/">
        Home
      </NuxtLink>
      <NuxtLink to="/blog">
        Blog
      </NuxtLink>
      <NuxtLink to="/products">
        Products
      </NuxtLink>
    </nav>
    <div>
      <NuxtPage />
    </div>
  </main>
</template>
<script setup>
await useContentLite({
    filterable: false,
    flattenData: true
})
</script>
<style lang="scss" src="~/scss/app.scss" />
