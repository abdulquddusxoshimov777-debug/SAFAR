const fs = require('fs');
const html = fs.readFileSync('d:/Saffar/public/index.html', 'utf8');

// Find all sections
const regex = /<section[^>]*id=['"]([^'"]+)['"]/g;
let m;
while ((m = regex.exec(html)) !== null) {
  console.log('Section found:', m[1], 'at position', m.index);
}
