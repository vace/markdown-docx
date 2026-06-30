import {
  FileChild, IParagraphStylePropertiesOptions, IRunStylePropertiesOptions, ParagraphChild
} from 'docx'

import type { MarkdownDocx } from '../MarkdownDocx'
import { IBlockAttr, ITextAttr } from './attr'
import { IBlockToken, IInlineToken } from './token'

export type Writeable<T> = {
  -readonly [P in keyof T]: T[P]
}

export type IMarkdownToken =
  | 'space' | 'code' | 'hr' | 'blockquote' | 'html' | 'def' | 'paragraph' | 'text' | 'footnote' | 'listItem' | 'table' | 'tableHeader' | 'tableCell' | 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'heading5' | 'heading6'
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

export type IMarkdownRenderFunction =
  (render: MarkdownDocx, token: IInlineToken | IBlockToken, attr?: ITextAttr | IBlockAttr)
    => ParagraphChild | ParagraphChild[] | FileChild | FileChild[] | false | null
