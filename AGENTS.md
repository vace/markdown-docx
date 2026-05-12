# markdown-docx — Agent Entrypoint

> **For agentic workers:** Read this file fully before touching any code. It contains the codebase map, conventions, and workflow required to work here safely.

---

## What This Project Is

`markdown-docx` converts Markdown to `.docx` (Microsoft Word) format. It runs in **both Node.js and browser** environments. It is published as an npm package with a CLI tool.

**Stack:** TypeScript · [docx](https://github.com/dolanmiu/docx) · [marked](https://marked.js.org/) · [KaTeX](https://katex.org/) · [tsdown](https://github.com/rolldown/tsdown) (build) · [vitest](https://vitest.dev/) (tests) · pnpm

---

## Repository Layout

```
src/                    Library source
  index.ts              Public entry (Node.js) — default export markdownDocx(), re-exports all types
  entry.ts              Browser entry
  entry-node.ts         Node.js-specific entry (includes image adapter)
  MarkdownDocx.ts       Core class — owns options, styles, footnotes, render dispatch
  tokenize.ts           Wraps marked tokenizer; attaches custom extensions
  utils.ts              Pure helpers (heading level map, image extension, resolvePageMargins)
  types/                All TypeScript types (pure type files, no runtime code)
    index.ts            Barrel — re-exports everything from sub-files
    theme.ts            IMarkdownTheme — colors, sizes, margins, collapseEmptyLines
    options.ts          MarkdownDocxOptions — full API options interface
    image.ts            MarkdownImageType, MarkdownImageItem, MarkdownImageAdapter
    token.ts            IBlockToken, IInlineToken, IParagraphToken (union types)
    attr.ts             ITextAttr, IBlockAttr (render attribute objects)
    style.ts            IMarkdownToken, IMarkdownStyle, IMarkdownRenderFunction, Writeable
  adapters/
    browser.ts          Canvas-based image adapter for browsers
    nodejs.ts           fetch/sharp-based image adapter for Node.js
  extensions/
    index.ts            Registers marked extensions; re-exports extension types
    footnote.ts         Footnote extension (block + inline)
    latex.ts            KaTeX inline/block extension
    mathml-to-docx.ts   Converts MathML XML → docx Math children
    types.ts            Extension-specific token types
  renders/
    index.ts            Re-exports renderBlocks and renderTokens
    render-blocks.ts    Block-level token → docx FileChild (paragraph, table, list…)
    render-tokens.ts    Inline token dispatch
    render-paragraph.ts Paragraph construction
    render-text.ts      Run (text span) construction
    render-list.ts      Ordered/unordered/task lists
    render-table.ts     Table rendering
    render-image.ts     Image rendering
    render-checkbox.ts  Task list checkbox
  styles/
    index.ts            Re-exports; builds default styles object
    themes.ts           defaultTheme constant (IMarkdownTheme values)
    styles.ts           createDocumentStyle(), createDefaultStyle()
    markdown.ts         createMarkdownStyle() — per-token paragraph/run styles
    classes.ts          CSS class name constants (MdParagraph, MdHeading1…)
    numbering.ts        List numbering configuration

bin/
  markdown-docx.mjs     CLI entry (Commander.js); --input --output --theme --config
  help-texts.mjs        CLI help content for `markdown-docx help theme|config`

tests/                  Integration tests (vitest)
  index.test.ts         Full-document round-trip tests
  margin.test.ts        Unit tests for resolvePageMargins()
  theme-styles.test.ts  Unit tests for createDefaultStyle()
  theme-CLI.test.ts     CLI flag tests (execSync)
  test-math.test.ts     Math/KaTeX rendering tests
  *.md                  Sample markdown inputs

src/**/*.test.ts        Unit tests co-located with source
  src/index.test.ts     Per-feature render tests (snapshots)
  src/tokenize.test.ts  Tokenizer unit tests
  src/__snapshots__/    Vitest snapshot files (auto-generated)

examples/
  sample-config.json    Full config reference with all defaults documented

docs/superpowers/
  plans/                Implementation plans (YYYY-MM-DD-<feature>.md)
  specs/                Feature specs
```

---

## Architecture Mental Model

```
markdownDocx(markdown, options)
  └─ new MarkdownDocx(markdown, options)
       ├─ tokenize()          → IBlockToken[]  (marked + extensions)
       ├─ downloadImageList() → populates _imageStore
       └─ toBlocks()          → FileChild[]
            └─ renderBlocks() → per-token → renderParagraph / renderList / renderTable / …
                                  └─ renderTokens() → ParagraphChild[] (inline spans)

new Document({ styles, numbering, sections: [{ properties, children }] })
```

The `MarkdownDocx` instance is threaded through all render functions as `render`. Access options via `render.options`, theme via `render.options.theme`.

---

## Key Conventions

### Types
- **All types live in `src/types/`**. Never define types in other files.
- `index.ts` is a pure barrel — only `export type { … } from './file'` lines.
- Add new types to the most semantically appropriate file (`theme.ts`, `image.ts`, `attr.ts`, `token.ts`, `style.ts`, `options.ts`).

### Styles
- Every docx paragraph/run style has a string class name defined in `src/styles/classes.ts`.
- Styles are built once per document in `createMarkdownStyle()` (`src/styles/markdown.ts`).
- To add a new paragraph style: add to `IMarkdownToken` union, add entry in `createMarkdownStyle()`, add class name to `classes.ts`.

### Theme
- `defaultTheme` in `src/styles/themes.ts` holds all default values.
- Theme is always merged with defaults before use: `{ ...defaultTheme, ...userTheme }`.
- `IMarkdownTheme` in `src/types/theme.ts` is the source of truth for allowed properties.
- Margin values are resolved to twips via `resolvePageMargins()` in `src/utils.ts`.

### Renders
- Every render function receives `(render: MarkdownDocx, token, attr)`.
- Block renders return `FileChild | FileChild[] | false | null`. Return `false` to skip silently; `null` logs a warning.
- Inline renders return `ParagraphChild | ParagraphChild[]`.

### Testing
- **Run all tests:** `npx vitest run --reporter=verbose`
- **Type check:** `pnpm ts-check`
- Snapshot tests are in `src/__snapshots__/`. Update with `npx vitest run --update-snapshots`.
- CLI tests use `execSync` and require the built CLI at `bin/markdown-docx.mjs` (no build step needed — it's pre-built ESM).
- Test files that output `.docx` write to `tests/` directory.

### Build
- `pnpm build` runs tsdown and outputs to `dist/`.
- The CLI (`bin/`) is pre-authored ESM and does **not** need rebuilding for tests.

---

## Common Pitfalls

| Pitfall | Correct approach |
|---|---|
| Adding types outside `src/types/` | Always add to the appropriate `src/types/*.ts` file |
| Modifying `themes.ts` defaults | Defaults go in `defaultTheme`; interface changes go in `IMarkdownTheme` |
| Using `theme.spaceSize` for run font size | Space paragraphs inherit body size — do not set `run.size` on `space` style |
| Forgetting to merge with `defaultTheme` | Always `{ ...defaultTheme, ...userTheme }` before reading theme values |
| Not returning `false` for skipped blocks | Return `false` (silent skip) not `null` (logs warning) |
| Breaking circular import between `MarkdownDocx` and `types/style.ts` | `IMarkdownRenderFunction` in `style.ts` imports `MarkdownDocx` — this is intentional and already present |
