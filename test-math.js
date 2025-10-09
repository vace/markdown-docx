import fs from 'node:fs/promises';
import markdownDocx, { Packer } from './dist/index.node.mjs';

async function testMath() {
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

  console.log('Converting markdown with math to DOCX...');
  
  try {
    const doc = await markdownDocx(markdown);
    const buffer = await Packer.toBuffer(doc);
    await fs.writeFile('test-math.docx', buffer);
    console.log('✅ Successfully created test-math.docx');
    console.log('📄 Open the file to see if math equations are rendered correctly');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testMath();

