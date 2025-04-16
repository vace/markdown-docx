import { FileChild, Paragraph } from "docx";
import { IBlockAttr, IBlockToken, IInlineToken } from "../types";
import { Tokens } from "marked";
import { MarkdownDocx } from "../MarkdownDocx";
import { renderParagraph } from "./render-paragraph";
import { renderTable } from "./render-table";
import { renderList } from "./render-list";

export function renderBlocks(render: MarkdownDocx, blocks: IBlockToken[], attr: IBlockAttr = {}): FileChild[] {
  const paragraphs: FileChild[] = []
  for (const block of blocks) {
    const child = renderBlock(render, block, attr)
    if (Array.isArray(child)) {
      paragraphs.push(...child)
    } else if (child) {
      paragraphs.push(child)
    } else if (child == null){
      console.warn(`Block is empty: ${block.type}`)
    }
  }
  return paragraphs
}

function renderBlock(render: MarkdownDocx, block: IBlockToken, attr: IBlockAttr): FileChild | FileChild[] | false | null {
  switch (block.type) {
    case 'space':
      return new Paragraph('')
    case 'code':
      return renderParagraph(render, block.text, { ...attr, code: true })
    case 'heading':
      return renderParagraph(render, block.tokens as IInlineToken[], {
        ...attr,
        heading: block.depth,
      })
    case 'hr':
      return new Paragraph({
        text: '',
        thematicBreak: true
      })
    case 'blockquote':
      return renderBlocks(render, block.tokens as IBlockToken[], {
        ...attr,
        blockquote: true,
      })
    case 'list':
      return renderList(render, block, attr)
    case 'html':
      return renderParagraph(render, block.text, {
        ...attr,
        code: true
      })
    case 'def':
      // TODO: handle def
      return new Paragraph({
        text: block.title,
        // style: 'Code',
      })
    case 'table':
      return renderTable(render, block as Tokens.Table, attr)
    case 'paragraph':
      return renderParagraph(render, block.tokens as IInlineToken[], attr)
    case 'text':
      if (block.tokens?.length) {
        return renderParagraph(render, block.tokens as IInlineToken[], attr)
      }
      return renderParagraph(render, block.text, attr)
    case 'footnote':
      const noteList = renderBlocks(render, block.tokens as IBlockToken[], {
        ...attr,
        footnote: true,
      })
      render.addFootnote(block.id, noteList as Paragraph[])
      return false
    default:
      return null
  }
}
