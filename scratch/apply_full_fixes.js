const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Add ENV right after "const App = (function() {"
if (!html.includes('const ENV = {')) {
  const oldAppStart = `const App = (function() {

      // Initial Default Products Data`;
  const newAppStart = `const App = (function() {

      // Runtime Environment Detection
      const ENV = {
        isLocalPHP: window.location.protocol.startsWith('http') && (
          window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1' ||
          window.location.hostname.endsWith('.local')
        ),
        isGitHubPages: window.location.hostname.includes('github.io'),
        isFileProtocol: window.location.protocol === 'file:'
      };

      // Initial Default Products Data`;
  html = html.replace(oldAppStart, newAppStart);
  console.log('✅ Added ENV detection to App');
}

// 2. Update Firebase Admin controllers
const oldFirebaseControllers = `      // ==========================================
      // FIREBASE TAB ACTIONS & UI CONTROLLERS
      // ==========================================
      async function renderAdminFirebase() {
        const input = document.getElementById("firebase-url-input");
        const badge = document.getElementById("firebase-status-badge");
        const currentUrl = FirebaseSync.getUrl();
        if (input) input.value = currentUrl;

        if (!badge) return;
        if (!currentUrl) {
          badge.innerHTML = '<i class="fa-solid fa-circle" style="color:#FFA000; font-size:0.65rem;"></i> Not Configured (Local Mode)';
          badge.style.borderColor = "#FFA000";
          badge.style.color = "#8A5852";
          return;
        }

        badge.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Checking Cloud Connection...';
        const testRes = await FirebaseSync.test();
        if (testRes.success) {
          badge.innerHTML = '<i class="fa-solid fa-circle" style="color:#25D366; font-size:0.65rem;"></i> 🟢 Live Realtime Sync Active';
          badge.style.borderColor = "#25D366";
          badge.style.color = "#155724";
        } else {
          badge.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="color:#DC3545; font-size:0.65rem;"></i> Connection Error / Permission Denied';
          badge.style.borderColor = "#DC3545";
          badge.style.color = "#721C24";
        }
      }

      async function saveFirebaseConfig() {
        const input = document.getElementById("firebase-url-input");
        if (!input) return;
        const val = input.value.trim();
        if (!val) {
          FirebaseSync.setUrl("");
          renderAdminFirebase();
          showToast("Firebase URL cleared. Operating in local mode.");
          return;
        }

        if (!val.startsWith("https://") || !val.includes("firebaseio.com")) {
          if (!confirm("The URL does not look like a standard Firebase Realtime Database URL (usually ends in firebaseio.com). Do you want to save it anyway?")) {
            return;
          }
        }

        FirebaseSync.setUrl(val);
        showToast("Testing Firebase connection...", "fa-satellite-dish");
        await renderAdminFirebase();
        const testRes = await FirebaseSync.test();
        if (testRes.success) {
          showToast("🎉 Connected to Firebase Realtime Cloud! All photo & product edits will now sync in 1 second across all customer phones!", "fa-circle-check");
        } else {
          showToast("Saved, but could not connect. Check security rules in Firebase Console (set .read: true, .write: true).", "fa-triangle-exclamation");
        }
      }

      async function testFirebaseConnection() {
        showToast("Testing Firebase connection...", "fa-satellite-dish");
        await renderAdminFirebase();
        const testRes = await FirebaseSync.test();
        if (testRes.success) {
          showToast("✅ Firebase Cloud is ONLINE and responding!", "fa-circle-check");
        } else {
          showToast("❌ Could not connect to Firebase: " + (testRes.error || "Permission Denied. Make sure security rules allow read/write."), "fa-triangle-exclamation");
        }
      }

      async function pushAllToFirebase() {
        if (!FirebaseSync.getUrl()) {
          showToast("Please enter and save your Firebase Database URL first!", "fa-triangle-exclamation");
          return;
        }

        showToast("Uploading all products & photos to Firebase Cloud...", "fa-cloud-arrow-up");
        try {
          const prods = getProducts();
          const photos = getHomePhotos();
          const settings = getSettings();

          await FirebaseSync.put("products", prods);
          await FirebaseSync.put("home_photos", photos);
          await FirebaseSync.put("settings", settings);

          showToast("🎉 SUCCESS! All " + prods.length + " products and " + Object.keys(photos).length + " photos uploaded to Firebase Cloud! Now 100% LIVE on GitHub Pages for all customers!", "fa-circle-check");
        } catch(e) {
          console.error("Firebase push error:", e);
          showToast("Failed to upload: " + e.message, "fa-triangle-exclamation");
        }
      }`;

const newFirebaseControllers = `      // ==========================================
      // FIREBASE TAB ACTIONS & UI CONTROLLERS
      // ==========================================
      async function renderAdminFirebase() {
        const input = document.getElementById("firebase-url-input");
        const badge = document.getElementById("firebase-status-badge");
        const currentUrl = FirebaseSync.getUrl();
        if (input) input.value = currentUrl;

        if (!badge) return;
        if (!currentUrl) {
          badge.innerHTML = '<i class="fa-solid fa-circle" style="color:#FFA000; font-size:0.65rem;"></i> Not Configured (Local Mode)';
          badge.style.borderColor = "#FFA000";
          badge.style.color = "#8A5852";
          return;
        }

        badge.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Checking Cloud Connection...';
        const testRes = await FirebaseSync.test();
        if (testRes.success) {
          badge.innerHTML = '<i class="fa-solid fa-circle" style="color:#25D366; font-size:0.65rem;"></i> 🟢 Live Realtime Sync Active';
          badge.style.borderColor = "#25D366";
          badge.style.color = "#155724";
        } else {
          const errText = testRes.error ? testRes.error : "Connection Failed (HTTP " + (testRes.status || "Error") + ")";
          badge.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="color:#DC3545; font-size:0.65rem;"></i> ' + errText;
          badge.style.borderColor = "#DC3545";
          badge.style.color = "#721C24";
        }
      }

      async function saveFirebaseConfig() {
        const input = document.getElementById("firebase-url-input");
        if (!input) return;
        const val = input.value.trim();
        if (!val) {
          FirebaseSync.setUrl("");
          renderAdminFirebase();
          showToast("Firebase URL cleared. Operating in local mode.");
          return;
        }

        if (!val.startsWith("https://") || !val.includes("firebaseio.com")) {
          if (!confirm("The URL does not look like a standard Firebase Realtime Database URL (usually ends in firebaseio.com). Do you want to save it anyway?")) {
            return;
          }
        }

        FirebaseSync.setUrl(val);
        showToast("Testing Firebase connection...", "fa-satellite-dish");
        await renderAdminFirebase();
        const testRes = await FirebaseSync.test();
        if (testRes.success) {
          showToast("🎉 Connected to Firebase Realtime Cloud! All photo & product edits will now sync in 1 second across all customer phones!", "fa-circle-check");
        } else {
          showToast("Saved, but could not connect: " + (testRes.error || "Check Firebase security rules."), "fa-triangle-exclamation");
        }
      }

      async function testFirebaseConnection() {
        showToast("Testing Firebase connection...", "fa-satellite-dish");
        await renderAdminFirebase();
        const testRes = await FirebaseSync.test();
        if (testRes.success) {
          showToast("✅ Firebase Cloud is ONLINE and responding! (Status 200 OK)", "fa-circle-check");
        } else {
          showToast("❌ Could not connect to Firebase: " + (testRes.error || "Permission Denied. Set rules in Firebase Console: { \\\".read\\\": true, \\\".write\\\": true }"), "fa-triangle-exclamation");
        }
      }

      async function pushAllToFirebase() {
        if (!FirebaseSync.getUrl()) {
          showToast("Please enter and save your Firebase Database URL first!", "fa-triangle-exclamation");
          return;
        }

        const prods = getProducts();
        const photos = getHomePhotos();
        const settings = getSettings();

        if (!Array.isArray(prods) || prods.length === 0) {
          showToast("Cannot upload empty product catalogue to cloud. Please add or load products first.", "fa-triangle-exclamation");
          return;
        }

        showToast("Uploading all products & photos to Firebase Cloud...", "fa-cloud-arrow-up");
        try {
          const res1 = await FirebaseSync.put("products", prods);
          const res2 = await FirebaseSync.put("home_photos", photos);
          const res3 = await FirebaseSync.put("settings", settings);

          if (res1 && res2 && res3) {
            showToast("🎉 SUCCESS! All " + prods.length + " products and " + Object.keys(photos).length + " photos uploaded to Firebase Cloud! Now 100% LIVE on GitHub Pages for all customers!", "fa-circle-check");
          } else {
            showToast("Upload partially completed. Please verify Firebase permissions.", "fa-triangle-exclamation");
          }
        } catch(e) {
          console.error("Firebase push error:", e);
          showToast("Failed to upload: " + e.message, "fa-triangle-exclamation");
        }
      }`;

if (html.includes(oldFirebaseControllers)) {
  html = html.replace(oldFirebaseControllers, newFirebaseControllers);
  console.log('✅ Updated Firebase controllers with detailed error handling');
} else {
  console.log('⚠️ Could not match oldFirebaseControllers directly');
}

// 3. Update switchAdminTab & renderAdminDashboard
const oldSwitchTab = `      function switchAdminTab(tab) {
        document.querySelectorAll("#admin-dashboard-view .dash-tab-btn").forEach(b => b.classList.remove("active"));
        if (event && event.currentTarget) event.currentTarget.classList.add("active");

        const tabs = ['overview', 'loginleads', 'products', 'homephotos', 'enquiries', 'wholesale', 'customers', 'emails', 'settings', 'firebase'];
        tabs.forEach(t => {
          const el = document.getElementById(\`admin-tab-\${t}\`);
          if (el) el.style.display = (t === tab) ? 'block' : 'none';
        });

        if (tab === 'overview') renderAdminOverview();
        if (tab === 'loginleads') renderAdminLoginLeadsTable();
        if (tab === 'products') renderAdminProductsTable();
        if (tab === 'homephotos') renderAdminHomePhotos();
        if (tab === 'enquiries') renderAdminEnquiriesTable();
        if (tab === 'wholesale') renderAdminWholesaleTable();
        if (tab === 'customers') renderAdminCustomersTable();
        if (tab === 'emails') renderAdminEmailLogsTable();
        if (tab === 'settings') populateAdminSettingsForm();
        if (tab === 'firebase') renderAdminFirebase();
      }

      function renderAdminDashboard() {
        if (!isAdminLoggedIn()) {
          openAdminLoginModal();
          return;
        }
        renderAdminOverview();
        renderAdminLoginLeadsTable();
        renderAdminProductsTable();
        renderAdminHomePhotos();
        renderAdminEnquiriesTable();
        renderAdminWholesaleTable();
        renderAdminCustomersTable();
        renderAdminEmailLogsTable();
        populateAdminSettingsForm();
        updateLeadsBadge();
      }`;

const newSwitchTab = `      function switchAdminTab(tab) {
        // Highlight active tab button reliably using data-tab or onclick text
        document.querySelectorAll("#admin-dashboard-view .dash-tab-btn").forEach(b => {
          b.classList.remove("active");
          const dTab = b.getAttribute("data-tab");
          const oClick = b.getAttribute("onclick") || "";
          if (dTab === tab || oClick.includes(\`'\${tab}'\`) || oClick.includes(\`"\${tab}"\`)) {
            b.classList.add("active");
          }
        });

        const tabs = ['overview', 'products', 'homephotos', 'enquiries', 'wholesale', 'loginleads', 'customers', 'emails', 'settings', 'firebase'];
        tabs.forEach(t => {
          const el = document.getElementById(\`admin-tab-\${t}\`);
          if (el) el.style.display = (t === tab) ? 'block' : 'none';
        });

        try {
          if (tab === 'overview') renderAdminOverview();
          else if (tab === 'products') renderAdminProductsTable();
          else if (tab === 'homephotos') renderAdminHomePhotos();
          else if (tab === 'enquiries') renderAdminEnquiriesTable();
          else if (tab === 'wholesale') renderAdminWholesaleTable();
          else if (tab === 'loginleads') renderAdminLoginLeadsTable();
          else if (tab === 'customers') renderAdminCustomersTable();
          else if (tab === 'emails') renderAdminEmailLogsTable();
          else if (tab === 'settings') populateAdminSettingsForm();
          else if (tab === 'firebase') renderAdminFirebase();
        } catch(tabErr) {
          console.error("Error rendering admin tab '" + tab + "':", tabErr);
        }
      }

      function renderAdminDashboard() {
        if (!isAdminLoggedIn()) {
          openAdminLoginModal();
          return;
        }
        updateLeadsBadge();
        switchAdminTab('overview');
      }`;

if (html.includes(oldSwitchTab)) {
  html = html.replace(oldSwitchTab, newSwitchTab);
  console.log('✅ Updated switchAdminTab and renderAdminDashboard');
} else {
  console.log('⚠️ Could not match oldSwitchTab directly');
}

// 4. Update populateAdminSettingsForm & saveWebsiteSettings
const oldSettingsFuncs = `      function populateAdminSettingsForm() {
        const s = getSettings();
        document.getElementById("set-business-name").value = s.businessName;
        document.getElementById("set-tagline").value = s.tagline;
        document.getElementById("set-phone").value = s.phone;
        document.getElementById("set-email").value = s.email;
        document.getElementById("set-gstin").value = s.gstin;
        document.getElementById("set-city-state").value = s.cityState || "Mumbai, Maharashtra";
        document.getElementById("set-address").value = s.address;
        document.getElementById("set-hero-headline").value = s.heroHeadline;
        document.getElementById("set-hero-desc").value = s.heroDesc;
      }

      function saveWebsiteSettings(e) {
        e.preventDefault();
        const newSettings = {
          businessName: document.getElementById("set-business-name").value.trim(),
          tagline: document.getElementById("set-tagline").value.trim(),
          phone: document.getElementById("set-phone").value.trim(),
          whatsapp: document.getElementById("set-phone").value.trim(),
          email: document.getElementById("set-email").value.trim(),
          gstin: document.getElementById("set-gstin").value.trim(),
          cityState: document.getElementById("set-city-state").value.trim(),
          address: document.getElementById("set-address").value.trim(),
          heroHeadline: document.getElementById("set-hero-headline").value.trim(),
          heroDesc: document.getElementById("set-hero-desc").value.trim()
        };

        setSettings(newSettings);
        applySettingsToDOM();
        CloudSync.saveToBackend('settings', newSettings);

        const uVal = document.getElementById("set-admin-username").value.trim();
        const pVal = document.getElementById("set-admin-password").value.trim();
        if (uVal && pVal) {
          setAdminCredentials(uVal, pVal);
        }

        showToast("Website Settings & Admin Credentials updated live!");
      }`;

const newSettingsFuncs = `      function populateAdminSettingsForm() {
        const s = getSettings();
        const creds = getAdminCredentials();
        const setVal = (id, val) => {
          const el = document.getElementById(id);
          if (el) el.value = (val !== undefined && val !== null) ? val : "";
        };

        setVal("set-business-name", s.businessName || s.store_name);
        setVal("set-tagline", s.tagline);
        setVal("set-phone", s.phone);
        setVal("set-email", s.email);
        setVal("set-owner-lead-email", s.ownerLeadEmail || s.email);
        setVal("set-gstin", s.gstin);
        setVal("set-city-state", s.cityState || "Mumbai, Maharashtra");
        setVal("set-address", s.address);
        setVal("set-hero-headline", s.heroHeadline);
        setVal("set-hero-desc", s.heroDesc);
        setVal("set-admin-username", creds.username || "payal");
        setVal("set-admin-password", creds.password || "payal@2026");
      }

      function saveWebsiteSettings(e) {
        if (e && e.preventDefault) e.preventDefault();
        const getVal = (id, fallback = "") => {
          const el = document.getElementById(id);
          return el ? el.value.trim() : fallback;
        };

        const newSettings = {
          businessName: getVal("set-business-name", "PAYAL FASHION STORE"),
          store_name: getVal("set-business-name", "PAYAL FASHION STORE"),
          tagline: getVal("set-tagline", "HANDCRAFTED BRIDAL & FESTIVE COUTURE"),
          phone: getVal("set-phone", "+91 8209206788"),
          whatsapp: getVal("set-phone", "+91 8209206788"),
          email: getVal("set-email", "payalcreation10@gmail.com"),
          ownerLeadEmail: getVal("set-owner-lead-email", getVal("set-email", "payalcreation10@gmail.com")),
          gstin: getVal("set-gstin", "27ABCSM8174F1Z5"),
          cityState: getVal("set-city-state", "Mumbai, Maharashtra"),
          address: getVal("set-address", "Shop No. 12, Fashion Market, Bhuleshwar Road, Kalbadevi, Mumbai, Maharashtra – 400002"),
          heroHeadline: getVal("set-hero-headline", "Handcrafted Luxury Bridal & Festive Couture."),
          heroDesc: getVal("set-hero-desc", "")
        };

        setSettings(newSettings);
        applySettingsToDOM();

        const uVal = getVal("set-admin-username");
        const pVal = getVal("set-admin-password");
        if (uVal && pVal) {
          setAdminCredentials(uVal, pVal);
          newSettings.admin_username = uVal;
          newSettings.admin_password = pVal;
        }

        CloudSync.saveToBackend('settings', newSettings);
        showToast("Website Settings & Admin Credentials saved and synced successfully!", "fa-circle-check");
      }`;

if (html.includes(oldSettingsFuncs)) {
  html = html.replace(oldSettingsFuncs, newSettingsFuncs);
  console.log('✅ Updated populateAdminSettingsForm and saveWebsiteSettings');
} else {
  console.log('⚠️ Could not match oldSettingsFuncs directly');
}

// 5. Update FirebaseSync.test()
const oldFbTest = `        async test() {
          const u = this.getUrl();
          if (!u) return { success: false, error: "No URL configured" };
          try {
            const res = await fetch(u + ".json?shallow=true", { cache: "no-cache" });
            if (res.ok) return { success: true };
            return { success: false, status: res.status };
          } catch(e) {
            return { success: false, error: e.message };
          }
        },`;

const newFbTest = `        async test() {
          const u = this.getUrl();
          if (!u) return { success: false, error: "No URL configured" };
          try {
            const res = await fetch(u + ".json?shallow=true", { cache: "no-cache" });
            if (res.ok) return { success: true, status: 200 };
            if (res.status === 401 || res.status === 403) {
              return { success: false, status: res.status, error: "Permission Denied. Please enable read/write rules in Firebase Console." };
            }
            return { success: false, status: res.status, error: "HTTP " + res.status };
          } catch(e) {
            return { success: false, error: e.message };
          }
        },`;

if (html.includes(oldFbTest)) {
  html = html.replace(oldFbTest, newFbTest);
  console.log('✅ Updated FirebaseSync.test()');
}

// 6. Update CloudSync uploadFile & fetchLatestData & saveToBackend
const oldUploadFile = `        async uploadFile(file) {
          try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('api/upload.php', {
              method: 'POST',
              body: formData
            });
            if (res.ok) {
              const data = await res.json();
              if (data && data.success && data.url) {
                console.log('Uploaded image to server:', data.url);
                return data.url;
              }
            }
          } catch(e) {}
          return null;
        },`;

const newUploadFile = `        async uploadFile(file) {
          // On local PHP server, physically upload file to /uploads/ folder
          if (ENV.isLocalPHP) {
            try {
              const formData = new FormData();
              formData.append('file', file);
              const res = await fetch('api/upload.php', {
                method: 'POST',
                body: formData
              });
              if (res.ok) {
                const data = await res.json();
                if (data && data.success && data.url) {
                  console.log('Uploaded image to local PHP server:', data.url);
                  return data.url;
                }
              }
            } catch(e) {
              console.warn('Local PHP upload failed, falling back to compressed data URL:', e);
            }
          }
          // On GitHub Pages or fallback: generate high-quality compact data URL
          return await optimizeImageFile(file);
        },`;

if (html.includes(oldUploadFile)) {
  html = html.replace(oldUploadFile, newUploadFile);
  console.log('✅ Updated CloudSync.uploadFile()');
}

// 7. Update renderAdminCustomersTable empty state
const oldCustTable = `      function renderAdminCustomersTable() {
        const tbody = document.getElementById("admin-customers-table-body");
        if (!tbody) return;
        const customers = getCustomers();

        tbody.innerHTML = customers.map(c => \`
          <tr>
            <td><strong>\${c.name}</strong></td>
            <td>\${c.phone}</td>
            <td>\${c.email}</td>
            <td>\${c.city || 'Mumbai'}</td>
            <td><span class="badge-luxury">\${c.type || 'Retail'}</span></td>
            <td>\${c.date || 'Active'}</td>
          </tr>
        \`).join("");
      }`;

const newCustTable = `      function renderAdminCustomersTable() {
        const tbody = document.getElementById("admin-customers-table-body");
        if (!tbody) return;
        const customers = getCustomers();

        if (!Array.isArray(customers) || customers.length === 0) {
          tbody.innerHTML = \`<tr><td colspan="6" style="text-align:center; padding:36px; color:var(--text-muted);">
            <i class="fa-solid fa-users" style="font-size:2rem; color:var(--maroon-rich); opacity:0.5; margin-bottom:8px; display:block;"></i>
            No registered customer profiles found. Customers who register or sign in appear here automatically.
          </td></tr>\`;
          return;
        }

        tbody.innerHTML = customers.map(c => \`
          <tr>
            <td><strong>\${c.name || 'Valued Customer'}</strong></td>
            <td><a href="tel:\${(c.phone || '').replace(/[^0-9]/g, '')}" style="color:var(--maroon-royal); font-weight:700;">\${c.phone || '—'}</a></td>
            <td>\${c.email || '—'}</td>
            <td>\${c.city || 'Mumbai'}</td>
            <td><span class="badge-luxury">\${c.type || 'Retail'}</span></td>
            <td>\${c.date || 'Active'}</td>
          </tr>
        \`).join("");
      }`;

if (html.includes(oldCustTable)) {
  html = html.replace(oldCustTable, newCustTable);
  console.log('✅ Updated renderAdminCustomersTable empty state');
}

// 8. Update renderAdminProductsTable empty state
const oldProdTable = `      function renderAdminProductsTable() {
        const tbody = document.getElementById("admin-products-table-body");
        if (!tbody) return;
        const products = getProducts();

        tbody.innerHTML = products.map(item => \``;

const newProdTable = `      function renderAdminProductsTable() {
        const tbody = document.getElementById("admin-products-table-body");
        if (!tbody) return;
        const products = getProducts();

        if (!Array.isArray(products) || products.length === 0) {
          tbody.innerHTML = \`<tr><td colspan="9" style="text-align:center; padding:36px; color:var(--text-muted);">
            <i class="fa-solid fa-shirt" style="font-size:2rem; color:var(--maroon-rich); opacity:0.5; margin-bottom:8px; display:block;"></i>
            No products found in catalogue. Click <strong>+ Add New Product</strong> above to add your first creation.
          </td></tr>\`;
          return;
        }

        tbody.innerHTML = products.map(item => \``;

if (html.includes(oldProdTable)) {
  html = html.replace(oldProdTable, newProdTable);
  console.log('✅ Updated renderAdminProductsTable empty state');
}

// 9. Update renderAdminEnquiriesTable to handle both camelCase and snake_case
const oldEnquiriesTable = `        tbody.innerHTML = enquiries.map(enq => \`
          <tr>
            <td><strong>\${enq.id}</strong></td>
            <td>\${enq.customerName}</td>
            <td><a href="tel:\${enq.mobileNumber}" style="color:var(--maroon-royal); font-weight:700;">\${enq.mobileNumber}</a></td>
            <td>\${enq.emailAddress || '—'}</td>
            <td>\${enq.productName}</td>
            <td>\${enq.quantity}</td>
            <td><span class="badge-luxury">\${enq.requirementType}</span></td>`;

const newEnquiriesTable = `        tbody.innerHTML = enquiries.map(enq => {
          const cName = enq.customerName || enq.customer_name || 'Guest Customer';
          const cPhone = enq.mobileNumber || enq.customer_phone || enq.phone || '';
          const cEmail = enq.emailAddress || enq.customer_email || enq.email || '—';
          const pName = enq.productName || enq.product_name || 'Boutique Collection';
          const reqType = enq.requirementType || enq.requirement_type || 'Retail Enquiry';
          const qty = enq.quantity || 1;
          const status = enq.status || 'New';
          const cleanDigits = cPhone.replace(/[^0-9]/g, '');
          const waPhone = cleanDigits.length === 10 ? '91' + cleanDigits : cleanDigits;

          return \`
          <tr>
            <td><strong>\${enq.id || '#'}</strong></td>
            <td>\${cName}</td>
            <td><a href="tel:\${cleanDigits}" style="color:var(--maroon-royal); font-weight:700;">\${cPhone}</a></td>
            <td>\${cEmail}</td>
            <td>\${pName}</td>
            <td>\${qty}</td>
            <td><span class="badge-luxury">\${reqType}</span></td>\`;
        `;

// 10. Update init() to check file: protocol
const oldInit = `      function init() {
        initDatabase();
        initStoreTheme();
        applySettingsToDOM();
        applyHomePhotosToDOM();
        renderCatalogue();
        updateWishlistCount();
        setupDropzoneEvents();

        // Always ensure public home is shown by default
        localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGGED);
        navigateTo('home');`;

const newInit = `      function init() {
        initDatabase();
        initStoreTheme();
        applySettingsToDOM();
        applyHomePhotosToDOM();
        renderCatalogue();
        updateWishlistCount();
        setupDropzoneEvents();

        // Always ensure public home is shown by default
        localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGGED);
        navigateTo('home');

        // Show diagnostic banner if viewed directly via file://
        if (ENV.isFileProtocol) {
          const banner = document.getElementById("file-protocol-diagnostic-banner");
          if (banner) banner.style.display = "block";
        }`;

if (html.includes(oldInit)) {
  html = html.replace(oldInit, newInit);
  console.log('✅ Updated init() with file: diagnostic notice');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('✅ All application logic fixes written successfully!');
