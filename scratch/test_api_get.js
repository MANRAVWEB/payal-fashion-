const http = require('http');

function getJson(path) {
  return new Promise((resolve, reject) => {
    http.get({
      hostname: '127.0.0.1',
      port: 80,
      path: path
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
    }).on('error', reject);
  });
}

async function run() {
  console.log('--- GET enquiries ---');
  const enq = await getJson('/p/api/enquiries.php');
  console.log('Enquiries count:', enq.body.count, enq.body.enquiries[0]);

  console.log('\n--- GET wholesale ---');
  const who = await getJson('/p/api/wholesale.php');
  console.log('Wholesale count:', who.body.count, who.body.leads[0]);
}

run();
