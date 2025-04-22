import { UnderlineType } from 'docx'

import { IMarkdownStyle, IMarkdownToken } from '../types'
import { classes } from './classes'
import { colors } from './colors'

export const markdown: Record<IMarkdownToken, IMarkdownStyle> = {
  space: {
    className: classes.Space,
    run: {
      size: 12, // 6pt - small space
    },
    paragraph: {
      spacing: {
        before: 0,
        after: 0,
      },
    },
  },
  code: {
    className: classes.Code,
    run: {
      font: "Courier New",
      size: 22, // 11pt
      color: colors.secondary,
    },
    paragraph: {
      border: {
        top: {
          style: "single",
          size: 1,
          color: colors.accent2,
          space: 8,
        },
        bottom: {
          style: "single",
          size: 1,
          color: colors.accent2,
          space: 8,
        },
        left: {
          style: "single",
          size: 1,
          color: colors.accent2,
          space: 8,
        },
        right: {
          style: "single",
          size: 1,
          color: colors.accent2,
          space: 8,
        },
      },
      spacing: {
        before: 200,
        after: 200,
      },
    },
  },
  hr: {
    className: classes.Hr,
    paragraph: {
      border: {
        bottom: {
          style: "single",
          size: 1,
          color: colors.accent2,
          space: 1,
        },
      },
      spacing: {
        before: 240,
        after: 240,
      },
    },
  },
  blockquote: {
    className: classes.Blockquote,
    run: {
      color: colors.blockquote,
      italics: true,
    },
    paragraph: {
      border: {
        left: {
          style: "single",
          size: 20,
          color: colors.accent2,
          space: 12,
        },
      },
      indent: {
        left: 360, // 0.25 inch
      },
      spacing: {
        before: 200,
        after: 200,
      },
    },
  },
  html: {
    className: classes.Html,
    run: {
      font: "Courier New",
      color: colors.accent1,
    },
  },
  def: {
    className: classes.Def,
    paragraph: {
      indent: {
        left: 720, // 0.5 inch
        hanging: 360, // 0.25 inch
      },
    },
  },
  paragraph: {
    className: classes.Paragraph,
    paragraph: {
      spacing: {
        before: 120,
        after: 120,
      },
    },
  },
  text: {
    className: classes.Text,
  },
  footnote: {
    className: classes.Footnote,
    run: {
      superScript: true,
    },
  },
  listItem: {
    className: classes.ListItem,
    paragraph: {
      indent: {
        left: 720, // 0.5 inch
        hanging: 360, // 0.25 inch
      },
      spacing: {
        before: 60,
        after: 60,
      },
    },
  },
  table: {
    className: classes.Table,
    paragraph: {
      spacing: {
        before: 60,
        after: 60,
      },
    },
  },
  tableHeader: {
    className: classes.TableHeader,
    // special
    properties: {
      shading: {
        fill: 'F1F2F1',
      },
    },
    run: {
      bold: true,
    }
  },
  tableCell: {
    className: classes.TableCell,
  },
  heading1: {
    className: classes.Heading1,
    run: {
      size: 36, // 18pt
      bold: true,
      color: colors.heading1,
    },
    paragraph: {
      spacing: {
        before: 480, // 24pt
        after: 240, // 12pt
      },
      keepNext: true,
      outlineLevel: 0,
    },
  },
  heading2: {
    className: classes.Heading2,
    run: {
      size: 32, // 16pt
      bold: true,
      color: colors.heading2,
    },
    paragraph: {
      spacing: {
        before: 400, // 20pt
        after: 200, // 10pt
      },
      keepNext: true,
      outlineLevel: 1,
    },
  },
  heading3: {
    className: classes.Heading3,
    run: {
      size: 28, // 14pt
      bold: true,
      color: colors.heading3,
    },
    paragraph: {
      spacing: {
        before: 320, // 16pt
        after: 160, // 8pt
      },
      keepNext: true,
      outlineLevel: 2,
    },
  },
  heading4: {
    className: classes.Heading4,
    run: {
      size: 26, // 13pt
      bold: true,
      color: colors.heading3,
    },
    paragraph: {
      spacing: {
        before: 280, // 14pt
        after: 140, // 7pt
      },
      keepNext: true,
      outlineLevel: 3,
    },
  },
  heading5: {
    className: classes.Heading5,
    run: {
      size: 24, // 12pt
      bold: true,
      italics: true,
      color: colors.heading3,
    },
    paragraph: {
      spacing: {
        before: 240, // 12pt
        after: 120, // 6pt
      },
      keepNext: true,
      outlineLevel: 4,
    },
  },
  heading6: {
    className: classes.Heading6,
    run: {
      size: 24, // 12pt
      bold: false,
      italics: true,
      color: colors.heading3,
    },
    paragraph: {
      spacing: {
        before: 240, // 12pt
        after: 120, // 6pt
      },
      keepNext: true,
      outlineLevel: 5,
    },
  },

  // inline
  tag: {
    inline: true,
    className: classes.Tag,
    run: {
      font: "Courier New",
      color: colors.accent1,
    },
  },
  link: {
    inline: true,
    className: classes.Link,
    run: {
      color: colors.link,
      underline: {
        type: UnderlineType.SINGLE,
      },
    },
  },
  strong: {
    inline: true,
    className: classes.Strong,
    run: {
      bold: true,
    },
  },
  em: {
    inline: true,
    className: classes.Em,
    run: {
      italics: true,
    },
  },
  codespan: {
    inline: true,
    className: classes.Codespan,
    run: {
      font: "Courier New",
      color: colors.secondary,
    },
  },
  del: {
    inline: true,
    className: classes.Del,
    run: {
      strike: true,
      color: colors.del,
    },
  },
  br: {
    inline: true,
    className: classes.Br,
    // The actual line break will be handled in the rendering code
  }
}