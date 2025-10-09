import { Math, MathRun, Paragraph, ParagraphChild, FileChild, TextRun, MathFraction, MathRadical, MathSuperScript, MathSubScript, MathSubSuperScript } from 'docx'
import katex from 'katex'
import { mathmlToDocxChildren } from '../mathml-to-docx'
import { Lexer } from 'marked'

import { MarkdownDocx } from '../MarkdownDocx'
import { BlockKatex, IExtension, InlineKatex } from './types'

const inlineRule = /^(\${1,2})(?!\$)((?:\\.|[^\\\n])*?(?:\\.|[^\\\n\$]))\1(?=[\s?!\.,:？！。，：]|$)/;
const inlineRuleNonStandard = /^(\${1,2})(?!\$)((?:\\.|[^\\\n])*?(?:\\.|[^\\\n\$]))\1/; // Non-standard, even if there are no spaces before and after $ or $$, try to parse

const blockRule = /^(\${1,2})\n((?:\\[^]|[^\\])+?)\n\1(?:\n|$)/;

/**
 * @see https://github.com/UziTech/marked-katex-extension/blob/main/src/index.js
 */


const kQueueKey: unique symbol = Symbol.for('markdown-docx/latexQueue') as unknown as unique symbol

export default function latex(lexer: Lexer): IExtension {
  const nonStandard = false // lexer.options.nonStandard;
  const ruleReg = nonStandard ? inlineRuleNonStandard : inlineRule;

  // Per-render queues to reliably pass content from tokenizer to renderer
  const inlineQueue: string[] = []
  const blockQueue: string[] = []

  return {
    name: 'latex',
    startInline: (src) => {
      let index;
      let indexSrc = src;

      while (indexSrc) {
        index = indexSrc.indexOf('$');
        if (index === -1) {
          return;
        }
        const f = nonStandard ? index > -1 : index === 0 || indexSrc.charAt(index - 1) === ' ';
        if (f) {
          const possibleKatex = indexSrc.substring(index);

          if (possibleKatex.match(ruleReg)) {
            return index;
          }
        }

        indexSrc = indexSrc.substring(index + 1).replace(/^\$+/, '');
      }
    },
    inline: (src, tokens) => {
      const match = src.match(ruleReg);
      if (match) {
        const content = match[2].trim();

        inlineQueue.push(content)
        return {
          type: 'inlineKatex',
          raw: match[0],
          text: '',
          displayMode: match[1].length === 2,
        } as any;
      }
    },
    block: (src, tokens) => {
      const match = src.match(blockRule);
      if (match) {
        const content = match[2].trim();

        blockQueue.push(content)
        return {
          type: 'blockKatex',
          raw: match[0],
          text: '',
          displayMode: match[1].length === 2,
        } as any;
      }
    },
    init: (render: MarkdownDocx) => {
      // Attach queues to this render instance for use in renderers
      ; (render as any)[kQueueKey] = { inlineQueue, blockQueue }
      // Register inline and block renderers
      render.addInlineRender('inlineKatex', renderInline)
      render.addBlockRender('blockKatex', renderBlock)
    }
  }
}

const keepSet = new Set(['{', '}', '#', '$', '%', '&']);

const macroMap = new Map<string, string>([
  ['alpha', 'α'],
  ['beta', 'β'],
  ['gamma', 'γ'],
  ['delta', 'δ'],
  ['epsilon', 'ε'],
  ['zeta', 'ζ'],
  ['eta', 'η'],
  ['theta', 'θ'],
  ['iota', 'ι'],
  ['kappa', 'κ'],
  ['lambda', 'λ'],
  ['mu', 'μ'],
  ['nu', 'ν'],
  ['xi', 'ξ'],
  ['omicron', 'ο'],
  ['pi', 'π'],
  ['rho', 'ρ'],
  ['sigma', 'σ'],
  ['tau', 'τ'],
  ['upsilon', 'υ'],
  ['phi', 'φ'],
  ['chi', 'χ'],
  ['psi', 'ψ'],
  ['omega', 'ω'],
  ['textasciitilde', '~'],
  ['textbackslash', '\\'],
  ['textasciicircum', '^'],
  ['textbar', '|'],
  ['textless', '<'],
  ['textgreater', '>'],
  ['textunderscore', '_'],
  ['neq', '≠'],
  ['leq', '≤'],
  ['leqq', '≦'],
  ['geq', '≥'],
  ['geqq', '≧'],
  ['sim', '∼'],
  ['simeq', '≃'],
  ['approx', '≈'],
  ['infty', '∞'],
  ['fallingdotseq', '≒'],
  ['risingdotseq', '≓'],
  ['equiv', '≡'],
  ['ll', '≪'],
  ['gg', '≫'],
  ['times', '×'],
  ['div', '÷'],
  ['pm', '±'],
  ['mp', '∓'],
  ['oplus', '⊕'],
  ['otimes', '⊗'],
  ['ominus', '⊖'],
  ['oslash', '⊘'],
  ['odot', '⊙'],
  ['circ', '∘'],
  ['bullet', '•'],
  ['cdot', '⋅'],
  ['ltimes', '⋉'],
  ['rtimes', '⋊'],
  ['in', '∈'],
  ['notin', '∉'],
  ['ni', '∋'],
  ['notni', '∌'],
]);

/**
 * Parse LaTeX text and convert to simple text representation
 * This is a basic implementation that handles common LaTeX commands
 */
function parseLatexToText(latex: string): string {
  let text = latex

  // Replace common LaTeX commands with Unicode symbols
  for (const [macro, symbol] of macroMap.entries()) {
    const regex = new RegExp(`\\\\${macro}(?![a-zA-Z])`, 'g')
    text = text.replace(regex, symbol)
  }

  // Handle superscripts: x^2 -> x²
  text = text.replace(/\^(\d)/g, (_, digit) => {
    const superscripts = '⁰¹²³⁴⁵⁶⁷⁸⁹'
    return superscripts[parseInt(digit)]
  })

  // Handle subscripts: x_2 -> x₂
  text = text.replace(/_(\d)/g, (_, digit) => {
    const subscripts = '₀₁₂₃₄₅₆₇₈₉'
    return subscripts[parseInt(digit)]
  })

  // Handle curly braces for grouping: x^{10} -> extract content
  text = text.replace(/\^{([^}]+)}/g, '^$1')
  text = text.replace(/_{([^}]+)}/g, '_$1')

  // Remove remaining backslashes for simple commands
  text = text.replace(/\\([a-zA-Z]+)/g, '$1')

  // Clean up remaining braces
  text = text.replace(/[{}]/g, '')

  return text
}

function extractLatex(raw: string = ''): string {
  // Remove starting and ending $ or $$ with optional surrounding spaces/newlines
  const trimmed = raw.trim();
  if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
    return trimmed.slice(2, -2).trim();
  }
  if (trimmed.startsWith('$') && trimmed.endsWith('$')) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function renderInline(render: MarkdownDocx, token: InlineKatex): ParagraphChild {
  // For now, use a simple text representation
  // TODO: Implement full LaTeX to OMML conversion
  const raw = (token as any).raw as string | undefined
  const queues = (render as any)[kQueueKey] as { inlineQueue?: string[] } | undefined
  const queued = queues?.inlineQueue?.shift()
  const content = (token as any).content as string | undefined
  const nested = (token as any).tokens?.[0]?.text as string | undefined
  const text = queued || (token.text && token.text.trim()) || (nested && nested.trim()) || (content && content.trim()) || extractLatex(raw)
  // KaTeX engine path
  if (render.options?.math?.engine === 'katex') {
    try {
      const mml = katex.renderToString(text, { output: 'mathml', throwOnError: false, displayMode: !!token.displayMode, ...(render.options.math?.katexOptions || {}) })
      const children = mathmlToDocxChildren(mml, { libreOfficeCompat: !!render.options.math?.libreOfficeCompat })
      if (children && children.length) {
        return new Math({ children })
      }
    } catch { }
  }

  let parsedText = parseLatexToText(text)
  if (!parsedText) parsedText = text

  // Fallback: if still empty, render as plain text so users see something
  if (!parsedText) return new TextRun(text || raw || '')

  return new Math({ children: [new MathRun(parsedText)] })
}

function renderBlock(render: MarkdownDocx, token: BlockKatex): FileChild {
  // For block equations, render as a paragraph containing the Math element
  const raw = (token as any).raw as string | undefined
  const queues = (render as any)[kQueueKey] as { blockQueue?: string[] } | undefined
  const queued = queues?.blockQueue?.shift()
  const content = (token as any).content as string | undefined
  const nested = (token as any).tokens?.[0]?.text as string | undefined
  const text = queued || (token.text && token.text.trim()) || (nested && nested.trim()) || (content && content.trim()) || extractLatex(raw)
  // KaTeX engine path
  if (render.options?.math?.engine === 'katex') {
    try {
      const mml = katex.renderToString(text, { output: 'mathml', throwOnError: false, displayMode: !!token.displayMode, ...(render.options.math?.katexOptions || {}) })
      const children = mathmlToDocxChildren(mml, { libreOfficeCompat: !!render.options.math?.libreOfficeCompat })
      if (children && children.length) {
        return new Paragraph({ children: [new Math({ children })] })
      }
    } catch { }
  }

  let parsedText = parseLatexToText(text)
  if (!parsedText) parsedText = text

  // Fallback: if still empty, render as plain text paragraph
  if (!parsedText) return new Paragraph({ children: [new TextRun(text || raw || '')] })

  return new Paragraph({ children: [new Math({ children: [new MathRun(parsedText)] })] })
}
