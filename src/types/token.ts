import { Tokens } from 'marked'

import { BlockKatex, Footnote, FootnoteRef, InlineKatex } from '../extensions'

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
  | InlineKatex
  | BlockKatex

export type IParagraphToken =
  | Tokens.Paragraph
  | Tokens.Blockquote
  | Tokens.Heading
