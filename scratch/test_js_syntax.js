const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scripts = html.match(/<script[\s\S]*?<\/script>/gi);
let combined = '';
for (const s of scripts) {
  if (s.includes('src=')) continue;
  const code = s.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
  combined += '\n;\n' + code;
}
fs.writeFileSync('scratch/extracted_all_scripts.js', combined);
console.log('Script extracted successfully');
