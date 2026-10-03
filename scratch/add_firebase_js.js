const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Create the FirebaseSync helper and integrate it inside CloudSync
const oldCloudSyncMarker = `      // ==========================================
      // CLOUDSYNC & REST API ENGINE (XAMPP PHP + MYSQL + GITHUB)
      // ==========================================
      const CloudSync = {`;

const newCloudSyncCode = `      // ==========================================
      // FIREBASE REALTIME CLOUD SYNC ENGINE (FOR GITHUB PAGES)
      // ==========================================
      const FirebaseSync = {
        getUrl() {
          let u = localStorage.getItem("pmh_firebase_url") || "";
          if (u && !u.endsWith("/")) u += "/";
          return u;
        },
        setUrl(url) {
          let u = (url || "").trim();
          if (u && !u.endsWith("/")) u += "/";
          localStorage.setItem("pmh_firebase_url", u);
          return u;
        },
        async test() {
          const u = this.getUrl();
          if (!u) return { success: false, error: "No URL configured" };
          try {
            const res = await fetch(u + ".json?shallow=true", { cache: "no-cache" });
            if (res.ok) return { success: true };
            return { success: false, status: res.status };
          } catch(e) {
            return { success: false, error: e.message };
          }
        },
        async get(path) {
          const u = this.getUrl();
          if (!u) return null;
          try {
            const res = await fetch(\`\${u}\${path}.json?_t=\${Date.now()}\`, { cache: "no-cache" });
            if (res.ok) return await res.json();
          } catch(e) {}
          return null;
        },
        async put(path, data) {
          const u = this.getUrl();
          if (!u) return false;
          try {
            const res = await fetch(\`\${u}\${path}.json\`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data)
            });
            return res.ok;
          } catch(e) {}
          return false;
        },
        async post(path, data) {
          const u = this.getUrl();
          if (!u) return false;
          try {
            const res = await fetch(\`\${u}\${path}.json\`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data)
            });
            return res.ok;
          } catch(e) {}
          return false;
        }
      };

      // ==========================================
      // CLOUDSYNC & REST API ENGINE (XAMPP PHP + MYSQL + GITHUB + FIREBASE)
      // ==========================================
      const CloudSync = {
        Firebase: FirebaseSync,`;

if (html.includes(oldCloudSyncMarker)) {
  html = html.replace(oldCloudSyncMarker, newCloudSyncCode);
  console.log('✅ FirebaseSync engine attached to CloudSync');
} else {
  console.log('⚠️ Could not match oldCloudSyncMarker');
}

// 2. Update CloudSync.fetchLatestData to query Firebase first if configured
const oldFetchProductsStart = `          // 1. Fetch products from PHP REST API or data folder
          try {
            let remoteProducts = null;`;

const newFetchProductsStart = `          // 1. Fetch products (Firebase Cloud Priority for GitHub Pages)
          try {
            let remoteProducts = null;
            if (FirebaseSync.getUrl()) {
              const fbProds = await FirebaseSync.get("products");
              if (Array.isArray(fbProds) && fbProds.length > 0) {
                remoteProducts = fbProds;
                console.log("Products synced from Firebase Realtime Cloud");
              }
            }`;

if (html.includes(oldFetchProductsStart)) {
  html = html.replace(oldFetchProductsStart, newFetchProductsStart);
  console.log('✅ Updated fetchLatestData products to check Firebase first');
} else {
  console.log('⚠️ Could not match oldFetchProductsStart');
}

// 3. Update CloudSync.fetchLatestData home_photos to query Firebase first if configured
const oldFetchPhotosStart = `          // 2. Fetch home photos from PHP REST API or data folder
          try {
            let remotePhotos = null;`;

const newFetchPhotosStart = `          // 2. Fetch home photos (Firebase Cloud Priority for GitHub Pages)
          try {
            let remotePhotos = null;
            if (FirebaseSync.getUrl()) {
              const fbPhotos = await FirebaseSync.get("home_photos");
              if (fbPhotos && typeof fbPhotos === "object" && Object.keys(fbPhotos).length > 0) {
                remotePhotos = fbPhotos;
                console.log("Homepage photos synced from Firebase Realtime Cloud");
              }
            }`;

if (html.includes(oldFetchPhotosStart)) {
  html = html.replace(oldFetchPhotosStart, newFetchPhotosStart);
  console.log('✅ Updated fetchLatestData home_photos to check Firebase first');
} else {
  console.log('⚠️ Could not match oldFetchPhotosStart');
}

// 4. Update CloudSync.saveToBackend to write to Firebase in real-time
const oldSaveToBackendStart = `        async saveToBackend(type, payload) {
          // 1. Send to appropriate PHP REST endpoint
          try {`;

const newSaveToBackendStart = `        async saveToBackend(type, payload) {
          // 1. Instant Realtime Push to Firebase Cloud (For GitHub Pages Live Users)
          if (FirebaseSync.getUrl()) {
            try {
              if (type === "products") {
                await FirebaseSync.put("products", payload);
                console.log("Pushed products live to Firebase Cloud");
              } else if (type === "home_photos") {
                await FirebaseSync.put("home_photos", payload);
                console.log("Pushed home_photos live to Firebase Cloud");
              } else if (type === "settings") {
                await FirebaseSync.put("settings", payload);
              } else if (type === "enquiry") {
                await FirebaseSync.post("enquiries", payload);
              } else if (type === "wholesale") {
                await FirebaseSync.post("wholesale", payload);
              }
            } catch(fbErr) {
              console.warn("Firebase sync error:", fbErr);
            }
          }

          // 2. Send to appropriate PHP REST endpoint (if local XAMPP running)
          try {`;

if (html.includes(oldSaveToBackendStart)) {
  html = html.replace(oldSaveToBackendStart, newSaveToBackendStart);
  console.log('✅ Updated saveToBackend to push to Firebase in real-time');
} else {
  console.log('⚠️ Could not match oldSaveToBackendStart');
}

// 5. Add UI helper methods for Firebase Tab
const firebaseMethods = `
      // ==========================================
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
      }
`;

// Insert the methods right before App return block
const appReturnMarker = `        return {`;
if (html.includes(appReturnMarker)) {
  html = html.replace(appReturnMarker, firebaseMethods + '\n        return {');
  console.log('✅ Added Firebase controller methods');
} else {
  console.log('⚠️ Could not match appReturnMarker');
}

// 6. Export methods on App
const oldAppExports = `        importProductsBackup: importProductsBackup
      };`;

const newAppExports = `        importProductsBackup: importProductsBackup,
        renderAdminFirebase: renderAdminFirebase,
        saveFirebaseConfig: saveFirebaseConfig,
        testFirebaseConnection: testFirebaseConnection,
        pushAllToFirebase: pushAllToFirebase,
        FirebaseSync: FirebaseSync
      };`;

if (html.includes(oldAppExports)) {
  html = html.replace(oldAppExports, newAppExports);
  console.log('✅ Exported Firebase methods on App');
} else {
  console.log('⚠️ Could not match oldAppExports');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Step 2 complete: All Firebase JavaScript integrated into index.html');
