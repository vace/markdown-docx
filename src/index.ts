import { Packer } from 'docx'

import { MarkdownDocx } from './MarkdownDocx'
import { styles } from './styles'
import { MarkdownDocxOptions } from './types'

export * from "./types"

// @ts-ignore
if(import.meta.env.VITEST === 'true' && import.meta.env.NODE_ENV === 'test') {
  const adapters = await import('./adapters/nodejs')
  MarkdownDocx.defaultOptions.imageAdapter = adapters.downloadImage
} else {
  // @ts-ignore
  const imageAdapter = import.meta.env.NODE_ENV === 'browser'
    ? require('./adapters/browser').downloadImage
    : require('./adapters/nodejs').downloadImage

  MarkdownDocx.defaultOptions.imageAdapter = imageAdapter
}

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
