# Markdown 转 DOCX 转换器

---

欢迎使用 Markdown 转 DOCX 转换器！本工具支持：

1. 编写或粘贴 Markdown 内容
2. 实时预览渲染效果
3. 一键转换为 DOCX 格式

## 使用指南

- 在左侧编辑区输入内容
- 右侧区域实时预览效果
- 点击"下载"按钮生成 DOCX 文档

## 示例

支持 **加粗文本**、*斜体文本*、`行内代码`、~~删除线~~ 和 [链接](https://www.google.com)

> 区块引用同样支持

## 链接示例

[普通内联链接](https://www.google.com)

[带标题的内联链接](https://www.google.com "谷歌首页")

## 任务列表

- [x] 完成修改
- [ ] 推送提交到 GitHub
- [x] 支持 @提及、#引用、[链接]()、**格式**和`标签`
- [ ] 未完成事项

## 图片嵌入

这是我们的 Logo（悬停查看标题文字）：

![替代文本](https://img.alicdn.com/imgextra/i3/O1CN012ZjB2y1xHUf6OzZ8C_!!6000000006418-2-tps-104-126.png "Logo 标题文字")

## 忽略 Markdown 格式

使用反斜杠 \ 可以转义 Markdown 特殊字符：

让我们将 \*新项目\* 重命名为 \*旧项目\*。

## 表格

使用冒号定义列对齐方式：

| 表格          |      对齐      |    金额 |
| ------------- |:-------------:| -----:|
| `第三列`      |   右对齐      | \$1600 |
| 第二列        | **居中对齐**   |   \$12 |
| 斑马条纹      | ~~美观整齐~~   |    \$1 |

## 代码区块

```javascript
import markdownDocx, { Packer } from 'markdown-docx';
// 读取Markdown内容
const markdown = await fs.readFile('input.md', 'utf-8');
const doc = await markdownDocx(markdown);
const buffer = await Packer.toBuffer(doc);
```

## 内联 HTML

<dl>
  <dt>定义列表</dt>
  <dd>这是人们有时会使用的格式</dd>

  <dt>HTML中的Markdown</dt>
  <dd>*不*能完美支持 **所有** 语法，请使用 HTML <em>标签</em></dd>
</dl>

---

祝您使用愉快！
