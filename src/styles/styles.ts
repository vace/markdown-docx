/**
 * Paragraph Style
 */

import { IStylesOptions, UnderlineType } from "docx";
import { classes } from "./classes";
import { colors } from "./colors";


export const styles: IStylesOptions = {
  default: {
    document: {
      run: {
        size: 24, // 12pt
      },
      paragraph: {
        spacing: { lineRule: "auto" }
      }
    },
    hyperlink: {
      run: {
        color: colors.link,
        underline: {
          type: UnderlineType.SINGLE,
          color: colors.link,
        }
      }
    }
  },

  paragraphStyles: [
    {
      id: classes.Space,
      name: "MdSpace",
      basedOn: "Normal",
      next: "Normal",
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
    {
      id: classes.Code,
      name: "MdCode",
      basedOn: "Normal",
      next: "Normal",
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
    {
      id: classes.Hr,
      name: "MdHr",
      basedOn: "Normal",
      next: "Normal",
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
    {
      id: classes.Blockquote,
      name: "MdBlockquote",
      basedOn: "Normal",
      next: "Normal",
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
    {
      id: classes.Html,
      name: "MdHtml",
      basedOn: "Normal",
      next: "Normal",
      run: {
        font: "Courier New",
        color: colors.accent1,
      },
    },
    {
      id: classes.Def,
      name: "MdDef",
      basedOn: "Normal",
      next: "Normal",
      paragraph: {
        indent: {
          left: 720, // 0.5 inch
          hanging: 360, // 0.25 inch
        },
      },
    },
    {
      id: classes.Paragraph,
      name: "MdParagraph",
      basedOn: "Normal",
      next: "Normal",
      paragraph: {
        spacing: {
          before: 120,
          after: 120,
        },
      },
    },
    {
      id: classes.Text,
      name: "MdText",
      basedOn: "Normal",
      next: "Normal",
    },
    {
      id: classes.Footnote,
      name: "MdFootnote",
      basedOn: "Normal",
      next: "Normal",
      run: {
        size: 20, // 10pt
        superScript: true,
      },
    },
    {
      id: classes.ListItem,
      name: "MdListItem",
      basedOn: "Normal",
      next: "Normal",
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
    {
      id: classes.Table,
      name: "MdTable",
      basedOn: "Normal",
      next: "Normal",
      paragraph: {
        spacing: {
          before: 60,
          after: 60,
        },
      },
    },
    {
      id: classes.TableHeader,
      name: "MdTableHeader",
      basedOn: "Normal",
      next: "Normal",
    },
    {
      id: classes.TableCell,
      name: "MdTableCell",
      basedOn: "Normal",
      next: "Normal",
    },
    {
      id: classes.Heading1,
      name: "MdHeading1",
      basedOn: "Normal",
      next: "Normal",
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
    {
      id: classes.Heading2,
      name: "MdHeading2",
      basedOn: "Normal",
      next: "Normal",
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
    {
      id: classes.Heading3,
      name: "MdHeading3",
      basedOn: "Normal",
      next: "Normal",
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
    {
      id: classes.Heading4,
      name: "MdHeading4",
      basedOn: "Normal",
      next: "Normal",
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
    {
      id: classes.Heading5,
      name: "MdHeading5",
      basedOn: "Normal",
      next: "Normal",
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
    {
      id: classes.Heading6,
      name: "MdHeading6",
      basedOn: "Normal",
      next: "Normal",
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
  ],
  characterStyles: [
    {
      id: classes.Tag,
      name: "Tag",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: {
        font: "Courier New",
        color: colors.accent1,
      },
    },
    {
      id: classes.Link,
      name: "Link",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: {
        color: colors.link,
        underline: {
          type: UnderlineType.SINGLE,
        },
      },
    },
    {
      id: classes.Strong,
      name: "Strong",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: {
        bold: true,
      },
    },
    {
      id: classes.Em,
      name: "Emphasis",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: {
        italics: true,
      },
    },
    {
      id: classes.Codespan,
      name: "Code Span",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: {
        font: "Courier New",
        color: colors.secondary,
      },
    },
    {
      id: classes.Del,
      name: "Deleted Text",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: {
        strike: true,
        color: colors.del,
      },
    },
    {
      id: classes.Br,
      name: "Line Break",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: {
        // For line break, we can't use the 'break' property directly
        // We'll just define the style so it can be recognized
        // The actual line break will be handled in the rendering code
      },
    },
  ]
}
