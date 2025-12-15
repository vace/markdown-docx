import { ImageRun } from 'docx'
import { Tokens } from 'marked'

import { MarkdownDocx } from '../MarkdownDocx'
import { ITextAttr, MarkdownImageItem } from '../types'
import { renderText } from './render-text'

export function renderImage(render: MarkdownDocx, block: Tokens.Image, attr: ITextAttr) {
  if (render.ignoreImage) {
    return false
  }

  const image = render.findImage(block)

  if (!image || !image.type) {
    return renderText(render, `[!${block.text}](${block.href})`, attr)
  }

  const { width, height, title } = parseImageTitleSize(block, image)

  return new ImageRun({
    type: image.type,
    data: image.data,
    transformation: { width, height },
    altText: {
      title: title || block.text,
      description: block.text,
      name: block.text
    }
  })
}


/**
 * Parse image size from token title
 * Supports format like "600x400" or "50%x50%" in title attribute
 */
export function parseImageTitleSize(block: Tokens.Image, image: MarkdownImageItem) {
  const title = block.title?.trim()

  const match = title ? title.match(/^(\d+%?)x(\d+%?)$/) : null

  if (!match) {
    return {
      width: image.width,
      height: image.height,
      title: block.title
    }
  }

  const width = match[1].endsWith('%') ? parseInt(match[1], 10) / 100 * image.width : parseInt(match[1], 10)
  const height = match[2].endsWith('%') ? parseInt(match[2], 10) / 100 * image.height : parseInt(match[2], 10)

  return {
    width,
    height,
    // remove title
    title: ''
  }
}
