import { ILevelsOptions, INumberingOptions, LevelFormat } from 'docx'

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
