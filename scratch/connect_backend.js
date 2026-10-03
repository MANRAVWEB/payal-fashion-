const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Update handleProductFiles to upload real file first
const oldHandleFiles = `      async function handleProductFiles(files) {
        if (!files || files.length === 0) return;
        showToast(\`Reading \${files.length} photo(s)...\`);

        let count = 0;
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          try {
            const dataUrl = await optimizeImageFile(file);
            if (dataUrl) {
              activeProductPhotos.push(dataUrl);
              count++;
            }
          } catch(err) {
            console.error("Image processing error:", err);
          }
        }`;

const newHandleFiles = `      async function handleProductFiles(files) {
        if (!files || files.length === 0) return;
        showToast(\`Uploading \${files.length} photo(s)...\`, "fa-cloud-arrow-up");

        let count = 0;
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          try {
            let uploadedUrl = null;
            if (typeof CloudSync !== 'undefined' && CloudSync.uploadFile) {
              uploadedUrl = await CloudSync.uploadFile(file);
            }
            if (uploadedUrl) {
              activeProductPhotos.push(uploadedUrl);
              count++;
            } else {
              const dataUrl = await optimizeImageFile(file);
              if (dataUrl) {
                activeProductPhotos.push(dataUrl);
                count++;
              }
            }
          } catch(err) {
            console.error("Image processing error:", err);
          }
        }`;

if (html.includes(oldHandleFiles)) {
  html = html.replace(oldHandleFiles, newHandleFiles);
  console.log('✅ handleProductFiles updated');
} else {
  console.log('⚠️ Could not match oldHandleFiles');
}

// 2. Update handleHomePhotoUpload to upload real file first
const oldHomePhotoUpload = `      async function handleHomePhotoUpload(key, files) {
        if (!files || !files[0]) return;
        const file = files[0];
        showToast("Compressing and updating photo...", "fa-image");
        try {
          const dataUrl = await optimizeImageFile(file);
          if (dataUrl) {
            const photos = getHomePhotos();
            photos[key] = dataUrl;
            setHomePhotos(photos);
            applyHomePhotosToDOM();
            renderAdminHomePhotos();
            showToast("Homepage photo updated live!", "fa-circle-check");
          }
        } catch(e) {
          console.error("Photo upload error:", e);
          showToast("Failed to process photo.", "fa-triangle-exclamation");
        }
        const input = document.getElementById(\`hp-file-\${key}\`);
        if (input) input.value = "";
      }`;

const newHomePhotoUpload = `      async function handleHomePhotoUpload(key, files) {
        if (!files || !files[0]) return;
        const file = files[0];
        showToast("Uploading and updating photo live...", "fa-cloud-arrow-up");
        try {
          let targetUrl = null;
          if (typeof CloudSync !== 'undefined' && CloudSync.uploadFile) {
            targetUrl = await CloudSync.uploadFile(file);
          }
          if (!targetUrl) {
            targetUrl = await optimizeImageFile(file);
          }
          if (targetUrl) {
            const photos = getHomePhotos();
            photos[key] = targetUrl;
            setHomePhotos(photos);
            applyHomePhotosToDOM();
            renderAdminHomePhotos();
            showToast("Homepage photo updated live across all devices!", "fa-circle-check");
          }
        } catch(e) {
          console.error("Photo upload error:", e);
          showToast("Failed to process photo.", "fa-triangle-exclamation");
        }
        const input = document.getElementById(\`hp-file-\${key}\`);
        if (input) input.value = "";
      }`;

if (html.includes(oldHomePhotoUpload)) {
  html = html.replace(oldHomePhotoUpload, newHomePhotoUpload);
  console.log('✅ handleHomePhotoUpload updated');
} else {
  console.log('⚠️ Could not match oldHomePhotoUpload');
}

// 3. Update CloudSync object to connect full REST API
const oldCloudSyncMarker = `      // ==========================================
      // CLOUDSYNC ENGINE (LIVE CROSS-DEVICE SYNC)
      // ==========================================
      const CloudSync = {`;

const newCloudSyncBody = `      // ==========================================
      // CLOUDSYNC & REST API ENGINE (XAMPP PHP + MYSQL + GITHUB)
      // ==========================================
      const CloudSync = {
        async uploadFile(file) {
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
        },

        async fetchLatestData() {
          // 1. Fetch products from PHP REST API or data folder
          try {
            let remoteProducts = null;
            const apiRes = await fetch('api/products.php?_t=' + Date.now(), { cache: 'no-cache' }).catch(() => null);
            if (apiRes && apiRes.ok) {
              const apiData = await apiRes.json().catch(() => null);
              if (apiData && apiData.success && Array.isArray(apiData.products) && apiData.products.length > 0) {
                remoteProducts = apiData.products;
              }
            }
            if (!remoteProducts) {
              const jsonRes = await fetch('data/products.json?_t=' + Date.now(), { cache: 'no-cache' }).catch(() => null);
              if (jsonRes && jsonRes.ok) {
                const jsonData = await jsonRes.json().catch(() => null);
                if (Array.isArray(jsonData) && jsonData.length > 0) remoteProducts = jsonData;
              }
            }
            if (remoteProducts && Array.isArray(remoteProducts) && remoteProducts.length > 0) {
              const localProds = getProducts();
              if (JSON.stringify(remoteProducts) !== JSON.stringify(localProds)) {
                setProducts(remoteProducts);
                renderCatalogue();
                if (isAdminLoggedIn()) renderAdminProductsTable();
                console.log('Catalogue synced with live backend/cloud');
              }
            }
          } catch(e) {}

          // 2. Fetch home photos from PHP REST API or data folder
          try {
            let remotePhotos = null;
            const apiRes = await fetch('api/home_photos.php?_t=' + Date.now(), { cache: 'no-cache' }).catch(() => null);
            if (apiRes && apiRes.ok) {
              const apiData = await apiRes.json().catch(() => null);
              if (apiData && apiData.success && apiData.photos) {
                remotePhotos = apiData.photos;
              }
            }
            if (!remotePhotos) {
              const jsonRes = await fetch('data/home_photos.json?_t=' + Date.now(), { cache: 'no-cache' }).catch(() => null);
              if (jsonRes && jsonRes.ok) {
                remotePhotos = await jsonRes.json().catch(() => null);
              }
            }
            if (remotePhotos && typeof remotePhotos === 'object' && Object.keys(remotePhotos).length > 0) {
              const localPhotos = getHomePhotos();
              if (JSON.stringify(remotePhotos) !== JSON.stringify(localPhotos)) {
                setHomePhotos(remotePhotos);
                applyHomePhotosToDOM();
                if (isAdminLoggedIn()) renderAdminHomePhotos();
                console.log('Homepage photos synced with live backend/cloud');
              }
            }
          } catch(e) {}

          // 3. Fetch website settings from PHP API
          try {
            const setRes = await fetch('api/settings.php?_t=' + Date.now(), { cache: 'no-cache' }).catch(() => null);
            if (setRes && setRes.ok) {
              const setData = await setRes.json().catch(() => null);
              if (setData && setData.success && setData.settings) {
                const localSet = getSettings();
                const merged = Object.assign({}, localSet, setData.settings);
                setSettings(merged);
                applySettingsToDOM();
              }
            }
          } catch(e) {}
        },

        async saveToBackend(type, payload) {
          // 1. Send to appropriate PHP REST endpoint
          try {
            let endpoint = 'api/save_data.php';
            let reqBody = JSON.stringify({ type: type, payload: payload });

            if (type === 'products') {
              endpoint = 'api/save_data.php';
            } else if (type === 'home_photos') {
              endpoint = 'api/home_photos.php';
              reqBody = JSON.stringify({ photos: payload });
            } else if (type === 'settings') {
              endpoint = 'api/settings.php';
              reqBody = JSON.stringify(payload);
            } else if (type === 'enquiry') {
              endpoint = 'api/enquiries.php';
              reqBody = JSON.stringify(payload);
            } else if (type === 'wholesale') {
              endpoint = 'api/wholesale.php';
              reqBody = JSON.stringify(payload);
            }

            const res = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: reqBody
            });
            if (res.ok) {
              console.log('Successfully saved to REST backend endpoint:', endpoint);
              return true;
            }
          } catch(e) {}

          // 2. Try GitHub API if configured
          const token = localStorage.getItem("pmh_gh_token");
          const repo = localStorage.getItem("pmh_gh_repo");
          if (token && repo && (type === 'products' || type === 'home_photos')) {
            const fileName = (type === 'products') ? 'data/products.json' : 'data/home_photos.json';
            try {
              await CloudSync.commitFileToGitHub(repo, token, fileName, JSON.stringify(payload, null, 2));
              showToast("Changes synced to Live GitHub automatically!", "fa-cloud-arrow-up");
              return true;
            } catch(ghErr) {
              console.warn("Auto GitHub commit error:", ghErr);
            }
          }
          return false;
        },`;

// Find where CloudSync begins and ends up to commitFileToGitHub
const cloudSyncStart = html.indexOf('const CloudSync = {');
const commitFileStart = html.indexOf('async commitFileToGitHub(repo, token, filePath, contentString) {');

if (cloudSyncStart !== -1 && commitFileStart !== -1) {
  const before = html.slice(0, cloudSyncStart);
  const after = html.slice(commitFileStart);
  html = before + newCloudSyncBody + '\n        ' + after;
  console.log('✅ CloudSync object updated with REST API endpoints');
} else {
  console.log('⚠️ Could not locate CloudSync markers');
}

// 4. Hook enquiries and wholesale submit to CloudSync
if (html.includes('setEnquiries(enquiries);') && !html.includes("CloudSync.saveToBackend('enquiry'")) {
  html = html.replace('setEnquiries(enquiries);', "setEnquiries(enquiries);\n        CloudSync.saveToBackend('enquiry', newEnquiry);");
  console.log('✅ Hooked enquiry submit to backend');
}

if (html.includes('setWholesaleLeads(leads);') && !html.includes("CloudSync.saveToBackend('wholesale'")) {
  html = html.replace('setWholesaleLeads(leads);', "setWholesaleLeads(leads);\n        CloudSync.saveToBackend('wholesale', lead);");
  console.log('✅ Hooked wholesale submit to backend');
}

if (html.includes('applySettingsToDOM();') && !html.includes("CloudSync.saveToBackend('settings'")) {
  html = html.replace('applySettingsToDOM();\n\n        const uVal', "applySettingsToDOM();\n        CloudSync.saveToBackend('settings', newSettings);\n\n        const uVal");
  console.log('✅ Hooked settings submit to backend');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('All updates written to index.html successfully!');
