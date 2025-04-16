import { Table, TableCell, TableRow, VerticalAlign, WidthType } from "docx";
import { Tokens } from "marked"
import { MarkdownDocx } from "../MarkdownDocx"
import { IBlockAttr, IInlineToken } from "../types"
import { renderParagraph } from "./render-paragraph";

export function renderTable(render: MarkdownDocx, block: Tokens.Table, attrs: IBlockAttr): Table {
  const toProps = (token?: Tokens.TableCell): IBlockAttr => {
    return token?.align ? { ...attrs, align: token.align } : attrs
  }
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows: [
      // headers
      new TableRow({
        tableHeader: true,
        cantSplit: true,
        children: block.header.map(cell => {
          return new TableCell({
            verticalAlign: VerticalAlign.CENTER,
            children: [
              renderParagraph(render, cell.tokens as IInlineToken[], toProps(cell)),
            ],
          })
        })
      }),
      // rows
      ...block.rows.map(row => {
        return new TableRow({
          cantSplit: true,
          children: row.map(cell => {
            return new TableCell({
              verticalAlign: VerticalAlign.CENTER,
              children: [
                renderParagraph(render, cell.tokens as IInlineToken[], toProps(cell)),
              ]
            })
          })
        })
      })
    ]
  })
}