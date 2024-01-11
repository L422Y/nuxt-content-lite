import { pascalCase } from "scule"

export async function resolveContentComponents(componentNames: Array<string>) {
    // @ts-ignore
    const manifest = await import("#build/content-components").catch(() => ( {} ))
    const resolvedComponentsEntries = await Promise.all(componentNames
        .map(async (c) => {
            const pcC = pascalCase(c)
            const componentImporter = manifest[pcC]

            if (typeof componentImporter === "function") {
                return await componentImporter()
            }
            return c
        }))

    return Object.fromEntries(resolvedComponentsEntries)
}

