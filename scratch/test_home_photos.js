async function test() {
  try {
    const res = await fetch('http://127.0.0.1/p/api/home_photos.php');
    console.log('home_photos HTTP Status:', res.status);
    const json = await res.json();
    console.log('home_photos Response:', JSON.stringify(json));
  } catch(e) {
    console.error('Fetch error:', e.message);
  }
}
test();
