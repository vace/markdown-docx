import { MarkdownDocx } from "./MarkdownDocx";
import { downloadImage } from './adapters/nodejs'

MarkdownDocx.defaultOptions.imageAdapter = downloadImage

export * from './index'
