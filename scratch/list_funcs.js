const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const scriptMatches = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
const code = scriptMatches.map(m => m[1]).join('\n');

const functionNames = [...code.matchAll(/function\s+([a-zA-Z0-9_]+)\s*\(/g)].map(m => m[1]);
console.log('All functions (' + functionNames.length + '):');
console.log(functionNames);
