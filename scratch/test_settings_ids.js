const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const ids = ['set-business-name', 'set-tagline', 'set-phone', 'set-email', 'set-owner-lead-email', 'set-gstin', 'set-city-state', 'set-address', 'set-hero-headline', 'set-hero-desc', 'set-admin-username', 'set-admin-password'];
for (const id of ids) {
  console.log(id, ':', html.includes('id="' + id + '"') ? 'FOUND' : 'MISSING');
}
