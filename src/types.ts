import { Paragraph, ParagraphChild, Table, TableOfContents } from "docx";
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
  bold ?: boolean
  italics ?: boolean
  underline ?: boolean // with options
  strike ?: boolean
  doubleStrike ?: boolean
  superScript ?: boolean
  subScript ?: boolean
  break?: boolean | number
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

  align?: 'left' | 'center' | 'right'

  footnote?: boolean

}
