import { _defaults } from "./defaults"
import { cleanUrl, escape } from "./helpers"
import type { MarkedOptions } from "./MarkedOptions.ts"
import { type VNode } from "vue"

/**
 * Renderer
 */
export class _Renderer {
    options: MarkedOptions

    constructor(options?: MarkedOptions) {
        this.options = options || _defaults
    }

    code(code: string, infostring: string | undefined, escaped: boolean): VNode {
        const lang = ( infostring || "" ).match(/\S*/)?.[0]
        // if (this.options.highlight) {
        //     const out = this.options.highlight(code, lang)
        //     if (out != null && out !== code) {
        //         escaped = true
        //         code = out
        //     }
        // }

        if (!lang) {
            return h("pre", {}, h("code", {innerHTML: escaped ? code : escape(code, true)}))
        }

        return h("pre", {class: "code--" + escape(lang, true)}, h("code", {
            class: "code--" + escape(lang, true),
            innerHTML: escaped ? code : escape(code, true)
        }))
    }

    blockquote(quote: Array<string | VNode>): VNode {
        return h("blockquote", {}, quote)
    }

    html(html: string, block?: boolean): VNode {
        return h("span", {innerHTML: html})
    }

    heading(children: Array<VNode | string>, level: number): VNode {
        // ignore IDs
        return h("h" + level, {}, children)
    }

    hr(): VNode {
        return h("hr")
    }

    list(body: ( VNode | string )[], ordered: boolean, start: number | ""): VNode {
        const type = ordered ? "ol" : "ul"
        const startatt = ordered && start !== 1 ? {start: start} : {}
        return h(type, startatt, body)
    }


    listitem(childNodes: ( VNode | string )[]): VNode {
        return h("li", {}, childNodes)
    }

    checkbox(checked: boolean): VNode {
        interface Props {
            type: string
            disabled: boolean
            checked?: ""
        }

        const props: Props = {
            type: "checkbox",
            disabled: true,
        }
        if (checked) {
            props["checked"] = ""
        }

        return h("input", props)
    }

    unescape(text: string): string {
        // emulate unescape unicodes -- &#39;
        return text.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'")

    }

    unescapeChildren(children: Array<VNode | string>): Array<VNode | string> {
        return children.map((child) => {
            if (typeof child === "string") {
                return this.unescape(child)
            }
            return child
        })
    }

    paragraph(text: Array<string | VNode>): VNode {



        return h("p", {}, this.unescapeChildren(text))
    }

    table(header: VNode, body: VNode[]): VNode {
        return h("table", {}, [header, ...body])
    }

    tablerow(content: VNode[]): VNode {
        return h("tr", {}, content)
    }

    tablecell(content: Array<VNode | string>, flags: {
        header: boolean;
        align: "center" | "left" | "right" | null;
    }): VNode {
        const type = flags.header ? "th" : "td"
        const align = flags.align ? {style: "text-align:" + flags.align} : {}
        return h(type, align, content)
    }

    /**
     * span level renderer
     */
    strong(childNodes: Array<VNode | string>): VNode {
        return h("strong", {}, childNodes)
    }

    em(text: any[]): VNode {
        return h("em", {}, text)
    }

    codespan(childNodes: Array<VNode | string>): VNode {
        return h("code", {}, childNodes)
    }

    br(): VNode {
        return h("br")
    }

    del(text: any[]): VNode {
        return h("del", {}, text)
    }

    link(href: string, title: string | null | undefined, childNodes: Array<VNode | string>): VNode {

        const cleanHref = cleanUrl(href)
        if (cleanHref === null) {
            return h("a", {}, childNodes)
        }
        href = cleanHref
        return h("a", {href: href, title: title}, childNodes)
    }

    image(href: string, title: string | null, text: string): VNode {
        const cleanHref = cleanUrl(href)
        if (cleanHref === null) {
            return h("img", {innerHTML: text})
        }
        href = cleanHref
        return h("img", {src: href, title: title, alt: text})
    }

    text(text: any): VNode | string {
        return text
    }

    component(name: string, props: any, children: any): VNode {
        const component = resolveComponent(name)
        return h(component, props, () => children)
    }
}
