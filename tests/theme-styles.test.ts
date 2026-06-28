import { describe, it, expect } from 'vitest'
import { createDefaultStyle } from '../src/styles/styles'
import { createMarkdownStyle } from '../src/styles/markdown'
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

describe('createMarkdownStyle font-family', () => {
  const defaultStyles = createMarkdownStyle({})

  it('code font defaults to "Courier New" when codeFont is not set', () => {
    expect(defaultStyles.code.run?.font).toBe('Courier New')
  })

  it('code font uses custom codeFont when set', () => {
    const styles = createMarkdownStyle({ codeFont: 'Fira Code' })
    expect(styles.code.run?.font).toBe('Fira Code')
  })

  it('codespan font defaults to "Courier New" when codeFont is not set', () => {
    expect(defaultStyles.codespan.run?.font).toBe('Courier New')
  })

  it('codespan font uses custom codeFont when set', () => {
    const styles = createMarkdownStyle({ codeFont: 'JetBrains Mono' })
    expect(styles.codespan.run?.font).toBe('JetBrains Mono')
  })

  it('html font defaults to "Courier New" when codeFont is not set', () => {
    expect(defaultStyles.html.run?.font).toBe('Courier New')
  })

  it('tag font defaults to "Courier New" when codeFont is not set', () => {
    expect(defaultStyles.tag.run?.font).toBe('Courier New')
  })

  it('tag font uses custom codeFont when set', () => {
    const styles = createMarkdownStyle({ codeFont: 'Source Code Pro' })
    expect(styles.tag.run?.font).toBe('Source Code Pro')
  })

  it('heading font is omitted when headingFont is not set', () => {
    expect(defaultStyles.heading1.run?.font).toBeUndefined()
    expect(defaultStyles.heading2.run?.font).toBeUndefined()
    expect(defaultStyles.heading3.run?.font).toBeUndefined()
    expect(defaultStyles.heading4.run?.font).toBeUndefined()
    expect(defaultStyles.heading5.run?.font).toBeUndefined()
    expect(defaultStyles.heading6.run?.font).toBeUndefined()
  })

  it('heading font is applied to all heading levels when headingFont is set', () => {
    const styles = createMarkdownStyle({ headingFont: 'Georgia' })
    expect(styles.heading1.run?.font).toBe('Georgia')
    expect(styles.heading2.run?.font).toBe('Georgia')
    expect(styles.heading3.run?.font).toBe('Georgia')
    expect(styles.heading4.run?.font).toBe('Georgia')
    expect(styles.heading5.run?.font).toBe('Georgia')
    expect(styles.heading6.run?.font).toBe('Georgia')
  })

  it('blockquote font is omitted when blockquoteFont is not set', () => {
    expect(defaultStyles.blockquote.run?.font).toBeUndefined()
  })

  it('blockquote font is applied when blockquoteFont is set', () => {
    const styles = createMarkdownStyle({ blockquoteFont: 'Georgia' })
    expect(styles.blockquote.run?.font).toBe('Georgia')
  })

  it('paragraph font is omitted when bodyFont is not set (body font handled at document level)', () => {
    expect(defaultStyles.paragraph.run?.font).toBeUndefined()
  })

  it('combines multiple font theme options', () => {
    const styles = createMarkdownStyle({
      headingFont: 'Arial',
      codeFont: 'Fira Code',
      blockquoteFont: 'Times New Roman',
    })
    expect(styles.heading1.run?.font).toBe('Arial')
    expect(styles.code.run?.font).toBe('Fira Code')
    expect(styles.blockquote.run?.font).toBe('Times New Roman')
    // code-related fonts all use codeFont
    expect(styles.codespan.run?.font).toBe('Fira Code')
    expect(styles.html.run?.font).toBe('Fira Code')
    expect(styles.tag.run?.font).toBe('Fira Code')
  })
})
