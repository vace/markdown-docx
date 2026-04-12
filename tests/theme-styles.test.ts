import { describe, it, expect } from 'vitest'
import { createDefaultStyle } from '../src/styles/styles'
import { IMarkdownTheme } from '../src/types'
import { defaultTheme } from '../src/styles/themes'

describe('createDefaultStyle', () => {
  it('converts bodySize (pt) to half-points for docx', () => {
    const theme: IMarkdownTheme = { ...defaultTheme, bodySize: 14 }
    const style = createDefaultStyle(theme)
    expect(style.document?.run?.size).toBe(28) // 14pt * 2 = 28 half-points
  })

  it('converts 12pt to 24 half-points', () => {
    const theme: IMarkdownTheme = { ...defaultTheme, bodySize: 12 }
    const style = createDefaultStyle(theme)
    expect(style.document?.run?.size).toBe(24)
  })

  it('converts lineSpacing to twips (240 per 1.0)', () => {
    const theme: IMarkdownTheme = { ...defaultTheme, lineSpacing: 1.5 }
    const style = createDefaultStyle(theme)
    expect(style.document?.paragraph?.spacing?.line).toBe(360) // 1.5 * 240 = 360 twips
  })

  it('converts single spacing (1.0) to 240 twips', () => {
    const theme: IMarkdownTheme = { ...defaultTheme, lineSpacing: 1.0 }
    const style = createDefaultStyle(theme)
    expect(style.document?.paragraph?.spacing?.line).toBe(240)
  })

  it('converts double spacing (2.0) to 480 twips', () => {
    const theme: IMarkdownTheme = { ...defaultTheme, lineSpacing: 2.0 }
    const style = createDefaultStyle(theme)
    expect(style.document?.paragraph?.spacing?.line).toBe(480)
  })

  it('preserves lineRule as auto', () => {
    const theme: IMarkdownTheme = { ...defaultTheme }
    const style = createDefaultStyle(theme)
    expect(style.document?.paragraph?.spacing?.lineRule).toBe('auto')
  })

  it('uses default values when theme values are undefined', () => {
    // bodySize defaults to 12 (from defaultTheme)
    const theme: IMarkdownTheme = { ...defaultTheme, bodySize: undefined }
    const style = createDefaultStyle(theme)
    expect(style.document?.run?.size).toBe(24) // 12pt default → 24 half-points
    
    // lineSpacing defaults to 1.0 (from defaultTheme)
    const theme2: IMarkdownTheme = { ...defaultTheme, lineSpacing: undefined }
    const style2 = createDefaultStyle(theme2)
    expect(style2.document?.paragraph?.spacing?.line).toBe(240) // 1.0 default → 240 twips
  })
})
