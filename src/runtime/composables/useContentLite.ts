import { useRoute, useState } from "nuxt/app"
import type { ContentLiteRawItem, IContentLiteFindOptions, IContentLiteItem, IContentLiteOptions } from "../types"
import type { Ref } from "vue"
import { reactive } from "vue"
import { parse } from "marked"

let globalOptions: IContentLiteOptions = {
    filterable: false,
    flattenData: true,
}

export const useContentLite = async (options?: IContentLiteOptions) => {

    globalOptions = {
        ...globalOptions,
        ...options
    }

    const contentData: Ref<IContentLiteItem[] | undefined> = useState("contentData", () => undefined)

    const makeFlat = (item: IContentLiteItem): IContentLiteItem & { [key: string]: any } => {
        for (const key in item.data) {
            // @ts-ignore
            item[key] = item.data[key]
        }
        return item
    }

    /**
     * Filter out words that are not useful for searching, and create a map of useful words to the number of times they appear
     * @param content
     */
    const makeFilterable = (content: IContentLiteItem): IContentLiteItem & { [key: string]: any } => {
        const words = new Map<string, number>()
        const dataString = Object.values(content.data).join(" ")
        const contentString = content.content
        const bigString = dataString + " " + contentString
        // create a map of all words, with the value being the number of times the word appears
        let rawWords = bigString.toLowerCase()
            // replace all newlines with spaces
            .replace(/\n/g, " ")
            // remove html tags
            .replace(/<[^>]*>?/gm, "")
            // remove punctuation
            .replace(/[^a-z0-9]/g, " ")
            .split(" ")
        rawWords = rawWords.filter((word) => word.length > 3)
        rawWords.forEach((word) => {
            if (words.has(word)) {
                words.set(word, words.get(word)! + 1)
            } else {
                words.set(word, 1)
            }
        })

        content.words = words
        return content
    }

    const initializeData = async () => {
        const contentData: Ref<IContentLiteItem[] | undefined> = useState("contentData", () => undefined)
        if (!contentData.value) {
            if (process.dev) {
                contentData.value = reactive(await loadContentData())
            } else {
                contentData.value = await loadContentData()
            }
        }
    }

    const loadContentData = async () => {
        return await $fetch("/.content-lite/content-lite.json")
            .then((data: any) => {
                if (!data) {
                    throw new Error("Content data not loaded")
                }
                // process tuples into objects
                const converted = ( data as ContentLiteRawItem[] )
                    .map((item, index: number) => {
                        const [source, modified, data, content] = item

                        if (!source.endsWith(".md")) {
                            throw new Error(`Invalid source file ${source}`)
                        }

                        const path = "/" + source?.replace(/\/index\.md$/, "").replace(/\.md$/, "")

                        const parentPaths = source?.split("/").filter((path) => path.length > 0)
                        parentPaths.pop()

                        let newItem = {
                            _clId: index,
                            slug: path?.split("/").pop()!,
                            source,
                            path,
                            parentPaths,
                            content: parse(content),
                            modified: new Date(modified),
                        } as IContentLiteItem

                        if (globalOptions?.filterable) {
                            newItem.words = makeFilterable(newItem).words
                        }

                        if (globalOptions?.flattenData) {
                            Object.assign(newItem, data)
                        } else {
                            newItem.data = data
                        }

                        return newItem
                    })

                return reactive(converted)

            }).catch((error) => {
                console.error("error", error)
                throw error
            })
    }


    const findOne = async (path?: string, options?: IContentLiteFindOptions): Promise<IContentLiteItem & {
        [key: string]: any
    } | undefined> => {
        if (contentData.value === undefined) {
            throw new Error("Content data not loaded")
        }

        if (!path || path === "*") {
            return undefined
        }

        if (path === "/") {
            path = "/index"
        }

        if (path.endsWith("/")) path = path.slice(0, -1)
        if (!path.startsWith("/")) path = "/" + path
        let item = [...contentData.value].find((content) => {
            return content.path === path || content.source === path || content.parentPaths.includes(path!)
        })

        if (!item) {
            return undefined
        }

        return item
    }

    const $route = useRoute()

    const routeContent = async (options?: IContentLiteFindOptions):
        Promise<Array<IContentLiteItem & { [key: string]: any }>> => {
        return await find($route.path, options)
    }

    const singleRouteContent = async (options?: IContentLiteFindOptions):
        Promise<IContentLiteItem & { [key: string]: any } | undefined> => {
        return await findOne($route.path, options)
    }

    const find = async (path?: string, options?: IContentLiteFindOptions):
        Promise<Array<IContentLiteItem & { [key: string]: any }>> => {

        if (contentData.value === undefined) {
            throw new Error("Content data not loaded")
        }

        if (!path || path === "/" || path === "*") {
            return [...contentData.value]
        }

        if (path.endsWith("/")) path = path.slice(0, -1)
        if (path.startsWith("/")) path = path.slice(1)

        let results = [...contentData.value].filter((content) => {
            return content.path === `/${path}` || content.parentPaths.includes(path!)
        })

        results = results.filter((item) => {
            return !item.source.endsWith("/index.md")
        })

        return results
    }

    const reload = async () => {
        const newContentData = await loadContentData()
        newContentData.forEach((newItem) => {
            const oldItem = contentData.value?.find((item) => item.source === newItem.source)
            if (oldItem) {

                if (globalOptions?.filterable) {
                    newItem = makeFilterable(newItem)
                }

                if (globalOptions?.flattenData) {
                    newItem = makeFlat(newItem)
                }

                Object.assign(oldItem, newItem)
            }
        })
    }


    if (!contentData.value) {
        await initializeData()
    }


    return {
        contentData,
        singleRouteContent,
        routeContent,
        findOne,
        find,
        reload
    }
}
