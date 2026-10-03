const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const scriptMatches = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
const code = scriptMatches.map(m => m[1]).join('\n');

console.log('Total JS lines:', code.split('\n').length);

// Find top level objects and functions
const topLevelFunctions = [...code.matchAll(/function\s+([a-zA-Z0-9_]+)/g)].map(m => m[1]);
console.log('Functions found:', topLevelFunctions.slice(0, 30));

const topLevelVars = [...code.matchAll(/(?:const|let|var)\s+([a-zA-Z0-9_]+)/g)].map(m => m[1]);
console.log('Variables found:', topLevelVars.slice(0, 30));

// Check App object structure if exists
if (code.includes('const App =') || code.includes('var App =') || code.includes('let App =') || code.includes('window.App =')) {
  console.log('App object exists.');
}
