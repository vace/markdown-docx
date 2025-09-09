import { BorderStyle, Table, TableCell, TableRow, VerticalAlign, WidthType } from 'docx'
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

  return new Table({
    ...style.table.properties,
    style: classes.Table,
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    // Modern table borders
    borders: {
      top: {
        style: BorderStyle.SINGLE,
        size: 4,
        color: 'E1E4E8',
      },
      bottom: {
        style: BorderStyle.SINGLE,
        size: 4,
        color: 'E1E4E8',
      },
      left: {
        style: BorderStyle.NONE,
      },
      right: {
        style: BorderStyle.NONE,
      },
      insideHorizontal: {
        style: BorderStyle.SINGLE,
        size: 2,
        color: 'E1E4E8',
      },
      insideVertical: {
        style: BorderStyle.SINGLE,
        size: 2,
        color: 'F6F8FA',
      },
    },
    rows: [
      // headers
      new TableRow({
        tableHeader: true,
        cantSplit: true,
        height: {
          value: 720, // 0.5 inch height for header
          rule: 'atLeast',
        },
        children: block.header.map((cell, index) => {
          return new TableCell({
            verticalAlign: VerticalAlign.CENTER,
            ...style.tableHeader.properties,
            margins: {
              top: 100,
              bottom: 100,
              left: 120,
              right: 120,
            },
            // Add left border for first column, right border for last column
            borders: {
              ...(index === 0 && {
                left: {
                  style: BorderStyle.NONE,
                },
              }),
              ...(index === block.header.length - 1 && {
                right: {
                  style: BorderStyle.NONE,
                },
              }),
            },
            children: [
              renderParagraph(render, cell.tokens as IInlineToken[], toProps(cell, true)),
            ],
          })
        })
      }),
      // rows
      ...block.rows.map((row, rowIndex) => {
        const isLastRow = rowIndex === block.rows.length - 1
        return new TableRow({
          cantSplit: true,
          height: {
            value: 576, // 0.4 inch minimum height
            rule: 'atLeast',
          },
          children: row.map((cell, cellIndex) => {
            return new TableCell({
              verticalAlign: VerticalAlign.CENTER,
              ...style.tableCell.properties,
              margins: {
                top: 80,
                bottom: 80,
                left: 120,
                right: 120,
              },
              // Add borders
              borders: {
                ...(cellIndex === 0 && {
                  left: {
                    style: BorderStyle.NONE,
                  },
                }),
                ...(cellIndex === row.length - 1 && {
                  right: {
                    style: BorderStyle.NONE,
                  },
                }),
                ...(isLastRow && {
                  bottom: {
                    style: BorderStyle.SINGLE,
                    size: 4,
                    color: 'E1E4E8',
                  },
                }),
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