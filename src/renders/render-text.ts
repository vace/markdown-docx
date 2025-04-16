import { IRunOptions, TextRun } from "docx";
import { ITextAttr } from "../types";
import { MarkdownDocx } from "../MarkdownDocx";

export function renderText (render: MarkdownDocx, text: string, attr: ITextAttr): TextRun[] {
  const multipleLines = text.trim().split(/\n/)
  const totalLine = multipleLines.length

  const options: IRunOptions = {
    italics: attr.italics,
    bold: attr.bold,
    underline: attr.underline ? {} : undefined,
    strike: attr.strike,
    doubleStrike: attr.doubleStrike,
    superScript: attr.superScript,
    subScript: attr.subScript,
    break: attr.break ? (typeof attr.break === 'number' ? attr.break : 1) : undefined,
  }

  if (totalLine > 1) {
    const textNodes: TextRun[] = []
    textNodes.push(...multipleLines.map((line, index) => new TextRun({
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
