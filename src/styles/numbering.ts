import { ILevelsOptions, INumberingOptions, LevelFormat } from 'docx'

import type { MarkdownDocx } from '../MarkdownDocx'

export const numbering: INumberingOptions = {
  config: [
    {
      reference: "numbering-points",
      levels: [
        makeNumbering(0),
        makeNumbering(1),
        makeNumbering(2),
        makeNumbering(3),
        makeNumbering(4),
        makeNumbering(5),
        makeNumbering(6),
        makeNumbering(7),
        makeNumbering(8),
      ],
    },
    {
      reference: "bullet-points",
      levels: [
        makeBullet(0, "\u2022"),
        makeBullet(1, "\u25A0"),
        makeBullet(2, "\u25B6"),
        makeBullet(3, "\u25B2"),
        makeBullet(4, "\u25C6"),
        makeBullet(5, "\u25CF"),
        makeBullet(6, "\u25A1"),
      ],
    },
  ],
}

function makeNumbering(level: number) {
  // let format = ''
  // for (let i = 1; i <= level; i++) {
  //   format = `${format}%${i}.`
  // }
  
  const opt: ILevelsOptions = {
    level: level,
    format: LevelFormat.DECIMAL,
    text: level < 1 ? '%1' : level < 2 ? '%1.%2' : level < 3 ? '%1.%2.%3' : `%${level + 1})`
  }

  return opt
}

function makeBullet(level: number, charset: string) {
  const opt: ILevelsOptions = {
    level: level,
    format: LevelFormat.BULLET,
    text: charset,
  }

  return opt
}

const startReferences = Symbol()

/**
 * docx starts every numbering instance at its reference's level start, so a
 * list that starts at another number gets a copy of the reference with that start.
 */
export function numberingStartReference (render: MarkdownDocx, level: number, start: number): string {
  const reference = `numbering-points-${level}-${start}`
  const references: Map<string, { level: number, start: number }> = render.store.get(startReferences) || new Map()
  references.set(reference, { level, start })
  render.store.set(startReferences, references)
  return reference
}

export function documentNumbering (render: MarkdownDocx): INumberingOptions {
  const references: Map<string, { level: number, start: number }> = render.store.get(startReferences) || new Map()
  const points = numbering.config[0]
  const extra = [...references].map(([reference, { level, start }]) => ({
    reference,
    levels: points.levels.map(l => (l.level === level ? { ...l, start } : l)),
  }))
  return { config: [...numbering.config, ...extra] }
}
