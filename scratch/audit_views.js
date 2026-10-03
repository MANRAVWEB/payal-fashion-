const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const re = /id=["']admin-tab-([^"']+)["']/g;
let m;
const tabs = [];
while ((m = re.exec(html)) !== null) {
  tabs.push(m[1]);
}
console.log('Admin tab IDs in DOM order:', tabs);

const btnRe = /data-tab=["']([^"']+)["']/g;
const btnTabs = [];
while ((m = btnRe.exec(html)) !== null) {
  btnTabs.push(m[1]);
}
console.log('Nav button data-tab order:', btnTabs);
