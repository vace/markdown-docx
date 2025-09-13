import { Lexer, Token, TokenizerExtensionFunction, TokenizerStartFunction } from 'marked'

import { MarkdownDocx } from '../MarkdownDocx'

export type IExtension = {
  name: string
  startBlock?: TokenizerStartFunction
  block: TokenizerExtensionFunction
  startInline?: TokenizerStartFunction
  inline: TokenizerExtensionFunction

  init?: (render: MarkdownDocx) => void
}

export type IExtensionFn = (lexer: Lexer) => IExtension

/**
 * Represents a single footnote.
 */
export type Footnote = {
  id: number
  type: 'footnote'
  raw: string
  label: string
  // refs: FootnoteRef[]
  tokens: Token[]
}

/**
 * Represents a reference to a footnote.
 */
export type FootnoteRef = {
  type: 'footnoteRef'
  raw: string
  id: number
  label: string
}

export type InlineKatex = {
  type: 'inlineKatex'
  raw: string
  displayMode: boolean
  text: string
}

export type BlockKatex = {
  type: 'blockKatex'
  raw: string
  displayMode: boolean
  text: string
}
