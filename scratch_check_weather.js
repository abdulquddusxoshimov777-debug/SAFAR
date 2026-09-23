const fs = require('fs');
const html = fs.readFileSync('d:/Safar/public/index.html', 'utf8');
const wIdx = html.indexOf('id="weather-section"');
const wEnd = html.indexOf('</section>', wIdx);
console.log(html.slice(wIdx, wEnd + 10));
