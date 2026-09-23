const fs = require('fs');
let html = fs.readFileSync('d:/Safar/public/index.html', 'utf8');

const isCrlf = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

// 1. Extract Hero part (from start of file to end of </header>)
const headerEnd = html.indexOf('</header>');
if (headerEnd === -1) {
  console.error('</header> not found');
  process.exit(1);
}
let topPart = html.slice(0, headerEnd + 9);

// Make sure hero h1 has "kashf" in color-clay
topPart = topPart.replace(
  '<h1>\n      <span data-i18n="hero_title">O\'zbekistonni kashf eting</span>\n    </h1>',
  '<h1>\n      <span data-i18n="hero_title">O\'zbekistonni <span style="color:var(--clay);">kashf</span> eting</span>\n    </h1>'
);

// 2. Extract about-section
const aboutStart = html.indexOf('<section id="about-section"');
const aboutEnd = html.indexOf('</section>', aboutStart) + 10;
const aboutSection = html.slice(aboutStart, aboutEnd);

// 3. Extract weather-section
const weatherStart = html.indexOf('<section id="weather-section"');
const weatherEnd = html.indexOf('</section>', weatherStart) + 10;
const weatherSection = html.slice(weatherStart, weatherEnd);

// 4. Extract metro-banner-section
const metroStart = html.indexOf('<section id="metro-banner-section"');
const metroEnd = html.indexOf('</section>', metroStart) + 10;
const metroSection = html.slice(metroStart, metroEnd);

// 5. Extract homes-gallery or create Curated Photos Gallery
const homesStart = html.indexOf('<section id="homes-gallery"');
const homesEnd = html.indexOf('</section>', homesStart) + 10;
let homesSection = "";
if (homesStart !== -1) {
  homesSection = html.slice(homesStart, homesEnd);
}

// 6. Extract reviews-section
const reviewsStart = html.indexOf('<section id="reviews-section"');
const reviewsEnd = html.indexOf('</section>', reviewsStart) + 10;
const reviewsSection = html.slice(reviewsStart, reviewsEnd);

// 7. Extract scripts and footer mount (from <div id="site-footer"> to end of file)
const footerMountIdx = html.indexOf('<div id="site-footer"></div>');
const footerAndScripts = html.slice(footerMountIdx);

// Build Section 2: "O'zbekistonning har bir burchagidan tanlab olingan rasmlar"
// If homesSection exists, adapt it to emphasize the photos and curated selections!
const curatedPhotosSection = `<!-- ============ O'ZBEKISTONNING HAR BIR BURCHAGIDAN TANLAB OLINGAN RASMLAR ============ -->
<section id="curated-photos-section" style="padding:60px 0 50px; background:var(--sand-light);">
  <div class="container">
    <div class="section-head" style="margin-bottom:28px;">
      <div>
        <span class="eyebrow">Fotogalereya & Sayohat Maskonlari</span>
        <h2 style="font-family:var(--font-display); font-size:clamp(26px, 3.8vw, 36px); color:var(--indigo); margin-top:4px;">
          O'zbekistonning har bir burchagidan tanlab olingan rasmlar
        </h2>
        <p style="margin-top:6px; color:rgba(28,26,23,0.7); max-width:640px; font-size:15px;">
          Registon maydonidan tortib Orol dengizi kemalarigacha, Buxoro gumbazlaridan Zomin tog'larigacha bo'lgan betakror go'zalliklar. (Rasmni to'liq ko'rish uchun ustiga bosing)
        </p>
      </div>
      <a href="places.html" class="view-all">Barcha joylarni ko'rish →</a>
    </div>

    <!-- Curated Mosaic Gallery Grid (Interactive Fullscreen Lightbox on click) -->
    <div class="curated-photos-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">
      <!-- Photo 1: Samarqand Registon -->
      <div class="curated-gallery-img" style="position:relative; height:240px; border-radius:18px; overflow:hidden; cursor:pointer; box-shadow:0 8px 24px rgba(0,0,0,0.08); transition:transform 0.25s ease;">
        <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85" alt="Samarqand Registon" style="width:100%; height:100%; object-fit:cover; transition:transform 0.4s ease;" loading="lazy">
        <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(10,18,40,0.85) 0%, rgba(0,0,0,0.1) 60%); display:flex; flex-direction:column; justify-content:flex-end; padding:18px; color:#fff;">
          <span style="font-size:11px; text-transform:uppercase; font-weight:800; letter-spacing:1px; color:#ffd54f;">Samarqand</span>
          <h3 style="font-size:18px; margin:3px 0 0; font-family:var(--font-display);">Registon Maydoni</h3>
        </div>
      </div>

      <!-- Photo 2: Buxoro Minorai Kalon -->
      <div class="curated-gallery-img" style="position:relative; height:240px; border-radius:18px; overflow:hidden; cursor:pointer; box-shadow:0 8px 24px rgba(0,0,0,0.08); transition:transform 0.25s ease;">
        <img src="https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=85" alt="Buxoro Minorai Kalon" style="width:100%; height:100%; object-fit:cover; transition:transform 0.4s ease;" loading="lazy">
        <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(10,18,40,0.85) 0%, rgba(0,0,0,0.1) 60%); display:flex; flex-direction:column; justify-content:flex-end; padding:18px; color:#fff;">
          <span style="font-size:11px; text-transform:uppercase; font-weight:800; letter-spacing:1px; color:#ffd54f;">Buxoro</span>
          <h3 style="font-size:18px; margin:3px 0 0; font-family:var(--font-display);">Poyi Kalon Majmuasi</h3>
        </div>
      </div>

      <!-- Photo 3: Xiva Ichan Qal'a -->
      <div class="curated-gallery-img" style="position:relative; height:240px; border-radius:18px; overflow:hidden; cursor:pointer; box-shadow:0 8px 24px rgba(0,0,0,0.08); transition:transform 0.25s ease;">
        <img src="https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=85" alt="Xiva Ichan Qala" style="width:100%; height:100%; object-fit:cover; transition:transform 0.4s ease;" loading="lazy">
        <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(10,18,40,0.85) 0%, rgba(0,0,0,0.1) 60%); display:flex; flex-direction:column; justify-content:flex-end; padding:18px; color:#fff;">
          <span style="font-size:11px; text-transform:uppercase; font-weight:800; letter-spacing:1px; color:#ffd54f;">Xiva (Xorazm)</span>
          <h3 style="font-size:18px; margin:3px 0 0; font-family:var(--font-display);">Ichan Qal'a Qadimiy Shahri</h3>
        </div>
      </div>

      <!-- Photo 4: Toshkent Chorsu Bozori -->
      <div class="curated-gallery-img" style="position:relative; height:240px; border-radius:18px; overflow:hidden; cursor:pointer; box-shadow:0 8px 24px rgba(0,0,0,0.08); transition:transform 0.25s ease;">
        <img src="https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=1200&q=85" alt="Toshkent Chorsu" style="width:100%; height:100%; object-fit:cover; transition:transform 0.4s ease;" loading="lazy">
        <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(10,18,40,0.85) 0%, rgba(0,0,0,0.1) 60%); display:flex; flex-direction:column; justify-content:flex-end; padding:18px; color:#fff;">
          <span style="font-size:11px; text-transform:uppercase; font-weight:800; letter-spacing:1px; color:#ffd54f;">Toshkent</span>
          <h3 style="font-size:18px; margin:3px 0 0; font-family:var(--font-display);">Chorsu Moviy Gumbazi</h3>
        </div>
      </div>

      <!-- Photo 5: Zomin Tog'lari -->
      <div class="curated-gallery-img" style="position:relative; height:240px; border-radius:18px; overflow:hidden; cursor:pointer; box-shadow:0 8px 24px rgba(0,0,0,0.08); transition:transform 0.25s ease;">
        <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85" alt="Zomin Tog'lari" style="width:100%; height:100%; object-fit:cover; transition:transform 0.4s ease;" loading="lazy">
        <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(10,18,40,0.85) 0%, rgba(0,0,0,0.1) 60%); display:flex; flex-direction:column; justify-content:flex-end; padding:18px; color:#fff;">
          <span style="font-size:11px; text-transform:uppercase; font-weight:800; letter-spacing:1px; color:#ffd54f;">Jizzax</span>
          <h3 style="font-size:18px; margin:3px 0 0; font-family:var(--font-display);">Zomin Milliy Bog'i va Tog'lari</h3>
        </div>
      </div>

      <!-- Photo 6: Mo'ynoq va Orol dengizi -->
      <div class="curated-gallery-img" style="position:relative; height:240px; border-radius:18px; overflow:hidden; cursor:pointer; box-shadow:0 8px 24px rgba(0,0,0,0.08); transition:transform 0.25s ease;">
        <img src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=85" alt="Moynoq Orol dengizi" style="width:100%; height:100%; object-fit:cover; transition:transform 0.4s ease;" loading="lazy">
        <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(10,18,40,0.85) 0%, rgba(0,0,0,0.1) 60%); display:flex; flex-direction:column; justify-content:flex-end; padding:18px; color:#fff;">
          <span style="font-size:11px; text-transform:uppercase; font-weight:800; letter-spacing:1px; color:#ffd54f;">Qoraqalpog'iston</span>
          <h3 style="font-size:18px; margin:3px 0 0; font-family:var(--font-display);">Mo'ynoq Kemalar Qabristoni</h3>
        </div>
      </div>
    </div>
  </div>
</section>`;

// Build Section 4: "O'zbekiston Statistikasi Banner" (Like the Metro banner, links to stats.html)
const statsBannerSection = `<!-- ============ UZBEKISTAN STATS BANNER SECTION (Huddi metroga oxshagan bolim) ============ -->
<section id="stats-banner-section" style="padding:36px 0; background:var(--sand-light);">
  <div class="container">
    <div style="background:linear-gradient(135deg, #16233f 0%, #1e3a6a 100%); color:#ffffff; border-radius:24px; padding:32px 30px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:20px; box-shadow:0 10px 30px rgba(22,35,63,0.15);">
      <div style="max-width:620px;">
        <div style="display:inline-flex; align-items:center; gap:6px; background:rgba(255,213,79,0.2); border:1px solid rgba(255,213,79,0.4); color:#ffd54f; font-size:12px; font-weight:800; padding:4px 12px; border-radius:999px; margin-bottom:10px; text-transform:uppercase; letter-spacing:0.5px;">
          <span>📊</span> O'zbekiston Statistikasi & Tahlillar
        </div>
        <h2 style="font-family:var(--font-display); font-size:clamp(22px, 3.5vw, 30px); margin:0 0 8px; color:#ffffff; line-height:1.25;">
          O'zbekiston Turizm va Milliy Statistikasi
        </h2>
        <p style="font-size:14.5px; opacity:0.88; line-height:1.5; margin:0;">
          Yillar kesimida O'zbekistonga kelgan sayyohlar oqimi, davlatlar bo'yicha turistlar reytingi, viloyatlar taqsimoti va barcha rasmiy jadvallar bir joyda.
        </p>
      </div>
      <div>
        <a href="stats.html" style="display:inline-flex; align-items:center; gap:8px; background:var(--clay); color:#ffffff; text-decoration:none; font-weight:800; font-size:14.5px; padding:14px 26px; border-radius:14px; box-shadow:0 6px 18px rgba(200,93,40,0.3); transition:transform 0.15s ease;">
          Barcha Statistikalarni Ko'rish (Jadvallar) →
        </a>
      </div>
    </div>
  </div>
</section>`;

// Assemble the final index.html in the EXACT sequence requested by the user:
// 1. Header & Hero
// 2. Curated photos from every corner of Uzbekistan
// 3. Biz haqimizda (About Safar)
// 4. O'zbekiston Statistikasi (Stats Banner -> stats.html)
// 5. Toshkent Metrosi (Metro Banner -> metro.html)
// 6. Ob-havo (Weather Section with 3 regions + toggle)
// 7. Haqiqiy sayohatlardan haqiqiy hikoyalar (Reviews Section)
// 8. Site Footer (Dark blue footer)

const finalHtml = [
  topPart,
  curatedPhotosSection,
  aboutSection,
  statsBannerSection,
  metroSection,
  weatherSection,
  reviewsSection,
  footerAndScripts
].join('\n\n');

if (isCrlf) {
  fs.writeFileSync('d:/Safar/public/index.html', finalHtml.replace(/\n/g, '\r\n'), 'utf8');
} else {
  fs.writeFileSync('d:/Safar/public/index.html', finalHtml, 'utf8');
}

console.log('index.html reordered and assembled successfully in the exact user order!');
