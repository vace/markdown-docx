
import useExtensions from './extensions'
import { MarkdownDocx } from './MarkdownDocx'
import { IBlockToken } from './types'

export function tokenize(render: MarkdownDocx) {
  const laxer = useExtensions(render)
  return laxer.lex(render.markdown) as IBlockToken[]
}
