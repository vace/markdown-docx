import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { execSync } from 'child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const tmpDir = path.join(os.tmpdir(), 'markdown-docx-test')
const inputFile = path.join(tmpDir, 'test.md')
const outputFile = path.join(tmpDir, 'test.docx')

beforeEach(() => {
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true })
  }
  fs.writeFileSync(inputFile, '# Test Heading\n\nBody text here.')
})

afterEach(() => {
  if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile)
  }
})

describe('CLI --theme flag', () => {
  it('creates docx with --theme JSON for bodySize', () => {
    const themeJson = JSON.stringify({ bodySize: 14 })
    execSync(`node bin/markdown-docx.mjs --input ${inputFile} --output ${outputFile} --theme '${themeJson}'`)
    expect(fs.existsSync(outputFile)).toBe(true)
  })

  it('creates docx with --theme JSON for lineSpacing', () => {
    const themeJson = JSON.stringify({ lineSpacing: 1.5 })
    execSync(`node bin/markdown-docx.mjs --input ${inputFile} --output ${outputFile} --theme '${themeJson}'`)
    expect(fs.existsSync(outputFile)).toBe(true)
  })

  it('creates docx with --theme JSON containing multiple properties', () => {
    const themeJson = JSON.stringify({ bodySize: 14, lineSpacing: 1.5, heading1: 'FF0000' })
    execSync(`node bin/markdown-docx.mjs --input ${inputFile} --output ${outputFile} --theme '${themeJson}'`)
    expect(fs.existsSync(outputFile)).toBe(true)
  })

  it('throws error for invalid JSON in --theme flag', () => {
    expect(() => {
      execSync(`node bin/markdown-docx.mjs --input ${inputFile} --output ${outputFile} --theme '{"bodySize": invalid}'`)
    }).toThrow()
  })
})

describe('CLI --config flag', () => {
  it('loads theme from config file', () => {
    const configFile = path.join(tmpDir, 'config.json')
    fs.writeFileSync(configFile, JSON.stringify({
      theme: {
        bodySize: 16,
        lineSpacing: 2.0
      }
    }))

    execSync(`node bin/markdown-docx.mjs --input ${inputFile} --output ${outputFile} --config ${configFile}`)
    expect(fs.existsSync(outputFile)).toBe(true)

    fs.unlinkSync(configFile)
  })

  it('throws error for missing config file', () => {
    expect(() => {
      execSync(`node bin/markdown-docx.mjs --input ${inputFile} --output ${outputFile} --config /nonexistent/config.json`)
    }).toThrow()
  })
})

describe('CLI precedence: --theme overrides --config', () => {
  it('--theme flag overrides --config file for same property', () => {
    const configFile = path.join(tmpDir, 'config.json')
    fs.writeFileSync(configFile, JSON.stringify({
      theme: {
        bodySize: 14,
        lineSpacing: 1.5
      }
    }))

    const themeJson = JSON.stringify({ bodySize: 18 })
    execSync(`node bin/markdown-docx.mjs --input ${inputFile} --output ${outputFile} --config ${configFile} --theme '${themeJson}'`)
    expect(fs.existsSync(outputFile)).toBe(true)

    fs.unlinkSync(configFile)
  })
})

describe('CLI help subcommand', () => {
  it('markdown-docx help theme outputs theme property names', () => {
    const output = execSync('node bin/markdown-docx.mjs help theme', {
      encoding: 'utf-8'
    })
    expect(output).toContain('heading1')
    expect(output).toContain('2F5597')
    expect(output).toContain('bodySize')
    expect(output).toContain('linkUnderline')
    expect(output).toContain('sample-config.json')
  })

  it('markdown-docx help config outputs config field names', () => {
    const output = execSync('node bin/markdown-docx.mjs help config', {
      encoding: 'utf-8'
    })
    expect(output).toContain('ignoreImage')
    expect(output).toContain('ignoreFootnote')
    expect(output).toContain('math.engine')
    expect(output).toContain('libreOfficeCompat')
    expect(output).toContain('sample-config.json')
  })

  it('markdown-docx help with no topic lists available topics', () => {
    const output = execSync('node bin/markdown-docx.mjs help', {
      encoding: 'utf-8'
    })
    expect(output).toContain('theme')
    expect(output).toContain('config')
  })

  it('markdown-docx help with unknown topic exits non-zero', () => {
    let stderr = ''
    try {
      execSync('node bin/markdown-docx.mjs help unknown-topic', {
        stdio: ['pipe', 'pipe', 'pipe'],
        encoding: 'utf-8'
      })
      throw new Error('Expected non-zero exit')
    } catch (err: any) {
      stderr = (err as any).stderr ?? ''
    }
    expect(stderr).toContain('Unknown help topic')
  })
})
