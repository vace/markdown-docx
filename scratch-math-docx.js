import { Document, Packer, Paragraph, Math as OMMLMath, MathRun } from 'docx';
import fs from 'node:fs/promises';

async function run() {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ children: [new OMMLMath({ children: [new MathRun('E=mc^2')] })] }),
        ],
      },
    ],
  });
  const buffer = await Packer.toBuffer(doc);
  await fs.writeFile('scratch-math.docx', buffer);
  console.log('wrote scratch-math.docx');
}
run();

