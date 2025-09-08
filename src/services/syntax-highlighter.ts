import { 
  BundledLanguage, 
  BundledTheme, 
  createHighlighter, 
  Highlighter
} from 'shiki'

export interface CodeHighlightOptions {
  enabled?: boolean           // 是否启用语法高亮
  theme?: BundledTheme        // 主题名称
  languages?: BundledLanguage[] // 支持的语言列表
  showLineNumbers?: boolean   // 是否显示行号
  showLanguage?: boolean      // 是否显示语言标识
  autoDetect?: boolean        // 自动检测语言
  defaultLanguage?: string    // 默认语言
}

// Define our own token interface that's compatible with shiki output
export interface HighlightToken {
  content: string
  color?: string
  fontStyle?: number
}

export interface HighlightedLine {
  tokens: HighlightToken[]
  lineNumber?: number
}

export class SyntaxHighlighter {
  private highlighter: Highlighter | null = null
  private options: CodeHighlightOptions
  private initPromise: Promise<void> | null = null

  constructor(options: CodeHighlightOptions = {}) {
    this.options = {
      enabled: true,
      theme: 'github-light',
      languages: [
        'javascript',
        'typescript', 
        'python',
        'java',
        'go',
        'rust',
        'cpp',
        'c',
        'csharp',
        'php',
        'ruby',
        'swift',
        'kotlin',
        'html',
        'css',
        'scss',
        'json',
        'xml',
        'yaml',
        'markdown',
        'sql',
        'bash',
        'shell',
        'powershell',
        'dockerfile',
        'graphql',
        'vue',
        'jsx',
        'tsx',
      ] as BundledLanguage[],
      showLineNumbers: false,
      showLanguage: false,
      autoDetect: true,
      defaultLanguage: 'plaintext',
      ...options
    }
  }

  async initialize(): Promise<void> {
    if (this.highlighter) return
    if (this.initPromise) return this.initPromise

    this.initPromise = this._doInitialize()
    await this.initPromise
  }

  private async _doInitialize(): Promise<void> {
    try {
      // Only load the languages that are actually needed
      const langs = this.options.languages || []
      
      this.highlighter = await createHighlighter({
        themes: [this.options.theme || 'github-light'],
        langs: langs.length > 0 ? langs : ['plaintext']
      })
    } catch (error) {
      console.error('[SyntaxHighlighter] Failed to initialize:', error)
      // Fallback to plaintext if initialization fails
      this.highlighter = await createHighlighter({
        themes: ['github-light'],
        langs: ['plaintext']
      })
    }
  }

  async highlightCode(
    code: string, 
    lang?: string,
    theme?: BundledTheme
  ): Promise<HighlightedLine[]> {
    if (!this.options.enabled) {
      // If highlighting is disabled, return plain text
      return code.split('\n').map((line, index) => ({
        tokens: [{
          content: line,
          color: undefined,
          fontStyle: undefined
        }],
        lineNumber: this.options.showLineNumbers ? index + 1 : undefined
      }))
    }

    // Ensure highlighter is initialized
    await this.initialize()
    
    if (!this.highlighter) {
      throw new Error('[SyntaxHighlighter] Highlighter not initialized')
    }

    // Determine the language to use
    let targetLang = lang || this.options.defaultLanguage || 'plaintext'
    
    // Map common aliases to supported languages
    const langAliases: Record<string, string> = {
      'js': 'javascript',
      'ts': 'typescript',
      'py': 'python',
      'rb': 'ruby',
      'yml': 'yaml',
      'sh': 'bash',
      'zsh': 'bash',
      'ps1': 'powershell',
      'cs': 'csharp',
      'md': 'markdown',
      'dockerfile': 'docker',
      'makefile': 'make',
    }

    targetLang = langAliases[targetLang.toLowerCase()] || targetLang.toLowerCase()

    // Check if the language is loaded
    const loadedLangs = this.highlighter.getLoadedLanguages()
    if (!loadedLangs.includes(targetLang as BundledLanguage)) {
      // Try to load the language dynamically
      try {
        await this.highlighter.loadLanguage(targetLang as BundledLanguage)
      } catch (error) {
        console.warn(`[SyntaxHighlighter] Language "${targetLang}" not supported, falling back to plaintext`)
        targetLang = 'plaintext'
      }
    }

    try {
      const targetTheme = theme || this.options.theme || 'github-light'
      
      // Check if theme is loaded, if not load it
      const loadedThemes = this.highlighter.getLoadedThemes()
      if (!loadedThemes.includes(targetTheme)) {
        await this.highlighter.loadTheme(targetTheme)
      }

      // Use codeToTokens with theme
      const result = this.highlighter.codeToTokens(code, {
        lang: targetLang as BundledLanguage,
        theme: targetTheme
      })

      return result.tokens.map((line, index) => ({
        tokens: line.map(token => ({
          content: token.content,
          color: token.color,
          fontStyle: token.fontStyle
        })),
        lineNumber: this.options.showLineNumbers ? index + 1 : undefined
      }))
    } catch (error) {
      console.error('[SyntaxHighlighter] Highlighting failed:', error)
      // Fallback to plain text
      return code.split('\n').map((line, index) => ({
        tokens: [{
          content: line,
          color: undefined,
          fontStyle: undefined
        }],
        lineNumber: this.options.showLineNumbers ? index + 1 : undefined
      }))
    }
  }

  /**
   * Get color for different token types
   * This provides a fallback color scheme if Shiki fails
   */
  getTokenColor(tokenType: string): string | undefined {
    const colorMap: Record<string, string> = {
      'keyword': '0000FF',      // Blue
      'string': '008000',        // Green  
      'comment': '808080',       // Gray
      'function': '795E26',      // Brown
      'number': '098658',        // Dark Green
      'operator': '000000',      // Black
      'variable': '001080',      // Dark Blue
      'class': '267F99',         // Teal
      'constant': '0070C1',      // Light Blue
      'type': '267F99',          // Teal
    }
    
    return colorMap[tokenType]
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.highlighter = null
    this.initPromise = null
  }
}

// Export a default instance for convenience
export const defaultHighlighter = new SyntaxHighlighter()
