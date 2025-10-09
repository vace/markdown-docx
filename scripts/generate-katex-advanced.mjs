import fs from 'node:fs/promises'
import markdownDocx, { Packer } from '../dist/index.node.mjs'

const markdown = `Sum: $\\sum_{i=1}^{n} i$  Integral: $\\int_{0}^{1} x^2 \, dx$`

const doc = await markdownDocx(markdown, { math: { engine: 'katex' } })
const buffer = await Packer.toBuffer(doc)
await fs.writeFile('test-katex-advanced.docx', buffer)
console.log('Wrote test-katex-advanced.docx', buffer.length, 'bytes')

