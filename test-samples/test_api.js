import fs from 'fs';
import http from 'http';

function testUpload(filename) {
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  const filePath = `test-samples/${filename}`;
  const fileData = fs.readFileSync(filePath);

  let body = '';
  body += `--${boundary}\r\n`;
  body += `Content-Disposition: form-data; name="resume"; filename="${filename}"\r\n`;
  body += `Content-Type: application/pdf\r\n\r\n`;

  const bodyEnd = `\r\n--${boundary}--\r\n`;
  const payload = Buffer.concat([
    Buffer.from(body, 'utf8'),
    fileData,
    Buffer.from(bodyEnd, 'utf8')
  ]);

  const req = http.request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/categorize',
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': payload.length
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`\n=== Response for ${filename} ===`);
      console.log(data);
    });
  });

  req.on('error', (err) => {
    console.error(`Error uploading ${filename}:`, err.message);
  });

  req.write(payload);
  req.end();
}

testUpload('frontend_resume.pdf');
setTimeout(() => testUpload('data_analyst_resume.pdf'), 500);
setTimeout(() => testUpload('ui_ux_resume.pdf'), 1000);
