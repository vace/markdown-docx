import { Math, Paragraph } from 'docx'
import { Lexer } from 'marked'

import { MarkdownDocx } from '../MarkdownDocx'
import { BlockKatex, IExtension, InlineKatex } from './types'

const inlineRule = /^(\${1,2})(?!\$)((?:\\.|[^\\\n])*?(?:\\.|[^\\\n\$]))\1(?=[\s?!\.,:？！。，：]|$)/;
const inlineRuleNonStandard = /^(\${1,2})(?!\$)((?:\\.|[^\\\n])*?(?:\\.|[^\\\n\$]))\1/; // Non-standard, even if there are no spaces before and after $ or $$, try to parse

const blockRule = /^(\${1,2})\n((?:\\[^]|[^\\])+?)\n\1(?:\n|$)/;

/**
 * @see https://github.com/UziTech/marked-katex-extension/blob/main/src/index.js
 */

export default function latex(lexer: Lexer): IExtension {
  const nonStandard = false // lexer.options.nonStandard;
  const ruleReg = nonStandard ? inlineRuleNonStandard : inlineRule;

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
        return {
          type: 'inlineKatex',
          raw: match[0],
          text: match[2].trim(),
          displayMode: match[1].length === 2,
        };
      }
    },
    block: (src, tokens) => {
      const match = src.match(blockRule);
      if (match) {
        return {
          type: 'blockKatex',
          raw: match[0],
          text: match[2].trim(),
          displayMode: match[1].length === 2,
        };
      }
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

// function renderInline(token: InlineKatex, render: MarkdownDocx) {
//   return new Math({
//     children: runs
//   });
// }

// function renderBlock(token: BlockKatex, render: MarkdownDocx) {
// }
