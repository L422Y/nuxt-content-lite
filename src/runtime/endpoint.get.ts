import * as path from "path"
import * as fs from "fs"

let json: any

export default defineEventHandler(async () => {
    if (json === undefined) {
        const jsonPath = path.resolve("./", ".cache/content-lite/content-lite.json")
        json = fs.promises.readFile(jsonPath, "utf-8").then((data) => JSON.parse(data))
    }
    return json || {}
})
