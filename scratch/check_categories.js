const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find category filter buttons
const catFilterMatches = html.match(/class="filter-btn[^"]*"[^>]*>[\s\S]*?<\/button>/gi);
console.log('Category filter buttons:');
if (catFilterMatches) {
  catFilterMatches.forEach(b => console.log(b.trim()));
}

// Find categories in DEFAULT_PRODUCTS
const prodsMatch = html.match(/const DEFAULT_PRODUCTS = \[([\s\S]*?)\];/);
if (prodsMatch) {
  const catMatches = prodsMatch[1].match(/category:\s*"[^"]+"/g);
  console.log('\nDefault product categories:');
  console.log([...new Set(catMatches)]);
}

// Find category select options in add/edit product modal
const catSelectMatch = html.match(/<select[^>]*id="ap-category"[^>]*>([\s\S]*?)<\/select>/i);
if (catSelectMatch) {
  console.log('\nCategory select options in modal:');
  console.log(catSelectMatch[1].trim());
}

// Find filterCatalogue logic
const filterCatMatch = html.match(/function filterCatalogue[\s\S]*?renderCatalogue/);
if (filterCatMatch) {
  console.log('\nfilterCatalogue logic snippet:');
  console.log(filterCatMatch[0]);
}
