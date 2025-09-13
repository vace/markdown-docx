export * from './index'

export { default } from './index'

import { MarkdownDocx } from './MarkdownDocx'

import { downloadImage } from './adapters/nodejs'

MarkdownDocx.defaultOptions.imageAdapter = downloadImage
