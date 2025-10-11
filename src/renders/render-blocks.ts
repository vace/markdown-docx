import { FileChild, Paragraph, Math } from 'docx'
import { Tokens } from 'marked'
import katex from 'katex'

import { MarkdownDocx } from '../MarkdownDocx'
import { classes } from '../styles'
import { IBlockAttr, IBlockToken, IInlineToken } from '../types'
import { renderList } from './render-list'
import { renderParagraph } from './render-paragraph'
import { renderTable } from './render-table'
import { mathmlToDocxChildren } from '../mathml-to-docx'

export function renderBlocks(render: MarkdownDocx, blocks: IBlockToken[], attr: IBlockAttr = {}): FileChild[] {
  const paragraphs: FileChild[] = []
  for (const block of blocks) {
    const child = renderBlock(render, block, attr)
    if (Array.isArray(child)) {
      paragraphs.push(...child)
    } else if (child) {
      paragraphs.push(child)
    } else if (child == null) {
      console.warn(`Block is empty: ${block.type}`)
    }
  }
  return paragraphs
}

function renderBlock(render: MarkdownDocx, block: IBlockToken, attr: IBlockAttr): FileChild | FileChild[] | false | null {
  switch (block.type) {
    case 'space':
      return new Paragraph({
        text: '',
        style: classes.Space,
      })
    case 'code': {
      // Support ```math (and latex/katex) fenced blocks as display math via KaTeX when enabled
      const lang = (block as Tokens.Code).lang?.trim().toLowerCase()
      if (lang && /^(math|latex|katex)$/.test(lang)) {
        const tex = (block as Tokens.Code).text.trim()
        if (render.options?.math?.engine === 'katex') {
          try {
            const mml = katex.renderToString(tex, {
              output: 'mathml',
              throwOnError: false,
              displayMode: true,
              ...(render.options.math?.katexOptions || {}),
            })
            const children = mathmlToDocxChildren(mml, { libreOfficeCompat: !!render.options.math?.libreOfficeCompat })
            if (children && children.length) {
              return new Paragraph({ children: [new Math({ children })], style: classes.Paragraph })
            }
          } catch { }
        }
        // Fallback to code paragraph if KaTeX disabled or failed
        return renderParagraph(render, tex, { ...attr, code: true, style: 'MdCode' })
      }
      return renderParagraph(render, block.text, { ...attr, code: true, style: 'MdCode' })
    }
    case 'heading':
      return renderParagraph(render, block.tokens as IInlineToken[], {
        ...attr,
        heading: block.depth,
        // @ts-ignore
        style: classes[`Heading${block.depth}`],
      })
    case 'hr':
      return new Paragraph({
        text: '',
        thematicBreak: true,
        style: classes.Hr,
      })
    case 'blockquote':
      return renderBlocks(render, block.tokens as IBlockToken[], {
        ...attr,
        blockquote: true,
        style: classes.Blockquote,
      })
    case 'list':
      return renderList(render, block, attr)
    case 'html':
      if (render.ignoreHtml) {
        return false
      }
      return renderParagraph(render, block.text, {
        ...attr,
        code: true,
        style: classes.Html,
      })
    case 'def':
      // TODO: handle def
      return new Paragraph({
        text: block.title,
        style: classes.Def,
      })
    case 'table':
      return renderTable(render, block as Tokens.Table, attr)
    case 'paragraph':
      return renderParagraph(render, block.tokens as IInlineToken[], {
        style: classes.Paragraph, // can be overridden by attr
        ...attr,
      })
    case 'text':
      if (block.tokens?.length) {
        return renderParagraph(render, block.tokens as IInlineToken[], {
          style: classes.Text,  // can be overridden by attr
          ...attr,
        })
      }
      return renderParagraph(render, block.text, attr)
    default:
      return render.useBlockRender(block, attr)
  }
}
