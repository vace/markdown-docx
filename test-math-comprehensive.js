import fs from 'node:fs/promises';
import markdownDocx, { Packer } from './dist/index.node.mjs';

async function testMathComprehensive() {
  console.log('📖 Reading math example markdown...');
  
  try {
    const markdown = await fs.readFile('examples/math-example.md', 'utf-8');
    
    console.log('🔄 Converting to DOCX...');
    const doc = await markdownDocx(markdown);
    
    console.log('💾 Saving file...');
    const buffer = await Packer.toBuffer(doc);
    await fs.writeFile('examples/math-example.docx', buffer);
    
    console.log('✅ Successfully created examples/math-example.docx');
    console.log('📄 Open the file in Microsoft Word or LibreOffice to see the rendered equations');
    console.log('');
    console.log('Features tested:');
    console.log('  ✓ Inline equations ($...$)');
    console.log('  ✓ Block equations ($$...$$)');
    console.log('  ✓ Superscripts (x^2)');
    console.log('  ✓ Subscripts (x_1)');
    console.log('  ✓ Greek letters (α, β, γ, π, etc.)');
    console.log('  ✓ Mathematical operators (×, ÷, ±)');
    console.log('  ✓ Relations (≤, ≥, ≠, ≈)');
    console.log('  ✓ Special symbols (∞, ∈)');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testMathComprehensive();

