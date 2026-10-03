# PAYAL FASHION STORE — Official Web Application & Realtime Cloud Engine

> **“TRADITION IN EVERY THREAD”**  
> Premium Ethnic Wear Manufacturer • Wholesaler • Online Seller  
> Owner: Nikhil Kishor Kumar Shah  
> 17TH FLOOR, 1701, CASA RARE, R M BHATTAD ROAD, BORIVALI WEST, MUMBAI SUBURBAN, MAHARASHTRA, 400092  
> WhatsApp: +91 8209206788 | Email: payalcreation10@gmail.com  
> GSTIN: 27AOUPS8724B1ZF (Type: REGULAR • Status: ONLINE SELLER)

---

## 🌟 Architecture Overview

Payal Fashion Store is designed to run seamlessly on **GitHub Pages (100% Free Hosting)** with **Google Firebase Realtime Database** for instant 1-second cross-device synchronization, and full local PHP/MySQL support for XAMPP.

### 📁 Directory Layout
```text
c:\xampp\htdocs\p\
├── config/
│   └── db.php                  # PDO MySQL connection, auto-database creation & JSON fallback
├── database/
│   └── schema.sql              # Complete MySQL schema (tables for products, photos, enquiries, leads)
├── api/
│   ├── products.php            # Products REST API (GET, POST, PUT, DELETE)
│   ├── home_photos.php         # Homepage 11-photo replacer API (GET, POST)
│   ├── upload.php              # Real image upload engine (saves to uploads/ with type validation)
│   ├── enquiries.php           # Customer enquiries API (GET, POST, PUT status)
│   ├── wholesale.php           # B2B wholesale leads API (GET, POST, PUT status)
│   ├── settings.php            # Store settings API (GET, POST)
│   ├── auth.php                # Owner authentication & session management API
│   └── save_data.php           # Local JSON backup bridge
├── uploads/                    # Physical storage for uploaded product & homepage images
├── assets/images/              # Core brand images (Bridal lehengas, silk sarees, heritage atelier, logo)
├── data/
│   ├── products.json           # Seeded catalogue items (JSON backup & offline mirror)
│   ├── home_photos.json        # Seeded homepage photo mappings
│   ├── enquiries.json          # Customer inquiries fallback mirror
│   └── wholesale.json          # Wholesale leads fallback mirror
└── index.html                  # Luxury single-page frontend application with Firebase Realtime Sync
```

---

## 🔥 Tareeqa 2: Google Firebase Realtime Cloud (For GitHub Pages)

Jab website **GitHub Pages** par host hoti hai, to Google Firebase Realtime Database use karke **1 second me live cross-device sync** kaam karta hai:

### How it works:
1. **Zero Server / Zero Cost**: Google Firebase ka Realtime Database 100% free hai (Spark tier).
2. **Instant Sync**: Jab Admin photo badalta hai ya product add karta hai, to wo direct Firebase Cloud me save hota hai.
3. **Live for All Customers**: Duniya bhar ke kisi bhi customer ke phone par ~1 second me nayi photo aur products live dikhne lagte hain!
4. **Enquiries**: Customer jab bridal ya wholesale enquiry bharta hai, to wo Firebase Cloud me chali jaati hai aur Admin dashboard par live dikhti hai.

### Setup Steps (Only Takes 2 Minutes):
1. [console.firebase.google.com](https://console.firebase.google.com) par jayein aur apne Google account se sign in karein.
2. **"Add project"** click karein &rarr; Project ka naam dein (e.g. `payal-fashion-store`).
3. Left menu me **"Build" &rarr; "Realtime Database"** par click karein &rarr; **"Create Database"** dabayein.
4. Security rules me **"Start in test mode"** select karke Enable karein (is se `.read: true, .write: true` ho jayega).
5. Database URL copy karein (e.g. `https://payal-fashion-store-default-rtdb.firebaseio.com/`).
6. Website ke **Admin Console** me jayein &rarr; **"Firebase Cloud Sync"** tab kholein &rarr; URL paste karke **SAVE & CONNECT** dabayein!
7. **"UPLOAD ALL PRODUCTS & PHOTOS TO CLOUD NOW"** button dabayein. Done!

---

## 🔒 Owner Credentials
- **Access URL**: Top header me discreet lock icon **`[ 🔒 ]`** dabayein.
- **Default Username**: `payal`
- **Default Password**: `payal@2026`
*(Can be changed anytime inside the Admin Console -> Website Settings tab)*

---

## 🚀 How to Deploy to GitHub Pages

1. Is poore project folder ke files (`index.html`, `assets/`, `data/`) ko apne GitHub repository me push karein.
2. GitHub repository Settings me jayein &rarr; **Pages** &rarr; Branch select karein `main` / `root` &rarr; Save karein.
3. 1 minute me aapki website live ho jayegi:
   ```
   https://<your-username>.github.io/<repo-name>/
   ```
4. Website par jake lock icon **`[ 🔒 ]`** dabakar Admin login karein, aur apna Firebase Database URL daal dein!
5. Ab jab bhi aap koi bhi photo ya product badlenge, **duniya ke har customer ke mobile me turant live change ho jayega!**
