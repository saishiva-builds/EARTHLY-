import fs from 'fs';

const html = fs.readFileSync('C:/Users/saish/.gemini/antigravity/scratch/earthly/index.html', 'utf8');
const js = fs.readFileSync('C:/Users/saish/.gemini/antigravity/scratch/earthly/app.js', 'utf8');

const idRegex = /getElementById\(['"]([^'"]+)['"]\)/g;
let match;
const jsIds = new Set();
while ((match = idRegex.exec(js)) !== null) {
  jsIds.add(match[1]);
}

console.log('Total getElementById queries in app.js:', jsIds.size);
const missing = [];
for (const id of jsIds) {
  const pattern = new RegExp(`id=['"]${id}['"]`);
  if (!pattern.test(html)) {
    missing.push(id);
  }
}

if (missing.length > 0) {
  console.error('MISSING IDs in HTML:', missing);
  process.exit(1);
} else {
  console.log('✓ ALL', jsIds.size, 'element IDs in app.js exist in index.html!');
}
