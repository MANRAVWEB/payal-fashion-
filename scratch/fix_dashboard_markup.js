const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Update navigation tabs with data-tab attributes
const oldNavTabs = `<div class="dashboard-nav-tabs">
          <button class="dash-tab-btn active" onclick="App.switchAdminTab('overview')"><i class="fa-solid fa-chart-line"></i> Overview</button>
          <button class="dash-tab-btn" onclick="App.switchAdminTab('products')"><i class="fa-solid fa-shirt"></i> Products Manager</button>
          <button class="dash-tab-btn" onclick="App.switchAdminTab('homephotos')"><i class="fa-solid fa-images"></i> Homepage Photos</button>
          <button class="dash-tab-btn" onclick="App.switchAdminTab('enquiries')"><i class="fa-solid fa-inbox"></i> Product Enquiries</button>
          <button class="dash-tab-btn" onclick="App.switchAdminTab('wholesale')"><i class="fa-solid fa-handshake"></i> Wholesale Leads</button>
          <button class="dash-tab-btn" onclick="App.switchAdminTab('loginleads')"><i class="fa-solid fa-phone-volume"></i> Customer Contact Leads <span id="admin-leads-badge" class="badge-luxury" style="background:#25D366; color:#FFF; font-size:0.68rem; margin-left:4px;">0</span></button>
          <button class="dash-tab-btn" onclick="App.switchAdminTab('customers')"><i class="fa-solid fa-users"></i> Registered Customers</button>
          <button class="dash-tab-btn" onclick="App.switchAdminTab('emails')"><i class="fa-solid fa-envelope"></i> Email Notification Logs</button>
          <button class="dash-tab-btn" onclick="App.switchAdminTab('settings')"><i class="fa-solid fa-gear"></i> Website Settings</button>
          <button class="dash-tab-btn" onclick="App.switchAdminTab('firebase')"><i class="fa-solid fa-fire" style="color:#FFA000;"></i> Firebase Cloud Sync</button>
        </div>`;

const newNavTabs = `<div class="dashboard-nav-tabs">
          <button class="dash-tab-btn active" data-tab="overview" onclick="App.switchAdminTab('overview')"><i class="fa-solid fa-chart-line"></i> Overview</button>
          <button class="dash-tab-btn" data-tab="products" onclick="App.switchAdminTab('products')"><i class="fa-solid fa-shirt"></i> Products Manager</button>
          <button class="dash-tab-btn" data-tab="homephotos" onclick="App.switchAdminTab('homephotos')"><i class="fa-solid fa-images"></i> Homepage Photos</button>
          <button class="dash-tab-btn" data-tab="enquiries" onclick="App.switchAdminTab('enquiries')"><i class="fa-solid fa-inbox"></i> Product Enquiries</button>
          <button class="dash-tab-btn" data-tab="wholesale" onclick="App.switchAdminTab('wholesale')"><i class="fa-solid fa-handshake"></i> Wholesale Leads</button>
          <button class="dash-tab-btn" data-tab="loginleads" onclick="App.switchAdminTab('loginleads')"><i class="fa-solid fa-phone-volume"></i> Customer Contact Leads <span id="admin-leads-badge" class="badge-luxury" style="background:#25D366; color:#FFF; font-size:0.68rem; margin-left:4px;">0</span></button>
          <button class="dash-tab-btn" data-tab="customers" onclick="App.switchAdminTab('customers')"><i class="fa-solid fa-users"></i> Registered Customers</button>
          <button class="dash-tab-btn" data-tab="emails" onclick="App.switchAdminTab('emails')"><i class="fa-solid fa-envelope"></i> Email Notification Logs</button>
          <button class="dash-tab-btn" data-tab="settings" onclick="App.switchAdminTab('settings')"><i class="fa-solid fa-gear"></i> Website Settings</button>
          <button class="dash-tab-btn" data-tab="firebase" onclick="App.switchAdminTab('firebase')"><i class="fa-solid fa-fire" style="color:#FFA000;"></i> Firebase Cloud Sync</button>
        </div>`;

if (html.includes(oldNavTabs)) {
  html = html.replace(oldNavTabs, newNavTabs);
  console.log('✅ Updated nav tabs with data-tab attributes');
} else {
  console.error('❌ Could not match oldNavTabs');
}

// 2. Extract admin-tab-homephotos and place it after admin-tab-products
const homePhotosBlock = `          <!-- HOMEPAGE PHOTOS & BANNERS TAB -->
          <div id="admin-tab-homephotos" style="display:none;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px; border-bottom:1px solid rgba(0,0,0,0.06); padding-bottom:14px;">
              <div>
                <h3 style="font-family:var(--font-serif); color:var(--maroon-deep); margin-bottom:4px;">Homepage Photos &amp; Banners Manager</h3>
                <p style="font-size:0.82rem; color:var(--text-muted);">Apne phone ya computer se direct koi bhi homepage photo badlein (Signature Collection, Bhuleshwar Atelier, Hero Banner). Ye changes website par turant live dikhte hain.</p>
              </div>
              <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <button type="button" class="btn btn-sm btn-gold" onclick="App.openPublishModal()"><i class="fa-solid fa-cloud-arrow-up"></i> Publish to Live GitHub</button>
                <button type="button" class="btn btn-sm btn-outline-maroon" onclick="App.downloadExportHtml()"><i class="fa-solid fa-download"></i> Download index.html</button>
                <button type="button" class="btn btn-sm btn-outline-gold" onclick="App.resetAllHomePhotos()"><i class="fa-solid fa-rotate-left"></i> Reset Defaults</button>
              </div>
            </div>

            <div id="home-photos-container">
              <!-- Dynamically rendered by App.renderAdminHomePhotos() -->
            </div>
          </div>`;

if (html.includes(homePhotosBlock)) {
  html = html.replace(homePhotosBlock + '\n\n', '');
  
  // Insert after admin-tab-products
  const productsEnd = `                <tbody id="admin-products-table-body"></tbody>
              </table>
            </div>
          </div>`;

  if (html.includes(productsEnd)) {
    html = html.replace(productsEnd, productsEnd + '\n\n' + homePhotosBlock);
    console.log('✅ Moved admin-tab-homephotos to correct order after products');
  } else {
    console.error('❌ Could not find productsEnd');
  }
} else {
  console.error('❌ Could not match homePhotosBlock');
}

// 3. Move admin-tab-loginleads before admin-tab-customers
const loginLeadsStart = '          <!-- 5.5 CUSTOMER LOGIN CONTACT LEADS TAB (DIRECT OWNER CONTACT) -->';
const emailsTabStart = '          <!-- 6. EMAIL LOGS TAB (TRANSACTIONAL PREVIEW) -->';
const customersTabStart = '          <!-- 5. REGISTERED CUSTOMERS TAB -->';

const idxLoginLeads = html.indexOf(loginLeadsStart);
const idxEmails = html.indexOf(emailsTabStart);
const idxCustomers = html.indexOf(customersTabStart);

if (idxLoginLeads !== -1 && idxEmails !== -1 && idxCustomers !== -1 && idxCustomers < idxLoginLeads) {
  const loginLeadsBlock = html.substring(idxLoginLeads, idxEmails);
  html = html.substring(0, idxLoginLeads) + html.substring(idxEmails);
  // Re-find customers start and insert before it
  const newIdxCustomers = html.indexOf(customersTabStart);
  html = html.substring(0, newIdxCustomers) + loginLeadsBlock + html.substring(newIdxCustomers);
  console.log('✅ Moved login leads tab before registered customers to match tab button order');
}

// 4. Update owner email indicator
html = html.replace('Heermanufacturinghub@gmail.com', 'payalcreation10@gmail.com');
html = html.replace('Heermanufacturinghub@gmail.com', 'payalcreation10@gmail.com');

fs.writeFileSync('index.html', html, 'utf8');
console.log('✅ Finished dashboard markup adjustments');
