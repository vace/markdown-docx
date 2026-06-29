import { describe, it, expect, vi } from 'vitest'
import { ImageRun, Paragraph } from 'docx'
import { Tokens } from 'marked'
import { createDefaultStyle } from '../src/styles/styles'
import { createMarkdownStyle } from '../src/styles/markdown'
import { IMarkdownTheme } from '../src/types'
import { defaultTheme } from '../src/styles/themes'
import { MarkdownDocx } from '../src/MarkdownDocx'
import { renderImage, parseImageTitleSize } from '../src/renders/render-image'
import { MarkdownImageItem } from '../src/types'

vi.mock('docx')

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

// ---------------------------------------------------------------------------
// renderImage – imageHorizontalAlign
// ---------------------------------------------------------------------------

describe('renderImage horizontal alignment', () => {

  // ---------------------------------------------------------------------------
  // Helpers for image alignment tests
  // ---------------------------------------------------------------------------

  function createMockImageToken(overrides: Partial<Tokens.Image> = {}): Tokens.Image {
    return {
      type: 'image',
      raw: '![test](https://example.com/test.png)',
      href: 'https://example.com/test.png',
      title: '',
      text: 'test image',
      tokens: [],
      ...overrides,
    }
  }

  function createMockImageItem(overrides: Partial<MarkdownImageItem> = {}): MarkdownImageItem {
    return {
      type: 'png',
      data: Buffer.from('fake-image-data'),
      width: 100,
      height: 200,
      ...overrides,
    }
  }

  function createImageRenderer(themeOptions: Partial<IMarkdownTheme> = {}) {
    const renderer = new MarkdownDocx('', { theme: themeOptions })
    renderer['_imageStore'].set('https://example.com/test.png', createMockImageItem())
    return renderer
  }

  it('returns ImageRun directly when imageHorizontalAlign is not set (defaults to left)', () => {
    const render = createImageRenderer()
    const result = renderImage(render, createMockImageToken(), {})
    expect(result).toBeInstanceOf(ImageRun)
  })

  it('returns ImageRun directly when imageHorizontalAlign is explicitly "left"', () => {
    const render = createImageRenderer({ imageHorizontalAlign: 'left' })
    const result = renderImage(render, createMockImageToken(), {})
    expect(result).toBeInstanceOf(ImageRun)
  })

  it('wraps in Paragraph with center alignment when imageHorizontalAlign is "center"', () => {
    const render = createImageRenderer({ imageHorizontalAlign: 'center' })
    const result = renderImage(render, createMockImageToken(), {})
    expect(result).toBeInstanceOf(Paragraph)
    expect(result!.toString()).toContain('alignment="center"')
  })

  it('wraps in Paragraph with right alignment when imageHorizontalAlign is "right"', () => {
    const render = createImageRenderer({ imageHorizontalAlign: 'right' })
    const result = renderImage(render, createMockImageToken(), {})
    expect(result).toBeInstanceOf(Paragraph)
    expect(result!.toString()).toContain('alignment="right"')
  })

  it('returns ImageRun directly when isAligned is true regardless of theme alignment', () => {
    const render = createImageRenderer({ imageHorizontalAlign: 'center' })
    const result = renderImage(render, createMockImageToken(), { isAligned: true })
    expect(result).toBeInstanceOf(ImageRun)
    expect(result!.toString()).not.toContain('<Paragraph')
  })

  it('returns false when ignoreImage is true', () => {
    const renderer = new MarkdownDocx('', { ignoreImage: true })
    const result = renderImage(renderer, createMockImageToken(), {})
    expect(result).toBe(false)
  })

  it('falls back to text when image is not in store', () => {
    const renderer = new MarkdownDocx('', { theme: { imageHorizontalAlign: 'center' } })
    const result = renderImage(renderer, createMockImageToken(), {})
    expect(Array.isArray(result)).toBe(true)
  })

  it('preserves other text attributes when wrapping in aligned Paragraph', () => {
    const render = createImageRenderer({ imageHorizontalAlign: 'center' })
    const result = renderImage(render, createMockImageToken(), { style: 'MyStyle' })
    expect(result).toBeInstanceOf(Paragraph)
    const str = result!.toString()
    expect(str).toContain('alignment="center"')
    expect(str).toContain('style="MyStyle"')
  })

  it('center-aligned Paragraph contains the ImageRun as child', () => {
    const render = createImageRenderer({ imageHorizontalAlign: 'center' })
    const result = renderImage(render, createMockImageToken({ text: 'alt text' }), {})
    const str = result!.toString()
    expect(str).toContain('<ImageRun')
    expect(str).toContain('altText-title="alt text"')
  })
})
