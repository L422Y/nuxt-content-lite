import { useContentLite } from "./composables/useContentLite"

export default defineNuxtPlugin(async () => {
    const content = await useContentLite()
    const clientSocket = new WebSocket("ws://localhost:24931")
    clientSocket.addEventListener("message", async (event) => {
        if (event.data === "content-updated") {
            await content.reload()
        }
    })
})
