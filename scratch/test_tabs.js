const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Check tab buttons
const tabBtns = [...html.matchAll(/data-tab=["']([^"']+)["']/g)].map(m => m[1]);
console.log('Tab buttons found in HTML (' + tabBtns.length + '):', tabBtns);

// Check tab containers
const tabPanes = [...html.matchAll(/id=["'](admin-tab-[^"']+)["']/g)].map(m => m[1]);
console.log('Tab panes found in HTML (' + tabPanes.length + '):', tabPanes);

let errors = 0;
for (const tab of tabBtns) {
  const paneId = 'admin-tab-' + tab;
  if (!tabPanes.includes(paneId)) {
    console.error('❌ ERROR: Missing pane for button tab:', tab, '-> expected', paneId);
    errors++;
  } else {
    console.log('✅ OK: Tab', tab, '->', paneId);
  }
}

if (errors === 0) {
  console.log('All tab buttons map 1:1 to tab panes!');
} else {
  process.exit(1);
}
