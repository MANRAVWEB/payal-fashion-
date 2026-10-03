const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scriptMatches = [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)];
const script = scriptMatches[1][1];

// Find any double-quoted, single-quoted, or backtick strings with 'wholesale' (case-insensitive)
const strRegex = /("([^"\\]*(\\.[^"\\]*)*)"|'([^'\\]*(\\.[^'\\]*)*)'|`([^`\\]*(\\.[^`\\]*)*)`)/g;
let m;
const matches = [];
while ((m = strRegex.exec(script)) !== null) {
  const str = m[0];
  if (/wholesale/i.test(str)) {
    matches.push(str);
  }
}
console.log('Found string matches containing wholesale:', matches.length);
matches.forEach(item => console.log(' -> ' + item.slice(0, 100)));
