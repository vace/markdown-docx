import { Tokens } from 'marked'

import { MarkdownImageAdapter } from '../types'
import { getImageExtension, parseImageSizeFromTitle } from '../utils'

export const downloadImage: MarkdownImageAdapter = async function (token: Tokens.Image) {
  const href = token.href
  if (!href) {
    return null
  }
  try {
    const response = await fetch(href)
    if (!response.ok) {
      return null
    }

    const blob = await response.blob()
    const mime = response.headers.get('content-type') || blob.type

    const type = getImageExtension(href, mime)

    if (!type) {
      return null
    }

    let { width, height, image } = await loadImageSize(blob)
    let imageData = await blob.arrayBuffer()
    let imageType = type

    // @ts-ignore
    if (type === 'webp') {
      const converted = await convertWebp2Png(width, height, image)
      imageData = converted
      imageType = 'png'
    }

    // Parse custom size from title if provided (e.g., "600x400")
    const [customWidth, customHeight] = parseImageSizeFromTitle(token.title)

    return {
      type: imageType,
      data: imageData,
      width: customWidth ?? width,
      height: customHeight ?? height,
    }
  } catch (error) {
    console.error(`[MarkdownDocx] downloadImageError`, error)
    return null
  }
}

async function loadImageSize (blob: Blob) {
  return new Promise<{ width: number, height: number, image: HTMLImageElement }>((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      resolve({
        width: image.naturalWidth || image.width,
        height: image.naturalHeight || image.height,
        image,
      })
      URL.revokeObjectURL(image.src)
    }
    image.onerror = (err: any) => {
      URL.revokeObjectURL(image.src)
      reject(new Error(`Failed to load image: ${err.message || err}`))
    }
    image.src = URL.createObjectURL(blob)
  })
}

async function convertWebp2Png(width: number, height: number, image: HTMLImageElement): Promise<ArrayBuffer> {
  // Try to use OffscreenCanvas for better performance (non-blocking)
  if (typeof OffscreenCanvas !== 'undefined') {
    return await convertWithOffscreenCanvas(width, height, image)
  }
  // Fallback to regular Canvas
  return await convertWithRegularCanvas(width, height, image)
}

async function convertWithOffscreenCanvas(width: number, height: number, image: HTMLImageElement): Promise<ArrayBuffer> {
  const canvas = new OffscreenCanvas(width, height)
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Failed to get canvas context for WebP conversion')
  }

  ctx.drawImage(image, 0, 0, width, height)

  // Convert to blob (PNG format) - this is non-blocking
  const blob = await canvas.convertToBlob({
    type: 'image/png',
    quality: 1.0
  })
  return blob.arrayBuffer()
}

async function convertWithRegularCanvas(width: number, height: number, image: HTMLImageElement): Promise<ArrayBuffer> {
  // Create a regular canvas element (fallback)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error(`Failed to get canvas context for WebP conversion`)
  }

  // Set canvas dimensions
  canvas.width = width
  canvas.height = height

  // Draw the image onto the canvas
  ctx.drawImage(image, 0, 0, width, height)

  return new Promise((resolve, reject) => {
    return canvas.toBlob(blob => blob ? resolve(blob.arrayBuffer()) : reject(new Error('Failed to convert canvas to Blob')), 'image/png', 1.0)
  })
}
