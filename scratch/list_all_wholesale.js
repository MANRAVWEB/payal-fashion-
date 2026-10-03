const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');

const visibleMatches = [];
const codeMatches = [];

lines.forEach((l, idx) => {
  const lineNum = idx + 1;
  if (/wholesale/i.test(l)) {
    // Check if it's purely CSS selector, internal var, or user-facing
    visibleMatches.push({ line: lineNum, text: l });
  }
});

console.log('Total occurrences in index.html:', visibleMatches.length);
visibleMatches.forEach(m => console.log(`${m.line}: ${m.text.trim()}`));
