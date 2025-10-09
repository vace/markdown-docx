import fs from 'node:fs/promises'
import markdownDocx, { Packer } from '../dist/index.node.mjs'

const markdown = `Matrix: $$\\begin{bmatrix}a & b \\\\ c & d\\end{bmatrix}$$`

const doc = await markdownDocx(markdown, { math: { engine: 'katex' } })
const buffer = await Packer.toBuffer(doc)
await fs.writeFile('test-katex-matrix.docx', buffer)
console.log('Wrote test-katex-matrix.docx', buffer.length, 'bytes')

