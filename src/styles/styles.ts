/**
 * Paragraph Style
 */

import { ICharacterStyleOptions, IParagraphStyleOptions, IParagraphStylePropertiesOptions, IRunStylePropertiesOptions, IStylesOptions, UnderlineType } from "docx";
import { classes } from "./classes";
import { colors } from "./colors";
import { markdown } from "./markdown";
import { IMarkdownStyle, IMarkdownToken } from "../types";

export const defaultStyle: IStylesOptions['default'] = {
  document: {
    run: {
      size: 24, // 12pt
    },
    paragraph: {
      spacing: { lineRule: "auto" }
    }
  },
  hyperlink: {
    run: {
      color: colors.link,
      underline: {
        type: UnderlineType.SINGLE,
        color: colors.link,
      }
    }
  },
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

export function createDocumentStyle(options?: IStylesOptions): IStylesOptions {
  const paragraphStyles: IParagraphStyleOptions[] = []
  const characterStyles: ICharacterStyleOptions[] = []
  const keys = Object.keys(markdown) as IMarkdownToken[]
  for (const key of keys) {
    const style = markdown[key]
    if (!style) continue
    const { className, run, inline, paragraph, basedOn = 'Normal', next = 'Normal', quickFormat = true } = style
    if (inline) {
      characterStyles.push({ id: className, name: className, basedOn, next, quickFormat, run })
    } else {
      paragraphStyles.push({ id: className, name: className, basedOn, next, quickFormat, run, paragraph })
    }
  }
  return {
    default: defaultStyle,
    paragraphStyles: paragraphStyles,
    characterStyles: characterStyles,
    ...options,
  }
}

