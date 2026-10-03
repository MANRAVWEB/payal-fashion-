async function testUpdate() {
  try {
    const payload = {
      photos: {
        colBridal: "assets/images/collection-bridal.jpg"
      }
    };
    const res = await fetch('http://127.0.0.1/p/api/home_photos.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    console.log('POST home_photos status:', res.status);
    const json = await res.json();
    console.log('POST home_photos response:', json);
  } catch(e) {
    console.error('POST error:', e.message);
  }
}
testUpdate();
