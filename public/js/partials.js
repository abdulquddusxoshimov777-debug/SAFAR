// Renders the shared header/footer and reflects sign-in state in the nav.
(function () {
  const API = window.SAFAR_API_BASE || (location.protocol === "file:" ? "http://localhost:4000" : "");

  function currentPage() {
    return (location.pathname.split("/").pop() || "index.html");
  }

  function getSession() {
    const token = localStorage.getItem("safar_token");
    const userRaw = localStorage.getItem("safar_user");
    if (!token || !userRaw) return null;
    try {
      return { token, user: JSON.parse(userRaw) };
    } catch {
      return null;
    }
  }

  function initials(name) {
    return (name || "?")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("");
  }

  const UZ_REGIONS = [
    { value: "Toshkent", label: "Toshkent shahri va viloyati" },
    { value: "Samarqand", label: "Samarqand" },
    { value: "Buxoro", label: "Buxoro" },
    { value: "Xorazm", label: "Xorazm / Xiva" },
    { value: "Andijon", label: "Andijon" },
    { value: "Farg'ona", label: "Farg'ona" },
    { value: "Namangan", label: "Namangan" },
    { value: "Qashqadaryo", label: "Qashqadaryo" },
    { value: "Surxondaryo", label: "Surxondaryo" },
    { value: "Jizzax", label: "Jizzax" },
    { value: "Navoiy", label: "Navoiy" },
    { value: "Sirdaryo", label: "Sirdaryo" },
    { value: "Qoraqalpog'iston", label: "Qoraqalpog'iston" }
  ];

  const CATEGORY_TAGS = {
    foods: [
      { value: "Liquid Dishes", label: "🍲 Suyuq taomlar (Sho'rva, Mastava, Lag'mon...)" },
      { value: "Main Dishes", label: "🍛 Quyuq taomlar (Osh, Dimlama, Qovurma...)" },
      { value: "Dough-Based Foods and Breads", label: "🥟 Xamir ovqatlar va pishiriqlar (Somsa, Manti, Non...)" },
      { value: "Meat Dishes and Kebabs", label: "🥩 Goʻshtli taomlar va kaboblar (Shashlik, Jiz, Qazi...)" },
      { value: "Salads and Cold Appetizers", label: "🥗 Salatlar va sovuq gazaklar (Achchiq-chuchuk...)" },
      { value: "Sweets and Traditional Desserts", label: "🍯 Shirinliklar va milliy qandolat (Holva, Nisholda...)" }
    ],
    places: [
      { value: "Monuments", label: "🏛 Tarixiy obidalar va Maqbaralar" },
      { value: "Parks", label: "🌳 Bog'lar, Parklar va Xiyobonlar" },
      { value: "Bazaars", label: "🛍 Sharqiy Bozorlar va Savdo Rastalar" },
      { value: "Nature", label: "⛰ Tabiat, Tog'lar, Ko'llar va Sharsharalar" },
      { value: "Museums", label: "🎨 Muzeylar va San'at Galereyalari" }
    ],
    homes: [
      { value: "Official Hotel", label: "Hotel" },
      { value: "Home Hotel", label: "UY Hotel" },
      { value: "Night Hotel", label: "Hostel" },
      { value: "Mountain view", label: "Dacha" },
      { value: "Yurt stay", label: "Chodir" },
      { value: "Historical", label: "Tarixiy" }
    ],
    crafts: [
      { value: "Sopolchilik", label: "🏺 Sopolchilik va Kulolchilik (Rishton, G'ijduvon)" },
      { value: "To'qimachilik", label: "🧵 Atlas, Adras va Ipak Mahsulotlari" },
      { value: "Zardo'zlik", label: "👑 Zardo'zlik, Kashtachilik va So'zana" },
      { value: "Temirchilik", label: "🗡 Chust va Shahrixon Pichoqlari" },
      { value: "Qog'ozchilik", label: "📜 Samarqand Ipak Qog'ozi" },
      { value: "Yog'och o'ymakorligi", label: "🪵 Yog'och o'ymakorligi va Naqqoshlik" }
    ]
  };

  function renderHeader() {
    const mount = document.getElementById("site-header");
    if (!mount) return;
    const page = currentPage();
    const session = getSession();

    const navLink = (href, i18nKey, label, icon) =>
      `<a href="${href}" class="nav-tab ${page === href ? "active" : ""}" data-i18n="${i18nKey}">
        ${icon}
        <span>${label}</span>
      </a>`;

    // Right-side controls: logged in vs guest
    let authControls = "";
    if (session) {
      const isHost = session.user.role === "host";
      const isAdmin = session.user.role === "admin" || session.user.email === "abdulquddusxoshimov777@gmail.com";
      const roleBadge = isAdmin ? "👑 Admin" : (isHost ? "🏠 Mezbon" : "✈️ Turist");
      const avatarHtml = session.user.avatarUrl
        ? `<img src="${session.user.avatarUrl}" style="width:26px; height:26px; border-radius:50%; object-fit:cover; margin-right:4px;">`
        : `<span class="avatar-dot" aria-hidden="true">${initials(session.user.name)}</span>`;

      authControls = `<a href="account.html" class="signin-btn" title="${session.user.name} (${roleBadge})" aria-label="Account profile for ${session.user.name}">
           ${avatarHtml}
           <span>${session.user.name.split(" ")[0]}</span>
           <span style="font-size:11px; background:rgba(255,255,255,0.18); padding:2px 7px; border-radius:10px; margin-left:4px; font-weight:700;">${roleBadge}</span>
         </a>`;
    } else {
      authControls = `<div class="auth-nav-btns">
           <a href="login.html" class="btn-nav-login" data-i18n="nav_login">Log in</a>
           <a href="signup.html" class="btn-nav-signup" data-i18n="nav_signup">Sign up</a>
         </div>`;
    }

    const currLangCode = (localStorage.getItem("safar_lang") || "uz").toLowerCase();

    mount.innerHTML = `
      <nav class="nav" aria-label="Main navigation">
        <div class="container nav-row">
          <div style="display:flex; align-items:center; gap:12px;">
            <button type="button" class="mobile-menu-toggle" id="openMobileMenuBtn" aria-label="Mobil menyuni ochish">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
            </button>
            <a href="index.html" class="brand" aria-label="Safar Home">
              <span class="brand-mark" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 20L9 8L13 15L16 10L21 20" stroke="#16233f" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/></svg>
              </span>
              Safar
            </a>
          </div>

          <ul class="nav-links desktop-only-nav">
            ${navLink("index.html", "nav_home", "Home",
              `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`
            )}
            ${navLink("places.html", "nav_places", "Places",
              `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s7-7.4 7-12a7 7 0 10-14 0c0 4.6 7 12 7 12z" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.7"/></svg>`
            )}
            ${navLink("stays.html", "nav_homes", "Homes",
              `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V10.5z" stroke="currentColor" stroke-width="1.7"/><path d="M9 21V12h6v9" stroke="currentColor" stroke-width="1.7"/></svg>`
            )}
            ${navLink("foods.html", "nav_foods", "Foods",
              `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`
            )}
            ${navLink("crafts.html", "nav_crafts", "Buyumlar",
              `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`
            )}
          </ul>

          <div class="nav-actions">
            <a href="#" id="openAddListingBtn" class="add-nav-btn" title="Yangi joy qo'shish" aria-label="Add new listing">
              + Add
            </a>
            <a href="saved.html" class="liked-nav-btn desktop-only-actions" title="Sevimlilar" aria-label="View saved items">
              ❤️
            </a>
            <div class="lang-pill" id="siteLangPill" tabIndex="0" role="button" aria-label="Language selector">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" stroke="currentColor" stroke-width="1.6"/></svg>
              <span id="siteLangLabel">${currLangCode.toUpperCase()}</span>
              <div class="lang-dropdown" id="siteLangDropdown">
                <button type="button" class="lang-option ${currLangCode === 'uz' ? 'active' : ''}" data-lang="uz">🇺🇿 O'zbek</button>
                <button type="button" class="lang-option ${currLangCode === 'ru' ? 'active' : ''}" data-lang="ru">🇷🇺 Русский</button>
                <button type="button" class="lang-option ${currLangCode === 'en' ? 'active' : ''}" data-lang="en">🇬🇧 English</button>
              </div>
            </div>
            ${authControls}
          </div>
        </div>
      </nav>

      <!-- Mobile Nav Drawer -->
      <div class="mobile-drawer-backdrop" id="mobileDrawerBackdrop"></div>
      <aside class="mobile-nav-drawer" id="mobileNavDrawer" aria-label="Mobil navigatsiya paneli">
        <div class="mobile-drawer-header">
          <div class="brand" style="font-size:22px;">
            <span class="brand-mark" style="width:30px; height:30px;" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 20L9 8L13 15L16 10L21 20" stroke="#16233f" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/></svg>
            </span>
            Safar
          </div>
          <button type="button" class="mobile-drawer-close" id="closeMobileDrawerBtn" aria-label="Yopish">✕</button>
        </div>
        <div class="mobile-drawer-links">
          <a href="index.html" class="${page === 'index.html' ? 'active' : ''}">🏠 Asosiy (Home)</a>
          <a href="places.html" class="${page === 'places.html' ? 'active' : ''}">🏛 Diqqatga sazovor joylar (Places)</a>
          <a href="stays.html" class="${page === 'stays.html' ? 'active' : ''}">🏨 Uylar va Mehmonxonalar (Homes)</a>
          <a href="foods.html" class="${page === 'foods.html' ? 'active' : ''}">🍲 Milliy taomlar (Foods)</a>
          <a href="crafts.html" class="${page === 'crafts.html' ? 'active' : ''}">🏺 Hunarmandchilik (Crafts)</a>
          <a href="saved.html" class="${page === 'saved.html' ? 'active' : ''}">❤️ Sevimlilar ro'yxati (Saved)</a>
          <a href="#" onclick="const b=document.getElementById('openAddListingBtn');if(b)b.click();closeMobileMenu();return false;" style="background:var(--turquoise-deep); color:#fff; font-weight:700;">➕ Yangi e'lon joylash</a>
        </div>
        <div class="mobile-drawer-footer">
          ${session ? `
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
              ${session.user.avatarUrl ? `<img src="${session.user.avatarUrl}" style="width:36px; height:36px; border-radius:50%; object-fit:cover;">` : `<div class="avatar-dot" style="width:36px; height:36px; font-size:14px;">${initials(session.user.name)}</div>`}
              <div style="line-height:1.2;">
                <div style="font-weight:700; font-size:14px; color:#fff;">${escapeHtml(session.user.name)}</div>
                <div style="font-size:12px; opacity:0.7;">${escapeHtml(session.user.email)}</div>
              </div>
            </div>
            <a href="account.html" class="btn btn-primary" style="text-align:center; padding:10px; font-size:14px; text-decoration:none;">👤 Profil kabineti</a>
          ` : `
            <a href="login.html" class="btn btn-primary" style="text-align:center; padding:10px; font-size:14px; text-decoration:none;">Kirish (Log in)</a>
            <a href="signup.html" class="btn btn-ghost" style="text-align:center; padding:10px; font-size:14px; text-decoration:none; color:#fff; border-color:rgba(255,255,255,0.3);">Ro'yxatdan o'tish (Sign up)</a>
          `}
        </div>
      </aside>

      <!-- Smartfonlar uchun qulay Pastki Navigatsiya Paneli (Bottom Nav Bar - 9:16 formati) -->
      <nav class="mobile-bottom-nav" aria-label="Pastki mobil navigatsiya">
        <a href="index.html" class="bottom-nav-item ${page === 'index.html' ? 'active' : ''}">
          <span class="b-icon">🏠</span>
          <span class="b-label">Asosiy</span>
        </a>
        <a href="places.html" class="bottom-nav-item ${page === 'places.html' ? 'active' : ''}">
          <span class="b-icon">🏛</span>
          <span class="b-label">Joylar</span>
        </a>
        <a href="stays.html" class="bottom-nav-item ${page === 'stays.html' ? 'active' : ''}">
          <span class="b-icon">🏨</span>
          <span class="b-label">Uylar</span>
        </a>
        <a href="foods.html" class="bottom-nav-item ${page === 'foods.html' ? 'active' : ''}">
          <span class="b-icon">🍲</span>
          <span class="b-label">Taomlar</span>
        </a>
        <a href="crafts.html" class="bottom-nav-item ${page === 'crafts.html' ? 'active' : ''}">
          <span class="b-icon">🏺</span>
          <span class="b-label">Buyumlar</span>
        </a>
        <a href="${session ? 'account.html' : 'login.html'}" class="bottom-nav-item ${(page === 'account.html' || page === 'login.html') ? 'active' : ''}">
          <span class="b-icon">${session ? '👤' : '🔑'}</span>
          <span class="b-label">${session ? 'Kabinet' : 'Kirish'}</span>
        </a>
      </nav>
    `;

    // Mobile drawer event listeners
    const openBtn = document.getElementById("openMobileMenuBtn");
    const closeBtn = document.getElementById("closeMobileDrawerBtn");
    const drawer = document.getElementById("mobileNavDrawer");
    const backdrop = document.getElementById("mobileDrawerBackdrop");

    function openMobileMenu() {
      if (drawer) drawer.classList.add("open");
      if (backdrop) backdrop.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function closeMobileMenu() {
      if (drawer) drawer.classList.remove("open");
      if (backdrop) backdrop.classList.remove("open");
      document.body.style.overflow = "";
    }
    window.closeMobileMenu = closeMobileMenu;

    if (openBtn) openBtn.onclick = openMobileMenu;
    if (closeBtn) closeBtn.onclick = closeMobileMenu;
    if (backdrop) backdrop.onclick = closeMobileMenu;
  }

  function renderFooter() {
    const mount = document.getElementById("site-footer");
    if (!mount) return;
    mount.innerHTML = `
      <footer role="contentinfo">
        <div class="container">
          <div class="footer-grid">
            <div>
              <div class="brand">
                <span class="brand-mark" style="background:rgba(251,247,238,0.12)" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 20L9 8L13 15L16 10L21 20" stroke="#fbf7ee" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/></svg>
                </span>
                Safar
              </div>
              <p style="max-width:260px;font-size:14px;color:rgba(251,247,238,0.85);">Unique places to stay, local foods and traditional crafts across Uzbekistan.</p>
            </div>
            <div>
              <h4>Explore</h4>
              <ul>
                <li><a href="places.html">Popular Places</a></li>
                <li><a href="stays.html">Homes &amp; Stays</a></li>
                <li><a href="foods.html">Uzbek Foods</a></li>
                <li><a href="crafts.html">Traditional Crafts</a></li>
                <li><a href="services.html">Services &amp; Products</a></li>
                <li><a href="saved.html">Saved Items</a></li>
              </ul>
            </div>
            <div>
              <h4>Company</h4>
              <ul>
                <li><a href="about.html">About Safar</a></li>
                <li><a href="services.html">Our Services</a></li>
                <li><a href="contact.html">Contact Us</a></li>
                <li><a href="contact.html">FAQs &amp; Help</a></li>
              </ul>
            </div>
            <div>
              <h4>Hosting</h4>
              <ul>
                <li><a href="#" onclick="const b=document.getElementById('openAddListingBtn');if(b)b.click();return false;">Host your home</a></li>
                <li><a href="#" onclick="const b=document.getElementById('openAddListingBtn');if(b)b.click();return false;">Host food experience</a></li>
                <li><a href="about.html">Responsible hosting</a></li>
                <li><a href="contact.html">Support center</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <span>&copy; 2026 Safar. Explore Uzbekistan.</span>
            <span class="legal"><a href="about.html">Privacy</a><a href="about.html">Terms</a><a href="services.html">Services</a></span>
          </div>
        </div>
      </footer>`;
  }

  function compressImageFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const MAX_W = 1200;
          const MAX_H = 1200;
          let w = img.width;
          let h = img.height;
          if (w > MAX_W) { h = Math.round(h * MAX_W / w); w = MAX_W; }
          if (h > MAX_H) { h = Math.round(h * MAX_H / h); h = MAX_H; }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function updateTagSelectOptions(categoryVal, tagSelectEl, customInputEl, selectedTag = "") {
    const list = CATEGORY_TAGS[categoryVal] || CATEGORY_TAGS.homes;
    tagSelectEl.innerHTML = `
      <option value="">Toifani / Turini tanlang *</option>
      ${list.map(t => `<option value="${escapeHtml(t.value)}">${escapeHtml(t.label)}</option>`).join("")}
      <option value="__custom__">✏️ Boshqa tur (Qo'lda kiritish)</option>
    `;
    const found = list.some(t => t.value === selectedTag);
    if (found) {
      tagSelectEl.value = selectedTag;
      if (customInputEl) customInputEl.style.display = "none";
    } else if (selectedTag) {
      tagSelectEl.value = "__custom__";
      if (customInputEl) {
        customInputEl.style.display = "block";
        customInputEl.value = selectedTag;
      }
    } else {
      tagSelectEl.value = "";
      if (customInputEl) customInputEl.style.display = "none";
    }
  }

  function initAddListingModal() {
    if (document.getElementById("addListingModal")) return;

    const modalDiv = document.createElement("div");
    modalDiv.id = "addListingModal";
    modalDiv.className = "modal-overlay";
    modalDiv.style.display = "none";
    modalDiv.innerHTML = `
      <div class="modal-box" style="max-width:640px;">
        <div class="modal-header">
          <h3>➕ Yangi joy / e'lon qo'shish</h3>
          <button type="button" class="modal-close" id="closeAddListingModal">✕</button>
        </div>
        <form id="addListingForm">
          <div id="categoryCooldownNotice" style="display:none; padding:12px 16px; background:rgba(201,162,39,0.14); border:1px solid rgba(201,162,39,0.4); border-radius:12px; margin-bottom:14px; font-size:13px; color:var(--ink); line-height:1.5;"></div>
          <div class="rev-field">
            <label>Bo'lim / Kategoriya *</label>
            <select id="addCategory" class="field-input" style="width:100%; border-radius:12px; padding:10px 14px; font-weight:700;">
              <option value="homes">🏠 Uylar va turargohlar (Homes)</option>
              <option value="places">🏛 Diqqatga sazovor joylar (Places)</option>
              <option value="foods">🍲 Milliy taomlar (Foods)</option>
              <option value="crafts">🏺 Hunarmandchilik va buyumlar (Crafts)</option>
            </select>
          </div>

          <div class="rev-form-row">
            <div class="rev-field">
              <label>Sarlavha (Nomi) *</label>
              <input type="text" id="addTitle" placeholder="masalan: Samarkand Boutique Hotel / Chust Oshi" required>
            </div>
            <div class="rev-field">
              <label>Viloyat / Shahar *</label>
              <select id="addCity" class="field-input" style="width:100%; border-radius:12px; padding:10px 14px; font-weight:600;" required>
                <option value="">Viloyat / Shaharni tanlang *</option>
                ${UZ_REGIONS.map(r => `<option value="${r.value}">${r.label}</option>`).join("")}
              </select>
            </div>
          </div>

          <div class="rev-form-row">
            <div class="rev-field">
              <label>Narxi *</label>
              <div style="display:flex; gap:8px;">
                <input type="text" id="addPrice" placeholder="masalan: 65 yoki 200,000" required style="flex:1;">
                <select id="addPriceCurrency" style="width:110px; border-radius:12px; padding:10px 8px; font-weight:600;">
                  <option value="$">$ (USD)</option>
                  <option value="so'm">so'm (UZS)</option>
                </select>
              </div>
            </div>
            <div class="rev-field">
              <label id="addTagLabel">Turi / Toifasi *</label>
              <select id="addTag" class="field-input" style="width:100%; border-radius:12px; padding:10px 14px; font-weight:600;" required>
              </select>
              <input type="text" id="addCustomTag" placeholder="O'z turini kiriting (masalan: Choyxona, Sanatoriya)..." style="display:none; margin-top:8px;">
            </div>
          </div>

          <div class="rev-form-row">
            <div class="rev-field">
              <label>Telefon raqam</label>
              <input type="text" id="addPhone" placeholder="+998 90 123 45 67">
            </div>
            <div class="rev-field">
              <label>Manzil</label>
              <input type="text" id="addAddress" placeholder="Samarqand sh., Registon ko'chasi 10">
            </div>
          </div>

          <div class="rev-field">
            <label>Qulayliklar va Imkoniyatlar (Vergul bilan ajratib yozing)</label>
            <input type="text" id="addAmenities" placeholder="masalan: Wi-Fi, Basseyin, Nonushta, Konditsioner, Milliy choyxona">
          </div>

          <div class="rev-field">
            <label>Google Maps / Yandex Maps havola yoki Lokatsiya *</label>
            <div style="display:flex; gap:8px;">
              <input type="text" id="addMapsUrl" placeholder="https://maps.google.com/?q=41.3113,69.2797..." required style="flex:1;">
              <button type="button" id="btnDetectGps" class="btn btn-ghost" style="font-size:12.5px; padding:6px 12px; white-space:nowrap;">
                📍 GPS orqali aniqlash
              </button>
            </div>
            <small id="gpsStatus" style="color:var(--clay); font-weight:600; display:none; margin-top:4px;"></small>
          </div>

          <div class="rev-field">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <label>Tavsif (Kamida 10 ta so'z) *</label>
              <small id="wordCounter" style="font-weight:700; color:var(--clay);">0 / 10 so'z</small>
            </div>
            <textarea id="addDesc" rows="4" placeholder="Ushbu joy haqida batafsil ma'lumot va tajribalaringizni yozing (kamida 10 so'z)..." required></textarea>
          </div>

          <div class="rev-field">
            <label>Rasmlar (Kamida 2 ta rasm URL yoki fayl) *</label>
            
            <div id="urlInputsContainer">
              <div class="url-input-row" style="display:flex; gap:8px; margin-bottom:8px;">
                <input type="text" class="add-url-input" placeholder="Rasm 1 URL manzili" style="flex:1;">
              </div>
            </div>
            <button type="button" id="btnAddUrlInput" class="btn btn-ghost" style="font-size:12.5px; padding:6px 14px; margin-bottom:12px;">
              + Yana rasm URL qo'shish
            </button>

            <div style="font-size:12px; color:rgba(0,0,0,0.6); font-weight:600; margin-bottom:6px;">Yoki qurilmangizdan rasmlar yuklang (Multi-select / Ketma-ket qo'shish):</div>
            <input type="file" id="addFilesInput" accept="image/*" multiple style="font-size:13px;">
            <div id="addImagesPreview" style="display:flex; gap:10px; margin-top:12px; flex-wrap:wrap;"></div>
          </div>

          <div class="form-alert" id="addListingAlert"></div>
          <div class="form-success" id="addListingSuccess"></div>

          <button type="submit" class="btn btn-primary" id="submitAddListingBtn" style="width:100%; margin-top:12px;">Yangi joyni e'lon qilish</button>
        </form>
      </div>
    `;
    document.body.appendChild(modalDiv);

    const categorySelect = document.getElementById("addCategory");
    const tagSelect = document.getElementById("addTag");
    const customTagInput = document.getElementById("addCustomTag");

    async function checkCooldown(selectedCat) {
      const noticeBox = document.getElementById("categoryCooldownNotice");
      const submitBtn = document.getElementById("submitAddListingBtn");
      if (!noticeBox) return;
      const session = getSession();
      if (!session) return;
      if (session.user.role === "admin" || session.user.email === "abdulquddusxoshimov777@gmail.com") {
        noticeBox.style.display = "none";
        if (submitBtn) submitBtn.disabled = false;
        return;
      }
      try {
        const res = await fetch(`${API}/api/me/cooldowns`, {
          headers: { Authorization: `Bearer ${session.token}` }
        });
        const d = await res.json();
        if (d.ok && d.cooldowns && d.cooldowns[selectedCat]) {
          const c = d.cooldowns[selectedCat];
          if (!c.canPost) {
            const catNames = { homes: "Uylar", places: "Diqqatga sazovor joylar", foods: "Milliy taomlar", crafts: "Hunarmandchilik" };
            noticeBox.innerHTML = `⏳ <strong>15 kunlik cheklov:</strong> Siz <em>${catNames[selectedCat] || selectedCat}</em> bo'limiga 15 kunda 1 ta e'lon joylay olasiz. Ushbu bo'limga navbatdagi e'lonni <strong>${c.remainingDays} kundan keyin</strong> qo'shishingiz mumkin.<br><small style="color:rgba(28,26,23,0.7); display:inline-block; margin-top:4px;">💡 Ammo siz hoziroq boshqa bo'limlarga e'lon qo'sha olasiz!</small>`;
            noticeBox.style.display = "block";
            if (submitBtn) submitBtn.disabled = true;
          } else {
            noticeBox.style.display = "none";
            if (submitBtn) submitBtn.disabled = false;
          }
        } else {
          noticeBox.style.display = "none";
          if (submitBtn) submitBtn.disabled = false;
        }
      } catch(e) {
        noticeBox.style.display = "none";
      }
    }

    // Initialize tag dropdown based on initial category
    updateTagSelectOptions(categorySelect.value, tagSelect, customTagInput);
    checkCooldown(categorySelect.value);

    categorySelect.addEventListener("change", () => {
      updateTagSelectOptions(categorySelect.value, tagSelect, customTagInput);
      checkCooldown(categorySelect.value);
    });

    tagSelect.addEventListener("change", () => {
      if (tagSelect.value === "__custom__") {
        customTagInput.style.display = "block";
        customTagInput.focus();
      } else {
        customTagInput.style.display = "none";
      }
    });

    let detectedCoords = null;

    // GPS location detection handler
    const btnGps = document.getElementById("btnDetectGps");
    if (btnGps) {
      btnGps.onclick = () => {
        const statusEl = document.getElementById("gpsStatus");
        if (!navigator.geolocation) {
          alert("Brauzeringiz GPS lokatsiyani qo'llab-quvvatlamaydi.");
          return;
        }
        statusEl.style.display = "block";
        statusEl.textContent = "📍 GPS lokatsiyangiz aniqlanmoqda...";
        navigator.geolocation.getCurrentPosition((pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          detectedCoords = [lat, lng];
          document.getElementById("addMapsUrl").value = `https://maps.google.com/?q=${lat},${lng}`;
          statusEl.textContent = `✅ GPS aniqlandi: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }, (err) => {
          statusEl.textContent = "⚠️ GPS lokatsiyani aniqlab bo'lmadi. Havolani qo'lda kiriting.";
        });
      };
    }

    // Dynamic URL input adder
    let urlInputCount = 1;
    const btnAddUrl = document.getElementById("btnAddUrlInput");
    if (btnAddUrl) {
      btnAddUrl.onclick = () => {
        urlInputCount++;
        const div = document.createElement("div");
        div.className = "url-input-row";
        div.style.cssText = "display:flex; gap:8px; margin-bottom:8px;";
        div.innerHTML = `
          <input type="text" class="add-url-input" placeholder="Rasm ${urlInputCount} URL manzili" style="flex:1;">
          <button type="button" class="btn-remove-url" style="background:rgba(193,101,47,0.12); color:var(--clay); border:none; border-radius:8px; padding:0 12px; cursor:pointer; font-weight:700;" onclick="this.parentElement.remove()">✕</button>
        `;
        document.getElementById("urlInputsContainer").appendChild(div);
      };
    }

    // Word count indicator
    const descEl = document.getElementById("addDesc");
    const counterEl = document.getElementById("wordCounter");
    descEl.addEventListener("input", () => {
      const words = descEl.value.trim().split(/\s+/).filter(Boolean).length;
      counterEl.textContent = `${words} / 10 so'z`;
      counterEl.style.color = words >= 10 ? "var(--clay)" : "var(--ink)";
    });

    let uploadedBase64Images = [];
    const filesInput = document.getElementById("addFilesInput");
    const previewBox = document.getElementById("addImagesPreview");

    function renderImagesPreview() {
      previewBox.innerHTML = "";
      uploadedBase64Images.forEach((src, idx) => {
        const wrap = document.createElement("div");
        wrap.style.cssText = "position:relative; display:inline-block;";
        wrap.innerHTML = `
          <img src="${src}" style="width:75px; height:75px; object-fit:cover; border-radius:8px; border:1px solid var(--sand-dark);">
          <button type="button" style="position:absolute; top:-6px; right:-6px; background:var(--clay); color:#fff; border:none; border-radius:50%; width:20px; height:20px; font-size:11px; cursor:pointer; display:flex; align-items:center; justify-content:center;" onclick="removeUploadedImage(${idx})">✕</button>
        `;
        previewBox.appendChild(wrap);
      });
    }

    window.removeUploadedImage = function(index) {
      uploadedBase64Images.splice(index, 1);
      renderImagesPreview();
    };

    filesInput.addEventListener("change", () => {
      const files = Array.from(filesInput.files);
      let loaded = 0;
      files.forEach(file => {
        if (!file.type.startsWith("image/")) return;
        compressImageFile(file).then(compressed => {
          uploadedBase64Images.push(compressed);
          loaded++;
          if (loaded === files.length) renderImagesPreview();
        });
      });
      filesInput.value = "";
    });

    // Close button
    document.getElementById("closeAddListingModal").onclick = () => {
      modalDiv.style.display = "none";
    };
    modalDiv.addEventListener("click", e => {
      if (e.target === modalDiv) modalDiv.style.display = "none";
    });

    // Form submit logic
    const addForm = document.getElementById("addListingForm");
    addForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const session = getSession();
      const alertBox = document.getElementById("addListingAlert");
      const successBox = document.getElementById("addListingSuccess");
      alertBox.classList.remove("show");
      successBox.classList.remove("show");

      if (!session) {
        alert("Joy qo'shish uchun avval tizimga kiring.");
        location.href = "login.html?redirect=add";
        return;
      }

      const isAdmin = session.user.role === "admin" || session.user.email === "abdulquddusxoshimov777@gmail.com";
      if (session.user.role !== "host" && !isAdmin) {
        alertBox.textContent = "Faqat Joy beruvchi / Mezbon (Host) akkaunti joy qo'shishi mumkin. Joy beruvchi sifatida ro'yxatdan o'ting.";
        alertBox.classList.add("show");
        return;
      }

      const category = document.getElementById("addCategory").value;
      const title = document.getElementById("addTitle").value.trim();
      const city = document.getElementById("addCity").value.trim();
      const priceVal = document.getElementById("addPrice").value.trim();
      const priceCurrency = document.getElementById("addPriceCurrency").value;

      let tagVal = document.getElementById("addTag").value;
      if (tagVal === "__custom__") {
        tagVal = (document.getElementById("addCustomTag").value || "").trim() || "Boshqa";
      }
      if (!tagVal) tagVal = "Umumiy";

      const phone = document.getElementById("addPhone").value.trim();
      const address = document.getElementById("addAddress").value.trim();
      const amenitiesText = document.getElementById("addAmenities").value.trim();
      const googleMapsUrl = document.getElementById("addMapsUrl").value.trim();
      const desc = document.getElementById("addDesc").value.trim();

      // Collect URLs from dynamic inputs
      const urlInputs = Array.from(document.querySelectorAll(".add-url-input"));
      const urlImages = urlInputs.map(inp => inp.value.trim()).filter(Boolean);
      const allImgs = [...urlImages, ...uploadedBase64Images];

      if (!city) {
        alertBox.textContent = "Viloyat / Shaharni tanlash majburiy!";
        alertBox.classList.add("show");
        return;
      }

      if (!googleMapsUrl) {
        alertBox.textContent = "Google Maps / Yandex Maps havola yoki lokatsiyani kiritish majburiy!";
        alertBox.classList.add("show");
        return;
      }

      const wordsCount = desc.split(/\s+/).filter(Boolean).length;
      if (wordsCount < 10) {
        alertBox.textContent = `Tavsif kamida 10 ta so'zdan iborat bo'lishi kerak. (Hozirda ${wordsCount} ta so'z).`;
        alertBox.classList.add("show");
        return;
      }

      if (allImgs.length < 2) {
        alertBox.textContent = `Kamida 2 ta rasm kiritishingiz (yoki yuklashingiz) shart. (Hozircha ${allImgs.length} ta).`;
        alertBox.classList.add("show");
        return;
      }

      const btn = document.getElementById("submitAddListingBtn");
      btn.disabled = true;
      btn.textContent = "Jo'natilmoqda...";

      try {
        const res = await fetch(`${API}/api/listings/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.token}`
          },
          body: JSON.stringify({
            category,
            title,
            city,
            price: priceVal,
            priceCurrency,
            tag: tagVal,
            phone,
            address,
            amenities: amenitiesText,
            googleMapsUrl,
            coordinates: detectedCoords,
            desc,
            images: allImgs
          })
        });

        const data = await res.json();
        if (!data.ok) {
          alertBox.textContent = data.message || "Xatolik yuz berdi.";
          alertBox.classList.add("show");
        } else {
          successBox.textContent = data.message || "Yangi joy muvaffaqiyatli qo'shildi!";
          successBox.classList.add("show");
          addForm.reset();
          uploadedBase64Images = [];
          previewBox.innerHTML = "";
          counterEl.textContent = "0 / 10 so'z";

          setTimeout(() => {
            modalDiv.style.display = "none";
            successBox.classList.remove("show");
            if (category === "places") location.href = "places.html";
            else if (category === "foods") location.href = "foods.html";
            else if (category === "crafts") location.href = "crafts.html";
            else location.href = "stays.html";
          }, 1200);
        }
      } catch (err) {
        alertBox.textContent = "Server bilan bog'lanishda xatolik.";
        alertBox.classList.add("show");
      }

      btn.disabled = false;
      btn.textContent = "Yangi joyni e'lon qilish";
    });
  }

  // ==================== EDIT LISTING MODAL ====================
  let editExistingImages = [];
  let editNewUploadedImages = [];

  function initEditListingModal() {
    if (document.getElementById("editListingModal")) return;

    const modalDiv = document.createElement("div");
    modalDiv.id = "editListingModal";
    modalDiv.className = "modal-overlay";
    modalDiv.style.display = "none";
    modalDiv.innerHTML = `
      <div class="modal-box" style="max-width:640px;">
        <div class="modal-header">
          <h3>✏️ E'lonni tahrirlash</h3>
          <button type="button" class="modal-close" id="closeEditListingModal">✕</button>
        </div>
        <form id="editListingForm">
          <input type="hidden" id="editItemCategory">
          <input type="hidden" id="editItemId">

          <div class="rev-field">
            <label>Bo'lim / Kategoriya</label>
            <input type="text" id="editCategoryDisplay" disabled style="background:var(--sand-dark); opacity:0.85; font-weight:700;">
          </div>

          <div class="rev-form-row">
            <div class="rev-field">
              <label>Sarlavha (Nomi) *</label>
              <input type="text" id="editTitle" required>
            </div>
            <div class="rev-field">
              <label>Viloyat / Shahar *</label>
              <select id="editCity" class="field-input" style="width:100%; border-radius:12px; padding:10px 14px; font-weight:600;" required>
                ${UZ_REGIONS.map(r => `<option value="${r.value}">${r.label}</option>`).join("")}
              </select>
            </div>
          </div>

          <div class="rev-form-row">
            <div class="rev-field">
              <label>Narxi *</label>
              <div style="display:flex; gap:8px;">
                <input type="text" id="editPrice" required style="flex:1;">
                <select id="editPriceCurrency" style="width:110px; border-radius:12px; padding:10px 8px; font-weight:600;">
                  <option value="$">$ (USD)</option>
                  <option value="so'm">so'm (UZS)</option>
                </select>
              </div>
            </div>
            <div class="rev-field">
              <label id="editTagLabel">Turi / Toifasi *</label>
              <select id="editTag" class="field-input" style="width:100%; border-radius:12px; padding:10px 14px; font-weight:600;" required>
              </select>
              <input type="text" id="editCustomTag" placeholder="O'z turini kiriting..." style="display:none; margin-top:8px;">
            </div>
          </div>

          <div class="rev-form-row">
            <div class="rev-field">
              <label>Telefon raqam</label>
              <input type="text" id="editPhone" placeholder="+998 90 123 45 67">
            </div>
            <div class="rev-field">
              <label>Manzil</label>
              <input type="text" id="editAddress" placeholder="Samarqand sh., Registon ko'chasi 10">
            </div>
          </div>

          <div class="rev-field">
            <label>Qulayliklar va Imkoniyatlar (Vergul bilan ajratib yozing)</label>
            <input type="text" id="editAmenities" placeholder="masalan: Wi-Fi, Basseyin, Nonushta">
          </div>

          <div class="rev-field">
            <label>Google Maps / Yandex Maps havola yoki Lokatsiya *</label>
            <input type="text" id="editMapsUrl" placeholder="https://maps.google.com/?q=..." required>
          </div>

          <div class="rev-field">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <label>Tavsif (Kamida 10 ta so'z) *</label>
              <small id="editWordCounter" style="font-weight:700; color:var(--clay);">0 / 10 so'z</small>
            </div>
            <textarea id="editDesc" rows="4" required></textarea>
          </div>

          <div class="rev-field">
            <label>Mavjud rasmlar (Rasmni o'chirish uchun ✕ bosing):</label>
            <div id="editExistingImagesBox" style="display:flex; gap:10px; margin-bottom:12px; flex-wrap:wrap;"></div>

            <label style="margin-top:10px;">Yangi rasm URL qo'shish:</label>
            <div id="editUrlInputsContainer"></div>
            <button type="button" id="btnEditAddUrlInput" class="btn btn-ghost" style="font-size:12.5px; padding:6px 14px; margin-bottom:12px;">
              + Yana rasm URL qo'shish
            </button>

            <div style="font-size:12px; color:rgba(0,0,0,0.6); font-weight:600; margin-bottom:6px;">Yoki qurilmangizdan yangi rasmlar yuklang:</div>
            <input type="file" id="editFilesInput" accept="image/*" multiple style="font-size:13px;">
            <div id="editNewImagesPreview" style="display:flex; gap:10px; margin-top:10px; flex-wrap:wrap;"></div>
          </div>

          <div class="form-alert" id="editListingAlert"></div>
          <div class="form-success" id="editListingSuccess"></div>

          <button type="submit" class="btn btn-primary" id="submitEditListingBtn" style="width:100%; margin-top:12px;">O'zgarishlarni saqlash</button>
        </form>
      </div>
    `;
    document.body.appendChild(modalDiv);

    // Close button
    document.getElementById("closeEditListingModal").onclick = () => {
      modalDiv.style.display = "none";
    };
    modalDiv.addEventListener("click", e => {
      if (e.target === modalDiv) modalDiv.style.display = "none";
    });

    // Tag selector change listener
    const editTagSelect = document.getElementById("editTag");
    const editCustomTagInput = document.getElementById("editCustomTag");
    editTagSelect.addEventListener("change", () => {
      if (editTagSelect.value === "__custom__") {
        editCustomTagInput.style.display = "block";
        editCustomTagInput.focus();
      } else {
        editCustomTagInput.style.display = "none";
      }
    });

    // Dynamic URL input adder for edit modal
    let editUrlCount = 0;
    document.getElementById("btnEditAddUrlInput").onclick = () => {
      editUrlCount++;
      const div = document.createElement("div");
      div.className = "url-input-row";
      div.style.cssText = "display:flex; gap:8px; margin-bottom:8px;";
      div.innerHTML = `
        <input type="text" class="edit-url-input" placeholder="Yangi rasm ${editUrlCount} URL manzili" style="flex:1;">
        <button type="button" class="btn-remove-url" style="background:rgba(193,101,47,0.12); color:var(--clay); border:none; border-radius:8px; padding:0 12px; cursor:pointer; font-weight:700;" onclick="this.parentElement.remove()">✕</button>
      `;
      document.getElementById("editUrlInputsContainer").appendChild(div);
    };

    // Word count indicator for edit modal
    const editDescEl = document.getElementById("editDesc");
    const editWordCounterEl = document.getElementById("editWordCounter");
    editDescEl.addEventListener("input", () => {
      const words = editDescEl.value.trim().split(/\s+/).filter(Boolean).length;
      editWordCounterEl.textContent = `${words} / 10 so'z`;
      editWordCounterEl.style.color = words >= 10 ? "var(--clay)" : "var(--ink)";
    });

    // File input handler for edit modal
    const editFilesInput = document.getElementById("editFilesInput");
    const editNewImagesPreview = document.getElementById("editNewImagesPreview");

    function renderEditNewImagesPreview() {
      editNewImagesPreview.innerHTML = "";
      editNewUploadedImages.forEach((src, idx) => {
        const wrap = document.createElement("div");
        wrap.style.cssText = "position:relative; display:inline-block;";
        wrap.innerHTML = `
          <img src="${src}" style="width:75px; height:75px; object-fit:cover; border-radius:8px; border:1px solid var(--sand-dark);">
          <button type="button" style="position:absolute; top:-6px; right:-6px; background:var(--clay); color:#fff; border:none; border-radius:50%; width:20px; height:20px; font-size:11px; cursor:pointer; display:flex; align-items:center; justify-content:center;" onclick="removeEditNewImage(${idx})">✕</button>
        `;
        editNewImagesPreview.appendChild(wrap);
      });
    }

    window.removeEditNewImage = function(index) {
      editNewUploadedImages.splice(index, 1);
      renderEditNewImagesPreview();
    };

    editFilesInput.addEventListener("change", () => {
      const files = Array.from(editFilesInput.files);
      let loaded = 0;
      files.forEach(file => {
        if (!file.type.startsWith("image/")) return;
        compressImageFile(file).then(compressed => {
          editNewUploadedImages.push(compressed);
          loaded++;
          if (loaded === files.length) renderEditNewImagesPreview();
        });
      });
      editFilesInput.value = "";
    });

    // Submit handler for edit modal
    document.getElementById("editListingForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const session = getSession();
      const alertBox = document.getElementById("editListingAlert");
      const successBox = document.getElementById("editListingSuccess");
      alertBox.classList.remove("show");
      successBox.classList.remove("show");

      if (!session) {
        alertBox.textContent = "Iltimos, avval tizimga kiring.";
        alertBox.classList.add("show");
        return;
      }

      const category = document.getElementById("editItemCategory").value;
      const id = document.getElementById("editItemId").value;
      const title = document.getElementById("editTitle").value.trim();
      const city = document.getElementById("editCity").value.trim();
      const priceVal = document.getElementById("editPrice").value.trim();
      const priceCurrency = document.getElementById("editPriceCurrency").value;

      let tagVal = document.getElementById("editTag").value;
      if (tagVal === "__custom__") {
        tagVal = (document.getElementById("editCustomTag").value || "").trim() || "Boshqa";
      }
      if (!tagVal) tagVal = "Umumiy";

      const phone = document.getElementById("editPhone").value.trim();
      const address = document.getElementById("editAddress").value.trim();
      const amenitiesText = document.getElementById("editAmenities").value.trim();
      const googleMapsUrl = document.getElementById("editMapsUrl").value.trim();
      const desc = document.getElementById("editDesc").value.trim();

      // Collect URLs from edit url inputs
      const urlInputs = Array.from(document.querySelectorAll(".edit-url-input"));
      const urlImages = urlInputs.map(inp => inp.value.trim()).filter(Boolean);
      const allImgs = [...editExistingImages, ...urlImages, ...editNewUploadedImages];

      if (!city) {
        alertBox.textContent = "Viloyat / Shaharni tanlash majburiy!";
        alertBox.classList.add("show");
        return;
      }

      if (!googleMapsUrl) {
        alertBox.textContent = "Google Maps / Yandex Maps havola yoki lokatsiyani kiritish majburiy!";
        alertBox.classList.add("show");
        return;
      }

      const wordsCount = desc.split(/\s+/).filter(Boolean).length;
      if (wordsCount < 10) {
        alertBox.textContent = `Tavsif kamida 10 ta so'zdan iborat bo'lishi kerak. (Hozirda ${wordsCount} ta so'z).`;
        alertBox.classList.add("show");
        return;
      }

      if (allImgs.length < 2) {
        alertBox.textContent = `Kamida 2 ta rasm bo'lishi shart. (Hozircha ${allImgs.length} ta qoldi).`;
        alertBox.classList.add("show");
        return;
      }

      const btn = document.getElementById("submitEditListingBtn");
      btn.disabled = true;
      btn.textContent = "Saqlanmoqda...";

      try {
        let normCat = String(category || "stays").toLowerCase().trim();
        if (normCat.endsWith("ss")) normCat = normCat.slice(0, -1);
        if (normCat === "stay" || normCat === "home" || normCat === "homes") normCat = "stays";
        if (normCat === "place") normCat = "places";
        if (normCat === "food") normCat = "foods";
        if (normCat === "craft") normCat = "crafts";

        const res = await fetch(`${API}/api/listings/${normCat}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.token}`
          },
          body: JSON.stringify({
            title,
            city,
            price: priceVal,
            priceCurrency,
            tag: tagVal,
            phone,
            address,
            amenities: amenitiesText,
            googleMapsUrl,
            desc,
            images: allImgs
          })
        });

        const data = await res.json();
        if (!data.ok) {
          alertBox.textContent = data.message || "Xatolik yuz berdi.";
          alertBox.classList.add("show");
        } else {
          successBox.textContent = "E'lon muvaffaqiyatli tahrirlandi!";
          successBox.classList.add("show");
          setTimeout(async () => {
            modalDiv.style.display = "none";
            await window.safarAlert({ title: "Muvaffaqiyatli", message: "E'loningiz muvaffaqiyatli yangilandi!", icon: "✅" });
            location.reload();
          }, 800);
        }
      } catch (err) {
        alertBox.textContent = "Server bilan bog'lanishda xatolik.";
        alertBox.classList.add("show");
      }

      btn.disabled = false;
      btn.textContent = "O'zgarishlarni saqlash";
    });
  }

  function renderEditExistingImages() {
    const box = document.getElementById("editExistingImagesBox");
    if (!box) return;
    box.innerHTML = "";
    editExistingImages.forEach((src, idx) => {
      const wrap = document.createElement("div");
      wrap.style.cssText = "position:relative; display:inline-block;";
      wrap.innerHTML = `
        <img src="${src}" style="width:75px; height:75px; object-fit:cover; border-radius:8px; border:1px solid var(--sand-dark);">
        <button type="button" style="position:absolute; top:-6px; right:-6px; background:var(--clay); color:#fff; border:none; border-radius:50%; width:20px; height:20px; font-size:11px; cursor:pointer; display:flex; align-items:center; justify-content:center;" onclick="removeEditExistingImage(${idx})">✕</button>
      `;
      box.appendChild(wrap);
    });
  }

  window.removeEditExistingImage = function(index) {
    editExistingImages.splice(index, 1);
    renderEditExistingImages();
  };

  window.openEditListingModal = async function(category, id) {
    const session = getSession();
    if (!session) return window.safarAlert({ title: "Diqqat", message: "Avval tizimga kiring.", icon: "🔒" });

    // Fetch listing data
    let item = null;
    try {
      const singleKey = category.replace(/s$/, "");
      const res = await fetch(`${API}/api/${category}/${id}`);
      const data = await res.json();
      item = data[singleKey] || data.stay || data.place || data.food || data.craft || data.item;
    } catch(err) {
      console.error(err);
    }

    if (!item) {
      return window.safarAlert({ title: "Xatolik", message: "E'lon ma'lumotlarini yuklab bo'lmadi.", icon: "⚠️" });
    }

    const isAdmin = session.user.role === "admin" || session.user.email === "abdulquddusxoshimov777@gmail.com";
    const isOwner = isAdmin || (item.ownerId && item.ownerId === session.user.id) || (item.ownerName && item.ownerName === session.user.name);
    if (!isOwner) {
      return window.safarAlert({ title: "Ruxsat yo'q", message: "Faqat o'zingiz qo'shgan e'lonni (yoki Admin) tahrirlashingiz mumkin.", icon: "🔒" });
    }

    initEditListingModal();

    // Populate fields
    document.getElementById("editItemCategory").value = category;
    document.getElementById("editItemId").value = id;

    const catLabels = {
      homes: "🏠 Uylar va turargohlar",
      places: "🏛 Diqqatga sazovor joylar",
      foods: "🍲 Milliy taomlar",
      crafts: "🏺 Hunarmandchilik va buyumlar"
    };
    document.getElementById("editCategoryDisplay").value = catLabels[category] || category;
    document.getElementById("editTitle").value = item.title || "";

    // City select
    const citySelect = document.getElementById("editCity");
    let matchCity = UZ_REGIONS.find(r => r.value.toLowerCase() === (item.city || "").toLowerCase());
    citySelect.value = matchCity ? matchCity.value : (item.city || "Toshkent");

    // Price and currency
    const rawPrice = String(item.price || "");
    const priceCurrencySelect = document.getElementById("editPriceCurrency");
    if (rawPrice.includes("so'm") || rawPrice.includes("UZS")) {
      priceCurrencySelect.value = "so'm";
      document.getElementById("editPrice").value = rawPrice.replace(/[^0-9]/g, "");
    } else {
      priceCurrencySelect.value = "$";
      document.getElementById("editPrice").value = rawPrice.replace(/[^0-9]/g, "");
    }

    // Tag select
    const editTagSelect = document.getElementById("editTag");
    const editCustomTagInput = document.getElementById("editCustomTag");
    updateTagSelectOptions(category, editTagSelect, editCustomTagInput, item.tag || item.category || "");

    document.getElementById("editPhone").value = item.phone || "";
    document.getElementById("editAddress").value = item.address || "";
    document.getElementById("editAmenities").value = Array.isArray(item.amenities) ? item.amenities.join(", ") : (item.amenities || "");
    document.getElementById("editMapsUrl").value = item.googleMapsUrl || "";
    document.getElementById("editDesc").value = item.desc || "";

    const words = (item.desc || "").trim().split(/\s+/).filter(Boolean).length;
    document.getElementById("editWordCounter").textContent = `${words} / 10 so'z`;

    // Existing images
    let rawImgs = Array.isArray(item.images) && item.images.length > 0 ? item.images : (item.image ? [item.image] : []);
    editExistingImages = [...rawImgs];
    editNewUploadedImages = [];
    document.getElementById("editUrlInputsContainer").innerHTML = "";
    document.getElementById("editNewImagesPreview").innerHTML = "";
    document.getElementById("editListingAlert").classList.remove("show");
    document.getElementById("editListingSuccess").classList.remove("show");
    renderEditExistingImages();

    const modal = document.getElementById("editListingModal");
    if (modal) {
      modal.style.display = "flex";
      modal.style.zIndex = "99999";
    }
  };

  // Global permission checkers for all pages
  window.checkUserIsAdmin = function(user) {
    if (!user) return false;
    if (user.role === "admin") return true;
    const email = (user.email || "").trim().toLowerCase();
    return email === "abdulquddusxoshimov777@gmail.com";
  };

  window.checkCanEditOrDelete = function(item, user) {
    if (!user || !item) return false;
    if (window.checkUserIsAdmin(user)) return true;
    const userId = String(user.id || "");
    const userEmail = (user.email || "").trim().toLowerCase();
    const userName = (user.name || "").trim().toLowerCase();

    const itemOwnerId = String(item.ownerId || "");
    const itemOwnerEmail = (item.ownerEmail || "").trim().toLowerCase();
    const itemOwnerName = (item.ownerName || "").trim().toLowerCase();

    if (itemOwnerId && itemOwnerId === userId) return true;
    if (itemOwnerEmail && itemOwnerEmail === userEmail) return true;
    if (itemOwnerName && itemOwnerName === userName) return true;
    return false;
  };

  // Global review permission checker (Admin or author only)
  window.checkCanEditOrDeleteReview = function(review, user) {
    if (!user || !review) return false;
    if (window.checkUserIsAdmin(user)) return true;
    const userId = String(user.id || "");
    const userEmail = (user.email || "").trim().toLowerCase();

    const revUserId = String(review.userId || "");
    const revEmail = (review.userEmail || "").trim().toLowerCase();

    if (revUserId && revUserId === userId) return true;
    if (revEmail && revEmail === userEmail) return true;
    return false;
  };

  // Edit Review Modal Dialog (Accessible by Author or Admin)
  window.openEditReviewModal = function(reviewId, currentText, currentRating, onUpdated) {
    const session = getSession();
    if (!session) {
      return window.safarAlert({ title: "Diqqat", message: "Sharhni tahrirlash uchun avval tizimga kiring.", icon: "🔒" });
    }

    const existingModal = document.getElementById("safarEditReviewModal");
    if (existingModal) existingModal.remove();

    let selectedRating = Number(currentRating) || 5;

    const modal = document.createElement("div");
    modal.id = "safarEditReviewModal";
    modal.className = "modal-overlay";
    modal.style.cssText = "display:flex; z-index:999999; backdrop-filter:blur(12px); background:rgba(10,18,40,0.65); animation:modalIn 0.22s ease;";

    function escapeModalHtml(str) {
      if (!str) return "";
      const d = document.createElement("div");
      d.textContent = str;
      return d.innerHTML;
    }

    modal.innerHTML = `
      <div class="modal-box" style="max-width:520px; width:94vw; padding:26px; border-radius:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h3 style="margin:0; font-size:20px; font-family:var(--font-display); color:var(--ink);">✏️ Sharhni tahrirlash</h3>
          <button type="button" id="closeEditRevBtn" style="background:none; border:none; font-size:22px; cursor:pointer; color:var(--ink); line-height:1;">✕</button>
        </div>

        <div style="margin-bottom:16px;">
          <label style="display:block; font-size:13.5px; font-weight:700; margin-bottom:6px; color:var(--ink);">Bahoyingiz (Yulduzcha):</label>
          <div id="editRevStarsBox" style="display:flex; gap:8px; font-size:26px; cursor:pointer; color:var(--gold); user-select:none;">
            ${[1,2,3,4,5].map(n => `<span data-star="${n}">${n <= selectedRating ? "★" : "☆"}</span>`).join("")}
          </div>
        </div>

        <div style="margin-bottom:18px;">
          <label style="display:block; font-size:13.5px; font-weight:700; margin-bottom:6px; color:var(--ink);">Sharh matni:</label>
          <textarea id="editRevTextInput" rows="4" style="width:100%; border-radius:12px; padding:12px 14px; border:1px solid rgba(28,26,23,0.2); font-family:inherit; font-size:14.5px; line-height:1.5; resize:vertical; background:rgba(255,255,255,0.9);" required>${escapeModalHtml(currentText || "")}</textarea>
        </div>

        <div id="editRevAlert" style="display:none; color:var(--clay); font-size:13px; font-weight:700; margin-bottom:14px; padding:8px 12px; background:rgba(193,101,47,0.1); border-radius:8px;"></div>

        <div style="display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" id="cancelEditRevBtn" class="btn btn-ghost" style="border-radius:12px; padding:9px 18px; font-size:13.5px;">Bekor qilish</button>
          <button type="button" id="saveEditRevBtn" class="btn btn-primary" style="border-radius:12px; padding:9px 22px; font-size:13.5px; font-weight:700;">Saqlash</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Star selection click
    const starsBox = modal.querySelector("#editRevStarsBox");
    starsBox.addEventListener("click", (e) => {
      const starEl = e.target.closest("[data-star]");
      if (!starEl) return;
      selectedRating = parseInt(starEl.getAttribute("data-star"), 10);
      starsBox.querySelectorAll("[data-star]").forEach(el => {
        const num = parseInt(el.getAttribute("data-star"), 10);
        el.textContent = num <= selectedRating ? "★" : "☆";
      });
    });

    const close = () => modal.remove();
    modal.querySelector("#closeEditRevBtn").onclick = close;
    modal.querySelector("#cancelEditRevBtn").onclick = close;
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });

    // Save review
    modal.querySelector("#saveEditRevBtn").onclick = async () => {
      const textVal = modal.querySelector("#editRevTextInput").value.trim();
      const alertEl = modal.querySelector("#editRevAlert");
      alertEl.style.display = "none";

      if (!textVal) {
        alertEl.textContent = "Sharh matnini kiritishingiz shart.";
        alertEl.style.display = "block";
        return;
      }

      const saveBtn = modal.querySelector("#saveEditRevBtn");
      saveBtn.disabled = true;
      saveBtn.textContent = "Saqlanmoqda...";

      try {
        const res = await fetch(`${API}/api/reviews/${reviewId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.token}`
          },
          body: JSON.stringify({
            text: textVal,
            rating: selectedRating
          })
        });
        const data = await res.json();
        if (data.ok) {
          modal.remove();
          await window.safarAlert({ title: "Muvaffaqiyatli", message: "Sharhingiz muvaffaqiyatli tahrirlandi!", icon: "✅" });
          if (typeof onUpdated === "function") {
            onUpdated(data.review);
          } else {
            location.reload();
          }
        } else {
          alertEl.textContent = data.message || "Sharhni saqlashda xatolik.";
          alertEl.style.display = "block";
          saveBtn.disabled = false;
          saveBtn.textContent = "Saqlash";
        }
      } catch(err) {
        alertEl.textContent = "Server bilan bog'lanishda xatolik yuz berdi.";
        alertEl.style.display = "block";
        saveBtn.disabled = false;
        saveBtn.textContent = "Saqlash";
      }
    };
  };

  // Custom App-Native Glassmorphism Confirm Dialog
  window.safarConfirm = function({ title, message, icon, confirmText, cancelText, danger }) {
    return new Promise((resolve) => {
      const existing = document.getElementById("safarConfirmModal");
      if (existing) existing.remove();

      const modal = document.createElement("div");
      modal.id = "safarConfirmModal";
      modal.className = "modal-overlay";
      modal.style.cssText = "display:flex; z-index:999999; backdrop-filter:blur(10px); background:rgba(10,18,40,0.65); animation:modalIn 0.22s ease;";
      modal.innerHTML = `
        <div class="modal-box" style="max-width:440px; border-radius:24px; padding:32px; text-align:center; box-shadow:0 24px 60px rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.2);">
          <div style="font-size:48px; margin-bottom:12px;">${icon || '⚠️'}</div>
          <h3 style="font-family:var(--font-display); font-size:22px; margin:0 0 10px; color:var(--ink);">${escapeHtml(title || "Tasdiqlash")}</h3>
          <p style="font-size:14.5px; color:rgba(28,26,23,0.75); line-height:1.6; margin:0 0 24px;">${escapeHtml(message || "")}</p>
          <div style="display:flex; gap:12px; justify-content:center;">
            <button type="button" id="safarConfirmCancel" class="btn btn-ghost" style="flex:1; border-radius:12px; padding:11px 18px; font-weight:600;">
              ${escapeHtml(cancelText || "Bekor qilish")}
            </button>
            <button type="button" id="safarConfirmOk" class="btn ${danger ? '' : 'btn-primary'}" style="flex:1; border-radius:12px; padding:11px 18px; font-weight:700; ${danger ? 'background:var(--clay); color:#fff; border:none;' : ''}">
              ${escapeHtml(confirmText || "Tasdiqlayman")}
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const cleanup = (result) => {
        modal.remove();
        resolve(result);
      };

      document.getElementById("safarConfirmCancel").onclick = () => cleanup(false);
      document.getElementById("safarConfirmOk").onclick = () => cleanup(true);
      modal.onclick = (e) => { if (e.target === modal) cleanup(false); };
    });
  };

  // Custom App-Native Alert Modal
  window.safarAlert = function({ title, message, icon }) {
    return new Promise((resolve) => {
      const existing = document.getElementById("safarAlertModal");
      if (existing) existing.remove();

      const modal = document.createElement("div");
      modal.id = "safarAlertModal";
      modal.className = "modal-overlay";
      modal.style.cssText = "display:flex; z-index:999999; backdrop-filter:blur(10px); background:rgba(10,18,40,0.65); animation:modalIn 0.22s ease;";
      modal.innerHTML = `
        <div class="modal-box" style="max-width:420px; border-radius:24px; padding:32px; text-align:center; box-shadow:0 24px 60px rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.2);">
          <div style="font-size:44px; margin-bottom:12px;">${icon || 'ℹ️'}</div>
          <h3 style="font-family:var(--font-display); font-size:21px; margin:0 0 10px; color:var(--ink);">${escapeHtml(title || "Xabarnoma")}</h3>
          <p style="font-size:14.5px; color:rgba(28,26,23,0.75); line-height:1.6; margin:0 0 24px;">${escapeHtml(message || "")}</p>
          <button type="button" id="safarAlertOk" class="btn btn-primary" style="width:100%; border-radius:12px; padding:11px 18px; font-weight:700;">
            Tushunarli
          </button>
        </div>
      `;

      document.body.appendChild(modal);

      const cleanup = () => {
        modal.remove();
        resolve(true);
      };

      document.getElementById("safarAlertOk").onclick = cleanup;
      modal.onclick = (e) => { if (e.target === modal) cleanup(); };
    });
  };

  function setupAddListingBtnHandler() {
    // Document-level event delegation prevents losing listener when header re-renders
    document.addEventListener("click", async (e) => {
      const btn = e.target.closest("#openAddListingBtn") || e.target.closest(".add-nav-btn");
      if (!btn) return;
      e.preventDefault();

      const session = getSession();
      if (!session) {
        await window.safarAlert({ title: "Tizimga kirish kerak", message: "Joy qo'shish uchun avval tizimga kiring.", icon: "🔒" });
        location.href = "login.html?redirect=add";
        return;
      }

      const isAdmin = window.checkUserIsAdmin(session.user);
      const isHost = session.user.role === "host";

      if (!isHost && !isAdmin) {
        const wantUpgrade = await window.safarConfirm({
          title: "Mezbon akkaunti kerak",
          message: "E'lon qo'shish uchun Mezbon / Joy beruvchi (Host) akkaunti kerak.\n\nAkkauntingiz turini hoziroq Mezbon (Host) ga o'tkazishni xohlaysizmi?",
          icon: "🏠",
          confirmText: "Ha, Mezbon bo'lish",
          cancelText: "Yo'q, bekor qilish"
        });

        if (wantUpgrade) {
          try {
            const res = await fetch(`${API}/api/me/role`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.token}`
              },
              body: JSON.stringify({ role: "host" })
            });
            const data = await res.json();
            if (data.ok) {
              await window.safarAlert({ title: "Muvaffaqiyatli", message: "Akkauntingiz muvaffaqiyatli Mezbon (Host) roliga o'tkazildi!", icon: "🎉" });
              localStorage.setItem("safar_user", JSON.stringify(data.user));
              renderHeader();
            } else {
              await window.safarAlert({ title: "Xatolik", message: data.message || "Xatolik yuz berdi.", icon: "⚠️" });
              return;
            }
          } catch(err) {
            await window.safarAlert({ title: "Xatolik", message: "Server bilan bog'lanishda xatolik.", icon: "❌" });
            return;
          }
        } else {
          return;
        }
      }

      initAddListingModal();
      const modal = document.getElementById("addListingModal");
      if (modal) {
        modal.style.display = "flex";
        modal.style.zIndex = "99999";
      }
    });
  }

  window.deleteListing = async function(category, id) {
    const session = getSession();
    if (!session) return window.safarAlert({ title: "Diqqat", message: "Avval tizimga kiring.", icon: "🔒" });

    // Normalize category: handle 'stay'/'home'/'places' and remove double 's'
    let normCat = String(category || "stays").toLowerCase().trim();
    if (normCat.endsWith("ss")) normCat = normCat.slice(0, -1);
    if (normCat === "stay" || normCat === "home" || normCat === "homes") normCat = "stays";
    if (normCat === "place") normCat = "places";
    if (normCat === "food") normCat = "foods";
    if (normCat === "craft") normCat = "crafts";

    const confirmed = await window.safarConfirm({
      title: "E'lonni o'chirish",
      message: "Ushbu e'lonni o'chirishni tasdiqlaysizmi? Bu amalni ortga qaytarib bo'lmaydi.",
      icon: "🗑",
      confirmText: "Ha, o'chirish",
      cancelText: "Bekor qilish",
      danger: true
    });
    if (!confirmed) return;

    try {
      const res = await fetch(`${API}/api/listings/${normCat}/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${session.token}` }
      });
      const data = await res.json();
      if (data.ok) {
        await window.safarAlert({ title: "O'chirildi", message: data.message || "E'lon muvaffaqiyatli o'chirildi.", icon: "✅" });
        location.reload();
      } else {
        await window.safarAlert({ title: "Xatolik", message: data.message || "E'lonni o'chirishda xatolik.", icon: "⚠️" });
      }
    } catch (err) {
      await window.safarAlert({ title: "Xatolik", message: "Server bilan bog'lanishda xatolik.", icon: "❌" });
    }
  };


  // Language dropdown click handler (delegated to document)
  document.addEventListener("click", (e) => {
    const langOpt = e.target.closest(".lang-option");
    const langPill = e.target.closest("#siteLangPill");
    const dropdown = document.getElementById("siteLangDropdown");

    if (langOpt) {
      e.preventDefault();
      e.stopPropagation();
      const lang = langOpt.dataset.lang;
      localStorage.setItem("safar_lang", lang);
      const label = document.getElementById("siteLangLabel");
      if (label) label.textContent = lang.toUpperCase();
      if (dropdown) dropdown.classList.remove("show");
      document.querySelectorAll(".lang-option").forEach(o => o.classList.toggle("active", o.dataset.lang === lang));
      if (window.applyI18n) window.applyI18n();
      return;
    }

    if (langPill) {
      e.preventDefault();
      e.stopPropagation();
      if (dropdown) dropdown.classList.toggle("show");
      return;
    }

    if (dropdown) {
      dropdown.classList.remove("show");
    }
  });

  window.SafarSession = { getSession, initials };
  window.renderHeader = renderHeader;
  document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderFooter();
    setupAddListingBtnHandler();

    // Auto-sync user session from backend to keep role and avatar updated
    const s = getSession();
    if (s) {
      fetch(`${API}/api/me`, {
        headers: { Authorization: `Bearer ${s.token}` }
      })
      .then(r => r.json())
      .then(d => {
        if (d.ok && d.user) {
          localStorage.setItem("safar_user", JSON.stringify(d.user));
          renderHeader();
        }
      })
      .catch(() => {});
    }
  });
})();
