export interface IContentLiteOptions {
    /**
     * Whether to return filterable content, which includes set of all unique words for each content item
     */
    filterable?: boolean

    /**
     * Whether to flatten the content item data into the parent content item
     */
    flattenData?: boolean
}

export interface IContentLiteItem {
    _clId: number
    slug: string
    source: string
    path: string
    parentPaths: string[]
    data: any
    content: string
    modified: Date
    words?: Map<string, number>
}

/**
 * The raw content item, as it is stored in the database
 *
 */
export type ContentLiteRawItem = [
    /** The path to the content item */
    string,
    /** The modified date of the content item */
    string,
    /** The data of the content item */
    any,
    /** The content of the content item */
    string
]

export interface IContentLiteFindOptions {
    filterable?: boolean
    flattenData?: boolean
}
