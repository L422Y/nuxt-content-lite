import { addComponentsDir, addImportsDir, addServerHandler, createResolver, defineNuxtModule } from "@nuxt/kit"
import { type ContentLiteRawItem } from "./runtime/composables/useContentLite"
import fs from "fs"
import path from "path"
import { registerTS } from "@vue/compiler-sfc"

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

        const baseDir = path.resolve(".", moduleOptions.contentDir)

        addServerHandler({
            route: "/.content-lite/content-lite.json",
            handler: moduleResolver.resolve("./runtime/endpoint.get")
        })


        // nuxt.options.nitro.publicAssets ??= []
        // nuxt.options.nitro.publicAssets.push({
        //     baseURL: "/.content-lite/",
        //     dir: contentLiteDir,
        //     maxAge: 1,
        // })
        const populateContent = async (currentPath: string = moduleOptions.contentDir) => {

            const path = require("path")
            const matter = require("gray-matter")


            // recursively walk the content directory and populate the contentData from the markdown files
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
                    await populateContent(filePath)
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

        addImportsDir(moduleResolver.resolve("./runtime/composables"))
        await addComponentsDir({
            path: moduleResolver.resolve("./runtime/components"),
            global: true,
        })

        await populateContent().then(() => {
            fs.mkdirSync(path.dirname(jsonPath), {recursive: true})
            fs.writeFileSync(jsonPath, JSON.stringify([...rawContentData]))
        })

        nuxt.hook("build:before", () => {


            console.log("contentComponents", nuxt.options.nitro.publicAssets)
        })


        // Register user global components, yoinked from @nuxt/content :)
        const _layers = [...nuxt.options._layers].reverse()
        for (const layer of _layers) {
            const srcDir = layer.config.srcDir
            const globalComponents = moduleResolver.resolve(srcDir, "components/content")
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
})

