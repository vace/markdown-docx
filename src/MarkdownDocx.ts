import { Document, FileChild, IPropertiesOptions, IStylesOptions, Paragraph, ParagraphChild } from 'docx'
import { Tokens } from 'marked'

import { renderBlocks, renderTokens } from './renders'
import { createDocumentStyle, numbering, styles } from './styles'
import { tokenize } from './tokenize'
import { IBlockAttr, IBlockToken, IInlineToken, ITextAttr, MarkdownDocxOptions, MarkdownImageItem } from './types'
import { getImageTokens } from './utils'

export class MarkdownDocx {

  public static defaultOptions: MarkdownDocxOptions = {
    gfm: true,
    math: { engine: 'katex' },
  }

  public styles = styles

  public store = new Map<Symbol, any>()

  public static covert(
    markdown: string,
    _options: MarkdownDocxOptions = {}
  ) {
    return new MarkdownDocx(markdown, _options).toDocument()
  }

  protected _imageStore = new Map<string, MarkdownImageItem>()

  private footnotes: Record<string, { children: Paragraph[] }> = {}

  public constructor(
    public markdown: string,
    public options: MarkdownDocxOptions = {}
  ) {

    this.options = {
      ...MarkdownDocx.defaultOptions,
      ...options,
    }
  }

  get ignoreImage() {
    return !!this.options.ignoreImage
  }

  get ignoreFootnote() {
    return !!this.options.ignoreFootnote
  }

  get ignoreHtml() {
    return !!this.options.ignoreHtml
  }

  public async toDocument(options?: Omit<IPropertiesOptions, 'sections'>) {
    this.footnotes = {}

    const section = await this.toSection()
    const doc = new Document({
      numbering,
      styles: createDocumentStyle({ theme: this.options.theme}),
      ...this.options.document,
      ...options,
      footnotes: this.footnotes,
      sections: [
        {
          children: section,
        }
      ],
    })
    return doc
  }

  public async toSection() {
    const tokenList = tokenize(this)

    // parse image
    if (!this.ignoreImage) {
      const imageList = getImageTokens(tokenList)
      if (imageList.length) {
        await this.downloadImageList(imageList)
      }
    }

    return this.toBlocks(tokenList)
  }

  public async downloadImageList(tokens: Tokens.Image[]) {
    const imageAdapter = this.options.imageAdapter
    if (typeof imageAdapter !== 'function') {
      throw new Error('MarkdownDocx.imageAdapter is not a function')
    }
    const store = this._imageStore
    const promises = tokens.map((token) => {
      if (store.has(token.href)) {
        return Promise.resolve(store.get(token.href))
      }

      const cache: MarkdownImageItem = {} as unknown as MarkdownImageItem
      store.set(token.href, cache)

      return imageAdapter(token).then(item => {
        Object.assign(cache, item)
        return cache
      })
    })
    return Promise.all(promises)
  }

  public toBlocks(tokens: IBlockToken[], attr: IBlockAttr = {}): FileChild[] {
    return renderBlocks(this, tokens, attr)
  }

  public toTexts(tokens: IInlineToken[], attr: ITextAttr = {}): ParagraphChild[] {
    return renderTokens(this, tokens, attr)
  }

  public addFootnote(id: number, children: Paragraph[]) {
    this.footnotes[id] = {
      children: children,
    }
  }

  public findImage(token: Tokens.Image): MarkdownImageItem | null {
    const image = this._imageStore.get(token.href)
    if (!image) {
      return null
    }
    return image
  }

  public _blockRender: Map<string, Function> = new Map()
  public _inlineRender: Map<string, Function> = new Map()

  public addBlockRender(blockType: string, renderFn: Function) {
    this._blockRender.set(blockType, renderFn)
  }

  public addInlineRender(inlineType: string, renderFn: Function) {
    this._inlineRender.set(inlineType, renderFn)
  }

  public useBlockRender(block: IBlockToken, attr: IBlockAttr): FileChild | FileChild[] | false | null {
    const renderFn = this._blockRender.get(block.type)
    if (renderFn) {
      return renderFn(this, block, attr)
    }
    return null
  }

  public useInlineRender(token: IInlineToken, attr: ITextAttr): ParagraphChild | ParagraphChild[] | false | null {
    const renderFn = this._inlineRender.get(token.type)
    if (renderFn) {
      return renderFn(this, token, attr)
    }
    return null
  }
}
