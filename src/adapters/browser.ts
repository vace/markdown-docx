import { Tokens } from 'marked'

import { MarkdownImageAdapter } from '../types'
import { getImageExtension } from '../utils'

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

    const { width, height } = await loadImageSize(blob)

    return {
      type,
      data: await blob.arrayBuffer(),
      width,
      height,
    }
  } catch (error) {
    console.error(`[MarkdownDocx] downloadImageError`, error)
    return null
  }
}

async function loadImageSize (blob: Blob) {
  return new Promise<{ width: number, height: number }>((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height
      })
      URL.revokeObjectURL(img.src)
    }
    img.onerror = (err: any) => {
      URL.revokeObjectURL(img.src)
      reject(new Error(`Failed to load image: ${err.message || err}`))
    }
    img.src = URL.createObjectURL(blob)
  })
}
