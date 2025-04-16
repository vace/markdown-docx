import path from 'node:path'
import fs from 'node:fs'
import { describe, it, expect } from 'vitest'
import { Packer } from 'docx'
import markdownToDocx, { MarkdownDocx } from '../src/index'

const __dirname = new URL('.', import.meta.url).pathname

const getFile = (filename: string) => path.resolve(__dirname, filename)

const getText = (filename: string) => fs.readFileSync(getFile(filename), 'utf-8')

describe('markdown-docx', () => {
  it('markdownToDocx()', async () => {
    const docx = await markdownToDocx(getText('./markdown.md'))

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
})
