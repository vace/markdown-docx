import { Paragraph } from 'docx'

import { MarkdownDocx } from '../MarkdownDocx'
import { IBlockAttr, IInlineToken } from '../types'
import { getHeadingLevel, getTextAlignment } from '../utils'
import { renderCheckbox } from './render-checkbox'
import { renderText } from './render-text'
import { renderTokens } from './render-tokens'

export function renderParagraph (render: MarkdownDocx, tokens: IInlineToken[] | string, attr: IBlockAttr) {
  const heading = getHeadingLevel(attr.heading)
  const alignment = getTextAlignment(attr.align)
  // 对于无序列表，使用 numbering 配置但引用 bullet-points
  const numbering = attr.list ? {
    level: Math.min(attr.list.level, 9),
    reference: attr.list.type === 'bullet' ? 'bullet-points' : 'numbering-points',
  } : undefined

  const options = {
    heading,
    alignment,
    numbering,
    style: attr.style
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
