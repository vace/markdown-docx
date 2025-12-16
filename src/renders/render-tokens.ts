import { ExternalHyperlink, FootnoteReferenceRun, ImageRun, ParagraphChild, TextRun } from 'docx'

import { MarkdownDocx } from '../MarkdownDocx'
import { classes } from '../styles'
import { IInlineToken, ITextAttr } from '../types'
import { renderImage } from './render-image'
import { renderText } from './render-text'

export function renderTokens(render: MarkdownDocx, tokens: IInlineToken[], attr: ITextAttr = {}): ParagraphChild[] {
  const children: ParagraphChild[] = []

  for (const token of tokens) {
    const child = flatInlineToken(render, token, attr)
    if (Array.isArray(child)) {
      children.push(...child)
    } else if (child) {
      children.push(child)
    } else if (child == null) {
      console.warn(`Inline token is empty: ${token.type}`)
    }
  }

  return children
}

function flatInlineToken(render: MarkdownDocx, token: IInlineToken, attr: ITextAttr): ParagraphChild | ParagraphChild[] | false | null {
  switch (token.type) {
    case 'escape':
      return renderText(render, token.text, attr)
    case 'html': // tag
      if (render.ignoreHtml) {
        return false
      }
      return renderText(render, token.text, { ...attr, html: true, style: classes.Tag })
    case 'link':
      return new ExternalHyperlink({
        children: renderTokens(
          render,
          token.tokens as IInlineToken[],
          { ...attr, link: true, style: classes.Link }
        ),
        link: token.href,
      })
    case 'em':
      return renderTokens(
        render,
        token.tokens as IInlineToken[],
        { ...attr, em: true, style: classes.Em }
      )
    case 'strong':
      return renderTokens(
        render,
        token.tokens as IInlineToken[],
        { ...attr, strong: true, style: classes.Strong }
      )
    case 'codespan':
      return renderText(
        render,
        token.text,
        { ...attr, codespan: true, style: classes.Codespan }
      )
    case 'br':
      return renderText(
        render,
        '',
        { break: 1, br: true, style: classes.Br }
      )
    case 'del':
      return renderTokens(
        render,
        token.tokens as IInlineToken[],
        { ...attr, del: true, style: classes.Del }
      )
    case 'text':
      if (token.tokens?.length) {
        return renderTokens(render, token.tokens as IInlineToken[], attr)
      }
      return renderText(render, token.text, attr)
    case 'image':
      return renderImage(render, token, attr)
    default:
      return render.useInlineRender(token, attr)
  }
}
