async function test() {
  try {
    const res = await fetch('http://127.0.0.1/p/api/products.php');
    console.log('HTTP Status:', res.status);
    const json = await res.json();
    console.log('Response:', JSON.stringify(json).slice(0, 200));
  } catch(e) {
    console.error('Fetch error:', e.message);
  }
}
test();
