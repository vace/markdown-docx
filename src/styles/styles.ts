/**
 * Paragraph Style
 */

import {
  ICharacterStyleOptions, IParagraphStyleOptions, IStylesOptions, UnderlineType
} from 'docx'

import { IMarkdownToken, IMarkdownTheme } from '../types'
import { createMarkdownStyle, markdown } from './markdown'

export const defaultStyle: IStylesOptions['default'] = {
  document: {
    run: {
      size: 24, // 12pt
    },
    paragraph: {
      spacing: { lineRule: "auto" }
    }
  },
  hyperlink: {},
  heading1: {},
  heading2: {},
  heading3: {},
  heading4: {},
  heading5: {},
  heading6: {},
  strong: {},
  listParagraph: {},
  footnoteReference: {},
  footnoteText: {},
  footnoteTextChar: {},
  title: {}
}

type CreateDocumentStyleOptions = {
  theme?: Partial<IMarkdownTheme>
}

export function createDocumentStyle({ theme }: CreateDocumentStyleOptions): IStylesOptions {
  const paragraphStyles: IParagraphStyleOptions[] = []
  const characterStyles: ICharacterStyleOptions[] = []
  const markdownTheme = theme ? createMarkdownStyle(theme) : markdown
  const keys = Object.keys(markdownTheme) as IMarkdownToken[]
  const styles = { ...defaultStyle }
  for (const key of keys) {
    const style = markdownTheme[key]
    if (!style) continue
    const { className, run, inline, paragraph, basedOn = 'Normal', next = 'Normal', quickFormat = true } = style
    if (inline) {
      characterStyles.push({ id: className, name: className, basedOn, next, quickFormat, run })
    } else {
      paragraphStyles.push({ id: className, name: className, basedOn, next, quickFormat, run, paragraph })
    }
    if (key in styles) {
      // @ts-ignore
      styles[key] = { ...styles[key], ...style}
    }
  }
  return {
    default: styles,
    paragraphStyles: paragraphStyles,
    characterStyles: characterStyles,
  }
}
