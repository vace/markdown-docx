import { MarkdownDocx } from "./MarkdownDocx";
import { tokenize } from "./tokenize";
import { MarkdownDocxOptions } from "./types";
import { Packer } from "docx";

export * from "./types"

// @ts-ignore
const imageAdapter = import.meta.env.NODE_ENV === 'browser'
  ? require('./adapters/browser').downloadImage
  : require('./adapters/nodejs').downloadImage

MarkdownDocx.defaultOptions.imageAdapter = imageAdapter

export default function markdownDocx (
  markdown: string,
  options: MarkdownDocxOptions = {}
) {
  return MarkdownDocx.covert(markdown, options)
}

export {
  markdownDocx,
  MarkdownDocx,
  Packer,
}
