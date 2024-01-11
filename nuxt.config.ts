import { defineBuildConfig } from "unbuild"

export default defineBuildConfig({
    dependencies: [
        "h3",
        "content-lite",
        "fs",
        "path",
        "gray-matter",
        "micromark",
    ],
})
