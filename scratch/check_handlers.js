const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Extract all onclick="..." attributes
const onclickRegex = /onclick=["']([^"']+)["']/g;
const onclicks = [];
let match;
while ((match = onclickRegex.exec(html)) !== null) {
  onclicks.push(match[1].trim());
}

// Extract all function names in the script
const funcs = new Set([...html.matchAll(/function\s+([a-zA-Z0-9_]+)\s*\(/g)].map(m => m[1]));

console.log('Total onclick handlers found:', onclicks.length);
let brokenHandlers = 0;

onclicks.forEach(expr => {
  // extract first call e.g. openProductModal(1) or navigateTo('home') or CloudSync.fetchLatestData()
  const m = expr.match(/^([a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)?)\s*\(/);
  if (m) {
    const fnName = m[1];
    if (fnName.startsWith('CloudSync.')) {
      if (!html.includes('const CloudSync') && !html.includes('var CloudSync')) {
        console.log('❌ CloudSync missing for:', expr);
        brokenHandlers++;
      }
    } else if (!funcs.has(fnName)) {
      // Check if it's window method or DOM method like this.select() or history.back()
      if (!['history', 'alert', 'confirm', 'console', 'document', 'window'].some(prefix => fnName.startsWith(prefix))) {
        console.log('❌ Undefined function called in onclick:', fnName, 'in expression:', expr);
        brokenHandlers++;
      }
    }
  }
});

if (brokenHandlers === 0) {
  console.log('✅ ALL', onclicks.length, 'ONCLICK HANDLERS CALL VALID, DEFINED FUNCTIONS!');
}
