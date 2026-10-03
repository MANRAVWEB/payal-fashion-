const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');

const targets = [
  'function saveProduct',
  'function handleProductEnquirySubmit',
  'function handleWholesaleSubmit',
  'function setHomePhotos',
  'function saveWebsiteSettings',
  'function getProducts',
  'function getHomePhotos',
  'function initDatabase'
];

targets.forEach(t => {
  lines.forEach((l, idx) => {
    if (l.includes(t)) {
      console.log(`${t} -> Line ${idx + 1}`);
    }
  });
});
