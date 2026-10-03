const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Meta tags
content = content.replace(
  /<meta name="description" content="Payal Fashion Store - Luxury bridal lehenga choli[\s\S]*?All India Delivery\." \/>/,
  '<meta name="description" content="Payal Fashion Store - Luxury bridal lehenga choli, designer party wear lehengas, pure silk sarees and festive couture. Handcrafted elegance, bespoke fittings, wholesale & retail. Borivali West, Mumbai Suburban. All India Delivery." />'
);

content = content.replace(
  /<meta name="keywords" content="[\s\S]*?Fashion Market Bhuleshwar" \/>/,
  '<meta name="keywords" content="Payal Fashion Store, Payal Fashion Mumbai, Bridal Lehenga Choli, Designer Sarees, Borivali West, Mumbai Suburban, Lehenga Wholesale Mumbai, Saree Wholesale Mumbai, Ethnic Wear Manufacturer, Premium Lehenga Choli, Saree Collections Mumbai, Wholesale Ethnic Wear" />'
);

content = content.replace(
  /<meta name="author" content="Payal Fashion Store" \/>/,
  '<meta name="author" content="Payal Fashion Store - Nikhil Kishor Kumar Shah" />'
);

content = content.replace(
  /<meta property="og:description" content="Premium Lehenga Choli & Sarees Collections[\s\S]*?Mumbai\." \/>/,
  '<meta property="og:description" content="Premium Lehenga Choli & Sarees Collections. Wholesale & Online Seller. 17th Floor, 1701, Casa Rare, R M Bhattad Road, Borivali West, Mumbai Suburban, Maharashtra – 400092." />'
);

// 2. Top announcement bar
content = content.replace(
  /<a href="tel:\+918209206788" id="top-phone-link"><i class="fa-solid fa-phone"><\/i> \+91 8209206788<\/a>/,
  '<a href="https://wa.me/918209206788" target="_blank" id="top-phone-link"><i class="fa-brands fa-whatsapp"></i> +91 8209206788</a>'
);
content = content.replace(
  /<span id="top-gstin-text">27ABCSM8174F1Z5<\/span>/,
  '<span id="top-gstin-text">27AOUPS8724B1ZF</span>'
);

// 3. Hero seal & badges
content = content.replace(
  /<i class="fa-solid fa-gem"><\/i> Handcrafted in Bhuleshwar Mumbai • Pure Heritage Silks/,
  '<i class="fa-solid fa-gem"></i> Handcrafted in Mumbai • Pure Heritage Silks'
);
content = content.replace(
  /<span>MUMBAI HUB<\/span>\s*<strong>BHULESHWAR<\/strong>/,
  '<span>MUMBAI HUB</span>\n            <strong>BORIVALI WEST</strong>'
);

// 4. Atelier section
content = content.replace(
  /<h2 class="section-title">The Bhuleshwar Heritage Atelier<\/h2>/,
  '<h2 class="section-title">The Heritage Atelier & Design Studio</h2>'
);
content = content.replace(
  /Located in the heart of Mumbai’s historic Fashion Market, Payal Fashion Store brings direct-from-manufacturer pricing/,
  'Located in Borivali West, Mumbai Suburban, Payal Fashion Store brings direct-from-manufacturer pricing'
);
content = content.replace(
  /<a href="tel:\+918209206788" class="btn btn-outline-gold"><i class="fa-solid fa-phone"><\/i> Call Bhuleshwar Hub<\/a>/,
  '<a href="https://wa.me/918209206788?text=Hello%20Payal%20Fashion%20Store,%20I%20am%20interested%20in%20your%20Atelier%20collection." target="_blank" class="btn btn-whatsapp"><i class="fa-brands fa-whatsapp"></i> WhatsApp Inquiry</a>'
);

// 5. Wholesale Call Button removal
content = content.replace(
  /<div style="display:flex; gap:16px; flex-wrap:wrap;">\s*<a href="tel:\+918209206788" class="btn btn-gold"><i class="fa-solid fa-phone"><\/i> Direct Call: \+91 8209206788<\/a>\s*<a href="https:\/\/wa\.me\/918209206788[^"]*" target="_blank" class="btn btn-whatsapp"><i class="fa-brands fa-whatsapp"><\/i> WhatsApp Wholesale Team<\/a>\s*<\/div>/,
  '<div style="display:flex; gap:16px; flex-wrap:wrap;">\n            <a href="https://wa.me/918209206788?text=Hello%20Payal%20Fashion%20Store,%20I%20am%20interested%20in%20Wholesale%20partnership." target="_blank" class="btn btn-whatsapp" style="padding:14px 28px; font-size:0.95rem;"><i class="fa-brands fa-whatsapp"></i> WhatsApp Wholesale Team</a>\n          </div>'
);

// 6. About Section
content = content.replace(
  /situated in the legendary textile quarter of Bhuleshwar, Mumbai\./,
  'situated in Mumbai Suburban (Borivali West).'
);

const oldAboutTable = `<div class="about-details-table">
            <div class="about-table-item">
              <strong>Business Name</strong>
              <span id="about-legal-name">PAYAL FASHION STORE</span>
            </div>
            <div class="about-table-item">
              <strong>Official GSTIN</strong>
              <span id="about-legal-gstin">27ABCSM8174F1Z5</span>
            </div>
            <div class="about-table-item">
              <strong>Manufacturing Base</strong>
              <span>Bhuleshwar Road, Mumbai</span>
            </div>
            <div class="about-table-item">
              <strong>Service Scope</strong>
              <span>Wholesale & Retail • All India</span>
            </div>
          </div>`;

const newAboutTable = `<div class="about-details-table">
            <div class="about-table-item">
              <strong>Business Enterprise</strong>
              <span id="about-legal-name">PAYAL FASHION STORE</span>
            </div>
            <div class="about-table-item">
              <strong>Owner Name</strong>
              <span id="about-owner-name">NIKHIL KISHOR KUMAR SHAH</span>
            </div>
            <div class="about-table-item">
              <strong>Official GSTIN</strong>
              <span id="about-legal-gstin">27AOUPS8724B1ZF</span>
            </div>
            <div class="about-table-item">
              <strong>Taxpayer Type</strong>
              <span>REGULAR &bull; Online Seller</span>
            </div>
            <div class="about-table-item">
              <strong>Registered Location</strong>
              <span>Borivali West, Mumbai Suburban – 400092</span>
            </div>
            <div class="about-table-item">
              <strong>Service Scope</strong>
              <span>Wholesale & Online Fashion Seller • All India</span>
            </div>
          </div>`;

content = content.replace(oldAboutTable, newAboutTable);

// 7. Contact Section - Location only for viewing, remove get directions, remove call now, keep WhatsApp only
const oldContactBlock = `<div class="contact-item">
                <div class="contact-icon-circle"><i class="fa-solid fa-location-dot"></i></div>
                <div class="contact-details">
                  <h4>Registered Address</h4>
                  <p id="contact-address-text">
                    Shop No. 12, Fashion Market, Bhuleshwar Road, Mumbai, Maharashtra – 400002
                  </p>
                </div>
              </div>

              <div class="contact-item">
                <div class="contact-icon-circle"><i class="fa-solid fa-phone"></i></div>
                <div class="contact-details">
                  <h4>Direct Phone / Orders</h4>
                  <p><a href="tel:+918209206788" id="contact-phone-link">+91 8209206788</a></p>
                </div>
              </div>

              <div class="contact-item">
                <div class="contact-icon-circle"><i class="fa-brands fa-whatsapp"></i></div>
                <div class="contact-details">
                  <h4>Official WhatsApp</h4>
                  <p><a href="https://wa.me/918209206788" target="_blank">+91 8209206788 (Instant Response)</a></p>
                </div>
              </div>

              <div class="contact-item">
                <div class="contact-icon-circle"><i class="fa-solid fa-envelope"></i></div>
                <div class="contact-details">
                  <h4>Email Inquiries</h4>
                  <p><a href="mailto:payalcreation10@gmail.com" id="contact-email-link">payalcreation10@gmail.com</a></p>
                </div>
              </div>

              <div class="contact-item">
                <div class="contact-icon-circle"><i class="fa-solid fa-file-invoice"></i></div>
                <div class="contact-details">
                  <h4>Verified GSTIN</h4>
                  <p><strong id="contact-gstin-text">27ABCSM8174F1Z5</strong></p>
                </div>
              </div>
            </div>

            <div class="contact-actions-row">
              <a href="tel:+918209206788" class="btn btn-maroon"><i class="fa-solid fa-phone"></i> CALL NOW</a>
              <a href="https://wa.me/918209206788?text=Hello%20Payal%20Manufacturing%20Hub,%20I%20want%20to%20visit%20your%20Bhuleshwar%20showroom." target="_blank" class="btn btn-whatsapp"><i class="fa-brands fa-whatsapp"></i> WHATSAPP US</a>
              <a href="https://maps.google.com/?q=Bhuleshwar+Road+Mumbai+400002" target="_blank" class="btn btn-outline-gold"><i class="fa-solid fa-map-location-dot"></i> GET DIRECTIONS</a>
            </div>`;

// Check if formatting matches or regex
const contactRegex = /<div class="contact-item">[\s\S]*?<div class="contact-actions-row">[\s\S]*?<\/div>\s*<\/div>/;
const newContactBlock = `<div class="contact-item">
              <div class="contact-icon-circle"><i class="fa-solid fa-user-tie"></i></div>
              <div class="contact-details">
                <h4>Owner Name</h4>
                <p><strong id="contact-owner-text">NIKHIL KISHOR KUMAR SHAH</strong></p>
              </div>
            </div>

            <div class="contact-item">
              <div class="contact-icon-circle"><i class="fa-solid fa-location-dot"></i></div>
              <div class="contact-details">
                <h4>Registered Address</h4>
                <p id="contact-address-text">
                  17th Floor, 1701, Casa Rare, R M Bhattad Road, Borivali West, Mumbai Suburban, Maharashtra – 400092
                </p>
              </div>
            </div>

            <div class="contact-item">
              <div class="contact-icon-circle"><i class="fa-brands fa-whatsapp"></i></div>
              <div class="contact-details">
                <h4>Official WhatsApp</h4>
                <p><a href="https://wa.me/918209206788" target="_blank">+91 8209206788 (Instant Response)</a></p>
              </div>
            </div>

            <div class="contact-item">
              <div class="contact-icon-circle"><i class="fa-solid fa-envelope"></i></div>
              <div class="contact-details">
                <h4>Email Inquiries</h4>
                <p><a href="mailto:payalcreation10@gmail.com" id="contact-email-link">payalcreation10@gmail.com</a></p>
              </div>
            </div>

            <div class="contact-item">
              <div class="contact-icon-circle"><i class="fa-solid fa-file-invoice"></i></div>
              <div class="contact-details">
                <h4>Verified GSTIN</h4>
                <p><strong id="contact-gstin-text">27AOUPS8724B1ZF</strong> <span style="font-size:0.75rem; color:var(--text-muted); margin-left:8px;">(Type: Regular • Status: Online Seller)</span></p>
              </div>
            </div>
          </div>

          <div class="contact-actions-row">
            <a href="https://wa.me/918209206788?text=Hello%20Payal%20Fashion%20Store,%20I%20have%20an%20inquiry%20regarding%20your%20collection." target="_blank" class="btn btn-whatsapp" style="width:100%; justify-content:center;"><i class="fa-brands fa-whatsapp"></i> CHAT ON WHATSAPP</a>
          </div>
        </div>`;

content = content.replace(contactRegex, newContactBlock);

// 8. Admin Settings Form (Live Editable)
const oldAdminSettingsFormFields = `<div class="form-row">
                <div class="form-group">
                  <label>Business Name</label>
                  <input type="text" class="form-control" id="set-business-name" required />
                </div>
                <div class="form-group">
                  <label>Official Tagline</label>
                  <input type="text" class="form-control" id="set-tagline" required />
                </div>
              </div>`;

const newAdminSettingsFormFields = `<div class="form-row">
                <div class="form-group">
                  <label>Business Name</label>
                  <input type="text" class="form-control" id="set-business-name" required />
                </div>
                <div class="form-group">
                  <label>Owner Name</label>
                  <input type="text" class="form-control" id="set-owner-name" value="NIKHIL KISHOR KUMAR SHAH" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Official Tagline</label>
                  <input type="text" class="form-control" id="set-tagline" required />
                </div>
                <div class="form-group">
                  <label>Business Type / Status</label>
                  <input type="text" class="form-control" id="set-business-type" value="REGULAR (Online Seller)" />
                </div>
              </div>`;

content = content.replace(oldAdminSettingsFormFields, newAdminSettingsFormFields);

// 9. Footer
content = content.replace(
  /Premier Indian luxury ethnic wear boutique, manufacturer and retailer based in Bhuleshwar, Mumbai\./,
  'Premier Indian luxury ethnic wear boutique, manufacturer and online seller based in Borivali West, Mumbai Suburban.'
);

content = content.replace(
  /<a href="#contact" onclick="App\.navigateTo\('contact'\)"><i class="fa-solid fa-angle-right"><\/i> Contact & Directions<\/a>/,
  '<a href="#contact" onclick="App.navigateTo(\'contact\')"><i class="fa-solid fa-angle-right"></i> Contact & Store Location</a>'
);

const oldFooterContact = `<h4 class="footer-col-title">Mumbai Headquarters</h4>
        <div class="footer-contact-item">
          <i class="fa-solid fa-location-dot"></i>
          <span id="footer-address-text">Shop No. 12, Fashion Market, Bhuleshwar Road, Mumbai, Maharashtra – 400002</span>
        </div>
        <div class="footer-contact-item">
          <i class="fa-solid fa-phone"></i>
          <a href="tel:+918209206788" id="footer-phone-link">+91 8209206788</a>
        </div>
        <div class="footer-contact-item">
          <i class="fa-brands fa-whatsapp"></i>
          <a href="https://wa.me/918209206788" target="_blank">+91 8209206788 (WhatsApp)</a>
        </div>
        <div class="footer-contact-item">
          <i class="fa-solid fa-envelope"></i>
          <a href="mailto:Heermanufacturinghub@gmail.com" id="footer-email-link">Heermanufacturinghub@gmail.com</a>
        </div>
        <div class="footer-contact-item">
          <i class="fa-solid fa-id-card"></i>
          <span>GSTIN: <strong id="footer-gstin-text" style="color:var(--gold-light);">27ABCSM8174F1Z5</strong></span>
        </div>`;

const newFooterContact = `<h4 class="footer-col-title">Registered Headquarters</h4>
        <div class="footer-contact-item">
          <i class="fa-solid fa-user-tie"></i>
          <span>Owner: <strong id="footer-owner-text" style="color:#FFF;">NIKHIL KISHOR KUMAR SHAH</strong></span>
        </div>
        <div class="footer-contact-item">
          <i class="fa-solid fa-location-dot"></i>
          <span id="footer-address-text">17th Floor, 1701, Casa Rare, R M Bhattad Road, Borivali West, Mumbai Suburban, Maharashtra – 400092</span>
        </div>
        <div class="footer-contact-item">
          <i class="fa-brands fa-whatsapp"></i>
          <a href="https://wa.me/918209206788" target="_blank" id="footer-phone-link">+91 8209206788 (WhatsApp)</a>
        </div>
        <div class="footer-contact-item">
          <i class="fa-solid fa-envelope"></i>
          <a href="mailto:payalcreation10@gmail.com" id="footer-email-link">payalcreation10@gmail.com</a>
        </div>
        <div class="footer-contact-item">
          <i class="fa-solid fa-id-card"></i>
          <span>GSTIN: <strong id="footer-gstin-text" style="color:var(--gold-light);">27AOUPS8724B1ZF</strong></span>
        </div>
        <div class="footer-contact-item">
          <i class="fa-solid fa-circle-check"></i>
          <span style="font-size:0.75rem; color:var(--text-muted);">Type: Regular &bull; Status: Online Seller</span>
        </div>`;

content = content.replace(oldFooterContact, newFooterContact);

// 10. Sticky bottom mobile bar - keep WhatsApp only
const oldMobileBar = `<div class="mobile-sticky-bottom-bar">
    <div class="mobile-bottom-actions">
      <a href="tel:+918209206788" class="btn btn-sm btn-maroon"><i class="fa-solid fa-phone"></i> CALL</a>
      <a href="https://wa.me/918209206788" target="_blank" class="btn btn-sm btn-whatsapp"><i class="fa-brands fa-whatsapp"></i> WHATSAPP</a>
      <button class="btn btn-sm btn-gold" onclick="App.openGeneralEnquiryModal()"><i class="fa-solid fa-paper-plane"></i> ENQUIRE</button>
    </div>
  </div>`;

const newMobileBar = `<div class="mobile-sticky-bottom-bar">
    <div class="mobile-bottom-actions">
      <a href="https://wa.me/918209206788?text=Hello%20Payal%20Fashion%20Store,%20I%20would%20like%20to%20enquire%20about%20your%20ethnic%20wear%20collections." target="_blank" class="btn btn-whatsapp" style="width:100%; justify-content:center; font-weight:700;"><i class="fa-brands fa-whatsapp"></i> ENQUIRE ON WHATSAPP</a>
    </div>
  </div>`;

content = content.replace(oldMobileBar, newMobileBar);

// 11. Modal Enquiry Buttons - remove CALL NOW button
const oldEnquiryModalButtons = `<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <button type="button" class="btn btn-whatsapp" onclick="App.triggerInstantWhatsAppEnquiry()">
              <i class="fa-brands fa-whatsapp"></i> WHATSAPP NOW
            </button>
            <a href="tel:+918209206788" class="btn btn-outline-gold">
              <i class="fa-solid fa-phone"></i> CALL NOW
            </a>
          </div>`;

const newEnquiryModalButtons = `<div style="display:grid; grid-template-columns:1fr; gap:10px;">
            <button type="button" class="btn btn-whatsapp" onclick="App.triggerInstantWhatsAppEnquiry()">
              <i class="fa-brands fa-whatsapp"></i> WHATSAPP NOW
            </button>
          </div>`;

content = content.replace(oldEnquiryModalButtons, newEnquiryModalButtons);

// 12. DEFAULT_SETTINGS in JS
const oldDefaultSettings = `const DEFAULT_SETTINGS = {
        businessName: "PAYAL FASHION STORE",
        tagline: "HANDCRAFTED BRIDAL & FESTIVE COUTURE",
        phone: "+91 8209206788",
        whatsapp: "+91 8209206788",
        email: "Heermanufacturinghub@gmail.com",
        ownerLeadEmail: "Heermanufacturinghub@gmail.com",
        address: "Shop No. 12, Fashion Market, Bhuleshwar Road, Mumbai, Maharashtra – 400002",
        gstin: "27ABCSM8174F1Z5",
        cityState: "Mumbai, Maharashtra",
        heroHeadline: "Handcrafted Luxury Bridal & Festive Couture.",
        heroDesc: "Discover exquisite designer lehenga choli and pure silk sarees crafted with love, fine zardozi embroidery, and timeless silhouettes. Handcrafted by master artisans in Mumbai with direct boutique pricing."
      };`;

const newDefaultSettings = `const DEFAULT_SETTINGS = {
        businessName: "PAYAL FASHION STORE",
        ownerName: "NIKHIL KISHOR KUMAR SHAH",
        tagline: "HANDCRAFTED BRIDAL & FESTIVE COUTURE",
        phone: "+91 8209206788",
        whatsapp: "+91 8209206788",
        email: "payalcreation10@gmail.com",
        ownerLeadEmail: "payalcreation10@gmail.com",
        address: "17th Floor, 1701, Casa Rare, R M Bhattad Road, Borivali West, Mumbai Suburban, Maharashtra – 400092",
        gstin: "27AOUPS8724B1ZF",
        cityState: "Mumbai Suburban, Maharashtra",
        pincode: "400092",
        businessType: "REGULAR",
        operatingStatus: "ONLINE SELLER",
        heroHeadline: "Handcrafted Luxury Bridal & Festive Couture.",
        heroDesc: "Discover exquisite designer lehenga choli and pure silk sarees crafted with love, fine zardozi embroidery, and timeless silhouettes. Handcrafted by master artisans with direct boutique pricing."
      };`;

content = content.replace(oldDefaultSettings, newDefaultSettings);

// 13. Product detail modal action buttons: remove CALL NOW
const oldProductDetailActions = `<div class="pdetail-actions-row">
                <a href="tel:\${settings.phone.replace(/\\s+/g, '')}" class="btn btn-outline-gold">
                  <i class="fa-solid fa-phone"></i> CALL NOW
                </a>
                <button class="btn btn-maroon" onclick="App.openEnquiryForProduct(\${product.id})">
                  <i class="fa-solid fa-paper-plane"></i> SEND ENQUIRY
                </button>
              </div>`;

const newProductDetailActions = `<div class="pdetail-actions-row">
                <button class="btn btn-maroon" onclick="App.openEnquiryForProduct(\${product.id})" style="flex:1;">
                  <i class="fa-solid fa-paper-plane"></i> SEND ENQUIRY
                </button>
              </div>`;

content = content.replace(oldProductDetailActions, newProductDetailActions);

// 14. populateAdminSettingsForm & saveWebsiteSettings & applySettingsToDOM
const oldSettingsFunctions = `      function populateAdminSettingsForm() {
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
      }

      function applySettingsToDOM() {
        const s = getSettings();
        // Top bar
        const topPhone = document.getElementById("top-phone-link");
        if (topPhone) { topPhone.href = \`tel:\${s.phone.replace(/\\s+/g, '')}\`; topPhone.innerHTML = \`<i class="fa-solid fa-phone"></i> \${s.phone}\`; }
        const topEmail = document.getElementById("top-email-link");
        if (topEmail) { topEmail.href = \`mailto:\${s.email}\`; topEmail.innerHTML = \`<i class="fa-solid fa-envelope"></i> \${s.email}\`; }
        const topGstin = document.getElementById("top-gstin-text");
        if (topGstin) topGstin.innerText = s.gstin;

        // Hero
        const heroTag = document.getElementById("hero-tagline-display");
        if (heroTag) heroTag.innerText = s.tagline;
        const heroDesc = document.getElementById("hero-desc-display");
        if (heroDesc) heroDesc.innerText = s.heroDesc;

        // Contact
        const cAddr = document.getElementById("contact-address-text");
        if (cAddr) cAddr.innerText = s.address;
        const cPhone = document.getElementById("contact-phone-link");
        if (cPhone) { cPhone.href = \`tel:\${s.phone.replace(/\\s+/g, '')}\`; cPhone.innerText = s.phone; }
        const cEmail = document.getElementById("contact-email-link");
        if (cEmail) { cEmail.href = \`mailto:\${s.email}\`; cEmail.innerText = s.email; }
        const cGstin = document.getElementById("contact-gstin-text");
        if (cGstin) cGstin.innerText = s.gstin;

        // Footer
        const fTag = document.getElementById("footer-tagline-text");
        if (fTag) fTag.innerText = s.tagline;
        const fAddr = document.getElementById("footer-address-text");
        if (fAddr) fAddr.innerText = s.address;
        const fPhone = document.getElementById("footer-phone-link");
        if (fPhone) { fPhone.href = \`tel:\${s.phone.replace(/\\s+/g, '')}\`; fPhone.innerText = s.phone; }
        const fEmail = document.getElementById("footer-email-link");
        if (fEmail) { fEmail.href = \`mailto:\${s.email}\`; fEmail.innerText = s.email; }
        const fGstin = document.getElementById("footer-gstin-text");
        if (fGstin) fGstin.innerText = s.gstin;
      }`;

const newSettingsFunctions = `      function populateAdminSettingsForm() {
        const s = getSettings();
        const creds = getAdminCredentials();
        const setVal = (id, val) => {
          const el = document.getElementById(id);
          if (el) el.value = (val !== undefined && val !== null) ? val : "";
        };

        setVal("set-business-name", s.businessName || s.store_name);
        setVal("set-owner-name", s.ownerName || "NIKHIL KISHOR KUMAR SHAH");
        setVal("set-business-type", s.businessType || "REGULAR (Online Seller)");
        setVal("set-tagline", s.tagline);
        setVal("set-phone", s.phone);
        setVal("set-email", s.email);
        setVal("set-owner-lead-email", s.ownerLeadEmail || s.email);
        setVal("set-gstin", s.gstin || "27AOUPS8724B1ZF");
        setVal("set-city-state", s.cityState || "Mumbai Suburban, Maharashtra");
        setVal("set-address", s.address || "17th Floor, 1701, Casa Rare, R M Bhattad Road, Borivali West, Mumbai Suburban, Maharashtra – 400092");
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
          ownerName: getVal("set-owner-name", "NIKHIL KISHOR KUMAR SHAH"),
          businessType: getVal("set-business-type", "REGULAR (Online Seller)"),
          tagline: getVal("set-tagline", "HANDCRAFTED BRIDAL & FESTIVE COUTURE"),
          phone: getVal("set-phone", "+91 8209206788"),
          whatsapp: getVal("set-phone", "+91 8209206788"),
          email: getVal("set-email", "payalcreation10@gmail.com"),
          ownerLeadEmail: getVal("set-owner-lead-email", getVal("set-email", "payalcreation10@gmail.com")),
          gstin: getVal("set-gstin", "27AOUPS8724B1ZF"),
          cityState: getVal("set-city-state", "Mumbai Suburban, Maharashtra"),
          address: getVal("set-address", "17th Floor, 1701, Casa Rare, R M Bhattad Road, Borivali West, Mumbai Suburban, Maharashtra – 400092"),
          pincode: "400092",
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
      }

      function applySettingsToDOM() {
        const s = getSettings();
        const cleanPhone = (s.phone || "+918209206788").replace(/[^0-9]/g, '');

        // Top bar
        const topPhone = document.getElementById("top-phone-link");
        if (topPhone) { 
          topPhone.href = \`https://wa.me/\${cleanPhone}\`; 
          topPhone.innerHTML = \`<i class="fa-brands fa-whatsapp"></i> \${s.phone}\`; 
        }
        const topEmail = document.getElementById("top-email-link");
        if (topEmail) { topEmail.href = \`mailto:\${s.email}\`; topEmail.innerHTML = \`<i class="fa-solid fa-envelope"></i> \${s.email}\`; }
        const topGstin = document.getElementById("top-gstin-text");
        if (topGstin) topGstin.innerText = s.gstin;

        // Hero
        const heroTag = document.getElementById("hero-tagline-display");
        if (heroTag) heroTag.innerText = s.tagline;
        const heroDesc = document.getElementById("hero-desc-display");
        if (heroDesc) heroDesc.innerText = s.heroDesc;

        // About section
        const abOwner = document.getElementById("about-owner-name");
        if (abOwner && s.ownerName) abOwner.innerText = s.ownerName;
        const abGstin = document.getElementById("about-legal-gstin");
        if (abGstin) abGstin.innerText = s.gstin;

        // Contact
        const cOwner = document.getElementById("contact-owner-text");
        if (cOwner && s.ownerName) cOwner.innerText = s.ownerName;
        const cAddr = document.getElementById("contact-address-text");
        if (cAddr) cAddr.innerText = s.address;
        const cEmail = document.getElementById("contact-email-link");
        if (cEmail) { cEmail.href = \`mailto:\${s.email}\`; cEmail.innerText = s.email; }
        const cGstin = document.getElementById("contact-gstin-text");
        if (cGstin) cGstin.innerText = s.gstin;

        // Footer
        const fOwner = document.getElementById("footer-owner-text");
        if (fOwner && s.ownerName) fOwner.innerText = s.ownerName;
        const fTag = document.getElementById("footer-tagline-text");
        if (fTag) fTag.innerText = s.tagline;
        const fAddr = document.getElementById("footer-address-text");
        if (fAddr) fAddr.innerText = s.address;
        const fPhone = document.getElementById("footer-phone-link");
        if (fPhone) { 
          fPhone.href = \`https://wa.me/\${cleanPhone}\`; 
          fPhone.innerText = \`\${s.phone} (WhatsApp)\`; 
        }
        const fEmail = document.getElementById("footer-email-link");
        if (fEmail) { fEmail.href = \`mailto:\${s.email}\`; fEmail.innerText = s.email; }
        const fGstin = document.getElementById("footer-gstin-text");
        if (fGstin) fGstin.innerText = s.gstin;
      }`;

content = content.replace(oldSettingsFunctions, newSettingsFunctions);

// Write back
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated index.html with image credentials and requirements!');
