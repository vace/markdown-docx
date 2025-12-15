import { beforeAll, describe, expect, it, vi } from 'vitest'

import markdownToDocx, { MarkdownDocx } from './entry-node'

vi.mock('docx')

async function renderTest (markdown: string) {
  const docx = new MarkdownDocx(markdown)
  const rows = await docx.toSection()
  return rows.map(r => r.toString()).join('\n')
}

describe('render', async () => {

  it('render heading', async () => {
    expect(await renderTest(`# h1 Heading 8-)
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading`)).toMatchSnapshot()
  })

  it('render paragraph', async () => {
    expect(await renderTest(`Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~`)).toMatchSnapshot()
  })

  it('render list', async () => {
    expect(await renderTest(`
1. Make my changes
    1. Fix bug
    2. Improve formatting
        - Make the headings bigger
2. Push my commits to GitHub
3. Open a pull request
    * Describe my changes
    * Mention all the members of my team
        * Ask for feedback`)).toMatchSnapshot()
  })

  it('render list special', async () => {
    expect(await renderTest(`1. First ordered list item
2. Another item Unordered sub-list.
3. Actual numbers don't matter, just that it's a number Ordered sub-list
4. And another item.
5. Make my changes
    1. Fix bug
    2. Improve formatting
        - Make the headings bigger
6. Push my commits to GitHub
7. Open a pull request
    * Describe my changes
    * Mention all the members of my team
        * Ask for feedback`)).toMatchSnapshot()
  })

  it('render task list', async () => {
    expect(await renderTest(`- [x] Finish my changes
- [ ] Push my commits to GitHub
- [ ] Open a pull request
- [x] @mentions, #refs, [links](), **formatting**, and <del>tags</del> supported
- [x] list syntax required (any unordered or ordered list supported)
- [ ] this is a complete item
- [ ] this is an incomplete item`)).toMatchSnapshot()
  })

  it('render links', async () => {
    expect(await renderTest(`[I'm an inline-style link](https://www.google.com)

[I'm an inline-style link with title](https://www.google.com "Google's Homepage")

[I'm a reference-style link][Arbitrary case-insensitive reference text]

[I'm a relative reference to a repository file](../blob/master/LICENSE)

[arbitrary case-insensitive reference text]: https://www.mozilla.org`)).toMatchSnapshot()
  })

  it('render images', async () => {
    expect(await renderTest(`Inline-style:
![alt text](https://img.alicdn.com/imgextra/i3/O1CN012ZjB2y1xHUf6OzZ8C_!!6000000006418-2-tps-104-126.png "Logo Title Text 1")

Reference-style:
![alt text][logo]

[logo]: https://img.alicdn.com/imgextra/i3/O1CN012ZjB2y1xHUf6OzZ8C_!!6000000006418-2-tps-104-126.png "Logo Title Text 2"`)).toMatchSnapshot()
  })

  it('render blockquotes', async () => {
    expect(await renderTest(`> Blockquotes are very handy in email to emulate reply text.
> This line is part of the same quote.

Quote break.

> This is a very long line that will still be quoted properly when it wraps. Oh boy let's keep writing to make sure this is long enough to actually wrap for everyone. Oh, you can *put* **Markdown** into a blockquote.

> Blockquotes can also be nested...
>> ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.`)).toMatchSnapshot()
  })

  it('render tables', async () => {
    expect(await renderTest(`| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |`)).toMatchSnapshot()
  })

  it('render tables special', async () => {
    expect(await renderTest(`Markdown | Less | Pretty
--- | --- | ---
*Still* | \`renders\` | **nicely**
1 | 2 | 3`)).toMatchSnapshot()
  })


  it('render code blocks', async () => {
    expect(await renderTest("```javascript\nfunction test() {\n  console.log('test');\n}\n```")).toMatchSnapshot()
  })

  it('render horizontal rules', async () => {
    expect(await renderTest(`Three or more...

---

Hyphens

***

Asterisks

___

Underscores`)).toMatchSnapshot()
  })

  it('render footnotes', async () => {
    expect(await renderTest(`# [Footnotes](https://github.com/markdown-it/markdown-it-footnote)

Footnote 1 link[^first].

Footnote 2 link[^second].

Inline footnote^[Text of inline footnote] definition.

Duplicated footnote reference[^second].

[^first]: Footnote **can have markup**

    and multiple paragraphs.

[^second]: Footnote text.`)).toMatchSnapshot()
  })

  it('render escape', async () => {
    expect(await renderTest(`\\*literal asterisks\\*`)).toMatchSnapshot()
  })

  // table dev
  it('render table dev', async () => {
    expect(await renderTest(`
| id | date | image |
|------|----------|----------|
| 1 | 2025-09-01 | ![图片](https://img.alicdn.com/imgextra/i3/O1CN012ZjB2y1xHUf6OzZ8C_!!6000000006418-2-tps-104-126.png "标题文字") |`)).toMatchSnapshot()
  })

  // math
  it('render katex', async () => {
    expect(await renderTest(`# Math Equation Test

## Inline Math

Here is an inline equation: $E=mc^2$ which is Einstein's famous formula.

Another example: $a^2 + b^2 = c^2$ is the Pythagorean theorem.

Greek letters: $\\alpha + \\beta = \\gamma$

## Block Math

Here is a block equation:

$$
E=mc^2
$$

Another block equation:

$$
x^2 + y^2 = z^2
$$

With Greek letters:

$$
\\alpha + \\beta + \\gamma = \\pi
$$

## End of Test

This document tests basic LaTeX math rendering.`)).toMatchSnapshot()
  })

  it('render math', async () => {
    expect(await renderTest(`** Inline math: ** $E=mc^2$

** Block math: **

$$
E=mc^2
$$`)).toMatchSnapshot()
  })

  // list number restart
  it('render list number restart', async () => {
    expect(await renderTest(`1. First item
2. Second item
      1. First subitem
      2. Second subitem
3. Third item

Some intervening text.

1. First item again
2. Second item again`)).toMatchSnapshot()
  })

  // list number with table
  it('render list number with table', async () => {
    expect(await renderTest(`# 测试用 Markdown 文本
1. 有序列表项一 — 基本说明

   * 这是一个子无序项，包含行内代码示例：\`console.log('hello')\`。

   * 下面插入一个表格用于测试表格渲染：

    | 名称     | 类型     | 说明               |
    | ------ | ------ | ---------------- |
    | id     | int    | 主键，自增            |
    | name   | string | 用户姓名             |
    | active | bool   | 是否激活（true/false） |

    * 再嵌入一段多行代码（JavaScript）：
    \`\`\`javascript
    console.log(greet('测试用户'));
    \`\`\`
    * 引用示例：

    > 这是一个引用块，用于测试在列表中嵌套引用的渲染效果。

2. 有序列表项二 — 嵌套有序与无序混合

    * 行内强调：*斜体*、**粗体**、\`代码\`。

`)).toMatchSnapshot()
  })

  // parse math
  it('parse katex', async () => {
    expect(await renderTest(`# Math Equation Test

## Inline Math

Here is an inline equation: $E=mc^2$ which is Einstein's famous formula.

Another example: $a^2 + b^2 = c^2$ is the Pythagorean theorem.

Greek letters: $\\alpha + \\beta = \\gamma$

## Block Math

Here is a block equation:

$$
E=mc^2
$$

Another block equation:

$$
x^2 + y^2 = z^2
$$

With Greek letters:

$$
\\alpha + \\beta + \\gamma = \\pi
$$

## End of Test

This document tests basic LaTeX math rendering.`)).toMatchSnapshot()
  })

  it('parse math', async () => {
    expect(await renderTest(`** Inline math: ** $E=mc^2$

** Block math: **

$$
E=mc^2
$$

** End Math **`)).toMatchSnapshot()
  })

  // image size
  it('render image size', async () => {
    expect(await renderTest(`![Alt text](https://github.githubassets.com/assets/pull-shark-default-498c279a747d.png "300x300")`)).toMatchSnapshot()
    expect(await renderTest(`![Alt text](https://github.githubassets.com/assets/pull-shark-default-498c279a747d.png "50%x50%")`)).toMatchSnapshot()
  })
})
