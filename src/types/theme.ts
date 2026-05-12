/**
 * Theme configuration for the generated docx document.
 */
export type IMarkdownTheme = {
  /**
   * Color of heading fonts
   */
  heading1: string
  heading2: string
  heading3: string
  heading4: string
  heading5: string
  heading6: string
  link: string
  code: string
  tag: string
  border: string
  codespan: string
  codeBackground: string
  blockquote: string
  blockquoteBackground: string
  del: string
  hr: string
  html: string
  tableHeaderBackground: string

  /**
   * Size of heading fonts
   */
  heading1Size: number
  heading2Size: number
  heading3Size: number
  heading4Size: number
  heading5Size: number
  heading6Size: number
  spaceSize: number
  codeSize: number
  linkUnderline: boolean

  /**
   * Body typography customization
   */
  bodySize?: number       // Font size in points (e.g., 14 for 14pt). Optional, uses library default if omitted.
  lineSpacing?: number    // Line spacing multiplier (e.g., 1.5 for 150%). Optional, uses library default if omitted.

  /**
   * Page margins. Accepts a CSS-style shorthand string or a plain number (treated as pt).
   * Supported units: pt (points), cm (centimetres), and in/inch (inches).
   * Shorthand patterns:
   *   "72"                   → all sides 72 pt
   *   "72pt"                 → all sides 72 pt
   *   "2cm"                  → all sides 2 cm
   *   "1in"                  → all sides 1 inch
   *   "2cm 1.5cm"            → top/bottom 2 cm, left/right 1.5 cm
   *   "2cm 1.5cm 1cm"        → top 2cm, left/right 1.5cm, bottom 1cm
   *   "2cm 1.5cm 1cm 1.5cm"  → top right bottom left
   * Verbose properties (marginTop/Right/Bottom/Left) override the shorthand.
   */
  margin?: string | number
  marginTop?: number | string
  marginRight?: number | string
  marginBottom?: number | string
  marginLeft?: number | string

  /**
   * When true, blank-line separator paragraphs between content blocks are omitted
   * from the output entirely instead of being rendered as empty paragraphs.
   */
  collapseEmptyLines?: boolean
}
