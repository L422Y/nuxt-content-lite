import { _Renderer } from "./Renderer"
import { _TextRenderer } from "./TextRenderer"
import { _defaults } from "./defaults"
import type { Token, Tokens } from "./Tokens"
import type { MarkedOptions } from "./MarkedOptions"
import type { RendererElement, RendererNode, VNode } from "vue"

/**
 * Parsing & Compiling
 */
export class _Parser {
    options: MarkedOptions
    renderer: _Renderer
    textRenderer: _TextRenderer

    constructor(options?: MarkedOptions) {
        this.options = options || _defaults
        this.options.renderer = this.options.renderer || new _Renderer()
        this.renderer = this.options.renderer
        this.renderer.options = this.options
        this.textRenderer = new _TextRenderer()
    }

    /**
     * Static Parse Method
     */
    static parse(tokens: Token[], options?: MarkedOptions) {
        const parser = new _Parser(options)
        return parser.parse(tokens)
    }

    /**
     * Static Parse Inline Method
     */
    static parseInline(tokens: Token[], options?: MarkedOptions) {
        const parser = new _Parser(options)
        return parser.parseInline(tokens)
    }

    /**
     * Parse Loop
     */
    parse(tokens: Token[], top = true): ( VNode | string )[] {
        const out: ( VNode | string )[] = []

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i]

            // Run any renderer extensions
            // if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
            //     const genericToken = token as Tokens.Generic
            //     const ret = this.options.extensions.renderers[genericToken.type].call({parser: this}, genericToken)
            //     if (ret !== false || !["component","space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(genericToken.type)) {
            //         out.push(ret || "")
            //         continue
            //     }
            // }


            switch (token.type) {


                case "space": {
                    continue
                }
                case "hr": {
                    out.push(this.renderer.hr())
                    continue
                }
                case "heading": {
                    const headingToken = token as Tokens.Heading
                    out.push(this.renderer.heading(
                            this.parseInline(headingToken.tokens),
                            headingToken.depth
                        )
                    )
                    continue
                }
                case "code": {
                    const codeToken = token as Tokens.Code
                    out.push(this.renderer.code(codeToken.text,
                        codeToken.lang,
                        !!codeToken.escaped)
                    )
                    continue
                }

                case "table": {
                    const tableToken = token as Tokens.Table

                    // header
                    let cell: string | VNode<RendererNode, RendererElement, { [key: string]: any }>[] = []
                    for (let j = 0; j < tableToken.header.length; j++) {
                        cell.push(this.renderer.tablecell(
                            this.parseInline(tableToken.header[j].tokens),
                            {header: true, align: tableToken.align[j]}
                        ))
                    }
                    const header = this.renderer.tablerow(cell)

                    const body = []
                    for (let j = 0; j < tableToken.rows.length; j++) {
                        const row = tableToken.rows[j]

                        cell = []
                        for (let k = 0; k < row.length; k++) {
                            cell.push(this.renderer.tablecell(
                                this.parseInline(row[k].tokens),
                                {header: false, align: tableToken.align[k]}
                            ))
                        }

                        body.push(this.renderer.tablerow(cell))
                    }
                    out.push(this.renderer.table(header, body))
                    continue
                }
                case "blockquote": {
                    const blockquoteToken = token as Tokens.Blockquote
                    const body = this.parse(blockquoteToken.tokens)
                    out.push(this.renderer.blockquote(body))
                    continue
                }
                case "list": {
                    const listToken = token as Tokens.List
                    const ordered = listToken.ordered
                    const start = listToken.start
                    const loose = listToken.loose

                    const body = []
                    for (let j = 0; j < listToken.items.length; j++) {
                        const item = listToken.items[j]
                        // TODO: Fix tasklists
                        // const checked = item.checked;
                        // const task = item.task;
                        // let itemBody = []
                        // if (item.task) {
                        //     const checkbox = this.renderer.checkbox(!!checked);
                        //     if (loose) {
                        //         if (item.tokens.length > 0 && item.tokens[0].type === 'paragraph') {
                        //             item.tokens[0].text = checkbox + ' ' + item.tokens[0].text;
                        //             if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === 'text') {
                        //                 item.tokens[0].tokens[0].text = checkbox + ' ' + item.tokens[0].tokens[0].text;
                        //             }
                        //         } else {
                        //             item.tokens.unshift({
                        //                 type: 'text',
                        //                 text: checkbox + ' '
                        //             } as Tokens.Text);
                        //         }
                        //     } else {
                        //         itemBody.push(checkbox + ' ');
                        //     }
                        // }

                        // itemBody.push(this.parseInline(item.tokens));
                        // body.push(this.renderer.listitem(itemBody, task, !!checked));
                        const childNodes = this.parseInline(item.tokens)
                        body.push(this.renderer.listitem(childNodes))
                    }

                    out.push(this.renderer.list(body, ordered, start))
                    continue
                }
                case "html": {
                    const htmlToken = token as Tokens.HTML
                    out.push(this.renderer.html(htmlToken.text, htmlToken.block))
                    continue
                }
                case "paragraph": {
                    const paragraphToken = token as Tokens.Paragraph
                    out.push(this.renderer.paragraph(this.parseInline(paragraphToken.tokens)))
                    continue
                }

                case "text": {
                    out.push(token.text)
                    continue
                }


                case "component": {
                    const componentToken = token as Tokens.Component
                    if (componentToken.name) {
                        // out.push(resolveComponent(componentToken.name) || componentToken.name)
                        out.push(this.renderer.component(componentToken.name, componentToken.props, componentToken.tokens))
                    }
                    continue
                }

                default: {
                    const errMsg = "Token with \"" + token.type + "\" type was not found."
                    if (this.options.silent) {
                        console.error(errMsg)
                        return [errMsg]
                    } else {
                        throw new Error(errMsg)
                    }
                }
            }
        }

        return out
    }

    /**
     * Parse Inline Tokens
     */
    parseInline(tokens: Token[], renderer?: _Renderer): ( VNode | string )[] {
        renderer = renderer || this.renderer
        const out = []

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i]

            // Run any renderer extensions
            if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
                const ret = this.options.extensions.renderers[token.type].call({parser: this}, token)
                if (ret !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(token.type)) {
                    out.push(ret || "")
                    continue
                }
            }

            switch (token.type) {
                case "escape": {
                    const escapeToken = token as Tokens.Escape
                    out.push(renderer.text(escapeToken.text))
                    break
                }
                case "html": {
                    const tagToken = token as Tokens.Tag
                    out.push(renderer.html(tagToken.text))
                    break
                }
                case "link": {
                    const linkToken = token as Tokens.Link
                    out.push(
                        renderer.link(
                            linkToken.href,
                            linkToken.title,
                            this.parseInline(linkToken.tokens, renderer)
                        )
                    )
                    break
                }
                case "image": {
                    const imageToken = token as Tokens.Image
                    out.push(renderer.image(imageToken.href, imageToken.title, imageToken.text))
                    break
                }
                case "strong": {
                    const strongToken = token as Tokens.Strong
                    out.push(renderer.strong(this.parseInline(strongToken.tokens, renderer)))
                    break
                }
                case "em": {
                    const emToken = token as Tokens.Em
                    out.push(renderer.em(this.parseInline(emToken.tokens, renderer)))
                    break
                }
                case "codespan": {
                    const codespanToken = token as Tokens.Codespan
                    out.push(renderer.codespan([codespanToken.text]))
                    break
                }
                case "br": {
                    out.push(renderer.br())
                    break
                }
                case "del": {
                    const delToken = token as Tokens.Del
                    out.push(renderer.del(this.parseInline(delToken.tokens, renderer)))
                    break
                }
                case "text": {
                    const textToken = token as Tokens.Text
                    // out.push(renderer.text(this.parseInline(textToken.text, renderer)))
                    if (textToken.tokens && textToken.tokens.length > 0) {
                        out.push(renderer.text(this.parseInline(textToken.tokens, renderer)))
                    } else {
                        out.push(textToken.text)
                    }
                    break
                }

                case "component": {
                    const componentToken = token as Tokens.Component
                    if (componentToken.name) {
                        // out.push(resolveComponent(componentToken.name) || componentToken.name)
                        // out.push(renderer.component(componentToken.name, componentToken.props, componentToken.tokens))

                    }
                    continue

                }

                default: {
                    const errMsg = "Token with \"" + token.type + "\" type was not found."
                    if (this.options.silent) {
                        console.error(errMsg)
                        return [errMsg]
                    } else {
                        throw new Error(errMsg)
                    }
                }
            }
        }
        return out
    }
}
