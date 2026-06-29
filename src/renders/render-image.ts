import { ImageRun, Paragraph } from 'docx'
import { Tokens } from 'marked'

import { MarkdownDocx } from '../MarkdownDocx'
import { ITextAttr, MarkdownImageItem } from '../types'
import { renderText } from './render-text'

/**
 * Maximum image dimensions in "pixels" (at 96 DPI) for an A4 page with 1" margins.
 * A4 = 210mm × 297mm → 8.27" × 11.69" at 96 DPI.
 * Subtract 1" margin on each side (2" total):
 *   Usable width:  8.27" - 2" = 6.27" → 6.27 × 96 ≈ 602px
 *   Usable height: 11.69" - 2" = 9.69" → 9.69 × 96 ≈ 931px
 *
 * - "auto":  scale down only when either dimension overflows; never upscale.
 * - "fit":   scale so one axis reaches exactly its max (may upscale small images).
 *            Like Word's "fit to page".
 */
const MAX_IMAGE_WIDTH_PX = 602
const MAX_IMAGE_HEIGHT_PX = 931


export function renderImage(render: MarkdownDocx, block: Tokens.Image, attr: ITextAttr) {
  if (render.ignoreImage) {
    return false
  }

  const image = render.findImage(block)

  if (!image || !image.type) {
    return renderText(render, `[!${block.text}](${block.href})`, attr)
  }

  const { width, height, title, isExplicitSize } = parseImageTitleSize(block, image)

  const theme = render.options.theme
  const imageDefaultSize = theme?.imageDefaultSize ?? "actual"

  // Scale down oversized images to fit page margins ("auto" mode).
  // Explicit sizes (from title attribute) are never scaled.
  const finalSize = scaleImageToFit(width, height, imageDefaultSize, isExplicitSize)

  return new ImageRun({
    type: image.type,
    data: image.data,
    transformation: { width: finalSize.width, height: finalSize.height },
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
      title: block.title,
      isExplicitSize: false,
    }
  }

  const width = match[1].endsWith('%') ? parseInt(match[1], 10) / 100 * image.width : parseInt(match[1], 10)
  const height = match[2].endsWith('%') ? parseInt(match[2], 10) / 100 * image.height : parseInt(match[2], 10)

  return {
    width,
    height,
    // remove title
    title: '',
    isExplicitSize: true,
  }
}

/**
 * Scale image dimensions to fit within page margins when imageDefaultSize is "auto".
 * Images wider than MAX_IMAGE_WIDTH_PX are scaled down proportionally.
 * Images already within bounds are left unchanged (no upscaling).
 * Explicit sizes (from title attribute) are never scaled.
 */
export function scaleImageToFit(
  width: number,
  height: number,
  imageDefaultSize: "actual" | "auto" | "fit",
  isExplicitSize: boolean = false,
): { width: number; height: number } {
  if (imageDefaultSize === "actual" || isExplicitSize) {
    return { width, height }
  }

  if (imageDefaultSize === "auto") {
    // Constrain both width AND height to ≤ max. Scale down only; never upscale.
    if (width <= MAX_IMAGE_WIDTH_PX && height <= MAX_IMAGE_HEIGHT_PX) {
      return { width, height }
    }
    const ratioW = MAX_IMAGE_WIDTH_PX / width
    const ratioH = MAX_IMAGE_HEIGHT_PX / height
    const ratio = Math.min(ratioW, ratioH)
    return {
      width: Math.round(width * ratio),
      height: Math.round(height * ratio),
    }
  }

  // "fit" mode: scale so one axis reaches exactly its max value.
  // The other axis will be ≤ its max. May scale up small images.
  const ratioW = MAX_IMAGE_WIDTH_PX / width
  const ratioH = MAX_IMAGE_HEIGHT_PX / height
  const ratio = Math.min(ratioW, ratioH)

  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  }
}
