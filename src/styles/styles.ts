/**
 * Paragraph Style
 */

import {
  ICharacterStyleOptions, IParagraphStyleOptions, IStylesOptions, UnderlineType
} from 'docx'

import { IMarkdownToken, IMarkdownTheme } from '../types'
import { createMarkdownStyle, markdown } from './markdown'
import { defaultTheme } from './themes'

export function createDefaultStyle(theme: IMarkdownTheme): IStylesOptions['default'] {
  return {
    document: {
      run: {
        size: (theme.bodySize ?? defaultTheme.bodySize ?? 12) * 2, // Convert pt to half-points
      },
      paragraph: {
        spacing: {
          line: Math.round((theme.lineSpacing ?? defaultTheme.lineSpacing ?? 1.0) * 240), // Convert to twips
          lineRule: "auto"
        }
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
}

// Legacy export for backward compatibility: use defaultTheme as input
export const defaultStyle = createDefaultStyle(defaultTheme)

type CreateDocumentStyleOptions = {
  theme?: Partial<IMarkdownTheme>
}

export function createDocumentStyle({ theme }: CreateDocumentStyleOptions): IStylesOptions {
  const paragraphStyles: IParagraphStyleOptions[] = []
  const characterStyles: ICharacterStyleOptions[] = []
  const mergedTheme = theme ? { ...defaultTheme, ...theme } : defaultTheme
  const markdownTheme = theme ? createMarkdownStyle(mergedTheme) : markdown
  const keys = Object.keys(markdownTheme) as IMarkdownToken[]
  const styles = { ...createDefaultStyle(mergedTheme) }
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
