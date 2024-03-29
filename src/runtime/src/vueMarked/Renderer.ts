import { _defaults } from "./defaults"
import { cleanUrl, escape } from "./helpers"
import type { MarkedOptions } from "./MarkedOptions.ts"
import { resolveComponent, h, type VNode } from "vue"

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
        return h("blockquote", {}, this.unescapeChildren(quote))
    }

    html(html: string, block?: boolean): VNode {
        return h("span", {innerHTML: html})
    }

    heading(children: Array<VNode | string>, level: number): VNode {
        // ignore IDs
        return h("h" + level, {}, this.unescapeChildren(children))
    }

    hr(): VNode {
        return h("hr")
    }

    list(body: ( VNode | string )[], ordered: boolean, start: number | ""): VNode {
        const type = ordered ? "ol" : "ul"
        const startatt = ordered && start !== 1 ? {start: start} : {}
        return h(type, startatt, this.unescapeChildren(body))
    }


    listitem(childNodes: ( VNode | string )[]): VNode {
        return h("li", {}, this.unescapeChildren(childNodes))
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
        const entities: { [key: string]: string } = {
            "&amp;": "&",
            "&quot;": "\"",
            "&#39;": "'",
            "&#x3A;": ":",
            "&lt;": "<",
            "&gt;": ">",
            "&nbsp;": " ",
            "&iexcl;": "¡",
            "&cent;": "¢",
            "&pound;": "£",
            "&curren;": "¤",
            "&yen;": "¥",
            "&brvbar;": "¦",
            "&sect;": "§",
            "&uml;": "¨",
            "&copy;": "©",
            "&ordf;": "ª",
            "&laquo;": "«",
            "&not;": "¬",
            "&shy;": "\u00AD", // Soft hyphen
            "&reg;": "®",
            "&macr;": "¯",
            "&deg;": "°",
            "&plusmn;": "±",
            "&sup2;": "²",
            "&sup3;": "³",
            "&acute;": "´",
            "&micro;": "µ",
            "&para;": "¶",
            "&middot;": "·",
            "&cedil;": "¸",
            "&sup1;": "¹",
            "&ordm;": "º",
            "&raquo;": "»",
            "&frac14;": "¼",
            "&frac12;": "½",
            "&frac34;": "¾",
            "&iquest;": "¿",
            "&Agrave;": "À",
            "&Aacute;": "Á",
        }
        return text.replace(/&[#a-zA-Z0-9]+;/g, (match: string) => entities[match] || match)
    }

    unescapeChildren(children: Array<VNode | string | any>): Array<VNode | string | any> {
        return children.map((child) => {
            if (typeof child === "string") {
                return this.unescape(child)
            } else if (child.children && Array.isArray(child.children)) {
                child.children = this.unescapeChildren(child.children)
            } else if (child.length && Array.isArray(child)) {
                child = this.unescapeChildren(child)
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
        return h("strong", {},  this.unescapeChildren(childNodes))
    }

    em(text: any[]): VNode {
        return h("em", {}, this.unescapeChildren(text))
    }

    codespan(childNodes: Array<VNode | string>): VNode {
        return h("code", {}, childNodes)
    }

    br(): VNode {
        return h("br")
    }

    del(text: any[]): VNode {
        return h("del", {}, this.unescapeChildren(text))
    }

    link(href: string, title: string | null | undefined, childNodes: Array<VNode | string>): VNode {

        const cleanHref = cleanUrl(href)
        if (cleanHref === null) {
            return h("a", {}, this.unescapeChildren(childNodes))
        }
        href = cleanHref
        return h("a", {href: href, title: title},  this.unescapeChildren(childNodes))
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
