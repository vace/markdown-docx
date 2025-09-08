# 代码语法高亮示例

这个文档展示了 markdown-docx 的代码语法高亮功能。

## 使用方法

```javascript
import markdownDocx, { Packer } from 'markdown-docx'

const doc = await markdownDocx(markdown, {
  codeHighlight: {
    enabled: true,              // 启用语法高亮
    theme: 'github-light',      // 使用 GitHub 浅色主题
    showLineNumbers: false,     // 不显示行号
    showLanguage: true,         // 显示语言标识
    languages: [                // 支持的语言列表
      'javascript',
      'typescript', 
      'python',
      'java',
      // ... 更多语言
    ]
  }
})

const buffer = await Packer.toBuffer(doc)
```

## 支持的语言

支持超过 200 种编程语言，包括但不限于：

- JavaScript / TypeScript
- Python
- Java / Kotlin
- C / C++ / C#
- Go / Rust
- Ruby / PHP
- SQL
- HTML / CSS / SCSS
- JSON / YAML / XML
- Markdown
- Shell / Bash / PowerShell
- Docker
- 更多...

## 主题选项

可以使用任何 Shiki 支持的主题，例如：

- `github-light` - GitHub 浅色主题（默认）
- `github-dark` - GitHub 深色主题
- `nord` - Nord 主题
- `dracula` - Dracula 主题
- `monokai` - Monokai 主题
- 更多主题请参考 [Shiki 文档](https://shiki.matsu.io/themes)

## 配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | boolean | true | 是否启用语法高亮 |
| `theme` | string | 'github-light' | 语法高亮主题 |
| `languages` | string[] | 常用语言 | 支持的语言列表 |
| `showLineNumbers` | boolean | false | 是否显示行号 |
| `showLanguage` | boolean | false | 是否显示语言标识 |
| `autoDetect` | boolean | true | 自动检测语言 |
| `defaultLanguage` | string | 'plaintext' | 默认语言 |

## 示例效果

转换后的 DOCX 文档中，代码块将具有：

- ✅ 关键字高亮（如 `function`, `class`, `if`, `for` 等）
- ✅ 字符串高亮（绿色）
- ✅ 注释高亮（灰色）
- ✅ 函数名和变量名区分
- ✅ 语言特定的语法高亮规则
- ✅ 可选的行号显示
- ✅ 可选的语言标识

## 性能优化

- 语法高亮器会按需加载语言包
- 首次初始化后会缓存高亮器实例
- 支持懒加载，只加载实际使用的语言

## 注意事项

1. 语法高亮是异步操作，因此渲染过程变为异步
2. 如果指定的语言不支持，会自动降级为纯文本
3. 浏览器和 Node.js 环境都支持
4. 生成的 DOCX 文件体积会略有增加（因为包含了颜色信息）
