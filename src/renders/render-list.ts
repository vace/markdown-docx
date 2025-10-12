import { FileChild } from 'docx'
import { Tokens } from 'marked'

import { MarkdownDocx } from '../MarkdownDocx'
import { classes } from '../styles'
import { IBlockAttr, IBlockToken } from '../types'
import { renderBlocks } from './render-blocks'

const countSymbol = Symbol()

export function renderList (render: MarkdownDocx, block: Tokens.List, attr: IBlockAttr): FileChild[] {
  let instance: number | undefined = undefined
  if (block.ordered) {
    instance = (render.store.get(countSymbol) || 0) + 1
    render.store.set(countSymbol, instance)
  }

  const list: IBlockAttr['list'] = {
    level: typeof attr.list?.level === 'number' ? attr.list.level + 1 : 0,
    type: block.ordered ? 'number' : 'bullet',
    instance: instance,
  }

  return block.items.map(item => {
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
    return renderBlocks(render, tokens, attribute)
  }).flat()
}
