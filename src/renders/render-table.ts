import { Table, TableCell, TableRow, VerticalAlign, WidthType } from 'docx'
import { Tokens } from 'marked'

import { MarkdownDocx } from '../MarkdownDocx'
import { classes } from '../styles'
import { IBlockAttr, IInlineToken } from '../types'
import { renderParagraph } from './render-paragraph'

export function renderTable(render: MarkdownDocx, block: Tokens.Table, attrs: IBlockAttr): Table {
  const toProps = (token?: Tokens.TableCell, isHeader?: boolean): IBlockAttr => {
    return {
      ...attrs,
      align: token?.align,
      style: isHeader ? classes.TableHeader : classes.TableCell,
    }
  }

  const style = render.styles.markdown
  const defaultColumnWidth = 100 / block.header.length * 100 // auto adjust

  return new Table({
    ...style.table.properties,
    style: classes.Table,
    width: {
      size: '100%',
      type: WidthType.PERCENTAGE,
    },
    columnWidths: block.header.map(() => defaultColumnWidth),
    rows: [
      // headers
      new TableRow({
        tableHeader: true,
        cantSplit: true,
        children: block.header.map(cell => {
          return new TableCell({
            verticalAlign: VerticalAlign.CENTER,
            ...style.tableHeader.properties,
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
              ...style.tableCell.properties,
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