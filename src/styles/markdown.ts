import { UnderlineType } from 'docx'

import { IMarkdownStyle, IMarkdownToken, IMarkdownTheme } from '../types'
import { classes } from './classes'
import { defaultTheme } from './themes'

export const createMarkdownStyle = (_theme: Partial<IMarkdownTheme>): Record<IMarkdownToken, IMarkdownStyle> => {
  const theme: IMarkdownTheme = { ...defaultTheme, ..._theme }
  
  return {
    space: {
      className: classes.Space,
      run: {
        size: theme.spaceSize, // 6pt - small space
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
        size: theme.codeSize, // 11pt
        color: theme.code,
      },
      paragraph: {
        shading: {
          fill: theme.codeBackground,
        },
        border: {
          top: {
            style: "single",
            size: 1,
            color: theme.border,
            space: 8,
          },
          bottom: {
            style: "single",
            size: 1,
            color: theme.border,
            space: 8,
          },
          left: {
            style: "single",
            size: 1,
            color: theme.border,
            space: 8,
          },
          right: {
            style: "single",
            size: 1,
            color: theme.border,
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
            color: theme.hr,
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
        color: theme.blockquote,
        italics: true,
      },
      paragraph: {
        shading: {
          fill: theme.blockquoteBackground,
        },
        border: {
          left: {
            style: "single",
            size: 20,
            color: theme.blockquote,
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
        color: theme.html,
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
          fill: theme.tableHeaderBackground,
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
        size: theme.heading1Size, // 18pt
        bold: true,
        color: theme.heading1,
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
        size: theme.heading2Size, // 16pt
        bold: true,
        color: theme.heading2,
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
        size: theme.heading3Size, // 14pt
        bold: true,
        color: theme.heading3,
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
        size: theme.heading4Size, // 13pt
        bold: true,
        color: theme.heading4,
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
        size: theme.heading5Size, // 12pt
        bold: true,
        italics: true,
        color: theme.heading5,
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
        size: theme.heading6Size, // 12pt
        bold: false,
        italics: true,
        color: theme.heading6,
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
        color: theme.tag,
      },
    },
    link: {
      inline: true,
      className: classes.Link,
      run: {
        color: theme.link,
        underline: theme.linkUnderline ? {
          type: UnderlineType.SINGLE,
        } : undefined,
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
        color: theme.codespan,
      },
    },
    del: {
      inline: true,
      className: classes.Del,
      run: {
        strike: true,
        color: theme.del,
      },
    },
    br: {
      inline: true,
      className: classes.Br,
      // The actual line break will be handled in the rendering code
    }
  }
}

export const markdown: Record<IMarkdownToken, IMarkdownStyle> = createMarkdownStyle({})
