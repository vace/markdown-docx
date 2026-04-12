export const HELP_FOOTER = `
For detailed option help:
  markdown-docx help theme    All theme color/size properties and their defaults
  markdown-docx help config   All config file options and their defaults
`

export const THEME_HELP = `
markdown-docx theme customization
──────────────────────────────────

Pass theme overrides as:
  -t '{"heading1":"2F5597","bodySize":14}'    inline JSON via flag
  -c config.json                               file with "theme" key inside

All color values are HEX strings WITHOUT the # prefix.
Size values are in points.

COLORS (hex, no #)             DEFAULT    DESCRIPTION
  heading1                     2F5597     H1 heading color
  heading2                     5B9BD5     H2 heading color
  heading3                     44546A     H3 heading color
  heading4                     44546A     H4 heading color
  heading5                     44546A     H5 heading color
  heading6                     44546A     H6 heading color
  link                         0563C1     Hyperlink color
  code                         032F62     Fenced code block text color
  codespan                     70AD47     Inline code text color
  codeBackground               f6f6f7     Code block background
  blockquote                   666666     Blockquote text color
  blockquoteBackground         F9F9F9     Blockquote background
  del                          FF0000     Strikethrough text color
  hr                           D9D9D9     Horizontal rule color
  html                         4472C4     Inline HTML color
  tag                          ED7D31     Tag color
  border                       A5A5A5     Table border color
  tableHeaderBackground        F2F2F2     Table header background

SIZES & SPACING                DEFAULT    DESCRIPTION
  heading1Size                 18         H1 font size (pt)
  heading2Size                 16         H2 font size (pt)
  heading3Size                 14         H3 font size (pt)
  heading4Size                 13         H4 font size (pt)
  heading5Size                 12         H5 font size (pt)
  heading6Size                 12         H6 font size (pt)
  bodySize                     12         Body text font size (pt)
  codeSize                     11         Code block font size (pt)
  spaceSize                    6          Paragraph spacing (pt)
  lineSpacing                  1.0        Line spacing multiplier (1.0 = single, 1.5 = 150%)

BOOLEANS                       DEFAULT    DESCRIPTION
  linkUnderline                true       Whether hyperlinks are underlined

See examples/sample-config.json for a ready-to-use config file.
`.trim()

export const CONFIG_HELP = `
markdown-docx config file reference
─────────────────────────────────────

Use -c <file.json> to load a JSON config file.
All fields are optional — omit any to use its default.

FIELD                          TYPE       DEFAULT    DESCRIPTION
  ignoreImage                  boolean    false      Skip all image processing
  ignoreFootnote               boolean    false      Skip footnote parsing
  ignoreHtml                   boolean    false      Skip inline HTML parsing
  gfm                          boolean    true       GitHub Flavored Markdown

  math.engine                  string     "katex"    "katex" or "builtin"
  math.libreOfficeCompat       boolean    false      Improve LibreOffice OMML rendering
  math.katexOptions            object     {}         Options passed directly to KaTeX

  theme                        object     {}         Theme overrides
                                                     Run: markdown-docx help theme

Example config file:
  {
    "ignoreImage": false,
    "math": { "engine": "katex", "libreOfficeCompat": false },
    "theme": { "heading1": "2F5597", "bodySize": 14, "lineSpacing": 1.5 }
  }

See examples/sample-config.json for the full list of configurable properties.
`.trim()
