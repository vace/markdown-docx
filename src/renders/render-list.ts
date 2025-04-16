import { Tokens } from "marked";
import { MarkdownDocx } from "../MarkdownDocx";
import { IBlockAttr, IBlockToken } from "../types";
import { FileChild } from "docx";
import { renderBlocks } from "./render-blocks";

export function renderList (render: MarkdownDocx, block: Tokens.List, attr: IBlockAttr): FileChild[] {
  const list: IBlockAttr['list'] = {
    level: typeof attr.list?.level === 'number' ? attr.list.level + 1 : 0,
    type: block.ordered ? 'number' : 'bullet',
  }
  return block.items.map(item => {
    const tokens = item.tokens as IBlockToken[]
    const attribute: IBlockAttr = {
      ...attr,
      list: {
        ...list,
        task: item.task,
        checked: item.checked,
      }
    }
    return renderBlocks(render, tokens, attribute)
  }).flat()
}
