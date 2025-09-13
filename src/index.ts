import { Packer } from 'docx'

import { MarkdownDocx } from './MarkdownDocx'
import { styles } from './styles'
import { MarkdownDocxOptions } from './types'

export * from "./types"

export default function markdownDocx (
  markdown: string,
  options: MarkdownDocxOptions = {}
) {
  return MarkdownDocx.covert(markdown, options)
}

export {
  // main
  markdownDocx,
  MarkdownDocx,
  Packer,

  // style
  styles,
}
