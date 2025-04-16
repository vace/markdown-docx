import { Lexer, MarkedOptions } from 'marked'
import { IBlockToken } from './types'
import useExtensions from './extensions'

export function tokenize(markdown: string, options?: MarkedOptions) {
  const laxer = useExtensions(new Lexer(options))
  return laxer.lex(markdown) as IBlockToken[]
}
