import { describe, it, expect } from 'vitest'
import { resolvePageMargins } from '../src/utils'

const PT = 20          // 1 pt = 20 twips
const CM = 720 / 25.4  // 1 cm in twips ≈ 28.3465

function pt(n: number) { return Math.round(n * PT) }
function cm(n: number) { return Math.round(n * CM) }

describe('resolvePageMargins', () => {
  it('returns null when no margin properties are set', () => {
    expect(resolvePageMargins({})).toBeNull()
    expect(resolvePageMargins({ bodySize: 14 })).toBeNull()
  })

  // ── shorthand: numeric ─────────────────────────────────────────────────

  it('applies a single numeric value to all sides (pt)', () => {
    const result = resolvePageMargins({ margin: 72 })!
    expect(result.top).toBe(pt(72))
    expect(result.right).toBe(pt(72))
    expect(result.bottom).toBe(pt(72))
    expect(result.left).toBe(pt(72))
  })

  // ── shorthand: pt string ───────────────────────────────────────────────

  it('parses a bare number string as pt', () => {
    const result = resolvePageMargins({ margin: '72' })!
    expect(result.top).toBe(pt(72))
  })

  it('parses "72pt" as pt', () => {
    const result = resolvePageMargins({ margin: '72pt' })!
    expect(result.top).toBe(pt(72))
  })

  it('parses "72PT" case-insensitively', () => {
    const result = resolvePageMargins({ margin: '72PT' })!
    expect(result.top).toBe(pt(72))
  })

  // ── shorthand: cm string ───────────────────────────────────────────────

  it('parses "2cm" and converts to twips', () => {
    const result = resolvePageMargins({ margin: '2cm' })!
    expect(result.top).toBe(cm(2))
    expect(result.right).toBe(cm(2))
    expect(result.bottom).toBe(cm(2))
    expect(result.left).toBe(cm(2))
  })

  it('parses "2CM" case-insensitively', () => {
    const result = resolvePageMargins({ margin: '2CM' })!
    expect(result.top).toBe(cm(2))
  })

  // ── shorthand: 2-value ────────────────────────────────────────────────

  it('applies 2-value shorthand: top/bottom | left/right', () => {
    const result = resolvePageMargins({ margin: '2cm 1.5cm' })!
    expect(result.top).toBe(cm(2))
    expect(result.bottom).toBe(cm(2))
    expect(result.right).toBe(cm(1.5))
    expect(result.left).toBe(cm(1.5))
  })

  it('mixes units in 2-value shorthand', () => {
    const result = resolvePageMargins({ margin: '72pt 1cm' })!
    expect(result.top).toBe(pt(72))
    expect(result.bottom).toBe(pt(72))
    expect(result.right).toBe(cm(1))
    expect(result.left).toBe(cm(1))
  })

  // ── shorthand: 3-value ────────────────────────────────────────────────

  it('applies 3-value shorthand: top | left/right | bottom', () => {
    const result = resolvePageMargins({ margin: '2cm 1.5cm 1cm' })!
    expect(result.top).toBe(cm(2))
    expect(result.right).toBe(cm(1.5))
    expect(result.bottom).toBe(cm(1))
    expect(result.left).toBe(cm(1.5))
  })

  // ── shorthand: 4-value ────────────────────────────────────────────────

  it('applies 4-value shorthand: top right bottom left', () => {
    const result = resolvePageMargins({ margin: '2cm 1.5cm 1cm 1.5cm' })!
    expect(result.top).toBe(cm(2))
    expect(result.right).toBe(cm(1.5))
    expect(result.bottom).toBe(cm(1))
    expect(result.left).toBe(cm(1.5))
  })

  it('applies 4 pt values', () => {
    const result = resolvePageMargins({ margin: '72pt 54pt 36pt 54pt' })!
    expect(result.top).toBe(pt(72))
    expect(result.right).toBe(pt(54))
    expect(result.bottom).toBe(pt(36))
    expect(result.left).toBe(pt(54))
  })

  // ── verbose properties ────────────────────────────────────────────────

  it('applies verbose numeric properties (pt)', () => {
    const result = resolvePageMargins({ marginTop: 72, marginRight: 54, marginBottom: 36, marginLeft: 54 })!
    expect(result.top).toBe(pt(72))
    expect(result.right).toBe(pt(54))
    expect(result.bottom).toBe(pt(36))
    expect(result.left).toBe(pt(54))
  })

  it('applies verbose string properties with pt unit', () => {
    const result = resolvePageMargins({ marginTop: '72pt', marginLeft: '54pt' })!
    expect(result.top).toBe(pt(72))
    expect(result.left).toBe(pt(54))
  })

  it('applies verbose string properties with cm unit', () => {
    const result = resolvePageMargins({ marginTop: '2cm', marginBottom: '1cm' })!
    expect(result.top).toBe(cm(2))
    expect(result.bottom).toBe(cm(1))
  })

  // ── verbose overrides shorthand ───────────────────────────────────────

  it('verbose marginTop overrides shorthand top', () => {
    const result = resolvePageMargins({ margin: '2cm', marginTop: '3cm' })!
    expect(result.top).toBe(cm(3))
    expect(result.right).toBe(cm(2))
    expect(result.bottom).toBe(cm(2))
    expect(result.left).toBe(cm(2))
  })

  it('verbose marginLeft overrides shorthand left', () => {
    const result = resolvePageMargins({ margin: '2cm 1cm', marginLeft: 36 })!
    expect(result.top).toBe(cm(2))
    expect(result.right).toBe(cm(1))
    expect(result.bottom).toBe(cm(2))
    expect(result.left).toBe(pt(36))
  })

  // ── edge cases ────────────────────────────────────────────────────────

  it('partial verbose (only marginTop set) returns non-null', () => {
    const result = resolvePageMargins({ marginTop: 36 })!
    expect(result).not.toBeNull()
    expect(result.top).toBe(pt(36))
    expect(result.left).toBe(0)
  })

  it('fractional cm values are rounded to the nearest twip', () => {
    const result = resolvePageMargins({ margin: '2.54cm' })!
    expect(result.top).toBe(Math.round(2.54 * CM))
  })
})
