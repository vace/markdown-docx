export * from 'docx'

abstract class BaseNode {
  abstract type: string

  public ignoreProps: string[] = []

  get ignorePropsSet () {
    return new Set([...this.ignoreProps, 'children', 'text'])
  }

  constructor (
    public options: Record<string, any> = {},
  ) {}

  toString () {
    const { type, options: { children, text, ...props } = {} } = this
    let str = '<' + type + getProps(props, this.ignorePropsSet) + '>'
    
    if (children?.length && Array.isArray(children)) {
      str += children.map((child: BaseNode) => {
        if (child instanceof BaseNode) {
          return child.toString()
        }
        return JSON.stringify(child)
      }).join('\n')
    } else if (text) {
      str += text
    }

    str += '</' + type + '>'
    return str
  }
}

function getProps (props: Record<string, any>, ignoreProps: Set<string> = new Set(), prefix: string = '') {
  const joined: string[] = []
  for (const key in props) {
    if (props[key] == null || ignoreProps.has(key)) continue
    if (Array.isArray(props[key])) {
      joined.push(`${prefix}${key}="${props[key].join(',')}"`)
    } else if (typeof props[key] === 'object') {
      joined.push(getProps(props[key], ignoreProps, `${prefix}${key}-`).trim())
    } else {
      joined.push(`${prefix}${key}="${props[key]}"`)
    }
  }
  return joined.length ? (' ' + joined.join(' ')) : ''
}

export class Paragraph extends BaseNode {
  type = 'Paragraph'
}

export class Table extends BaseNode {
  type = 'Table'
}

export class TableCell extends BaseNode {
  type = 'TableCell'
}

export class TableRow extends BaseNode {
  type = 'TableRow'
}

export class CheckBox extends BaseNode {
  type = 'Checkbox'
}

export class TextRun extends BaseNode {
  type = 'TextRun'
}

export class ImageRun extends BaseNode {
  public ignoreProps = ['data']
  type = 'ImageRun'
}

export class FootnoteReferenceRun extends BaseNode {
  type = 'FootnoteReferenceRun'
}
export class ExternalHyperlink extends BaseNode {
  type = 'ExternalHyperlink'
}
export class Hyperlink extends BaseNode {
  type = 'Hyperlink'
}
export class BookmarkStart extends BaseNode {
  type = 'BookmarkStart'
}
export class BookmarkEnd extends BaseNode {
  type = 'BookmarkEnd'
}
export class Tab extends BaseNode {
  type = 'Tab'
}
export class Break extends BaseNode {
  type = 'Break'
}
export class ThematicBreak extends BaseNode {
  type = 'ThematicBreak'
}
export class FileChild extends BaseNode {
  type = 'FileChild'
}
export class Run extends BaseNode {
  type = 'Run'
}

export class Math extends BaseNode {
  type = 'Math'
}

export class MathRun extends BaseNode {
  type = 'MathRun'
}

export class Equation extends BaseNode {
  type = 'Equation'
}

export class Document extends BaseNode {
  type = 'Document'
}

export class Header extends BaseNode {
  type = 'Header'
}

export class Footer extends BaseNode {
  type = 'Footer'
}

export class Footnote extends BaseNode {
  type = 'Footnote'
}

export class Endnote extends BaseNode {
  type = 'Endnote'
}

export class Comment extends BaseNode {
  type = 'Comment'
}

export class CommentRangeStart extends BaseNode {
  type = 'CommentRangeStart'
}

export class CommentRangeEnd extends BaseNode {
  type = 'CommentRangeEnd'
}

export class HyperlinkRef extends BaseNode {
  type = 'HyperlinkRef'
}

export class MathFraction extends BaseNode {
  type = 'MathFraction'
}
export class MathRadical extends BaseNode {
  type = 'MathRadical'
}
export class MathSuperScript extends BaseNode {
  type = 'MathSuperScript'
}
export class MathSubScript extends BaseNode {
  type = 'MathSubScript'
}
export class MathSubSuperScript extends BaseNode {
  type = 'MathSubSuperScript'
}
export class MathSum extends BaseNode {
  type = 'MathSum'
}
export class MathIntegral extends BaseNode {
  type = 'MathIntegral'
}
export class XmlComponent extends BaseNode {
  type = 'XmlComponent'
}
export class MathComponent extends BaseNode {
  type = 'MathComponent'
}