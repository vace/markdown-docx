import { Lexer } from 'marked'

import { MarkdownDocx } from '../MarkdownDocx'
import footnote from './footnote'
// import latex from './latex'
import { IExtensionFn } from './types'

export default function useExtensions(render: MarkdownDocx) {
  const lexer = new Lexer(render.options)
  usePlugin(render, lexer, footnote)
  // TODO latex extension currently has some issues
  // usePlugin(render, lexer, latex)
  return lexer
}

export * from './types'

function usePlugin(render: MarkdownDocx, lexer: Lexer, fn: IExtensionFn) {
  const plugin = fn(lexer)

  // @ts-ignore
  const extensions: any = lexer.options.extensions || (lexer.options.extensions = {})

  if (plugin.startBlock) {
    const startBlocks = extensions.startBlock || (extensions.startBlock = [])
    startBlocks.push(plugin.startBlock)
  }
  if (plugin.startInline) {
    const startInline = extensions.startInline || (extensions.startInline = [])
    startInline.push(plugin.startInline)
  }

  if (plugin.block) {
    const blocks = extensions.block || (extensions.block = [])
    blocks.push(plugin.block)
  }
  if (plugin.inline) {
    const inline = extensions.inline || (extensions.inline = [])
    inline.push(plugin.inline)
  }

  // add render plugin
  if (plugin.init) {
    plugin.init(render)
  }
}
