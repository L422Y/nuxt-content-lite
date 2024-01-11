import { H3Event } from "h3"
import * as path from "path"
import * as fs from "fs"
import { createResolver } from "@nuxt/kit"

let json: any

export default eventHandler(async (event: H3Event) => {
    if (json === undefined) {
        console.log(path.resolve("."))
        const jsonPath = path.resolve("./", ".cache/content-lite/content-lite.json")
        json = fs.promises.readFile(jsonPath, "utf-8").then((data) => JSON.parse(data))
    }
    return json || {}
})
