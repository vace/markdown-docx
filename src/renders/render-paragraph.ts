import { Paragraph } from "docx";
import { MarkdownDocx } from "../MarkdownDocx";
import { IBlockAttr, IInlineToken } from "../types";
import { getHeadingLevel, getTextAlignment } from "../utils";
import { renderText } from "./render-text";
import { renderTokens } from "./render-tokens";
import { renderCheckbox } from "./render-checkbox";

export function renderParagraph (render: MarkdownDocx, tokens: IInlineToken[] | string, attr: IBlockAttr) {
  const heading = getHeadingLevel(attr.heading)
  const alignment = getTextAlignment(attr.align)
  const bullet = attr.list?.type === 'bullet' ? {
    level: Math.min(attr.list.level, 9),
  } : undefined
  const numbering = attr.list?.type === 'number' ? {
    level: Math.min(attr.list.level, 9),
    reference: 'numbering-points',
  } : undefined

  const options = {
    heading,
    alignment,
    bullet,
    numbering,
  }

  const children = typeof tokens === 'string' ? renderText(render, tokens, {}) : renderTokens(render, tokens, {})

  if (attr.list?.task) {
    children.unshift(renderCheckbox(render, attr.list.checked))
  }

  return new Paragraph({
    children,
    ...options,
  })
}
