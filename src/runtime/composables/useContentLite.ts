import { useState } from "nuxt/app"
import { micromark } from "micromark"
import type {
    ContentLiteRawItem,
    IContentLiteFindOptions,
    IContentLiteItem,
    IContentLiteOptions
} from "~/src/runtime/types"

let globalOptions: IContentLiteOptions = {
    filterable: false,
    flattenData: true,
    contentDir: "content",
}

export type {
    ContentLiteRawItem,
    IContentLiteFindOptions,
    IContentLiteItem,
    IContentLiteOptions
} from "~/src/runtime/types"

const filterAbleResults = (content: IContentLiteItem): IContentLiteItem & { [key: string]: any } => {
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


    const words = new Map<string, number>()
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
        contentData.value = await $fetch("/.content-lite/content-lite.json")
            .then((data: any) => {
                if (!data) {
                    throw new Error("Content data not loaded")
                }
                // process tuples into objects
                return ( data as ContentLiteRawItem[] )
                    .map((item, index: number) => {
                        const [source, modified, data, content] = item
                        const parentPaths = source.split("/").filter((path) => path.length > 0)
                        const path = "/" + source.replace(/\/index\.md$/, "").replace(/\.md$/, "")
                        parentPaths.pop()
                        const newItem = {
                            _clId: index,
                            slug: path.split("/").pop()!,
                            source,
                            path,
                            parentPaths,
                            data,
                            content: micromark(content),
                            modified: new Date(modified),
                        } as IContentLiteItem

                        if (globalOptions?.filterable) {
                            newItem.words = filterAbleResults(newItem).words
                        }

                        return newItem
                    })


            }).catch((error) => {
                console.error("error", error)
                throw error
            })
    }
}

export const useContentLite = async (options?: IContentLiteOptions) => {

    globalOptions = {
        ...globalOptions,
        ...options
    }

    const contentData: Ref<IContentLiteItem[] | undefined> = useState("contentData", () => undefined)

    if (!contentData.value) {
        await initializeData()
    }

    const findOne = async (path?: string, options?: IContentLiteFindOptions): Promise<IContentLiteItem & {
        [key: string]: any
    } | undefined> => {
        if (contentData.value === undefined) {
            throw new Error("Content data not loaded")
        }

        if (!path || path === "/" || path === "*") {
            return undefined
        }

        if (path.endsWith("/")) path = path.slice(0, -1)
        if (!path.startsWith("/")) path = "/" + path
        let item = [...contentData.value].find((content) => {
            return content.path === path || content.source === path || content.parentPaths.includes(path!)
        })

        if (!item) {
            return undefined
        }

        if (globalOptions?.filterable || options?.filterable) {
            item.words = filterAbleResults(item).words
        }

        if (globalOptions?.flattenData || options?.flattenData) {
            item = {...item, ...item.data}
        }

        return item
    }

    const routeContent = async (options?: IContentLiteFindOptions):
        Promise<Array<IContentLiteItem & { [key: string]: any }>> => {
        const path = useRoute().path
        return await find(path, options)
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

        if (globalOptions?.filterable || options?.filterable) {
            results = results.map(filterAbleResults)
        }

        if (globalOptions?.flattenData || options?.flattenData) {
            results = results.map((item) => {
                const newItem = {...item}
                newItem.data = undefined
                return {...newItem, ...item.data}
            })
        }

        return results
    }


    return {
        routeContent,
        findOne,
        find,
        contentData
    }
}
