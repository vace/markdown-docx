import { Alignment, AlignmentType, HeadingLevel } from "docx"
import { IBlockAttr, MarkdownImageType } from "./types"
import { Tokens } from "marked"

export function getHeadingLevel(level?: number) {
  if (level == null) {
    return undefined
  }
  switch (level) {
    case 0:
      return HeadingLevel.TITLE
    case 1:
      return HeadingLevel.HEADING_1
    case 2:
      return HeadingLevel.HEADING_2
    case 3:
      return HeadingLevel.HEADING_3
    case 4:
      return HeadingLevel.HEADING_4
    case 5:
      return HeadingLevel.HEADING_5
    case 6:
      return HeadingLevel.HEADING_6
    default:
      // if (import.meta.env.MODE === 'development') {
      //   console.warn('Heading level out of range, defaulting to Heading 6')
      // }
      return HeadingLevel.HEADING_6
  }
}


export function getTextAlignment(align: IBlockAttr['align']) {
  switch (align) {
    case 'left':
      return AlignmentType.LEFT
    case 'center':
      return AlignmentType.CENTER
    case 'right':
      return AlignmentType.RIGHT
    default:
      return undefined
  }
}

export function getImageTokens(tokenList: any[], tokens: Tokens.Image[] = []) {
  for (const token of tokenList) {
    if (!token) continue
    if (token.type === 'image') {
      tokens.push(token)
    } else if (token.tokens?.length) {
      getImageTokens(token.tokens, tokens)
    }
  }
  return tokens
}


// "jpg" | "png" | "gif" | "bmp"
const ImageTypeWhitelist = new Set(['jpg', 'png', 'gif', 'bmp'])

export function getImageExtension(filename: string = '', mime?: string | null): MarkdownImageType | null {
  let ext = ''
  switch (mime) {
    case 'image/jpeg':
      ext = 'jpg'
      break
    case 'image/png':
      ext = 'png'
      break
    case 'image/gif':
      ext = 'gif'
      break
    case 'image/bmp':
      ext = 'bmp'
      break
    case 'image/webp':
      ext = 'webp'
      break
    case 'image/svg+xml':
      ext = 'svg'
      break
    default:
      const name = filename.split('?').pop() || ''
      const index = name.lastIndexOf('.')
      if (index > -1) {
        ext = name.substring(index + 1)
      }
      break
  }

  if (!ext) {
    throw new Error(`Cannot get Image extension from mime type: ${mime}`)
    return null
  } else if (!ImageTypeWhitelist.has(ext)) {
    throw new Error(`Image extension ${ext} is not supported`)
  }

  return ext as MarkdownImageType
}


export function isHttp (src: string) {
  return /^https?:\/\//.test(src)
}
