const fs = require('fs');

async function testUpload() {
  try {
    const fileBuffer = fs.readFileSync('assets/images/payal-logo.png');
    const blob = new Blob([fileBuffer], { type: 'image/png' });
    const formData = new FormData();
    formData.append('file', blob, 'test_logo.png');

    const res = await fetch('http://127.0.0.1/p/api/upload.php', {
      method: 'POST',
      body: formData
    });

    console.log('Upload HTTP status:', res.status);
    const json = await res.json();
    console.log('Upload response:', json);
  } catch(e) {
    console.error('Upload test error:', e.message);
  }
}
testUpload();
