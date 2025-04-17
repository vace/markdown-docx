# markdown-docx

将 Markdown 文件转换为 DOCX 格式，支持浏览器和 Node.js 环境。

[![npm 版本](https://img.shields.io/npm/v/markdown-docx.svg)](https://www.npmjs.com/package/markdown-docx)
[![许可协议](https://img.shields.io/npm/l/markdown-docx.svg)](https://github.com/vace/markdown-docx/blob/main/LICENSE)

## 在线演示

[Markdown 转 DOCX 转换器](https://md-docx.vace.me)

## 功能特性

![截图](./tests/screenshots.png)

- 📝 高保真 Markdown 转 DOCX 格式
- 🖼️ 支持图片（自动下载）
- 📋 支持表格、列表、代码块等 Markdown 元素
- 🔗 支持超链接与脚注
- 💅 可自定义样式
- 🌐 同时支持浏览器与 Node.js 环境
- 🖥️ 提供命令行工具

## 安装

```bash
# 使用 npm
npm install markdown-docx

# 使用 yarn
yarn add markdown-docx

# 使用 pnpm
pnpm add markdown-docx
```

## 基础用法

### Node.js

```javascript
import fs from 'node:fs/promises';
import markdownDocx, { Packer } from 'markdown-docx';

async function convertMarkdownToDocx() {
  // 读取 Markdown 内容
  const markdown = await fs.readFile('input.md', 'utf-8');
  
  // 转换为 DOCX
  const doc = await markdownDocx(markdown);
  
  // 保存文件
  const buffer = await Packer.toBuffer(doc);
  await fs.writeFile('output.docx', buffer);
  
  console.log('转换完成！');
}

convertMarkdownToDocx();
```

### 浏览器环境

```javascript
import markdownDocx, { Packer } from 'markdown-docx';

async function convertMarkdownToDocx(markdownText) {
  // 转换为 DOCX
  const doc = await markdownDocx(markdownText);
  
  // 生成下载文件
  const blob = await Packer.toBlob(doc);
  
  // 创建下载链接
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'document.docx';
  a.click();
  
  // 清理资源
  URL.revokeObjectURL(url);
}

// 示例：配合文本域使用
document.getElementById('convert-btn').addEventListener('click', () => {
  const markdown = document.getElementById('markdown-input').value;
  convertMarkdownToDocx(markdown);
});
```

## 高级用法

### 使用 MarkdownDocx 类

通过 `MarkdownDocx` 类实现更精细的控制：

```javascript
import { MarkdownDocx, Packer } from 'markdown-docx';
import fs from 'node:fs/promises';

async function convertWithOptions() {
  const markdown = await fs.readFile('input.md', 'utf-8');
  
  // 创建带配置的转换器
  const converter = new MarkdownDocx(markdown)
  
  // 生成文档
  const doc = await converter.toDocument({
    title: '我的文档',
    creator: 'markdown-docx',
    description: '由 Markdown 生成'
  });
  
  // 保存文件
  const buffer = await Packer.toBuffer(doc);
  await fs.writeFile('output.docx', buffer);
}
```

## 配置选项

`MarkdownDocx` 构造函数和 `markdownDocx` 函数接收如下配置参数：

| 选项 | 类型 | 默认值 | 说明 |
|--------|------|---------|-------------|
| `imageAdapter` | 函数 | 内置适配器 | 自定义图片处理器 |
| `ignoreImage` | 布尔值 | `false` | 是否忽略图片 |
| `ignoreFootnote` | 布尔值 | `false` | 是否忽略脚注 |
| `ignoreHtml` | 布尔值 | `false` | 是否忽略内联 HTML |
| `gfm` | 布尔值 | `true` | 启用 GitHub 风格 Markdown |

同时支持 [marked](https://marked.js.org/using_advanced) 库的额外配置选项。

## 命令行工具

提供 CLI 工具进行文件转换：

```bash
# 全局安装
npm install -g markdown-docx

# 基础用法
markdown-docx --input input.md --output output.docx

# 简写形式
markdown-docx -i input.md -o output.docx
```

未指定输出文件时，默认使用输入文件名并添加 `.docx` 后缀。

## 支持的 Markdown 特性

- 标题（H1-H6）
- 段落与换行
- 强调（粗体、斜体、删除线）
- 列表（有序/无序）
- 链接与图片
- 引用块
- 语法代码块
- 表格
- 水平分隔线
- 脚注
- 任务列表（复选框）

## 图片适配器

内置自动下载图片的适配器，可通过实现 `ImageAdapter` 接口创建自定义适配器。
适配器需包含 `getImage` 方法，接收图片 URL 并返回包含图片数据的 Promise。

```ts
const imageAdapter: (token: Tokens.Image) => Promise<null | MarkdownImageItem>
```

## 样式定制

通过样式组件自定义 DOCX 外观：

```javascript
import { styles, colors, classes, numbering } from 'markdown-docx';

// 示例：修改超链接颜色
styles.default.hyperlink.run.color = '0077cc';
styles.markdown.code.run.color = '000000';
```

可参考 `src/styles` 目录下的文件编写自定义样式：

- [styles.ts](./src/styles//styles.ts) - 文档默认样式
- [colors.ts](./src/styles/colors.ts) - 颜色定义
- [markdown.ts](./src/styles/markdown.ts) - Markdown 专用样式

## 浏览器与 Node.js 差异

根据运行环境自动选择图片适配器：

- 浏览器环境使用 Fetch API
- Node.js 环境使用内置 HTTP/HTTPS 模块

## 示例

更多示例请查看仓库中的 [tests 目录](https://github.com/vace/markdown-docx/tree/main/tests)。

## 许可协议

本项目基于 MIT 许可证，详见 LICENSE 文件。

## 相关项目

- [docx](https://github.com/dolanmiu/docx) - DOCX 生成底层库
- [marked](https://github.com/markedjs/marked) - 本项目使用的 Markdown 解析器
