import { FileChild, Paragraph, TextRun } from 'docx'
import { Tokens } from 'marked'

import { MarkdownDocx } from '../MarkdownDocx'
import { classes } from '../styles'
import { IBlockAttr } from '../types'

/**
 * Render a code block with syntax highlighting
 */
export async function renderCodeBlock(
  render: MarkdownDocx,
  block: Tokens.Code,
  attr: IBlockAttr
): Promise<FileChild[]> {
  const { text, lang } = block
  const highlighter = render.syntaxHighlighter
  
  // Check if syntax highlighting is enabled
  const codeHighlightEnabled = render.options.codeHighlight?.enabled !== false
  
  if (!codeHighlightEnabled || !lang) {
    // Fallback to plain code rendering
    return renderPlainCode(text, attr)
  }

  try {
    // Get highlighted lines
    const highlightedLines = await highlighter.highlightCode(text, lang)
    
    // Convert highlighted lines to paragraphs
    const paragraphs: Paragraph[] = []
    
    for (const [index, line] of highlightedLines.entries()) {
      const runs: TextRun[] = []
      
      // Add line number if enabled
      if (line.lineNumber && render.options.codeHighlight?.showLineNumbers) {
        runs.push(new TextRun({
          text: String(line.lineNumber).padStart(4, ' ') + ' | ',
          font: 'Courier New',
          size: 20,
          color: '808080', // Gray color for line numbers
        }))
      }
      
      // Add tokens with syntax highlighting
      for (const token of line.tokens) {
        // Handle font styles (fontStyle is a bitmap number)
        const fontStyle = token.fontStyle || 0
        const isBold = (fontStyle & 1) !== 0 // 1 = bold
        const isItalic = (fontStyle & 2) !== 0 // 2 = italic
        const isUnderline = (fontStyle & 4) !== 0 // 4 = underline
        
        runs.push(new TextRun({
          text: token.content || '',
          font: 'Cascadia Code, Consolas, Courier New',
          size: 20, // 10pt
          color: token.color?.replace('#', '') || '000000',
          bold: isBold,
          italics: isItalic,
          underline: isUnderline ? {} : undefined,
        }))
      }
      
      // If the line is empty, add a space to preserve empty lines
      if (runs.length === 0 || (runs.length === 1 && runs[0].text === '')) {
        runs.push(new TextRun({
          text: ' ',
          font: 'Cascadia Code, Consolas, Courier New',
          size: 20,
        }))
      }
      
      paragraphs.push(new Paragraph({
        children: runs,
        style: classes.Code,
        spacing: {
          before: index === 0 ? 120 : 0,
          after: index === highlightedLines.length - 1 ? 120 : 0,
          line: 276, // 1.15 line spacing
        },
        indent: {
          left: 360, // 0.25 inch indent
        },
        border: {
          top: index === 0 ? {
            style: 'single',
            size: 1,
            color: 'E1E4E8',
            space: 8,
          } : undefined,
          bottom: index === highlightedLines.length - 1 ? {
            style: 'single',
            size: 1,
            color: 'E1E4E8',
            space: 8,
          } : undefined,
          left: {
            style: 'single',
            size: 1,
            color: 'E1E4E8',
            space: 8,
          },
          right: {
            style: 'single',
            size: 1,
            color: 'E1E4E8',
            space: 8,
          },
        },
        shading: {
          fill: 'F6F8FA', // Light gray background
        },
      }))
    }
    
    // Add language label if enabled
    if (render.options.codeHighlight?.showLanguage && lang) {
      const langLabel = new Paragraph({
        children: [
          new TextRun({
            text: lang.toUpperCase(),
            font: 'Arial',
            size: 16, // 8pt
            color: '586069',
            bold: true,
          })
        ],
        spacing: {
          before: 60,
          after: 60,
        },
        alignment: 'right',
      })
      paragraphs.unshift(langLabel)
    }
    
    return paragraphs
  } catch (error) {
    console.error('[renderCodeBlock] Syntax highlighting failed:', error)
    // Fallback to plain code rendering
    return renderPlainCode(text, attr)
  }
}

/**
 * Render plain code without syntax highlighting
 */
function renderPlainCode(text: string, attr: IBlockAttr): Paragraph[] {
  const lines = text.split('\n')
  
  return lines.map((line, index) => {
    return new Paragraph({
      children: [
        new TextRun({
          text: line || ' ', // Preserve empty lines
          font: 'Courier New',
          size: 20, // 10pt
          color: '24292E', // Dark gray
        })
      ],
      style: classes.Code,
      spacing: {
        before: index === 0 ? 120 : 0,
        after: index === lines.length - 1 ? 120 : 0,
        line: 276,
      },
      indent: {
        left: 360,
      },
      border: {
        top: index === 0 ? {
          style: 'single',
          size: 1,
          color: 'E1E4E8',
          space: 8,
        } : undefined,
        bottom: index === lines.length - 1 ? {
          style: 'single',
          size: 1,
          color: 'E1E4E8',
          space: 8,
        } : undefined,
        left: {
          style: 'single',
          size: 1,
          color: 'E1E4E8',
          space: 8,
        },
        right: {
          style: 'single',
          size: 1,
          color: 'E1E4E8',
          space: 8,
        },
      },
      shading: {
        fill: 'F6F8FA',
      },
    })
  })
}
