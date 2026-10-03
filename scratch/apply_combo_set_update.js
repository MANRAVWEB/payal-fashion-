const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');
const originalLength = content.length;

const replacements = [
  // 1. Meta Tags
  {
    from: 'wholesale & retail. Borivali West',
    to: 'Combo Set & retail. Borivali West'
  },
  {
    from: 'Lehenga Wholesale Mumbai, Saree Wholesale Mumbai, Ethnic Wear Manufacturer, Premium Lehenga Choli, Saree Collections Mumbai, Wholesale Ethnic Wear',
    to: 'Lehenga Combo Set Mumbai, Saree Combo Set Mumbai, Ethnic Wear Manufacturer, Premium Lehenga Choli, Saree Collections Mumbai, Combo Set Ethnic Wear'
  },
  {
    from: 'Premium Lehenga Choli & Sarees Collections. Wholesale & Online Seller.',
    to: 'Premium Lehenga Choli & Sarees Collections. Combo Set & Online Seller.'
  },

  // 2. Top Announcement Bar
  {
    from: '<span><i class="fa-solid fa-tag"></i> Wholesale & Retail Available</span>',
    to: '<span><i class="fa-solid fa-layer-group"></i> Combo Set & Retail Available</span>'
  },

  // 3. Navigation Links
  {
    from: '<li><a href="#wholesale" class="nav-link" onclick="App.navigateTo(\'wholesale\')">Wholesale</a></li>',
    to: '<li><a href="#wholesale" class="nav-link" onclick="App.navigateTo(\'wholesale\')">Combo Set</a></li>'
  },

  // 4. Hero Section
  {
    from: '<a href="#wholesale" class="btn btn-gold"><i class="fa-solid fa-handshake"></i> Wholesale Enquiry</a>',
    to: '<a href="#wholesale" class="btn btn-gold"><i class="fa-solid fa-layer-group"></i> Combo Set Enquiry</a>'
  },
  {
    from: '<span><i class="fa-solid fa-circle-check"></i> Wholesale Available</span>',
    to: '<span><i class="fa-solid fa-circle-check"></i> Combo Set Available</span>'
  },

  // 5. Trust Strip & Atelier
  {
    from: 'delivering wholesale and retail parcels across all Indian pin codes.',
    to: 'delivering combo set and retail parcels across all Indian pin codes.'
  },
  {
    from: 'reliable wholesale supply, and bespoke ethnic perfection to retailers and wedding shoppers nationwide.',
    to: 'reliable combo set supply, and bespoke ethnic perfection to retailers and wedding shoppers nationwide.'
  },
  {
    from: '<span class="badge-luxury badge-gold">WHOLESALE READY</span>',
    to: '<span class="badge-luxury badge-gold">COMBO SET READY</span>'
  },
  {
    from: 'inquire for wholesale bulk slots, or place individual retail orders.',
    to: 'inquire for combo set packages, or place individual retail orders.'
  },

  // 6. Category Filter Pills
  {
    from: '<button class="filter-pill" onclick="App.filterCatalogue(\'Designer Collections\')">Designer</button>',
    to: '<button class="filter-pill" onclick="App.filterCatalogue(\'Designer Collections\')">Designer</button>\n            <button class="filter-pill" onclick="App.filterCatalogue(\'Combo Set\')">Combo Set</button>'
  },

  // 7. Section 6: Wholesale Section Markup
  {
    from: '<!-- 6. WHOLESALE & BULK MANUFACTURING SECTION -->',
    to: '<!-- 6. COMBO SET & ENSEMBLE SECTION -->'
  },
  {
    from: '<div class="section-tagline">MANUFACTURING ALLIANCE</div>\n          <h2 class="wholesale-title">Your Trusted Ethnic Wear Manufacturing Partner</h2>',
    to: '<div class="section-tagline">CURATED COMBINATIONS</div>\n          <h2 class="wholesale-title">Exclusive Combo Set Collections &amp; Matching Ensembles</h2>'
  },
  {
    from: 'Are you a boutique owner, retail chain, online brand, or wedding planner? Partner directly with Payal Fashion Store for verified fabric consistency, flawless finishing, competitive factory rates, and dependable All-India dispatch.',
    to: 'Looking to explore curated combo sets, matching lehenga and saree ensembles, or value packages for festive occasions and boutiques? Payal Fashion Store offers handcrafted matching sets, bespoke color coordinating, verified dispatch, and dedicated stylist support.'
  },
  {
    from: '<div class="perk-item">\n              <i class="fa-solid fa-warehouse"></i>\n              <span>Direct Factory Supply</span>\n            </div>',
    to: '<div class="perk-item">\n              <i class="fa-solid fa-layer-group"></i>\n              <span>Curated Matching Sets</span>\n            </div>'
  },
  {
    from: '<div class="perk-item">\n              <i class="fa-solid fa-boxes-stacked"></i>\n              <span>Flexible Minimums (MOQ)</span>\n            </div>',
    to: '<div class="perk-item">\n              <i class="fa-solid fa-boxes-stacked"></i>\n              <span>Exclusive Combo Pricing</span>\n            </div>'
  },
  {
    from: '<a href="https://wa.me/918209206788?text=Hello%20Payal%20Fashion%20Store,%20I%20am%20interested%20in%20Wholesale%20partnership." target="_blank" class="btn btn-whatsapp" style="padding:14px 28px; font-size:0.95rem;"><i class="fa-brands fa-whatsapp"></i> WhatsApp Wholesale Team</a>',
    to: '<a href="https://wa.me/918209206788?text=Hello%20Payal%20Fashion%20Store,%20I%20am%20interested%20in%20Combo%20Set%20collections." target="_blank" class="btn btn-whatsapp" style="padding:14px 28px; font-size:0.95rem;"><i class="fa-brands fa-whatsapp"></i> WhatsApp Combo Set Team</a>'
  },
  {
    from: '<h3>Wholesale Enquiry</h3>\n          <p>Submit your bulk inventory requirements and our manufacturing team will provide immediate catalog sheets and price breakdowns.</p>',
    to: '<h3>Combo Set Enquiry</h3>\n          <p>Submit your combo set or styling requirements and our specialist team will provide immediate catalog sheets and price breakdowns.</p>'
  },
  {
    from: '<option value="All Categories">All Categories</option>',
    to: '<option value="All Categories">All Categories</option>\n                  <option value="Combo Set">Combo Set Collections</option>'
  },
  {
    from: '<button type="submit" class="btn btn-maroon" style="width:100%;">\n              <i class="fa-solid fa-paper-plane"></i> SEND WHOLESALE ENQUIRY\n            </button>',
    to: '<button type="submit" class="btn btn-maroon" style="width:100%;">\n              <i class="fa-solid fa-paper-plane"></i> SEND COMBO SET ENQUIRY\n            </button>'
  },

  // 8. About & Contact
  {
    from: '<span>Wholesale & Online Fashion Seller • All India</span>',
    to: '<span>Combo Set & Online Fashion Seller • All India</span>'
  },
  {
    from: 'We welcome retailers, wholesalers, and retail buyers to visit our facility or get in touch for custom bookings, catalog dispatch, and order queries.',
    to: 'We welcome retail shoppers, combo set buyers, and boutique clients to visit our facility or get in touch for custom bookings, catalog dispatch, and order queries.'
  },
  {
    from: 'placeholder="Retail Purchase / Wholesale Catalog / Custom Order"',
    to: 'placeholder="Retail Purchase / Combo Set Catalog / Custom Order"'
  },

  // 9. Customer Dashboard
  {
    from: 'Account Type: Retail / Wholesale',
    to: 'Account Type: Retail / Combo Set'
  },
  {
    from: 'My Product & Wholesale Enquiries',
    to: 'My Product & Combo Set Enquiries'
  },

  // 10. Admin Navigation & Tabs
  {
    from: '<p style="font-size:0.8rem; color:#E8DCB8; margin-top:4px;">Manage Products, Enquiries, Wholesale Leads, and Live Settings</p>',
    to: '<p style="font-size:0.8rem; color:#E8DCB8; margin-top:4px;">Manage Products, Enquiries, Combo Set Leads, and Live Settings</p>'
  },
  {
    from: '<button class="dash-tab-btn" data-tab="wholesale" onclick="App.switchAdminTab(\'wholesale\')"><i class="fa-solid fa-handshake"></i> Wholesale Leads</button>',
    to: '<button class="dash-tab-btn" data-tab="wholesale" onclick="App.switchAdminTab(\'wholesale\')"><i class="fa-solid fa-layer-group"></i> Combo Set Leads</button>'
  },
  {
    from: '<h3 id="stat-wholesale-leads">0</h3>\n                  <p>Wholesale Leads</p>',
    to: '<h3 id="stat-wholesale-leads">0</h3>\n                  <p>Combo Set Leads</p>'
  },
  {
    from: '<th>Wholesale</th>',
    to: '<th>Combo Set</th>'
  },
  {
    from: '<h3 style="font-family:var(--font-serif); color:var(--maroon-deep); margin-bottom:16px;">Wholesale Partner Applications</h3>',
    to: '<h3 style="font-family:var(--font-serif); color:var(--maroon-deep); margin-bottom:16px;">Combo Set Applications &amp; Enquiries</h3>'
  },

  // 11. Footer Links
  {
    from: '<li><a href="#wholesale" onclick="App.navigateTo(\'wholesale\')"><i class="fa-solid fa-angle-right"></i> Wholesale Partnerships</a></li>',
    to: '<li><a href="#wholesale" onclick="App.navigateTo(\'wholesale\')"><i class="fa-solid fa-angle-right"></i> Combo Set Collections</a></li>'
  },
  {
    from: '<li><a href="javascript:void(0)" onclick="App.filterCatalogue(\'Designer Collections\')"><i class="fa-solid fa-angle-right"></i> Designer Collections</a></li>',
    to: '<li><a href="javascript:void(0)" onclick="App.filterCatalogue(\'Designer Collections\')"><i class="fa-solid fa-angle-right"></i> Designer Collections</a></li>\n          <li><a href="javascript:void(0)" onclick="App.filterCatalogue(\'Combo Set\')"><i class="fa-solid fa-angle-right"></i> Combo Set Collections</a></li>'
  },

  // 12. Modals (Enquiry, Auth, Add Product)
  {
    from: '<option value="Wholesale Bulk">Wholesale (Bulk Production)</option>',
    to: '<option value="Combo Set">Combo Set (Curated Package)</option>'
  },
  {
    from: 'placeholder="Tell us if you require custom sizing, urgent dispatch, or wholesale fabric swatches..."',
    to: 'placeholder="Tell us if you require custom sizing, urgent dispatch, or combo set fabric swatches..."'
  },
  {
    from: 'Enter your mobile number to view wholesale rates, request bridal video previews, or get personal fitting recommendations from our master stylists.',
    to: 'Enter your mobile number to view combo set rates, request bridal video previews, or get personal fitting recommendations from our master stylists.'
  },
  {
    from: '<option value="Wholesale">Wholesale / Boutique Owner</option>',
    to: '<option value="Combo Set">Combo Set / Boutique Shopper</option>'
  },
  {
    from: '<option value="Designer Collections">Designer Collections</option>\n              </select>',
    to: '<option value="Designer Collections">Designer Collections</option>\n                <option value="Combo Set">Combo Set</option>\n              </select>'
  },
  {
    from: '<option value="wholesale">Contact for Wholesale Price</option>',
    to: '<option value="wholesale">Contact for Combo Set Price</option>'
  },
  {
    from: '<input type="checkbox" id="ap-wholesale-chk" checked /> Wholesale Available',
    to: '<input type="checkbox" id="ap-wholesale-chk" checked /> Combo Set Available'
  },

  // 13. JavaScript logic (Product Card, Detail, Handlers)
  {
    from: '${item.wholesale ? \'<span class="badge-luxury badge-gold">WHOLESALE</span>\' : \'\'}',
    to: '${item.wholesale ? \'<span class="badge-luxury badge-gold">COMBO SET</span>\' : \'\'}'
  },
  {
    from: '? "Contact for Wholesale Price" \n            : (item.priceVisibility === "fixed"',
    to: '? "Contact for Combo Set Price" \n            : (item.priceVisibility === "fixed"'
  },
  {
    from: '? "Contact for Wholesale Price" \n          : (product.priceVisibility === "fixed"',
    to: '? "Contact for Combo Set Price" \n          : (product.priceVisibility === "fixed"'
  },
  {
    from: '`Requirement: Wholesale / Retail\\n`',
    to: '`Requirement: Combo Set / Retail\\n`'
  },
  {
    from: '<td>${product.wholesale ? \'Wholesale Available\' : \'\'} ${product.retail ? \'• Retail Available\' : \'\'}</td>',
    to: '<td>${product.wholesale ? \'Combo Set Available\' : \'\'} ${product.retail ? \'• Retail Available\' : \'\'}</td>'
  },
  {
    from: 'Interested in this design? Contact our team for availability, wholesale pricing and order details.',
    to: 'Interested in this design? Contact our team for availability, combo set pricing and order details.'
  },
  {
    from: '"Wholesale Lead"',
    to: '"Combo Set Lead"'
  },
  {
    from: '`New Wholesale Lead — ${lead.businessName} (${lead.customerName})`',
    to: '`New Combo Set Lead — ${lead.businessName} (${lead.customerName})`'
  },
  {
    from: '"Wholesale Confirmation"',
    to: '"Combo Set Confirmation"'
  },
  {
    from: '`Wholesale Partnership Acknowledgement — Payal Fashion Store`',
    to: '`Combo Set Enquiry Acknowledgement — Payal Fashion Store`'
  },
  {
    from: 'Thank you for reaching out to Payal Fashion Store. We have registered your wholesale application for ${lead.businessName}.\\nOur B2B merchandising desk will contact you via WhatsApp/Phone with volume pricing sheets.',
    to: 'Thank you for reaching out to Payal Fashion Store. We have registered your combo set enquiry for ${lead.businessName}.\\nOur styling & merchandising desk will contact you via WhatsApp/Phone with combo set catalog sheets.'
  },
  {
    from: 'showToast("Wholesale inquiry sent! Our B2B coordinator will contact you shortly.");',
    to: 'showToast("Combo Set enquiry sent! Our styling coordinator will contact you shortly.");'
  },
  {
    from: 'if (confirm("Would you like to open WhatsApp to chat with our wholesale director immediately?"))',
    to: 'if (confirm("Would you like to open WhatsApp to chat with our Combo Set team immediately?"))'
  },
  {
    from: '`I have registered a Wholesale Inquiry for:\\n`',
    to: '`I have registered a Combo Set Inquiry for:\\n`'
  },
  {
    from: 'sub.innerText = "Join Payal Fashion Store for wholesale pricing & catalogue tracking";',
    to: 'sub.innerText = "Join Payal Fashion Store for combo set pricing & catalogue tracking";'
  },
  {
    from: '<td>${item.priceVisibility === \'wholesale\' ? \'Wholesale Only\' : (item.priceVisibility === \'fixed\' ? \'Fixed Price\' : \'Price on Enquiry\')}</td>',
    to: '<td>${item.priceVisibility === \'wholesale\' ? \'Combo Set Price\' : (item.priceVisibility === \'fixed\' ? \'Fixed Price\' : \'Price on Enquiry\')}</td>'
  },
  {
    from: 'No wholesale leads submitted yet.',
    to: 'No combo set leads submitted yet.'
  },
  {
    from: 'we have reviewed the wholesale request for',
    to: 'we have reviewed the combo set enquiry for'
  },
  {
    from: 'showToast(`Wholesale lead ${id} status updated to ${newStatus}`);',
    to: 'showToast(`Combo Set lead ${id} status updated to ${newStatus}`);'
  }
];

let applied = 0;
replacements.forEach((r, idx) => {
  if (content.includes(r.from)) {
    content = content.replace(r.from, r.to);
    applied++;
  } else {
    console.warn(`[Replacement ${idx}] NOT FOUND: ${r.from.slice(0, 40)}...`);
  }
});

// Update filterCatalogue logic to support 'Combo Set'
const oldFilterCat = 'const matchCat = (activeCategory === "all") || (item.category === activeCategory) || (item.collection === activeCategory);';
const newFilterCat = 'const matchCat = (activeCategory === "all") || (activeCategory === "Combo Set" && (item.category === "Combo Set" || item.wholesale === true || item.collection === "Combo Set" || item.category === "Wholesale")) || (item.category === activeCategory) || (item.collection === activeCategory);';
if (content.includes(oldFilterCat)) {
  content = content.replace(oldFilterCat, newFilterCat);
  applied++;
  console.log('Updated filterCatalogue logic to support Combo Set category!');
} else {
  console.warn('oldFilterCat NOT FOUND');
}

// Update DEFAULT_PRODUCTS priceText from "Contact for Wholesale Price" to "Contact for Combo Set Price"
const countWholesalePrice = (content.match(/Contact for Wholesale Price/g) || []).length;
content = content.replace(/Contact for Wholesale Price/g, 'Contact for Combo Set Price');
console.log(`Replaced ${countWholesalePrice} occurrences of "Contact for Wholesale Price" with "Contact for Combo Set Price"`);

fs.writeFileSync('index.html', content, 'utf8');
console.log(`Successfully applied ${applied} replacements. Updated file size: ${content.length}`);
