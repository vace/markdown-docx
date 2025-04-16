#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { Command } from 'commander'
import markdownToDocx, { Packer } from '../dist/node/index.mjs'

const pkg = JSON.parse(await fs.readFile(new URL('../package.json', import.meta.url), 'utf-8'))

const { name, description, version } = pkg

const program = new Command()

program
  .name(name)
  .description(description)
  .version(version, '-v, --version', 'output the version number')
  .option('-i, --input <file>', 'input markdown file')
  .option('-o, --output <file>', 'output docx file')
  .action(doCommand)
  .parse(process.argv)

async function doCommand(options) {
  if (!options.input) {
    throw new Error('Input file is required')
  }
  if (!options.output) {
    options.output = options.input.replace(/\.mdx?$/, '.docx')
  }

  const ext = path.extname(options.output)

  if (!ext) {
    options.output += '.docx'
  } else if (ext.toLowerCase() !== '.docx') {
    throw new Error(`[${name}] Output file must be a .docx file, but got ${ext}`)
  }

  const content = await fs.readFile(options.input, 'utf-8')
  if (!content) {
    throw new Error(`[${name}] File ${options.input} is empty`)
  }

  const docx = await markdownToDocx(content)
  const buffer = await Packer.toBuffer(docx)

  await fs.writeFile(options.output, buffer)

  console.log(`[${name}] File ${options.output} created successfully`)
}
