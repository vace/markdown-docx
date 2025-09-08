import { AlignmentType, ILevelsOptions, INumberingOptions, LevelFormat } from 'docx'

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
        makeBullet(0, "\u2022"),  // • 实心圆点
        makeBullet(1, "\u25E6"),  // ◦ 空心圆点
        makeBullet(2, "\u2022"),  // • 实心圆点（重复）
        makeBullet(3, "\u25E6"),  // ◦ 空心圆点（重复）
        makeBullet(4, "\u2022"),  // • 实心圆点（重复）
        makeBullet(5, "\u25E6"),  // ◦ 空心圆点（重复）
        makeBullet(6, "\u2022"),  // • 实心圆点（重复）
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
    text: level < 1 ? '%1' : level < 2 ? '%1.%2' : level < 3 ? '%1.%2.%3' : `%${level + 1})`,
    alignment: AlignmentType.LEFT,
    style: {
      paragraph: {
        indent: {
          left: 720 + (level * 720), // 每级增加 0.5 inch
          hanging: 360, // 悬挂缩进 0.25 inch
        },
      },
    },
  }

  return opt
}

function makeBullet(level: number, charset: string) {
  const opt: ILevelsOptions = {
    level: level,
    format: LevelFormat.BULLET,
    text: charset,
    alignment: AlignmentType.LEFT,
    style: {
      paragraph: {
        indent: {
          left: 720 + (level * 720), // 每级增加 0.5 inch
          hanging: 360, // 悬挂缩进 0.25 inch
        },
      },
    },
  }

  return opt
}
