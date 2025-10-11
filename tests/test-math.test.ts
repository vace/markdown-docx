import { describe, expect, it } from 'vitest'
import fs from 'node:fs/promises';
import path from 'node:path';
import markdownToDocx, { Packer } from '../src/entry-node'

const __dirname = new URL('.', import.meta.url).pathname

describe('Math Rendering', () => {
  it('render comprehensive math example', async () => {
    const doc = await markdownToDocx(getDefaultMathExample());
    const buffer = await Packer.toBuffer(doc);
    expect(buffer).toBeInstanceOf(Buffer);
    // Optionally, write to file for manual inspection
    const outputPath = path.join(__dirname, 'test-math-comprehensive.docx');
    await fs.writeFile(outputPath, buffer);
    console.log('✅ Successfully created test-math-comprehensive.docx');
    // check file exists
    const stat = await fs.stat(outputPath);
    expect(stat.isFile()).toBe(true);
  })

  // read file
  it('render math example from file', async () => {
    const markdown = await fs.readFile(path.join(__dirname, 'math-example.md'), 'utf-8');
    const doc = await markdownToDocx(markdown);
    const buffer = await Packer.toBuffer(doc);
    expect(buffer).toBeInstanceOf(Buffer);
    // Optionally, write to file for manual inspection
    const outputPath = path.join(__dirname, 'math-example-from-file.docx');
    await fs.writeFile(outputPath, buffer);
    console.log('✅ Successfully created math-example-from-file.docx');
    // check file exists
    const stat = await fs.stat(outputPath);
    expect(stat.isFile()).toBe(true);
  })
})


function getDefaultMathExample() {
  const markdown = `# Math Equation Test

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

This document tests basic LaTeX math rendering.
`;
  return markdown;
}
