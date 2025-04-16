import { Lexer } from "marked";
import footnote from "./footnote";
import { IExtensionFn } from "./types";

export default function useExtensions(lexer: Lexer) {
  usePlugin(lexer, footnote)
  return lexer
}

export * from './types'

function usePlugin(lexer: Lexer, fn: IExtensionFn) {
  const plugin = fn(lexer)

  // @ts-ignore
  const extensions: any = lexer.options.extensions || (lexer.options.extensions = {})

  const blocks = extensions.block || (extensions.block = [])
  const inline = extensions.inline || (extensions.inline = [])

  if (plugin.block) {
    blocks.push(plugin.block)
  }
  if (plugin.inline) {
    inline.push(plugin.inline)
  }
}
