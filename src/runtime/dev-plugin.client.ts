import { useContentLite } from "./composables/useContentLite"
import { defineNuxtPlugin } from "#imports"

export default defineNuxtPlugin(async () => {
    const port = await fetch("/.content-lite/content-lite.json?port=1").then((res) => res.text())
    const content = await useContentLite()
    const clientSocket = new WebSocket(`ws://localhost:${port}`)
    clientSocket.addEventListener("message", async (event) => {
        if (event.data === "content-updated") {
            await content.reload()
        }
    })
})
