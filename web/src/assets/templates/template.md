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
Images are fully supported, including specifying dimensions (e.g., `64x64`), scaling percentages (e.g., `30%x30%`), and WebP format.

Here are some examples:

![alt text](pull-shark.png "64x64")

![alt text](starstruck.png "30%x30%")

![webp Support](./webp.webp "Logo Title Text 1")


## Ignoring Markdown formatting

You can tell GitHub to ignore (or escape) Markdown formatting by using \ before the Markdown character.

Let's rename \*our-new-project\* to \*our-old-project\*.

## Tables

Colons can be used to align columns.

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| `col 3 is`      | right-aligned | $1600 |
| col 2 is      | **centered**      |   $12 |
| ![img](/small.png) | ~~are neat~~      |    $1 |

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


## Math Equations

## Inline Math

You can write inline equations like $E=mc^2$ directly in your text. Here are more examples:

- Einstein's mass-energy equivalence: $E=mc^2$
- Pythagorean theorem: $a^2 + b^2 = c^2$
- Quadratic formula: $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$
- Greek letters: $\alpha$, $\beta$, $\gamma$, $\delta$, $\pi$, $\omega$

## Block Math

For display equations, use double dollar signs:

$$
i\hbar\frac{\partial}{\partial t}\Psi(\mathbf{r},t) = -\frac{\hbar^2}{2m}\nabla^2\Psi(\mathbf{r},t) + V(\mathbf{r})\Psi(\mathbf{r},t)
$$

### More Examples

The Pythagorean theorem:

$$
a^2 + b^2 = c^2
$$

Sum of Greek letters:

$$
\alpha + \beta + \gamma = \pi
$$

Inequality:

$$
x \leq y
$$

Mathematical operations:

$$
a \times b \div c \pm d
$$

---

Enjoy!
