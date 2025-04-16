import type { Lexer } from 'marked'
import { Footnote, FootnoteRef } from './types'

/**
 * @see https://github.com/bent10/marked-extensions/blob/main/packages/footnote/src/footnote.ts
 */

export default function footnote(lexer: Lexer) {
  let hasFootnotes = false
  let footnoteId = 0

  const footnotes: Map<string, Footnote> = new Map()

  return {
    name: 'footnote',
    block: tokenizerBlock,
    inline: tokenizerInline,
  }

  function tokenizerBlock(src: string) {
    const match = /^\[\^([^\]\n]+)\]:(?:[ \t]+|[\n]*?|$)([^\n]*?(?:\n|$)(?:\n*?[ ]{4,}[^\n]*)*)/.exec(src)

    if (!match) return

    if (!hasFootnotes) {
      hasFootnotes = true
      footnoteId = 0
      // always begin with empty items
      footnotes.clear()
    }
    
    const [raw, label, text = ''] = match
    let content = text.split('\n').reduce((acc, curr) => {
      return acc + '\n' + curr.replace(/^(?:[ ]{4}|[\t])/, '')
    }, '')

    const contentLastLine = content.trimEnd().split('\n').pop()

    content +=
      // add lines after list, blockquote, codefence, and table
      contentLastLine &&
        /^[ \t]*?[>\-*][ ]|[`]{3,}$|^[ \t]*?[|].+[|]$/.test(contentLastLine)
        ? '\n\n'
        : ''

    const token: Footnote = {
      id: ++footnoteId,
      type: 'footnote',
      raw,
      label,
      tokens: lexer.blockTokens(content.trim())
    }
    footnotes.set(label, token)
    return token
  }

  function tokenizerInline(src: string) {
    const match = /^\[\^([^\]\n]+)\]/.exec(src)

    if (match) {
      const [raw, label] = match
      const note = footnotes.get(label)

      if (!note) return

      const ref: FootnoteRef = {
        id: note.id,
        type: 'footnoteRef',
        raw,
        label
      }
      return ref
    }
  }
}