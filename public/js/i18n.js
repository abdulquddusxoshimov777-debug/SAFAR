/**
 * Saffar i18n — Multi-language Engine (UZ, RU, EN)
 * Complete, unified and robust translations across all pages and widgets.
 */
(function () {
  const TRANSLATIONS = {
    uz: {
      // Header & Navigation
      nav_home: "Bosh sahifa",
      nav_places: "Joylar",
      nav_homes: "Uylar",
      nav_foods: "Taomlar",
      nav_crafts: "Hunarmandchilik",
      nav_services: "Xizmatlar",
      nav_about: "Biz haqimizda",
      nav_contact: "Bog'lanish",
      nav_login: "Kirish",
      nav_signup: "Ro'yxatdan o'tish",
      nav_profile: "Profilim",
      nav_logout: "Chiqish",

      // Hero
      hero_title: 'O\'zbekistonni <span style="color:var(--clay);">kashf</span> eting',
      hero_tag: "Qadimiy Ipak yo'lida",
      hero_h1a: "O'zbekistonning",
      hero_h1b: "buyuk",
      hero_h1c: " tarixini his qiling",

      // About us
      about_eyebrow: "Biz haqimizda",
      about_h2: "O'zbekistonni qanday ekanligini kashf qiling!",

      // Population Demographics
      pop_title: "O'zbekiston aholisi soni",
      pop_male: "Erkaklar",
      pop_female: "Ayollar",
      pop_median_age: "O'rtacha yosh",
      pop_density: "Zichlik",
      pop_urban: "Shahar aholisi",
      pop_rank: "Dunyo o'rni",

      // Weather Widget
      weather_eyebrow: "Ob-havo ma'lumotlari",
      weather_title: "O'zbekiston viloyatlari bo'yicha jonli ob-havo",
      weather_sub: "Sayohatingizni rejalashtirish uchun 14 ta hududdagi ayni paytdagi havo harorati va holati.",

      // Homes & Stays
      homes_eyebrow: "Uylar va turargohlar",
      homes_h2: "O'zbekistonning har bir burchagidan tanlab olingan joylar.",
      homes_viewall: "Barchasini ko'rish →",

      // Services / Products
      services_eyebrow: "Saffar xizmatlari",
      services_h2: "O'zbekiston bo'ylab eng yaxshi sayohat xizmatlari",

      // Reviews
      rev_eyebrow: "Sayohatchilar sharhlari",
      rev_h2: "Haqiqiy sayohatlardan haqiqiy hikoyalar",
      rev_btn: "Tajribangizni ulashing",
      rev_empty: "Hozircha sharhlar yo'q. Birinchi bo'lib sharh qoldiring!",

      // Search & Filters
      search_location: "Joylashuv",
      search_where: "Qayerga?",
      search_checkin: "Kelish sanasi",
      search_checkout: "Ketish sanasi",
      search_guests: "Mehmonlar",
      filter_all: "Barchasi",

      // Messages
      msg_rev_write: "Iltimos, sharhingizni yozing.",
      msg_rev_success: "Sharhingiz muvaffaqiyatli joylandi!",
      msg_err_server: "Server bilan bog'lanib bo'lmadi.",
      msg_login_required: "Tizimga kirish talab qilinadi."
    },
    ru: {
      // Header & Navigation
      nav_home: "Главная",
      nav_places: "Места",
      nav_homes: "Жильё",
      nav_foods: "Блюда",
      nav_crafts: "Ремесла",
      nav_services: "Услуги",
      nav_about: "О нас",
      nav_contact: "Контакты",
      nav_login: "Войти",
      nav_signup: "Регистрация",
      nav_profile: "Мой профиль",
      nav_logout: "Выйти",

      // Hero
      hero_title: '<span style="color:var(--clay);">Откройте</span> для себя Узбекистан',
      hero_tag: "По древнему Шёлковому пути",
      hero_h1a: "Почувствуйте",
      hero_h1b: "великую",
      hero_h1c: " историю Узбекистана",

      // About us
      about_eyebrow: "О нас",
      about_h2: "Откройте для себя истинный дух и гостеприимство Узбекистана",

      // Population Demographics
      pop_title: "Население Узбекистана",
      pop_male: "Мужчины",
      pop_female: "Женщины",
      pop_median_age: "Средний возраст",
      pop_density: "Плотность",
      pop_urban: "Городское",
      pop_rank: "В мире",

      // Weather Widget
      weather_eyebrow: "Прогноз погоды",
      weather_title: "Погода по регионам Узбекистана",
      weather_sub: "Текущая температура и погода в 14 регионах для планирования вашего путешествия.",

      // Homes & Stays
      homes_eyebrow: "Жильё и отели",
      homes_h2: "Отобранные места из каждого уголка Узбекистана.",
      homes_viewall: "Смотреть все →",

      // Services / Products
      services_eyebrow: "Сервисы Saffar",
      services_h2: "Лучшие туристические услуги по всему Узбекистану",

      // Reviews
      rev_eyebrow: "Отзывы путешественников",
      rev_h2: "Настоящие истории из реальных путешествий",
      rev_btn: "Поделиться опытом",
      rev_empty: "Отзывов пока нет. Будьте первым, кто оставит отзыв!",

      // Search & Filters
      search_location: "Местоположение",
      search_where: "Куда едем?",
      search_checkin: "Дата заезда",
      search_checkout: "Дата выезда",
      search_guests: "Гости",
      filter_all: "Все",

      // Messages
      msg_rev_write: "Пожалуйста, напишите ваш отзыв.",
      msg_rev_success: "Отзыв успешно опубликован!",
      msg_err_server: "Не удалось связаться с сервером.",
      msg_login_required: "Пожалуйста, войдите в систему."
    },
    en: {
      // Header & Navigation
      nav_home: "Home",
      nav_places: "Places",
      nav_homes: "Homes",
      nav_foods: "Foods",
      nav_crafts: "Crafts",
      nav_services: "Services",
      nav_about: "About Us",
      nav_contact: "Contact",
      nav_login: "Log in",
      nav_signup: "Sign up",
      nav_profile: "My Profile",
      nav_logout: "Sign out",

      // Hero
      hero_title: '<span style="color:var(--clay);">Discover</span> Uzbekistan',
      hero_tag: "Along the ancient Silk Road",
      hero_h1a: "Experience the",
      hero_h1b: "great",
      hero_h1c: " history of Uzbekistan",

      // About us
      about_eyebrow: "About Us",
      about_h2: "Discover the true spirit and hospitality of Uzbekistan",

      // Population Demographics
      pop_title: "Uzbekistan Population",
      pop_male: "Male",
      pop_female: "Female",
      pop_median_age: "Median Age",
      pop_density: "Density",
      pop_urban: "Urban",
      pop_rank: "World Rank",

      // Weather Widget
      weather_eyebrow: "Weather Forecast",
      weather_title: "Live Weather Across Uzbekistan Regions",
      weather_sub: "Current temperature and conditions across 14 regions to plan your journey.",

      // Homes & Stays
      homes_eyebrow: "Homes & Stays",
      homes_h2: "Hand-picked accommodations across every corner of Uzbekistan.",
      homes_viewall: "View all →",

      // Services / Products
      services_eyebrow: "Saffar Services",
      services_h2: "Best travel services across Uzbekistan",

      // Reviews
      rev_eyebrow: "Traveller Reviews",
      rev_h2: "Real stories from real journeys",
      rev_btn: "Share your experience",
      rev_empty: "No reviews yet. Be the first to share your experience!",

      // Search & Filters
      search_location: "Location",
      search_where: "Where to?",
      search_checkin: "Check-in",
      search_checkout: "Check-out",
      search_guests: "Guests",
      filter_all: "All",

      // Messages
      msg_rev_write: "Please write your review.",
      msg_rev_success: "Review posted successfully!",
      msg_err_server: "Could not connect to server.",
      msg_login_required: "Please sign in to continue."
    }
  };

  const LANG_KEY = "Saffar_lang";

  function getCurrentLang() {
    let l = localStorage.getItem(LANG_KEY);
    if (!l || !TRANSLATIONS[l]) l = "uz";
    return l;
  }

  function t(key) {
    const lang = getCurrentLang();
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.uz;
    return dict[key] || TRANSLATIONS.uz[key] || TRANSLATIONS.en[key] || key;
  }

  function applyI18n() {
    const lang = getCurrentLang();
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.setAttribute("lang", lang);

    // Synchronize Desktop and Mobile Lang Labels
    const siteLangLabel = document.getElementById("siteLangLabel");
    if (siteLangLabel) siteLangLabel.textContent = lang.toUpperCase();

    // Synchronize all option buttons (desktop dropdown, mobile drawer, account page)
    document.querySelectorAll(".lang-option").forEach(btn => {
      const isTarget = btn.dataset.lang === lang;
      btn.classList.toggle("active", isTarget);
      if (isTarget) {
        btn.style.fontWeight = "800";
      } else {
        btn.style.fontWeight = "500";
      }
    });

    // Translate all [data-i18n] text nodes (supports HTML spans)
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      const val = t(key);
      if (val && val !== key) {
        if (val.includes("<")) {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // Translate all [data-i18n-placeholder] inputs
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (!key) return;
      const val = t(key);
      if (val && val !== key) {
        el.placeholder = val;
      }
    });

    // Dispatch event so custom widgets can respond if needed
    window.dispatchEvent(new CustomEvent("Saffar_lang_changed", { detail: { lang } }));
  }

  window.Saffar_t = t;
  window.applyI18n = applyI18n;

  // Run on page load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyI18n);
  } else {
    applyI18n();
  }
})();
