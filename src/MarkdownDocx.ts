import { Tokens } from "marked";
import { tokenize } from "./tokenize";
import { Document, FileChild, IPropertiesOptions, Paragraph, ParagraphChild } from "docx";
import { numbering } from "./styles/numbering";
import { IBlockAttr, IBlockToken, IInlineToken, ITextAttr, MarkdownDocxOptions, MarkdownImageItem } from "./types";
import { renderBlocks, renderTokens } from "./renders";
import { getImageTokens } from "./utils";

export class MarkdownDocx  {

  public static defaultOptions: MarkdownDocxOptions = {
    gfm: true,
  }

  public static covert(
    markdown: string,
    _options: MarkdownDocxOptions = {}
  ) {
    return new MarkdownDocx(markdown, _options).toDocument()
  }

  protected _imageStore = new Map<string, MarkdownImageItem>()

  private footnotes:Record<string, { children: Paragraph[]}> = {}

  public constructor (
    public markdown: string,
    public options: MarkdownDocxOptions = {}
  ) {
    this.options = {
      ...MarkdownDocx.defaultOptions,
      ...options,
    }
  }

  public async toDocument(options?: Omit<IPropertiesOptions, 'sections'>) {
    this.footnotes = {}

    const section = await this.toSection()
    
    const doc = new Document({
      ...options,
      numbering: {
        ...options?.numbering,
        ...numbering,
      },
      footnotes: this.footnotes,
      sections: [
        {
          children: section,
        }
      ],
    })
    return doc
  }

  public async toSection () {
    const tokenList = tokenize(this.markdown, this.options)
    const imageList = getImageTokens(tokenList)
    if (imageList.length) {
      await this.downloadImageList(imageList)
    }
    return this.toBlocks(tokenList)
  }

  public async downloadImageList (tokens: Tokens.Image[]) {
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
}
