export type ITextAttr = {
  style?: string

  // attrs
  bold?: boolean
  italics?: boolean
  underline?: boolean // with options
  strike?: boolean
  break?: boolean | number

  // text style
  html?: boolean
  link?: boolean
  strong?: boolean
  em?: boolean
  codespan?: boolean
  del?: boolean
  br?: boolean
}

export type IBlockAttr = {
  style?: string

  blockquote?: boolean

  list?: {
    task?: boolean
    checked?: boolean
    level: number
    type?: 'number' | 'bullet'
    /**
     * @link https://github.com/dolanmiu/docx/pull/816
     * @link https://github.com/dolanmiu/docx/issues/3037#issuecomment-3164253396
     */
    instance?: number // numbering instance
  }

  listNone?: boolean

  heading?: number
  code?: boolean

  align?: 'left' | 'center' | 'right' | null

  footnote?: boolean
}
