import { pascalCase } from "scule"

export async function resolveContentComponents(componentNames: Array<string>) {
    // @ts-ignore
    const manifest = await import("#build/content-components").catch(() => ( {} ))
    console.log(manifest)

    const resolvedComponentsEntries = await Promise.all(componentNames
        .map(async (c) => {
            const pcC = pascalCase(c)
            const componentImporter = manifest[pcC]
            console.log("pcC", pcC, "componentImporter", componentImporter)

            if (typeof componentImporter === "function") {
                return await componentImporter()
            }
            return c
        }))

    return Object.fromEntries(resolvedComponentsEntries)
}

