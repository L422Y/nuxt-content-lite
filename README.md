# Nuxt Content Lite

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Light-use markdown driven content engine inspired by Nuxt Content for doing amazing things with markdown, with less.

## Why?

[Nuxt Content](https://content.nuxt.com/) is an amazing module, but it's a bit heavy for some use cases. Nuxt Content Lite is a lightweight
alternative for those who don't need all the bells and whistles.

The goal of Nuxt Content Lite is to provide a simple, lightweight, and flexible way to use markdown content in your Nuxt
app or website, while keeping things light and fast.

## Who is this for?

Smaller sites, blogs, and apps that don't need all the bells and whistles of Nuxt Content.

The primary use case for Nuxt Content Lite is for small sites that need a little more than just static content, but
don't need a full-blown CMS like Wordpress. 

If you're building a large site, blog a ton of posts, or app, you should probably
use [Nuxt Content](https://content.nuxt.com/).

## What's the difference?

> We use tuples instead of objects for storing content! 

...and we don't have a lot of the features that Nuxt Content has.

Currently, Nuxt Content Lite renders all content into a single file on build. This means that while you can use Nuxt
Content Lite to build a blog, you probably shouldn't use it to build a blog with a ton of posts. 

We're working on a way to split content into multiple files, but for now, Nuxt Content Lite is best for smaller sites.

## Roadmap
- [x] ~~Markdown content~~
- [x] ~~Markdown content rendering~~
- [x] ~~Vue Composable~~
- [x] ~~ContentLiteDoc component~~
- [x] ~~Basic content rendering~~
- [x] ~~Frontmatter~~
- [x] ~~Nuxt layers~~
- [x] ~~Vue components~~
- [x] ~~Generate unique word lists with counts~~
- [x] ~~Find all content for path~~
- [x] ~~Find single content for path~~
- [ ] Content API
- [ ] (better) Content search
- [ ] Content pagination
- [ ] Content tags
- [ ] Content categories
- [ ] Split content into multiple files
- [ ] Content caching


## Features

- Markdown-based content
- Frontmatter
- Supports Nuxt layers
- Supports Vue components

## Quick Setup

1. Add `nuxt-content-lite` dependency to your project

```bash
# Using pnpm
pnpm add -D nuxt-content-lite

# Using yarn
yarn add --dev nuxt-content-lite

# Using npm
npm install --save-dev nuxt-content-lite
```

2. Add `nuxt-content-lite` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
    modules: [
        'nuxt-content-lite'
    ]
})
```

That's it! You can now use Nuxt Content Lite in your Nuxt app ✨

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nuxt-content-lite/latest.svg?style=flat&colorA=18181B&colorB=28CF8D

[npm-version-href]: https://npmjs.com/package/nuxt-content-lite

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-content-lite.svg?style=flat&colorA=18181B&colorB=28CF8D

[npm-downloads-href]: https://npmjs.com/package/nuxt-content-lite

[license-src]: https://img.shields.io/npm/l/nuxt-content-lite.svg?style=flat&colorA=18181B&colorB=28CF8D

[license-href]: https://npmjs.com/package/nuxt-content-lite

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js

[nuxt-href]: https://nuxt.com
