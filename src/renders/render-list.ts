import { FileChild } from 'docx'
import { Tokens } from 'marked'

import { MarkdownDocx } from '../MarkdownDocx'
import { classes, numberingStartReference } from '../styles'
import { IBlockAttr, IBlockToken } from '../types'
import { renderBlocks } from './render-blocks'

const countSymbol = Symbol()

export function renderList (render: MarkdownDocx, block: Tokens.List, attr: IBlockAttr): FileChild[] {
  let instance: number | undefined = undefined
  if (block.ordered) {
    instance = (render.store.get(countSymbol) || 0) + 1
    render.store.set(countSymbol, instance)
  }

  const level = typeof attr.list?.level === 'number' ? attr.list.level + 1 : 0
  const start = block.ordered && typeof block.start === 'number' && block.start !== 1 ? block.start : undefined

  const list: IBlockAttr['list'] = {
    level,
    type: block.ordered ? 'number' : 'bullet',
    instance: instance,
    reference: start === undefined ? undefined : numberingStartReference(render, level, start),
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
