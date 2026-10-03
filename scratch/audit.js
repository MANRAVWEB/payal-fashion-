const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// Find all elements with an id
const idRegex = /id=["']([^"']+)["']/g;
const ids = [];
let match;
while ((match = idRegex.exec(html)) !== null) {
  ids.push(match[1]);
}
console.log('Total unique IDs in index.html:', new Set(ids).size);

const relevant = ids.filter(id => /cart|modal|drawer|quick|view|search|checkout|order|grid|product|admin|nav|filter/i.test(id));
console.log('\nRelevant IDs in DOM:');
console.log(relevant.sort());

// Check key methods on App object or global window
const methods = [...html.matchAll(/(?:App\.)?([a-zA-Z0-9_]+)\s*[:=]\s*(?:function|\([^)]*\)\s*=>)/g)].map(m => m[1]);
console.log('\nSample methods in App / JS:');
console.log([...new Set(methods)].slice(0, 40));
