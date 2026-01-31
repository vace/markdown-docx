---
name: markdown-to-docx
description: Converts Markdown files (.md, .markdown) to DOCX using the markdown-docx npm package. Supports single and batch conversions, automatically generates output filenames, and creates Microsoft Word documents from Markdown content.
---

# Markdown to DOCX Converter

## Overview

Convert Markdown files to Microsoft Word DOCX format using the `markdown-docx` npm package. Supports single file and batch conversions with automatic output file naming.

## Quick Start

**Single file conversion:**
```bash
python scripts/convert_md_to_docx.py -i document.md
```
This creates `document.docx` in the same directory.

**Batch conversion:**
```bash
python scripts/convert_md_to_docx.py -i file1.md file2.md file3.md
```
Each file is converted to DOCX in its original location.

**Custom output location:**
```bash
python scripts/convert_md_to_docx.py -i document.md -o output/mydoc.docx
```

**Batch to specific directory:**
```bash
python scripts/convert_md_to_docx.py -i *.md -o output_docs/
```

## Workflow

When a user requests markdown to DOCX conversion:

1. **Identify input files** - Confirm which markdown file(s) to convert
2. **Determine output naming** - Use auto-naming unless user specifies custom names
3. **Run conversion** - Execute the script with appropriate parameters
4. **Report results** - Inform user of success and output file location(s)

## Common Use Cases

### Convert a single markdown file
User: "Convert README.md to DOCX"
```bash
python scripts/convert_md_to_docx.py -i README.md
```

### Convert all markdown files in current directory
User: "Convert all my markdown files to Word documents"
```bash
python scripts/convert_md_to_docx.py -i *.md
```

### Convert with custom output name
User: "Convert notes.md to report.docx"
```bash
python scripts/convert_md_to_docx.py -i notes.md -o report.docx
```

### Convert documentation set to a folder
User: "Convert all docs to DOCX and put them in the exports folder"
```bash
python scripts/convert_md_to_docx.py -i docs/*.md -o exports/
```

## Script Details

**Location:** `scripts/convert_md_to_docx.py`

**Features:**
- Validates input files exist and are markdown format
- Auto-generates output filenames (input.md → input.docx)
- Supports custom output paths for single files
- Supports output directory for batch conversions
- Creates output directories if they don't exist
- Provides clear success/failure feedback
- Returns proper exit codes for automation

**Requirements:**
- Python 3+
- Node.js and npm (for npx)
- markdown-docx npm package (automatically fetched via npx)

## Error Handling

The script handles common errors:
- **Input file not found** - Reports missing file path
- **Invalid file type** - Ensures input is .md or .markdown
- **npx not available** - Checks for Node.js/npm installation
- **Conversion failure** - Captures and reports markdown-docx errors

## Tips

- **Auto-naming is preferred** - The script automatically names output files, reducing friction
- **Batch operations** - When converting multiple files, the script shows a summary of successes and failures
- **Path handling** - Both absolute and relative paths work for input and output
- **Glob patterns** - Shell glob patterns (*.md) can be used for batch operations
