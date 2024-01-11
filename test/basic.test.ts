import { describe, expect, it } from "vitest"
import { fileURLToPath } from "node:url"
import { $fetch, setup } from "@nuxt/test-utils/e2e"

describe("ssr", async () => {
    await setup({
        rootDir: fileURLToPath(new URL("./fixtures/basic", import.meta.url)),
    })

    it("renders the index page", async () => {
        // Get response to a server-rendered page with `$fetch`.
        const html = await $fetch("/")
        expect(html).toContain("<div>basic</div>")
    })

    it("includes the contentData in the initial source", async () => {
        const html = await $fetch("/")
        expect(html).toContain("\"$scontentData\"")
    })

    it("renders the content object with vue", async () => {
        const html = await $fetch("/")
        expect(html).toContain("123456788")
    })

    it("utilizes the github content layer for blog posts", async () => {
        const html = await $fetch("/")
        expect(html).toContain("\"blog/awesome-post.md\"")
    })

    it("renders the awesome blog post", async () => {
        const html = await $fetch("/")
        expect(html).toContain("Awesome Post")
    })

    it("renders the awesome vue component", async () => {
        const html = await $fetch("/")
        expect(html).toContain("This is an awesome component!")
    })
})
