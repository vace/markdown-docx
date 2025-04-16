import { IRunOptions, TextRun } from "docx";
import { ITextAttr, Writeable } from "../types";
import { MarkdownDocx } from "../MarkdownDocx";

export function renderText (render: MarkdownDocx, text: string, attr: ITextAttr): TextRun[] {
  const multipleLines = text.trim().split(/\n/)
  const totalLine = multipleLines.length

  const options: Writeable<IRunOptions> = {
    style: attr.style,
    italics: attr.italics,
    bold: attr.bold,
    underline: attr.underline ? {} : undefined,
    strike: attr.strike,
    break: attr.break ? (typeof attr.break === 'number' ? attr.break : 1) : undefined,
  }

  // inherit from parent
  if (attr.strong) options.bold = true
  if (attr.em) options.italics = true
  if (attr.codespan) options.underline = {}
  if (attr.del) options.strike = true

  if (totalLine > 1) {
    const textNodes: TextRun[] = []
    textNodes.push(...multipleLines.map((line, index) => new TextRun({
      ...options,
      text: line,
      break: index > 0 ? 1 : undefined,
    })))
    return textNodes
  }

  return [
    new TextRun({
      text,
      ...options,
    })
  ]
}
