import { Table, TableCell, TableRow, VerticalAlign, WidthType } from "docx";
import { Tokens } from "marked"
import { MarkdownDocx } from "../MarkdownDocx"
import { IBlockAttr, IInlineToken } from "../types"
import { renderParagraph } from "./render-paragraph";
import { classes } from "../styles";

export function renderTable(render: MarkdownDocx, block: Tokens.Table, attrs: IBlockAttr): Table {
  const toProps = (token?: Tokens.TableCell, isHeader?: boolean): IBlockAttr => {
    return {
      ...attrs,
      align: token?.align,
      style: isHeader ? classes.TableHeader : classes.TableCell,
    }
  }
  return new Table({
    style: classes.Table,

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
            shading: {
              fill: 'D9E1F2',
              color: '000000',
            },
            children: [
              renderParagraph(render, cell.tokens as IInlineToken[], toProps(cell, true)),
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
              margins: {
                top: 0,
                bottom: 0,
                left: 10,
                right: 10,
              },
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