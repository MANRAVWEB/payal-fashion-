const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Add Firebase Tab Button in dashboard-nav-tabs
const oldNavTabs = `<button class="dash-tab-btn" onclick="App.switchAdminTab('settings')"><i class="fa-solid fa-gear"></i> Website Settings</button>
        </div>`;

const newNavTabs = `<button class="dash-tab-btn" onclick="App.switchAdminTab('settings')"><i class="fa-solid fa-gear"></i> Website Settings</button>
          <button class="dash-tab-btn" onclick="App.switchAdminTab('firebase')"><i class="fa-solid fa-fire" style="color:#FFA000;"></i> Firebase Cloud Sync</button>
        </div>`;

if (html.includes(oldNavTabs)) {
  html = html.replace(oldNavTabs, newNavTabs);
  console.log('✅ Added Firebase tab button to admin nav');
} else {
  console.log('⚠️ Could not match oldNavTabs');
}

// 2. Add #admin-tab-firebase view container right after #admin-tab-settings
const oldSettingsEnd = `              <button type="submit" class="btn btn-maroon"><i class="fa-solid fa-floppy-disk"></i> Save & Apply Settings</button>
            </form>
          </div>`;

const firebaseTabHtml = `              <button type="submit" class="btn btn-maroon"><i class="fa-solid fa-floppy-disk"></i> Save & Apply Settings</button>
            </form>
          </div>

          <!-- 8. FIREBASE REALTIME CLOUD SYNC TAB (FOR GITHUB PAGES) -->
          <div id="admin-tab-firebase" style="display:none;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px; border-bottom:1px solid rgba(0,0,0,0.06); padding-bottom:14px;">
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:1.6rem; color:#FFA000;"><i class="fa-solid fa-fire"></i></span>
                  <h3 style="font-family:var(--font-serif); color:var(--maroon-deep); margin:0;">Google Firebase Cloud Realtime Sync</h3>
                </div>
                <p style="font-size:0.82rem; color:var(--text-muted); margin-top:4px;">
                  <strong>100% Free Cloud Database for GitHub Pages!</strong> Is feature se jab aap photo ya product change karoge, toh bina kisi build ya commit ke, <strong>turant 1 second me duniya bhar ke sabhi customers ke phone me live update ho jayega!</strong>
                </p>
              </div>
              <div id="firebase-status-badge" style="display:inline-flex; align-items:center; gap:6px; background:#FAF2EF; border:1px solid var(--maroon-royal); padding:6px 14px; border-radius:20px; font-size:0.8rem; font-weight:700; color:var(--maroon-royal);">
                <i class="fa-solid fa-circle-notch fa-spin"></i> Checking Connection...
              </div>
            </div>

            <!-- Firebase Setup Form -->
            <div style="background:#FFF9F0; border:1.5px solid var(--gold-border-solid); border-radius:12px; padding:20px; margin-bottom:24px;">
              <h4 style="font-size:0.95rem; color:var(--maroon-deep); margin-bottom:8px; display:flex; align-items:center; gap:8px;">
                <i class="fa-solid fa-link" style="color:var(--gold-dark);"></i> Firebase Realtime Database URL
              </h4>
              <p style="font-size:0.78rem; color:var(--text-muted); margin-bottom:14px; line-height:1.4;">
                Apne Google Firebase Console se <strong>Realtime Database URL</strong> yahan paste karein (e.g. <code>https://your-project-default-rtdb.firebaseio.com/</code>).
              </p>
              <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:12px;">
                <input type="text" class="form-control" id="firebase-url-input" placeholder="https://your-project-default-rtdb.firebaseio.com/" style="flex:1; min-width:280px;" />
                <button type="button" class="btn btn-gold" style="font-weight:700;" onclick="App.saveFirebaseConfig()">
                  <i class="fa-solid fa-floppy-disk"></i> SAVE &amp; CONNECT
                </button>
                <button type="button" class="btn btn-outline-maroon" onclick="App.testFirebaseConnection()">
                  <i class="fa-solid fa-satellite-dish"></i> TEST CONNECTION
                </button>
              </div>
            </div>

            <!-- One-Click Seed to Cloud -->
            <div style="background:#FAF7F4; border:1px solid var(--gold-border); border-radius:12px; padding:20px; margin-bottom:24px;">
              <h4 style="font-size:0.95rem; color:var(--maroon-deep); margin-bottom:8px; display:flex; align-items:center; gap:8px;">
                <i class="fa-solid fa-cloud-arrow-up" style="color:var(--maroon-royal);"></i> 1-Click Upload All Catalogue &amp; Photos to Firebase
              </h4>
              <p style="font-size:0.78rem; color:var(--text-muted); margin-bottom:14px; line-height:1.4;">
                Pehli baar jab aap Firebase connect karein, toh yeh button dabayein taaki aapke sabhi 8 products aur 11 homepage photos seedhe Google Cloud me upload ho jayein aur sabhi customers ko turant dikhne lagein.
              </p>
              <button type="button" class="btn btn-maroon" style="font-weight:700;" onclick="App.pushAllToFirebase()">
                <i class="fa-solid fa-cloud-arrow-up"></i> UPLOAD ALL PRODUCTS &amp; PHOTOS TO CLOUD NOW
              </button>
            </div>

            <!-- 2-Minute Quick Guide -->
            <div style="background:#FFF; border:1px solid rgba(0,0,0,0.08); border-radius:12px; padding:20px;">
              <h4 style="font-size:0.92rem; color:var(--maroon-deep); margin-bottom:12px; display:flex; align-items:center; gap:8px;">
                <i class="fa-solid fa-circle-question" style="color:var(--gold-dark);"></i> 2-Minute Step-by-Step Guide: Firebase Kaise Banayein (100% Free)
              </h4>
              <ol style="font-size:0.8rem; color:var(--text-dark); line-height:1.7; padding-left:20px; margin:0;">
                <li>Google me <a href="https://console.firebase.google.com" target="_blank" style="color:var(--maroon-royal); font-weight:700; text-decoration:underline;">console.firebase.google.com</a> kholein aur apne Gmail account se sign-in karein.</li>
                <li><strong>"Add Project"</strong> dabayein &rarr; Project ka naam rakhein (e.g. <code>payal-fashion</code>) &rarr; Continue dabayein.</li>
                <li>Left menu me <strong>"Build" &rarr; "Realtime Database"</strong> par click karein &rarr; <strong>"Create Database"</strong> dabayein.</li>
                <li>Location me default (United States) choose karein &rarr; Security rules me <strong>"Start in test mode"</strong> select karke Enable dabayein.</li>
                <li>Database create hote hi top par aapko ek URL dikhega (jaise <code>https://payal-fashion-default-rtdb.firebaseio.com/</code>) &rarr; Use copy karke upar box me paste karein aur <strong>SAVE &amp; CONNECT</strong> dabayein!</li>
              </ol>
            </div>
          </div>`;

if (html.includes(oldSettingsEnd)) {
  html = html.replace(oldSettingsEnd, firebaseTabHtml);
  console.log('✅ Added Firebase tab view container');
} else {
  console.log('⚠️ Could not match oldSettingsEnd');
}

// 3. Update switchAdminTab in JavaScript to include 'firebase'
html = html.replace(
  "const tabs = ['overview', 'loginleads', 'products', 'homephotos', 'enquiries', 'wholesale', 'customers', 'emails', 'settings'];",
  "const tabs = ['overview', 'loginleads', 'products', 'homephotos', 'enquiries', 'wholesale', 'customers', 'emails', 'settings', 'firebase'];"
);

// 4. Add renderAdminFirebase call in switchAdminTab
const oldSwitchTabs = `if (tab === 'settings') populateAdminSettingsForm();`;
const newSwitchTabs = `if (tab === 'settings') populateAdminSettingsForm();
        if (tab === 'firebase') renderAdminFirebase();`;

if (html.includes(oldSwitchTabs)) {
  html = html.replace(oldSwitchTabs, newSwitchTabs);
  console.log('✅ Updated switchAdminTab logic');
} else {
  console.log('⚠️ Could not match oldSwitchTabs');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Step 1 complete: UI and tab routing added');
