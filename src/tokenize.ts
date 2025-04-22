import { Lexer, MarkedOptions } from 'marked'

import useExtensions from './extensions'
import { IBlockToken } from './types'

export function tokenize(markdown: string, options?: MarkedOptions) {
  const laxer = useExtensions(new Lexer(options))
  return laxer.lex(markdown) as IBlockToken[]
}
