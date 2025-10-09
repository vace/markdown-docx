import fs from 'node:fs/promises'
import markdownDocx, { Packer } from '../dist/index.node.mjs'

const markdown = `**The Cauchy-Schwarz Inequality**\
$$\\left( \\sum_{k=1}^n a_k b_k \\right)^2 \\leq \\left( \\sum_{k=1}^n a_k^2 \\right) \\left( \\sum_{k=1}^n b_k^2 \\right)$$

**The Cauchy-Schwarz Inequality**

\`\`\`math
\\left( \\sum_{k=1}^n a_k b_k \\right)^2 \\leq \\left( \\sum_{k=1}^n a_k^2 \\right) \\left( \\sum_{k=1}^n b_k^2 \\right)
\`\`\`
`

const doc = await markdownDocx(markdown, { math: { engine: 'katex' } })
const buffer = await Packer.toBuffer(doc)
await fs.writeFile('test-cauchy.docx', buffer)
console.log('Wrote test-cauchy.docx', buffer.length, 'bytes')

