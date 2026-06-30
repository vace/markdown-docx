import { IPropertiesOptions } from 'docx'
import { MarkedOptions } from 'marked'

import { MarkdownImageAdapter } from './image'
import { IMarkdownTheme } from './theme'

export interface MarkdownDocxOptions extends MarkedOptions {
  imageAdapter?: MarkdownImageAdapter

  /**
   * Math engine configuration
   * builtin: simple unicode mapping
   * katex: KaTeX -> MathML -> docx Math
   */
  math?: {
    engine?: 'builtin' | 'katex' // future: 'mathjax'
    katexOptions?: Record<string, any>
    /** Prefer constructs that are broadly supported by LibreOffice (e.g., avoid true OMML matrices and n-ary) */
    libreOfficeCompat?: boolean
  }

  /**
   * do not download image
   * @default false
   */
  ignoreImage?: boolean

  /**
   * do not parse footnote
   * @default false
   */
  ignoreFootnote?: boolean

  /**
   * do not parse html
   * @default false
   */
  ignoreHtml?: boolean

  /**
   * Properties for the document
   */
  document?: Omit<IPropertiesOptions, 'sections'>

  /**
   * colors theme
   */
  theme?: Partial<IMarkdownTheme>
}
