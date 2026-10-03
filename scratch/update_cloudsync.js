const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Replace fetchLatestData and saveToBackend with environment-aware implementations
const oldCloudSyncMethods = `        async fetchLatestData() {
          // 1. Fetch products (Firebase Cloud Priority for GitHub Pages)
          try {
            let remoteProducts = null;
            if (FirebaseSync.getUrl()) {
              const fbProds = await FirebaseSync.get("products");
              if (Array.isArray(fbProds) && fbProds.length > 0) {
                remoteProducts = fbProds;
                console.log("Products synced from Firebase Realtime Cloud");
              }
            }
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
                setProducts(remoteProducts, true);
                renderCatalogue();
                if (isAdminLoggedIn()) renderAdminProductsTable();
                console.log('Catalogue synced with live backend/cloud');
              }
            }
          } catch(e) {}

          // 2. Fetch home photos (Firebase Cloud Priority for GitHub Pages)
          try {
            let remotePhotos = null;
            if (FirebaseSync.getUrl()) {
              const fbPhotos = await FirebaseSync.get("home_photos");
              if (fbPhotos && typeof fbPhotos === "object" && Object.keys(fbPhotos).length > 0) {
                remotePhotos = fbPhotos;
                console.log("Homepage photos synced from Firebase Realtime Cloud");
              }
            }
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
              const normalized = {};
              for (const [k, v] of Object.entries(remotePhotos)) {
                normalized[k] = (v && typeof v === 'object' && v.url) ? v.url : String(v);
              }
              const localPhotos = getHomePhotos();
              if (JSON.stringify(normalized) !== JSON.stringify(localPhotos)) {
                setHomePhotos(normalized, true);
                applyHomePhotosToDOM();
                if (isAdminLoggedIn()) renderAdminHomePhotos();
                console.log('Homepage photos synced with live backend/cloud');
              }
            }
          } catch(e) {}

          // 3. Fetch website settings (Firebase Cloud Priority + Local Fallback)
          try {
            if (FirebaseSync.getUrl()) {
              const fbSettings = await FirebaseSync.get("settings");
              if (fbSettings && typeof fbSettings === "object" && Object.keys(fbSettings).length > 0) {
                const localSet = getSettings();
                const merged = Object.assign({}, localSet, fbSettings);
                setSettings(merged);
                applySettingsToDOM();
              }
            }
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
          } catch(e) {}`;

const newCloudSyncMethods = `        async fetchLatestData() {
          // 1. Fetch products (Firebase Cloud Priority + Local PHP backend)
          try {
            let remoteProducts = null;
            if (FirebaseSync.getUrl()) {
              const fbProds = await FirebaseSync.get("products");
              if (Array.isArray(fbProds) && fbProds.length > 0) {
                remoteProducts = fbProds;
                console.log("Products synced from Firebase Realtime Cloud");
              }
            }

            // Only call PHP API when running in a local PHP server environment
            if (!remoteProducts && ENV.isLocalPHP) {
              const apiRes = await fetch('api/products.php?_t=' + Date.now(), { cache: 'no-cache' }).catch(() => null);
              if (apiRes && apiRes.ok) {
                const apiData = await apiRes.json().catch(() => null);
                if (apiData && apiData.success && Array.isArray(apiData.products) && apiData.products.length > 0) {
                  remoteProducts = apiData.products;
                }
              }
            }

            if (!remoteProducts && (ENV.isLocalPHP || !FirebaseSync.getUrl())) {
              const jsonRes = await fetch('data/products.json?_t=' + Date.now(), { cache: 'no-cache' }).catch(() => null);
              if (jsonRes && jsonRes.ok) {
                const jsonData = await jsonRes.json().catch(() => null);
                if (Array.isArray(jsonData) && jsonData.length > 0) remoteProducts = jsonData;
              }
            }

            if (remoteProducts && Array.isArray(remoteProducts) && remoteProducts.length > 0) {
              const localProds = getProducts();
              if (JSON.stringify(remoteProducts) !== JSON.stringify(localProds)) {
                setProducts(remoteProducts, true);
                renderCatalogue();
                if (isAdminLoggedIn()) renderAdminProductsTable();
                console.log('Catalogue synced with live backend/cloud');
              }
            }
          } catch(e) {
            console.warn("Product sync notice:", e);
          }

          // 2. Fetch home photos (Firebase Cloud Priority + Local PHP backend)
          try {
            let remotePhotos = null;
            if (FirebaseSync.getUrl()) {
              const fbPhotos = await FirebaseSync.get("home_photos");
              if (fbPhotos && typeof fbPhotos === "object" && Object.keys(fbPhotos).length > 0) {
                remotePhotos = fbPhotos;
                console.log("Homepage photos synced from Firebase Realtime Cloud");
              }
            }

            // Only call PHP API when running in local PHP environment
            if (!remotePhotos && ENV.isLocalPHP) {
              const apiRes = await fetch('api/home_photos.php?_t=' + Date.now(), { cache: 'no-cache' }).catch(() => null);
              if (apiRes && apiRes.ok) {
                const apiData = await apiRes.json().catch(() => null);
                if (apiData && apiData.success && apiData.photos) {
                  remotePhotos = apiData.photos;
                }
              }
            }

            if (!remotePhotos && (ENV.isLocalPHP || !FirebaseSync.getUrl())) {
              const jsonRes = await fetch('data/home_photos.json?_t=' + Date.now(), { cache: 'no-cache' }).catch(() => null);
              if (jsonRes && jsonRes.ok) {
                remotePhotos = await jsonRes.json().catch(() => null);
              }
            }

            if (remotePhotos && typeof remotePhotos === 'object' && Object.keys(remotePhotos).length > 0) {
              const normalized = {};
              for (const [k, v] of Object.entries(remotePhotos)) {
                normalized[k] = (v && typeof v === 'object' && v.url) ? v.url : String(v);
              }
              const localPhotos = getHomePhotos();
              if (JSON.stringify(normalized) !== JSON.stringify(localPhotos)) {
                setHomePhotos(normalized, true);
                applyHomePhotosToDOM();
                if (isAdminLoggedIn()) renderAdminHomePhotos();
                console.log('Homepage photos synced with live backend/cloud');
              }
            }
          } catch(e) {
            console.warn("Home photos sync notice:", e);
          }

          // 3. Fetch website settings (Firebase Cloud Priority + Local PHP backend)
          try {
            if (FirebaseSync.getUrl()) {
              const fbSettings = await FirebaseSync.get("settings");
              if (fbSettings && typeof fbSettings === "object" && Object.keys(fbSettings).length > 0) {
                const localSet = getSettings();
                const merged = Object.assign({}, localSet, fbSettings);
                setSettings(merged, true);
                applySettingsToDOM();
              }
            }

            // Only call PHP API when in local PHP environment
            if (ENV.isLocalPHP) {
              const setRes = await fetch('api/settings.php?_t=' + Date.now(), { cache: 'no-cache' }).catch(() => null);
              if (setRes && setRes.ok) {
                const setData = await setRes.json().catch(() => null);
                if (setData && setData.success && setData.settings) {
                  const localSet = getSettings();
                  const merged = Object.assign({}, localSet, setData.settings);
                  setSettings(merged, true);
                  applySettingsToDOM();
                }
              }
            }
          } catch(e) {
            console.warn("Settings sync notice:", e);
          }
        },

        async saveToBackend(type, payload) {
          // 1. Instant Realtime Push to Firebase Cloud (Active in all environments)
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
              console.warn("Firebase sync notice:", fbErr);
            }
          }

          // 2. Send to PHP REST endpoint ONLY IF in local PHP environment (Skip on GitHub Pages & file://)
          if (ENV.isLocalPHP) {
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
                console.log('Successfully saved to PHP REST backend:', endpoint);
                return true;
              }
            } catch(e) {
              console.warn("Local PHP save notice:", e);
            }
          }`;

if (html.includes(oldCloudSyncMethods)) {
  html = html.replace(oldCloudSyncMethods, newCloudSyncMethods);
  console.log('✅ Updated CloudSync fetchLatestData and saveToBackend with ENV guards');
} else {
  console.log('⚠️ Could not match oldCloudSyncMethods');
}

fs.writeFileSync('index.html', html, 'utf8');
