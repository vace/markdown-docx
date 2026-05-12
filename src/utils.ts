import { AlignmentType, HeadingLevel, IPageMarginAttributes } from 'docx'
import { Tokens } from 'marked'

import { IBlockAttr, IMarkdownTheme, MarkdownImageType } from './types'

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

    switch (token.type) {
      case 'image':
        tokens.push(token)
        break;
      case 'table':
        if (token.header?.length) {
          getImageTokens(token.header, tokens)
        }
        if (token.rows?.length) {
          for (const row of token.rows) {
            getImageTokens(row, tokens)
          }
        }
        break;
      default:
        if (token.tokens?.length) {
          getImageTokens(token.tokens, tokens)
        }
        break;
    }
  }
  return tokens
}


// "jpg" | "png" | "gif" | "bmp"
const ImageTypeWhitelist = new Set(['jpg', 'png', 'gif', 'bmp', 'webp'])

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
  } else if (!ImageTypeWhitelist.has(ext)) {
    throw new Error(`Image extension ${ext} is not supported`)
  }

  return ext as MarkdownImageType
}


export function isHttp (src: string) {
  return /^https?:\/\//.test(src)
}

// 1 pt = 20 twips (the unit docx uses for page margins)
const PT_TO_TWIPS = 20
// 1 inch = 1440 twips
const IN_TO_TWIPS = 1440
// 1 inch = 2.54 cm => 1 cm = 1440/2.54 ≈ 566.93 twips
const CM_TO_TWIPS = (1440 / 2.54)

function parseMarginValue(val: string | number): number {
  if (typeof val === 'number') return Math.round(val * PT_TO_TWIPS)
  const s = val.toString().trim()
  
  // Try centimeter
  const cmMatch = s.match(/^([\d.]+)\s*cm$/i)
  if (cmMatch) return Math.round(parseFloat(cmMatch[1]) * CM_TO_TWIPS)
  
  // Try inch
  const inMatch = s.match(/^([\d.]+)\s*(?:in|inch)$/i)
  if (inMatch) return Math.round(parseFloat(inMatch[1]) * IN_TO_TWIPS)
  
  // Default to points
  const num = parseFloat(s.replace(/pt$/i, '').trim())
  return isNaN(num) ? 0 : Math.round(num * PT_TO_TWIPS)
}

/**
 * Resolve page margin twip values from a theme's margin properties.
 * Returns null when no margin properties are set.
 */
export function resolvePageMargins(theme: Partial<IMarkdownTheme>): IPageMarginAttributes | null {
  const hasShorthand = theme.margin != null
  const hasVerbose =
    theme.marginTop != null ||
    theme.marginRight != null ||
    theme.marginBottom != null ||
    theme.marginLeft != null

  if (!hasShorthand && !hasVerbose) return null

  let top = 0, right = 0, bottom = 0, left = 0

  if (hasShorthand) {
    const m = theme.margin!
    const parts = typeof m === 'number' ? [m] : m.trim().split(/\s+/)
    if (parts.length === 1) {
      top = right = bottom = left = parseMarginValue(parts[0])
    } else if (parts.length === 2) {
      top = bottom = parseMarginValue(parts[0])
      right = left = parseMarginValue(parts[1])
    } else if (parts.length === 3) {
      top = parseMarginValue(parts[0])
      right = left = parseMarginValue(parts[1])
      bottom = parseMarginValue(parts[2])
    } else {
      top = parseMarginValue(parts[0])
      right = parseMarginValue(parts[1])
      bottom = parseMarginValue(parts[2])
      left = parseMarginValue(parts[3])
    }
  }

  // Verbose properties override shorthand
  if (theme.marginTop != null) top = parseMarginValue(theme.marginTop)
  if (theme.marginRight != null) right = parseMarginValue(theme.marginRight)
  if (theme.marginBottom != null) bottom = parseMarginValue(theme.marginBottom)
  if (theme.marginLeft != null) left = parseMarginValue(theme.marginLeft)

  return { top, right, bottom, left }
}
