import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { execSync } from 'child_process'
import fs from 'node:fs'
import path from 'node:path'

const tmpDir = '/tmp/markdown-docx-test'
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
    execSync(`node bin/markdown-docx.mjs --input ${inputFile} --output ${outputFile} --theme '${themeJson}'`, {
      cwd: '/home/tsehla/projects/other/markdown-docx'
    })
    expect(fs.existsSync(outputFile)).toBe(true)
  })

  it('creates docx with --theme JSON for lineSpacing', () => {
    const themeJson = JSON.stringify({ lineSpacing: 1.5 })
    execSync(`node bin/markdown-docx.mjs --input ${inputFile} --output ${outputFile} --theme '${themeJson}'`, {
      cwd: '/home/tsehla/projects/other/markdown-docx'
    })
    expect(fs.existsSync(outputFile)).toBe(true)
  })

  it('creates docx with --theme JSON containing multiple properties', () => {
    const themeJson = JSON.stringify({ bodySize: 14, lineSpacing: 1.5, heading1: 'FF0000' })
    execSync(`node bin/markdown-docx.mjs --input ${inputFile} --output ${outputFile} --theme '${themeJson}'`, {
      cwd: '/home/tsehla/projects/other/markdown-docx'
    })
    expect(fs.existsSync(outputFile)).toBe(true)
  })

  it('throws error for invalid JSON in --theme flag', () => {
    expect(() => {
      execSync(`node bin/markdown-docx.mjs --input ${inputFile} --output ${outputFile} --theme '{"bodySize": invalid}'`, {
        cwd: '/home/tsehla/projects/other/markdown-docx'
      })
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

    execSync(`node bin/markdown-docx.mjs --input ${inputFile} --output ${outputFile} --config ${configFile}`, {
      cwd: '/home/tsehla/projects/other/markdown-docx'
    })
    expect(fs.existsSync(outputFile)).toBe(true)

    fs.unlinkSync(configFile)
  })

  it('throws error for missing config file', () => {
    expect(() => {
      execSync(`node bin/markdown-docx.mjs --input ${inputFile} --output ${outputFile} --config /nonexistent/config.json`, {
        cwd: '/home/tsehla/projects/other/markdown-docx'
      })
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
    execSync(`node bin/markdown-docx.mjs --input ${inputFile} --output ${outputFile} --config ${configFile} --theme '${themeJson}'`, {
      cwd: '/home/tsehla/projects/other/markdown-docx'
    })
    expect(fs.existsSync(outputFile)).toBe(true)

    fs.unlinkSync(configFile)
  })
})
