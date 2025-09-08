import { FileChild } from 'docx'
import { Tokens } from 'marked'

import { MarkdownDocx } from '../MarkdownDocx'
import { classes } from '../styles'
import { IBlockAttr, IBlockToken } from '../types'
import { renderBlocks } from './render-blocks'

export async function renderList (render: MarkdownDocx, block: Tokens.List, attr: IBlockAttr): Promise<FileChild[]> {
  const list: IBlockAttr['list'] = {
    level: typeof attr.list?.level === 'number' ? attr.list.level + 1 : 0,
    type: block.ordered ? 'number' : 'bullet',
  }
  const results = await Promise.all(block.items.map(async item => {
    const tokens = item.tokens as IBlockToken[]
    const attribute: IBlockAttr = {
      ...attr,
      style: classes.ListItem,
      list: {
        ...list,
        task: item.task,
        checked: item.checked,
      }
    }
    return await renderBlocks(render, tokens, attribute)
  }))
  return results.flat()
}
