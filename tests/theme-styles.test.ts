import { describe, it, expect, vi } from 'vitest'
import { ImageRun, Paragraph } from 'docx'
import { Tokens } from 'marked'
import { createDefaultStyle } from '../src/styles/styles'
import { createMarkdownStyle } from '../src/styles/markdown'
import { IMarkdownTheme } from '../src/types'
import { defaultTheme } from '../src/styles/themes'
import { MarkdownDocx } from '../src/MarkdownDocx'
import { renderImage, parseImageTitleSize, scaleImageToFit } from '../src/renders/render-image'
import { renderParagraph } from '../src/renders/render-paragraph'
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
// Helpers for image rendering tests
// ---------------------------------------------------------------------------

function createMockImageToken(overrides: Partial<Tokens.Image> = {}): Tokens.Image {
  return {
    type: 'image',
    raw: '![test](https://example.com/test.png)',
    href: 'https://example.com/test.png',
    title: '',
    text: 'test image',
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

// ---------------------------------------------------------------------------
// renderParagraph – imageHorizontalAlign integration
// ---------------------------------------------------------------------------

describe('renderParagraph imageHorizontalAlign', () => {

  it('wraps single image in center-aligned Paragraph when imageHorizontalAlign is "center"', () => {
    const render = createImageRenderer({ imageHorizontalAlign: 'center' })
    const result = renderParagraph(render, [createMockImageToken()] as any, {})
    expect(result).toBeInstanceOf(Paragraph)
    expect(result!.toString()).toContain('alignment="center"')
    expect(result!.toString()).toContain('<ImageRun')
  })

  it('wraps single image in right-aligned Paragraph when imageHorizontalAlign is "right"', () => {
    const render = createImageRenderer({ imageHorizontalAlign: 'right' })
    const result = renderParagraph(render, [createMockImageToken()] as any, {})
    expect(result).toBeInstanceOf(Paragraph)
    expect(result!.toString()).toContain('alignment="right"')
  })

  it('does not set alignment when imageHorizontalAlign is not configured', () => {
    const render = createImageRenderer()
    const result = renderParagraph(render, [createMockImageToken()] as any, {})
    expect(result!.toString()).not.toContain('alignment=')
  })

  it('explicit attr.align takes precedence over imageHorizontalAlign', () => {
    const render = createImageRenderer({ imageHorizontalAlign: 'center' })
    const result = renderParagraph(render, [createMockImageToken()] as any, { align: 'right' })
    expect(result!.toString()).toContain('alignment="right"')
  })

  it('ignores imageHorizontalAlign when tokens are not a single image', () => {
    const render = createImageRenderer({ imageHorizontalAlign: 'center' })
    const result = renderParagraph(render, 'plain text', {})
    expect(result!.toString()).not.toContain('alignment=')
  })

  it('ignores imageHorizontalAlign when there are multiple tokens', () => {
    const render = createImageRenderer({ imageHorizontalAlign: 'center' })
    const result = renderParagraph(render, [createMockImageToken(), createMockImageToken()] as any, {})
    expect(result!.toString()).not.toContain('alignment=')
  })
})

// ---------------------------------------------------------------------------
// renderImage – basic behavior (alignment is tested above via renderParagraph)
// ---------------------------------------------------------------------------

describe('renderImage', () => {

  it('returns false when ignoreImage is true', () => {
    const renderer = new MarkdownDocx('', { ignoreImage: true })
    const result = renderImage(renderer, createMockImageToken(), {})
    expect(result).toBe(false)
  })

  it('falls back to text when image is not in store', () => {
    const renderer = new MarkdownDocx('', {})
    const result = renderImage(renderer, createMockImageToken(), {})
    expect(Array.isArray(result)).toBe(true)
  })

  it('produces ImageRun with altText from token text', () => {
    const render = createImageRenderer()
    const result = renderImage(render, createMockImageToken({ text: 'alt text' }), {})
    expect(result).toBeInstanceOf(ImageRun)
    expect(result!.toString()).toContain('altText-title="alt text"')
  })
})

// ---------------------------------------------------------------------------
// scaleImageToFit  (max: 602×931 px — A4 with 1" margins at 96 DPI)
// ---------------------------------------------------------------------------

describe('scaleImageToFit', () => {
  it('returns original dimensions when imageDefaultSize is "actual"', () => {
    const result = scaleImageToFit(1200, 800, "actual")
    expect(result.width).toBe(1200)
    expect(result.height).toBe(800)
  })

  it('returns original dimensions when imageDefaultSize is "auto" but image is within bounds', () => {
    const result = scaleImageToFit(400, 300, "auto")
    expect(result.width).toBe(400)
    expect(result.height).toBe(300)
  })

  it('returns original dimensions when imageDefaultSize is "auto" and image exactly at max width', () => {
    const result = scaleImageToFit(602, 400, "auto")
    expect(result.width).toBe(602)
    expect(result.height).toBe(400)
  })

  it('scales down by width when image is wider than max', () => {
    // 1200×800 → ratioW=602/1200=0.5017, ratioH=931/800=1.1638 → use width
    const result = scaleImageToFit(1200, 800, "auto")
    expect(result.width).toBe(602)
    expect(result.height).toBe(401) // 800 * 602/1200 = 401.33 → 401
  })

  it('scales down proportionally preserving aspect ratio', () => {
    // 1800×600 → ratioW=602/1800=0.3344, ratioH=931/600=1.5517 → use width
    const result = scaleImageToFit(1800, 600, "auto")
    expect(result.width).toBe(602)
    expect(result.height).toBe(201) // 600 * 602/1800 = 200.67 → 201
  })

  it('scales down tall images by height constraint in "auto" mode', () => {
    // "auto" constrains both axes. 800×2000: ratioW=602/800=0.7525, ratioH=931/2000=0.4655 → use height
    const result = scaleImageToFit(800, 2000, "auto")
    expect(result.width).toBe(372)  // 800 * 931/2000 = 372.4 → 372
    expect(result.height).toBe(931)
  })

  it('rounds dimensions to integers', () => {
    // 1000×753 → ratioW=602/1000=0.602, ratioH=931/753=1.2364 → use width
    const result = scaleImageToFit(1000, 753, "auto")
    expect(result.width).toBe(602)
    expect(result.height).toBe(453) // Math.round(753 * 602/1000) = Math.round(453.306) = 453
  })

  it('returns original dimensions when isExplicitSize is true (regardless of mode)', () => {
    const result = scaleImageToFit(2000, 1500, "auto", true)
    expect(result.width).toBe(2000)
    expect(result.height).toBe(1500)
  })

  it('isExplicitSize takes precedence even when mode is "auto"', () => {
    const result = scaleImageToFit(2000, 1500, "auto", true)
    expect(result.width).toBe(2000)
    expect(result.height).toBe(1500)
  })

  // ---- "fit" mode: scale to fill bounds (may upscale) ----

  it('upscales small images in "fit" mode to fill one axis', () => {
    // 600×400 → ratioW=602/600=1.0033, ratioH=931/400=2.3275 → use width
    const result = scaleImageToFit(600, 400, "fit")
    expect(result.width).toBe(602)
    expect(result.height).toBe(401)
  })

  it('scales down by width when width is the more constraining axis', () => {
    // 1200×800 → ratioW=0.5017, ratioH=1.1638 → use width
    const result = scaleImageToFit(1200, 800, "fit")
    expect(result.width).toBe(602)
    expect(result.height).toBe(401)
  })

  it('scales down by height when height is the more constraining axis', () => {
    // 600×1200 → ratioW=602/600=1.0033, ratioH=931/1200=0.7758 → use height
    const result = scaleImageToFit(600, 1200, "fit")
    expect(result.width).toBe(466)  // 600 * 931/1200 = 465.5 → 466
    expect(result.height).toBe(931)
  })

  it('scales down a square image that exceeds both width and height equally', () => {
    // 1000×1000 → ratioW=0.602, ratioH=0.931 → use width
    const result = scaleImageToFit(1000, 1000, "fit")
    expect(result.width).toBe(602)
    expect(result.height).toBe(602)
  })

  it('scales by width when image is wider than max but height is exactly at max', () => {
    // 1248×931 → ratioW=602/1248=0.4824, ratioH=931/931=1.0 → use width
    const result = scaleImageToFit(1248, 931, "fit")
    expect(result.width).toBe(602)
    expect(result.height).toBe(449) // 931 * 602/1248 = 449.26 → 449
  })

  it('scales by height when image is taller than max but width is exactly at max', () => {
    // 602×1728 → ratioW=1.0, ratioH=931/1728=0.5388 → use height
    const result = scaleImageToFit(602, 1728, "fit")
    expect(result.width).toBe(324)  // 602 * 931/1728 = 324.42 → 324
    expect(result.height).toBe(931)
  })

  it('upscales small images in "fit" mode when height is the more constraining axis', () => {
    // 300×500 → ratioW=602/300=2.0067, ratioH=931/500=1.862 → use height
    const result = scaleImageToFit(300, 500, "fit")
    expect(result.width).toBe(559)  // 300 * 931/500 = 558.6 → 559
    expect(result.height).toBe(931)
  })

  it('rounds dimensions to integers in "fit" mode', () => {
    // 1000×753 → ratioW=0.602, ratioH=1.2364 → use width
    const result = scaleImageToFit(1000, 753, "fit")
    expect(result.width).toBe(602)
    expect(result.height).toBe(453) // Math.round(753 * 602/1000) = 453
  })
})

// ---------------------------------------------------------------------------
// renderImage – imageDefaultSize integration
// ---------------------------------------------------------------------------

describe('renderImage imageDefaultSize', () => {
  it('uses actual width when theme does not set imageDefaultSize (defaults to "actual")', () => {
    const render = createImageRenderer()
    const result = renderImage(render, createMockImageToken(), {})
    expect(result).toBeInstanceOf(ImageRun)
    expect(result!.toString()).toContain('width="100"')
    expect(result!.toString()).toContain('height="200"')
  })

  it('uses actual width when imageDefaultSize is "actual"', () => {
    const render = createImageRenderer({ imageDefaultSize: 'actual' })
    const result = renderImage(render, createMockImageToken(), {})
    expect(result).toBeInstanceOf(ImageRun)
    expect(result!.toString()).toContain('width="100"')
    expect(result!.toString()).toContain('height="200"')
  })

  it('leaves small images unchanged in "auto" mode', () => {
    const render = createImageRenderer({ imageDefaultSize: 'auto' })
    const result = renderImage(render, createMockImageToken(), {})
    expect(result).toBeInstanceOf(ImageRun)
    expect(result!.toString()).toContain('width="100"')
    expect(result!.toString()).toContain('height="200"')
  })

  it('scales down large images in "auto" mode', () => {
    const render = createImageRenderer({ imageDefaultSize: 'auto' })
    render['_imageStore'].set('https://example.com/test.png', createMockImageItem({
      width: 1200,
      height: 800,
    }))
    const result = renderImage(render, createMockImageToken(), {})
    expect(result).toBeInstanceOf(ImageRun)
    expect(result!.toString()).toContain('width="602"')
    expect(result!.toString()).toContain('height="401"')
  })

  it('does not scale image when title has explicit size (even in "auto" mode)', () => {
    const render = createImageRenderer({ imageDefaultSize: 'auto' })
    render['_imageStore'].set('https://example.com/sized.png', createMockImageItem({
      width: 1200,
      height: 800,
    }))
    const result = renderImage(render, createMockImageToken({
      href: 'https://example.com/sized.png',
      title: '600x400',
    }), {})
    expect(result).toBeInstanceOf(ImageRun)
    expect(result!.toString()).toContain('width="600"')
    expect(result!.toString()).toContain('height="400"')
  })

  it('upscales small images in "fit" mode', () => {
    // 100×200 → ratioW=6.02, ratioH=4.655 → use height → 466×931
    const render = createImageRenderer({ imageDefaultSize: 'fit' })
    const result = renderImage(render, createMockImageToken(), {})
    expect(result).toBeInstanceOf(ImageRun)
    expect(result!.toString()).toContain('width="466"')
    expect(result!.toString()).toContain('height="931"')
  })

  it('scales down wide image by width in "fit" mode', () => {
    const render = createImageRenderer({ imageDefaultSize: 'fit' })
    render['_imageStore'].set('https://example.com/test.png', createMockImageItem({
      width: 1200,
      height: 800,
    }))
    const result = renderImage(render, createMockImageToken(), {})
    expect(result).toBeInstanceOf(ImageRun)
    expect(result!.toString()).toContain('width="602"')
    expect(result!.toString()).toContain('height="401"')
  })

  it('scales down tall image by height in "fit" mode', () => {
    const render = createImageRenderer({ imageDefaultSize: 'fit' })
    render['_imageStore'].set('https://example.com/test.png', createMockImageItem({
      width: 600,
      height: 1200,
    }))
    const result = renderImage(render, createMockImageToken(), {})
    expect(result).toBeInstanceOf(ImageRun)
    expect(result!.toString()).toContain('width="466"')
    expect(result!.toString()).toContain('height="931"')
  })
})
