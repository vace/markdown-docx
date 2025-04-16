import { MarkedOptions, Tokens } from "marked";
import { Footnote, FootnoteRef } from "./extensions";

export type MarkdownImageType = 'jpg' | 'png' | 'gif' | 'bmp'

export type MarkdownImageItem = {
  type: MarkdownImageType
  data: Buffer | string | Uint8Array | ArrayBuffer
  width: number
  height: number
}

export type MarkdownImageAdapter = (token: Tokens.Image) => Promise<null | MarkdownImageItem>

export interface MarkdownDocxOptions extends MarkedOptions {
  imageAdapter?: MarkdownImageAdapter

  /**
   * do not download image
   * @default false
   */
  ignoreImage?: boolean

  /**
   * do not parse footnote
   * @default false
   */
  ignoreFootnote?: boolean

  /**
   * do not parse html
   * @default false
   */
  ignoreHtml?: boolean
}

export type IBlockToken =
  | Tokens.Space
  | Tokens.Code
  | Tokens.Heading
  | Tokens.Hr
  | Tokens.Blockquote
  | Tokens.List
  | Tokens.HTML
  | Tokens.Def
  | Tokens.Table
  | Tokens.Heading
  | Tokens.Paragraph
  | Tokens.Text
  // plugin
  | Footnote

export type IInlineToken =
  | Tokens.Escape
  | Tokens.Tag
  | Tokens.Link
  | Tokens.Em
  | Tokens.Strong
  | Tokens.Codespan
  | Tokens.Br
  | Tokens.Del
  | Tokens.Text
  | Tokens.Image
  // plugin
  | FootnoteRef

export type IParagraphToken =
  | Tokens.Paragraph
  | Tokens.Blockquote
  | Tokens.Heading

export type ITextAttr = {
  style?: string

  // attrs
  bold ?: boolean
  italics ?: boolean
  underline ?: boolean // with options
  strike ?: boolean
  break?: boolean | number

  // text style
  html?: boolean
  link?: boolean
  strong?: boolean
  em?: boolean
  codespan?: boolean
  del?: boolean
  br?: boolean
  
}

export type IBlockAttr = {
  style?: string

  blockquote?: boolean
  
  list?: {
    task?: boolean
    checked?: boolean
    level: number
    type?: 'number' | 'bullet'
  }

  heading?: number
  code?: boolean

  align?: 'left' | 'center' | 'right' | null

  footnote?: boolean

}

export type Writeable<T> = {
  -readonly [P in keyof T]: T[P]
}
