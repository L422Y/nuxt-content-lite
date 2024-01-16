import * as path from "path"
import * as fs from "fs"
import { eventHandler } from "h3"

let json: any

export default eventHandler(async () => {
    if (json === undefined || process.dev) {
        const jsonPath = path.resolve("./", ".cache/content-lite/content-lite.json")
        json = fs.promises.readFile(jsonPath, "utf-8").then((data) => JSON.parse(data))
    }
    return json || {}
})
