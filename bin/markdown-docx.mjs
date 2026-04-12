#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { Command } from 'commander'
import markdownToDocx, { Packer } from '../dist/index.node.mjs'
import { HELP_FOOTER, THEME_HELP, CONFIG_HELP } from './help-texts.mjs'

const pkg = JSON.parse(await fs.readFile(new URL('../package.json', import.meta.url), 'utf-8'))
const { name, description, version } = pkg

const program = new Command()

program
  .name(name)
  .description(description)
  .version(version, '-v, --version', 'output the version number')
  .option('-i, --input <file>', 'input markdown file')
  .option('-o, --output <file>', 'output docx file')
  .option('-t, --theme <json>', 'theme overrides as inline JSON (run: markdown-docx help theme)')
  .option('-c, --config <file>', 'JSON config file with all options (run: markdown-docx help config)')

program
  .command('help [topic]')
  .description('Show detailed help for theme or config options (topics: theme, config)')
  .action((topic) => {
    if (!topic) {
      console.log('Available help topics:')
      console.log('  markdown-docx help theme    Theme color/size properties and defaults')
      console.log('  markdown-docx help config   Config file structure and all option defaults')
    } else if (topic === 'theme') {
      console.log(THEME_HELP)
    } else if (topic === 'config') {
      console.log(CONFIG_HELP)
    } else {
      process.stderr.write(`Unknown help topic: ${topic}\nAvailable topics: theme, config\n`)
      process.exit(1)
    }
  })

program
  .action(doCommand)

program
  .parseAsync(process.argv)
  .catch((err) => {
    console.error(`\x1b[31mError: ${err.message}\x1b[0m`)
    if (err.message === 'Input file is required') {
      program.help()
    } else {
      console.error(err.stack)
    }
    process.exit(1)
  })

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

  const markdownDocxOptions = {}

  if (options.config) {
    try {
      const configContent = await fs.readFile(options.config, 'utf-8')
      const baseOptions = JSON.parse(configContent)
      Object.assign(markdownDocxOptions, baseOptions)
    } catch (err) {
      throw new Error(`Failed to load config file "${options.config}": ${err.message}`)
    }
  }

  if (!markdownDocxOptions.theme) {
    markdownDocxOptions.theme = {}
  }

  if (options.theme) {
    try {
      const themeOverride = JSON.parse(options.theme)
      Object.assign(markdownDocxOptions.theme, themeOverride)
    } catch (err) {
      throw new Error(`Failed to parse --theme JSON: ${err.message}`)
    }
  }

  const content = await fs.readFile(options.input, 'utf-8')
  if (!content) {
    throw new Error(`[${name}] File ${options.input} is empty`)
  }

  const docx = await markdownToDocx(content, markdownDocxOptions)
  const buffer = await Packer.toBuffer(docx)

  await fs.writeFile(options.output, buffer)

  console.log(`[${name}] File ${options.output} created successfully`)
}
