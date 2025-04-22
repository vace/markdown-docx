import {
  IParagraphStylePropertiesOptions, IPropertiesOptions, IRunStylePropertiesOptions, IShadingAttributesProperties
} from 'docx'
import { MarkedOptions, Tokens } from 'marked'

import { Footnote, FootnoteRef } from './extensions'

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

  /**
   * Properties for the document
   */
  document?: Omit<IPropertiesOptions, 'sections'>
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

export type IMarkdownToken = 
  |'space' | 'code' | 'hr'| 'blockquote'| 'html'| 'def'| 'paragraph'| 'text'| 'footnote'| 'listItem'| 'table'| 'tableHeader'| 'tableCell'| 'heading1'| 'heading2'| 'heading3'| 'heading4'| 'heading5'| 'heading6'
  | 'tag' | 'link' | 'strong' | 'em' | 'codespan' | 'del' | 'br'

export type IMarkdownStyle = {
  inline?: boolean
  className: string
  name?: string
  basedOn?: string
  next?: string
  run?: IRunStylePropertiesOptions
  paragraph?: IParagraphStylePropertiesOptions
  quickFormat?: boolean

  // special attributes
  properties?: any
}
