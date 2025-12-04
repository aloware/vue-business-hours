/**
 * Create ES module build by copying source entry file
 * Adjust import paths to point to source files
 * The consumer's bundler will handle Vue SFC compilation
 * This avoids webpack's module system conflicts
 */

const fs = require('fs');
const path = require('path');

const srcEntry = path.join(__dirname, '../src/entry.js');
const distEsm = path.join(__dirname, '../dist/VueBusinessHours.esm.js');

if (!fs.existsSync(srcEntry)) {
  console.error(`Source entry not found: ${srcEntry}`);
  process.exit(1);
}

// Read the source entry file
let content = fs.readFileSync(srcEntry, 'utf8');

// Adjust import paths to point to source files (relative to package root)
// Change './components/BusinessHours.vue' to '../src/components/BusinessHours.vue'
content = content.replace(
  /from\s+['"]\.\/components\//g,
  "from '../src/components/"
);

fs.writeFileSync(distEsm, content, 'utf8');

console.log('✓ Created ES module build from source');
console.log('  Note: Consumer bundler will compile Vue SFCs from source files');

