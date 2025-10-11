import { MathRun, MathFraction, MathRadical, MathSuperScript, MathSubScript, MathSubSuperScript, MathSum, MathIntegral, XmlComponent, MathComponent } from 'docx'
import { XMLParser } from 'fast-xml-parser'

let LO_COMPAT = false


// OMML Matrix helpers
class MathMatrixElement extends XmlComponent {
  constructor(children: MathComponent[]) {
    super('m:e')
    for (const child of children) this.root.push(child as any)
  }
}

class MathMatrixRow extends XmlComponent {
  constructor(cells: MathComponent[][]) {
    super('m:mr')
    for (const cell of cells) this.root.push(new MathMatrixElement(cell))
  }
}

class MathMatrix extends XmlComponent {
  constructor(rows: MathComponent[][][]) {
    super('m:m')
    // m:mPr could be added for alignment/spacing in the future
    for (const row of rows) this.root.push(new MathMatrixRow(row))
  }
}

// Convert KaTeX MathML string to docx Math children
// Minimal mapper covering core elements; can be expanded over time.
export function mathmlToDocxChildren(mathml: string, opts?: { libreOfficeCompat?: boolean }): MathComponent[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    textNodeName: 'text',
    preserveOrder: true,
    trimValues: false,
  })
  const json = parser.parse(mathml) as any[]
  // Find the <math> node
  const mathNode = findFirst(json, 'math')
  LO_COMPAT = !!opts?.libreOfficeCompat

  if (!mathNode) return []
  // Prefer <semantics><mrow>...</mrow></semantics> content
  const semantics = findFirst(childrenOf(mathNode), 'semantics')
  const root = semantics ? findFirst(childrenOf(semantics), 'mrow') || semantics : findFirst(childrenOf(mathNode), 'mrow') || mathNode
  return walkChildren(childrenOf(root))
}

function walkChildren(nodes: any[]): MathComponent[] {
  let out: MathComponent[] = []
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i]
    const tag = tagName(n)

    // Handle NAry operators with limits in various MathML shapes
    if (tag === 'munderover' || tag === 'munder' || tag === 'mover') {
      const kids = childrenOf(n)
      const moNode = findFirst(kids, 'mo')
      const opText = moNode ? directText(childrenOf(moNode)) : ''
      const lower = tag !== 'mover' ? (kids[1] ? walkNode(kids[1]) : []) : []
      const upper = tag !== 'munder' ? (kids[2] ? walkNode(kids[2]) : []) : []
      const base = walkChildren(nodes.slice(i + 1)) // treat rest of mrow as the base/body
      if (opText.includes('∑')) {
        if (LO_COMPAT) {
          out.push(...naryAsSubSup('∑', lower, upper, base))
        } else {
          out.push(new MathSum({ children: base, subScript: lower, superScript: upper }))
        }
        break // consumed the rest as base
      }
      if (opText.includes('∫')) {
        if (LO_COMPAT) {
          out.push(...naryAsSubSup('∫', lower, upper, base))
        } else {
          out.push(new MathIntegral({ children: base, subScript: lower, superScript: upper }))
        }
        break
      }
      // If operator is unrecognized, fall through to default handling
    }

    // KaTeX often uses msubsup around the operator (mo)
    if (tag === 'msubsup') {
      const ks = childrenOf(n)
      const base = ks[0]
      if (tagName(base) === 'mo') {
        const op = directText(childrenOf(base))
        const lower = ks[1] ? walkNode(ks[1]) : []
        const upper = ks[2] ? walkNode(ks[2]) : []
        const body = walkChildren(nodes.slice(i + 1))
        if (op.includes('∑')) { out.push(...(LO_COMPAT ? naryAsSubSup('∑', lower, upper, body) : [new MathSum({ children: body, subScript: lower, superScript: upper })])); break }
        if (op.includes('∫')) { out.push(...(LO_COMPAT ? naryAsSubSup('∫', lower, upper, body) : [new MathIntegral({ children: body, subScript: lower, superScript: upper })])); break }
      }
    }

    out = out.concat(walkNode(n))
  }
  return out
}

function walkNode(node: any): MathComponent[] {
  const tag = tagName(node)
  if (!tag) {
    const t = node.text?.toString() || ''
    return t ? [new MathRun(t)] : []
  }
  const kids = childrenOf(node)

  switch (tag) {
    case 'mrow':
      return walkChildren(kids)
    case 'mi':
    case 'mn':
    case 'mo':
      return textFrom(kids)
    case 'msup': {
      const [base, sup] = firstN(kids, 2)
      return [new MathSuperScript({ children: walkNode(base), superScript: walkNode(sup) })]
    }
    case 'msub': {
      const [base, sub] = firstN(kids, 2)
      return [new MathSubScript({ children: walkNode(base), subScript: walkNode(sub) })]
    }
    case 'msubsup': {
      const [base, sub, sup] = firstN(kids, 3)
      return [new MathSubSuperScript({ children: walkNode(base), subScript: walkNode(sub), superScript: walkNode(sup) })]
    }
    case 'mfrac': {
      const [num, den] = firstN(kids, 2)
      return [new MathFraction({ numerator: walkNode(num), denominator: walkNode(den) })]
    }
    case 'msqrt': {
      const [body] = firstN(kids, 1)
      return [new MathRadical({ children: walkNode(body) })]
    }
    case 'mroot': {
      const [body, degree] = firstN(kids, 2)
      return [new MathRadical({ children: walkNode(body), degree: walkNode(degree) })]
    }
    case 'mtable': {
      const rows = kids.filter((k) => tagName(k) === 'mtr')
      if (LO_COMPAT) {
        // LibreOffice-friendly fallback: bracketed representation [row1; row2; ...]
        const parts: MathComponent[] = []
        parts.push(new MathRun('['))
        rows.forEach((row, ri) => {
          if (ri > 0) parts.push(new MathRun('; '))
          const cells = childrenOf(row).filter((c) => tagName(c) === 'mtd')
          cells.forEach((cell, ci) => {
            if (ci > 0) parts.push(new MathRun(', '))
            parts.push(...walkChildren(childrenOf(cell)))
          })
        })
        parts.push(new MathRun(']'))
        return parts
      }
      // Default: True OMML matrix using m:m (rows m:mr, elements m:e)
      const rowsCells: MathComponent[][][] = rows.map((row) => {
        const cells = childrenOf(row).filter((c) => tagName(c) === 'mtd')
        return cells.map((cell) => walkChildren(childrenOf(cell)))
      })
      return [new MathMatrix(rowsCells)]
    }


    case 'munderover':
    case 'munder':
    case 'mover': {
      // Already handled in walkChildren for lookahead/base capture; as a node, render its operator + limits plainly
      const m = childrenOf(node)
      const op = textFrom(childrenOf(findFirst(m, 'mo') || {}))
      const low = tag !== 'mover' ? (m[1] ? walkNode(m[1]) : []) : []
      const up = tag !== 'munder' ? (m[2] ? walkNode(m[2]) : []) : []
      return op.concat(low).concat(up)
    }
    default:
      return walkChildren(kids)
  }
}

function tagName(node: any): string | null {
  // node like: { tag: [ children ], ":@": { attrs } } OR { text: '...' }
  const keys = Object.keys(node).filter((k) => k !== 'text' && k !== ':@')
  return keys[0] || null
}

function childrenOf(node: any): any[] {
  const tag = tagName(node)
  if (!tag) return []
  const val = node[tag]
  return Array.isArray(val) ? val : (val ? [val] : [])
}

function textFrom(nodes: any[]): MathComponent[] {
  const texts = nodes.map((n) => (n.text ?? '').toString()).join('')
  return texts ? [new MathRun(texts)] : []
}

function directText(nodes: any[]): string {
  return nodes.map((n) => (n.text ?? '').toString()).join('')
}

function naryAsSubSup(op: string, lower: MathComponent[], upper: MathComponent[], body: MathComponent[]): MathComponent[] {
  return [new MathSubSuperScript({ children: [new MathRun(op)], subScript: lower, superScript: upper }), ...body]
}

function findFirst(nodes: any[], name: string): any | null {
  for (const n of nodes) {
    if (tagName(n) === name) return n
    const inner = findFirst(childrenOf(n), name)
    if (inner) return inner
  }
  return null
}

function firstN(nodes: any[], n: number): any[] {
  return nodes.slice(0, n)
}

