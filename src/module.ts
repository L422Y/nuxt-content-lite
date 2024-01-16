import {
    addComponentsDir,
    addImportsDir,
    addPlugin,
    addServerHandler,
    createResolver,
    defineNuxtModule
} from "@nuxt/kit"
import fs from "fs"
import path from "path"
import type { ContentLiteRawItem } from "~/dist/runtime/types"
import type { WebSocketClient } from "vite"

export default defineNuxtModule({
    meta: {
        name: "nuxt-content-lite",
        configKey: "contentLite",
        compatibility: {
            nuxt: "^3.0.0"
        }
    },
    defaults: {
        contentDir: "content"
    },
    hooks: {},
    async setup(moduleOptions, nuxt) {
        const moduleResolver = createResolver(import.meta.url)
        const rawContentData = new Set<ContentLiteRawItem>()
        const contentComponents = [] as string[]

        const contentLiteDir = path.resolve(".", ".cache/content-lite")
        const jsonPath = path.resolve(contentLiteDir, "content-lite.json")


        await addComponentsDir({
            path: moduleResolver.resolve("./runtime/components"),
            global: true,
        })

        addImportsDir(moduleResolver.resolve("./runtime/composables"))
        addServerHandler({
            route: "/.content-lite/content-lite.json",
            handler: moduleResolver.resolve("./runtime/endpoint.get")
        })

        const populateContent = async (currentPath: string = moduleOptions.contentDir, baseDir?: string) => {
            const path = require("path")
            const matter = require("gray-matter")

            if (!baseDir) {
                baseDir = path.resolve(".", moduleOptions.contentDir)
            }

            const contentDirPath = path.resolve(".", currentPath)
            const contentFiles = fs.readdirSync(contentDirPath)


            for (const file of contentFiles) {
                if (file.startsWith(".")) {
                    continue
                }
                const filePath = contentDirPath + "/" + file
                const fileStat = fs.statSync(filePath)
                if (fileStat.isDirectory()) {
                    // recurse
                    await populateContent(filePath, baseDir)
                } else if (fileStat.isFile() && file.endsWith(".md")) {

                    // parse the file
                    const fileContents = fs.readFileSync(filePath, "utf-8")

                    // parse markdown, including front matter
                    const fileData = await getFileData(matter, fileContents)

                    if (fileData.data?.status === "draft") {
                        continue
                    }

                    const modifiedDate = fileStat.mtime
                    const contentPath = path.relative(baseDir, filePath)

                    const fileDataItem: ContentLiteRawItem = [
                        contentPath,
                        modifiedDate.toISOString(),
                        fileData.data,
                        fileData.body
                    ]

                    if (fileData.body) {
                        // find any lines that match :<component-name> and add them to the data
                        const lines = fileData.body.split("\n")
                        const regex = /^:(?<component>[a-zA-Z0-9-]+)$/
                        if (!lines.length)
                            lines.map((line: string) => {
                                const match = regex.exec(line)
                                if (match?.groups?.component) {
                                    contentComponents.push(match.groups?.component)
                                }
                            })

                    }
                    rawContentData.add(fileDataItem)
                }
            }

        }

        const getFileData = async (matter: any, markdown: string) => {
            const matterResult = matter(markdown)
            const content = matterResult.content.trim()
            const data = matterResult.data
            return {
                body: content,
                data: data,
            }
        }


        const loadLayersContent = async () => {
            const _layers = [...nuxt.options._layers].reverse()
            for (const layer of _layers) {
                const srcDir = layer.config.srcDir
                const globalComponents = moduleResolver.resolve(srcDir, "components/content")
                const layerContent = moduleResolver.resolve(srcDir, "content")

                await populateContent(layerContent, layerContent)

                const dirStat = await fs.promises.stat(globalComponents).catch(() => null)
                if (dirStat && dirStat.isDirectory()) {
                    nuxt.hook("components:dirs", (dirs) => {
                        dirs.unshift({
                            path: globalComponents,
                            global: true,
                            pathPrefix: false,
                            prefix: ""
                        })
                    })
                }
            }

        }

        await loadLayersContent()

        fs.mkdirSync(path.dirname(jsonPath), {recursive: true})
        fs.writeFileSync(jsonPath, JSON.stringify([...rawContentData]))

        // watch for changes to content files during development and rebuild the content-lite.json file
        if (nuxt.options.dev) {
            const websocketServer = require("ws").Server
            const wss = new websocketServer({port: 24931})

            const chokidar = require("chokidar")
            const watcher = chokidar.watch(path.resolve(".", moduleOptions.contentDir), {
                ignored: /(^|[/\\])\../,
                persistent: true
            })

            watcher.on("change", async (path: string) => {
                // find the item in the set and update it
                const filePath = path.replace(/\\/g, "/")
                const item = [...rawContentData]
                    .find((item) => filePath.endsWith(item[0]))

                if (!item) {
                    return
                }

                const fileStat = fs.statSync(filePath)
                const fileContents = fs.readFileSync(filePath, "utf-8")
                const fileData = await getFileData(require("gray-matter"), fileContents)
                item[1] = fileStat.mtime.toISOString()
                item[2] = fileData.data
                item[3] = fileData.body

                await fs.promises.writeFile(jsonPath, JSON.stringify([...rawContentData]))

                wss.clients.forEach((client: WebSocketClient) => {
                    client.send("content-updated")
                })
            })

            addPlugin({
                src: moduleResolver.resolve("./runtime/dev-plugin.client.ts")
            })
        }
    }
})

