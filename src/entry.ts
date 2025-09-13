export * from './index'
export { default } from './index'

import { downloadImage } from './adapters/browser'
import { MarkdownDocx } from './MarkdownDocx'

MarkdownDocx.defaultOptions.imageAdapter = downloadImage
