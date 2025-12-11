import imagesize, { disableTypes, imageSize } from 'image-size'
import { Tokens } from 'marked'
import fs from 'node:fs/promises'
import http from 'node:http'
import https from 'node:https'

import { MarkdownImageAdapter } from '../types'
import { getImageExtension, isHttp, parseImageSizeFromTitle } from '../utils'

export const downloadImage: MarkdownImageAdapter = async function (token: Tokens.Image) {
  const src = token.href
  if (!src) {
    return null
  }

  try {
    const buffer = await loadImage(src)

    const { width, height, type } = imagesize(buffer)

    const supportType = getImageExtension(src, type)

    if (!supportType) {
      return null
    }

    // @ts-ignore
    if (supportType === 'webp') {
      console.error(`[MarkdownDocx] Webp is not supported in the nodejs environment`)
      return null
    }

    // Parse custom size from title if provided (e.g., "600x400")
    const [customWidth, customHeight] = parseImageSizeFromTitle(token.title)

    return {
      type: supportType,
      data: buffer,
      width: customWidth ?? width,
      height: customHeight ?? height,
    }
  } catch (error) {
    console.error(`[MarkdownDocx] downloadImageError`, error)
    return null
  }
}

function loadImage (src: string) {
  if (isHttp(src)) {
    return new Promise<Buffer>((resolve, reject) => {
      const agent = src.startsWith('https') ? https : http
      agent.get(src, (res) => {
        const chunks: Buffer[] = []
        res.on('data', (chunk) => {
          chunks.push(chunk)
        })
        res.on('end', () => {
          const buffer = Buffer.concat(chunks)
          disableTypes(['svg', 'webp'])
          resolve(buffer)
        })
        res.on('error', (err) => {
          reject(new Error(`Failed to load image: ${err.message || err}`))
        })
      })
    })
  }
  return fs.readFile(src)
}
