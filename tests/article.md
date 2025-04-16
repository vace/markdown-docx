# Markdown to DOCX Converter

---

Welcome to the Markdown to DOCX converter! This tool allows you to:

1. Write or paste Markdown content
2. Preview the rendered Markdown
3. Convert to DOCX format with a single click

## How to use

- Type in the editor on the left
- See the preview on the right
- Click "Download" to convert to DOCX

## Examples

**Bold text**, *italic text*, `inline code`, ~~strikethrough~~, and [links](https://www.google.com) are all supported.

> Blockquotes are also supported

## Links

[I'm an inline-style link](https://www.google.com)

[I'm an inline-style link with title](https://www.google.com "Google's Homepage")

## Task lists

- [x] Finish my changes
- [ ] Push my commits to GitHub
- [x] @mentions, #refs, [links](), **formatting**, and `tags` supported
- [ ] this is an incomplete item

## Images

Here's our logo (hover to see the title text):

![alt text](https://img.alicdn.com/imgextra/i3/O1CN012ZjB2y1xHUf6OzZ8C_!!6000000006418-2-tps-104-126.png "Logo Title Text 1")


## Ignoring Markdown formatting

You can tell GitHub to ignore (or escape) Markdown formatting by using \ before the Markdown character.

Let's rename \*our-new-project\* to \*our-old-project\*.

## Tables

Colons can be used to align columns.

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| `col 3 is`      | right-aligned | $1600 |
| col 2 is      | **centered**      |   $12 |
| zebra stripes | ~~are neat~~      |    $1 |

## Code Block

```javascript
import markdownDocx, { Packer } from 'markdown-docx';
// Read markdown content
const markdown = await fs.readFile('input.md', 'utf-8');
const doc = await markdownDocx(markdown);
const buffer = await Packer.toBuffer(doc);
```

## Inline HTML

<dl>
  <dt>Definition list</dt>
  <dd>Is something people use sometimes.</dd>

  <dt>Markdown in HTML</dt>
  <dd>Does *not* work **very** well. Use HTML <em>tags</em>.</dd>
</dl>

---

Enjoy!
