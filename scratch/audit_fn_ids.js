const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const funcsToCheck = [
  'renderAdminOverview',
  'renderAdminProductsTable',
  'renderAdminHomePhotos',
  'renderAdminEnquiriesTable',
  'renderAdminWholesaleTable',
  'renderAdminLoginLeadsTable',
  'renderAdminCustomersTable',
  'renderAdminEmailLogsTable',
  'populateAdminSettingsForm',
  'renderAdminFirebase'
];

// Extract IDs from HTML
const allIds = new Set([...html.matchAll(/id=["']([a-zA-Z0-9_-]+)["']/g)].map(m => m[1]));

console.log('Total unique IDs in HTML:', allIds.size);

for (const fn of funcsToCheck) {
  const fnRegex = new RegExp('(?:function\\s+' + fn + '|async\\s+function\\s+' + fn + '|' + fn + '\\s*=\\s*function)[\\s\\S]*?\\n\\s*\\}', 'g');
  const match = fnRegex.exec(html);
  if (!match) {
    console.warn('⚠️ Could not extract body for function:', fn);
    continue;
  }
  const body = match[0];
  const getElemCalls = [...body.matchAll(/getElementById\(["']([a-zA-Z0-9_-]+)["']\)/g)].map(m => m[1]);
  const missing = getElemCalls.filter(id => !allIds.has(id));
  if (missing.length > 0) {
    console.error('❌ In function ' + fn + ', missing DOM IDs:', missing);
  } else {
    console.log('✅ Function ' + fn + ' referenced ' + getElemCalls.length + ' IDs, all exist in HTML.');
  }
}
