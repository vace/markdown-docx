import { Packer } from 'docx'
import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import markdownToDocx, { MarkdownDocx, styles } from '../src/entry-node'

const __dirname = new URL('.', import.meta.url).pathname

const getFile = (filename: string) => path.resolve(__dirname, filename)

const getText = (filename: string) => fs.readFileSync(getFile(filename), 'utf-8')

describe('markdown-docx', () => {
  it('markdownToDocx()', async () => {
    // styles.default.heading1 = { run: { color: '#ff0000' } }
    // styles.default.heading2 = { run: { color: '#ff0000' } }
    // styles.default.heading3 = { run: { color: '#ff0000' } }

    const docx = await markdownToDocx(getText('./markdown.md'))

    const buffer = await Packer.toBuffer(docx)

    // buffer not empty
    expect(buffer.length).greaterThan(0)

    fs.writeFileSync(getFile('./markdown.docx'), buffer)

    // check file exists
    expect(fs.existsSync(getFile('./markdown.docx'))).toBe(true)
  })

  it('markdownToDocx() with themes', async () => {
    const docx = await markdownToDocx(getText('./markdown.md'), {
      theme: {
        heading1: "5B21B6",
        heading2: "7C3AED",
        heading3: "8B5CF6",
        heading4: "374151",
        heading5: "374151",
        heading6: "374151",
        link: "00fb0a",
        code: "EC4899",
        blockquote: "6B7280",
        del: "EF4444",
        heading1Size: 66,
        heading2Size: 52,
        heading3Size: 42,
        spaceSize: 18,
        codeSize: 20,
        linkUnderline: false,
      }
    })

    const buffer = await Packer.toBuffer(docx)

    // buffer not empty
    expect(buffer.length).greaterThan(0)

    fs.writeFileSync(getFile('./markdown.docx'), buffer)

    // check file exists
    expect(fs.existsSync(getFile('./markdown.docx'))).toBe(true)
  })

  it('new MarkdownToDocx()', async () => {
    const docx = new MarkdownDocx(getText('./markdown.md'))
    const buffer = await docx.toDocument()
    const docxBuffer = await Packer.toBuffer(buffer)
    // buffer not empty
    expect(docxBuffer.length).greaterThan(0)
    fs.writeFileSync(getFile('./markdown.docx'), docxBuffer)
    // check file exists
    expect(fs.existsSync(getFile('./markdown.docx'))).toBe(true)
  })

  it('List Numbering', async () => {
    const md = getFile('./list-number-restart.md')
    const file = getFile('./list-number-restart.docx')
    const docx = new MarkdownDocx(getText(md))
    const buffer = await docx.toDocument()
    const docxBuffer = await Packer.toBuffer(buffer)
    // buffer not empty
    expect(docxBuffer.length).greaterThan(0)
    fs.writeFileSync(file, docxBuffer)
    // check file exists
    expect(fs.existsSync(file)).toBe(true)
  })

  it('List Complex', async () => {
    const md = getFile('./list-complex.md')
    const file = getFile('./list-complex.docx')
    const docx = new MarkdownDocx(getText(md))
    const buffer = await docx.toDocument()
    const docxBuffer = await Packer.toBuffer(buffer)
    // buffer not empty
    expect(docxBuffer.length).greaterThan(0)
    fs.writeFileSync(file, docxBuffer)
    // check file exists
    expect(fs.existsSync(file)).toBe(true)
  })
})
