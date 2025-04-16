import { ExternalHyperlink, FootnoteReferenceRun, ImageRun, ParagraphChild, TextRun } from "docx";
import { IInlineToken, ITextAttr } from "../types";
import { renderText } from "./render-text";
import { MarkdownDocx } from "../MarkdownDocx";
import { renderImage } from "./render-image";

export function renderTokens(render: MarkdownDocx, tokens: IInlineToken[], attr: ITextAttr = {}): ParagraphChild[] {
  const children: ParagraphChild[] = []

  for (const token of tokens) {
    const child = flatInlineToken(render, token, attr)
    if (Array.isArray(child)) {
      children.push(...child)
    } else if (child) {
      children.push(child)
    } else {
      console.warn(`Inline token is empty: ${token.type}`)
    }
  }

  return children
}

function flatInlineToken(render: MarkdownDocx, token: IInlineToken, attr: ITextAttr): ParagraphChild | ParagraphChild[] | null {
  switch (token.type) {
    case 'escape':
      return renderText(render, token.text, attr)
    case 'html': // tag
      // TODO: handle html
      return renderText(render, token.text, attr)
      break
    case 'link':
      return new ExternalHyperlink({
        children: renderTokens(render, token.tokens as IInlineToken[]),
        link: token.href,
        // tooltip: token.title,
      })
      break
    case 'em':
      return renderTokens(
        render,
        token.tokens as IInlineToken[],
        { ...attr, italics: true }
      )
    case 'strong':
      return renderTokens(
        render,
        token.tokens as IInlineToken[],
        { ...attr, bold: true }
      )
    case 'codespan':
      return renderText(
        render,
        token.text, {
          ...attr,
          italics: true,
          bold: true,
        }
      )
    case 'br':
      return new TextRun({ text: '', break: 1 })
    case 'del':
      return renderTokens(
        render,
        token.tokens as IInlineToken[],
        { ...attr, strike: true }
      )
    case 'text':
      if (token.tokens?.length) {
        return renderTokens(render, token.tokens as IInlineToken[], attr)
      }
      return renderText(render, token.text, attr)
    case 'image':
      return renderImage(render, token, attr)
    case 'footnoteRef':
      return new FootnoteReferenceRun(token.id)
    default:
      return null
  }
}
