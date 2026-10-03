const http = require('http');

function postJson(path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request({
      hostname: '127.0.0.1',
      port: 80,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  console.log('Testing api/enquiries.php POST...');
  const res1 = await postJson('/p/api/enquiries.php', {
    customerName: 'Ananya Sharma',
    mobileNumber: '+91 9876543210',
    productName: 'Crimson Red Velvet Zardozi Bridal Lehenga',
    message: 'Interested in bridal consultation'
  });
  console.log('Enquiries POST result:', res1);

  console.log('\nTesting api/wholesale.php POST...');
  const res2 = await postJson('/p/api/wholesale.php', {
    businessName: 'Sharma Boutique',
    contactPerson: 'Ananya Sharma',
    phone: '+91 9876543210',
    email: 'ananya@example.com',
    city: 'Jaipur',
    approxQuantity: '25 Pcs'
  });
  console.log('Wholesale POST result:', res2);
}

run();
