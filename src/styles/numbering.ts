import { AlignmentType, INumberingOptions, LevelFormat } from "docx";

export const numbering: INumberingOptions = {
  config: [
    {
      reference: "numbering-points",
      levels: [
        {
          level: 0,
          format: LevelFormat.DECIMAL,
          text: "%1",
          alignment: AlignmentType.START,
        },
        {
          level: 1,
          format: LevelFormat.DECIMAL,
          text: "%2.",
          alignment: AlignmentType.START,
        },
        {
          level: 2,
          format: LevelFormat.DECIMAL,
          text: "%3)",
          alignment: AlignmentType.START,
        },
        {
          level: 3,
          format: LevelFormat.DECIMAL,
          text: "%4)",
          alignment: AlignmentType.START,
        },
        {
          level: 4,
          format: LevelFormat.DECIMAL,
          text: "%5)",
          alignment: AlignmentType.START,
        },
        {
          level: 5,
          format: LevelFormat.DECIMAL,
          text: "%6)",
          alignment: AlignmentType.START,
        },
        {
          level: 6,
          format: LevelFormat.DECIMAL,
          text: "%7)",
          alignment: AlignmentType.START,
        },
        {
          level: 7,
          format: LevelFormat.DECIMAL,
          text: "%8)",
          alignment: AlignmentType.START,
        },
        {
          level: 8,
          format: LevelFormat.DECIMAL,
          text: "%9)",
          alignment: AlignmentType.START,
        },
        {
          level: 9,
          format: LevelFormat.DECIMAL,
          text: "%10)",
          alignment: AlignmentType.START,
        }
      ],
    },
    {
      reference: "bullet-points",
      levels: [
        {
          level: 0,
          format: LevelFormat.BULLET,
          text: "\u1F60",
          alignment: AlignmentType.LEFT,
        },
        {
          level: 1,
          format: LevelFormat.BULLET,
          text: "\u00A5",
          alignment: AlignmentType.LEFT,
        },
        {
          level: 2,
          format: LevelFormat.BULLET,
          text: "\u273F",
          alignment: AlignmentType.LEFT,
        },
        {
          level: 3,
          format: LevelFormat.BULLET,
          text: "\u267A",
          alignment: AlignmentType.LEFT,
        },
        {
          level: 4,
          format: LevelFormat.BULLET,
          text: "\u2603",
          alignment: AlignmentType.LEFT,
        },
      ],
    },
  ],
}
