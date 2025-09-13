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
})
