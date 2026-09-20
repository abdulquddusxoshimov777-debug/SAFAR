/**
 * Safar i18n — supports UZ, RU, EN
 * Translations are stored in this file and applied on page load.
 * Language is saved to localStorage under "safar_lang".
 */
(function () {
  const TRANSLATIONS = {
    en: {
      hero_tag: "Discover",
      hero_h1a: "Discover",
      hero_h1b: "Uzbekistan",
      hero_h1c: " ",
      search_location: "Location",
      search_where: "Where to?",
      search_checkin: "Check in",
      search_checkout: "Check out",
      search_guests: "Guests",
      filter_all: "All",
      filter_courtyard: "Courtyard",
      filter_city: "City Center",
      filter_mountain: "Mountain view",
      filter_historic: "Historic",
      filter_yurt: "Yurt stay",
      filter_lake: "Lakeside",
      filter_trad: "Traditional",
      dest_eyebrow: "Popular destinations",
      dest_h2: "Explore the legendary cities of the Silk Road, each with its own colour and character.",
      dest_viewall: "View all cities →",
      stays_label: "stays",
      homes_eyebrow: "Homes & Stays",
      homes_h2: "Hand-picked accommodations across every corner of Uzbekistan.",
      homes_viewall: "Browse all homes →",
      why_eyebrow: "Why Safar",
      why_h2: "Homes chosen with a local's eye, not an algorithm's",
      why1_h: "Verified hosts",
      why1_p: "Every listing is visited and confirmed before it goes live, so what you book is what you get.",
      why2_h: "Flexible cancellation",
      why2_p: "Plans change on the road. Most stays offer free cancellation up to 48 hours before arrival.",
      why3_h: "Support in your language",
      why3_p: "Our team answers in Uzbek, Russian and English, day or night, wherever your journey takes you.",
      foods_eyebrow: "Uzbek Cuisine",
      foods_h2: "Taste the flavours of the Silk Road",
      foods_sub: "Every stay comes with local food recommendations. From steaming plov to clay-oven somsa — discover the heart of Uzbek culture through its food.",
      food1_p: "The crown jewel of Uzbek cooking — saffron rice slow-cooked with lamb, carrots and chickpeas in a giant kazan.",
      food2_p: "Flaky triangular pastry stuffed with spiced lamb or pumpkin, freshly baked in a clay tandoor oven.",
      food3_p: "Tender marinated lamb skewers grilled over hot charcoal, served with sliced onion and fresh flatbread.",
      food4_p: "Hand-pulled noodles in rich tomato-based broth with vegetables and beef — a Silk Road heirloom dish.",
      food5_p: "Golden, stamped flatbread baked on the walls of a traditional tandoor — the sacred bread of Uzbekistan.",
      food6_p: "Green tea served in a painted kosa bowl with dried apricots and halva — the ritual start of every Uzbek meal.",
      rev_eyebrow: "Traveller Reviews",
      rev_h2: "Real stories from real journeys",
      rev_btn: "Share your experience",
      rev_empty: "No reviews yet. Be the first to share your experience!",
      modal_title: "Share your experience",
      modal_signin_msg: "You need to be signed in to leave a review.",
      modal_signin_btn: "Sign in",
      modal_signup_btn: "Create account",
      modal_stay: "Stay / Location",
      modal_rating: "Rating",
      modal_text: "Your review",
      modal_text_ph: "Tell others about your experience…",
      modal_media: "Photos or Videos (Max 5MB total)",
      modal_media_hint: "Click or drag to upload photo / video",
      modal_submit: "Post review",
      cta_eyebrow: "Join Safar today",
      cta_h2: "Start your journey across Uzbekistan",
      cta_p: "Create a free account to save stays, message hosts and book your spot along the ancient Silk Road.",
      cta_signup: "Create free account",
      cta_login: "Sign in",
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
       msg_rev_write: "Please write your review.",
       msg_rev_success: "Review posted successfully!",
       msg_err_server: "Could not connect to server.",
       msg_err_file_size: "File size exceeds 5MB limit.",
       msg_empty_stays: "No stays found matching your criteria.",
       msg_login_required: "Please sign in to continue."
     },
     uz: {
       hero_tag: "Qadimiy Ipak yo'lida",
       hero_h1a: "O'zbekistonni",
       hero_h1b: "kashf",
       hero_h1c: " eting",
       search_location: "Joylashuv",
       search_where: "Qayerga?",
       search_checkin: "Kelish sanasi",
       search_checkout: "Ketish sanasi",
       search_guests: "Mehmonlar",
       filter_all: "Barchasi",
       filter_courtyard: "Hotel",
       filter_city: "UY Hotel",
       filter_mountain: "Dacha",
       filter_historic: "Chodir",
       filter_yurt: "Tarixiy",
       filter_lake: "Ko'l bo'yi",
       filter_trad: "An'anaviy",
       dest_eyebrow: "Mashhur shaharlar",
       dest_h2: "Sayohat qilish uchun top joylar.",
       dest_viewall: "Barcha shaharlarni ko'rish →",
       stays_label: "turar joy",
       homes_eyebrow: "Uylar va turargohlar",
       homes_h2: "O'zbekistonning har bir burchagidan tanlab olingan joylar.",
       homes_viewall: "Barcha uylarni ko'rish →",
       why_eyebrow: "Nima uchun Safar?",
       why_h2: "Algoritmmas, mahalliy ko'z bilan tanlangan uylar",
       why1_h: "Tekshirilgan xostlar",
       why1_p: "Har bir e'lon joylashtirish oldidan borib ko'riladi va tasdiqlanadi.",
       why2_h: "Moslashuvchan bekor qilish",
       why2_p: "Ko'pgina uylar kelishdan 48 soat oldin bepul bekor qilish imkonini beradi.",
       why3_h: "Tilizda yordam",
       why3_p: "Jamoamiz o'zbek, rus va ingliz tillarida, kecha-kunduz javob beradi.",
       foods_eyebrow: "O'zbek taomlari",
       foods_h2: "Ipak yo'lining ta'mlarini his eting",
       foods_sub: "Har bir uy mahalliy taom tavsiyalari bilan keladi. Bug'langan plovdan loy tandirda pishgan somsagacha.",
       food1_p: "O'zbek oshxonasining toji — qo'zi go'shti, sabzi va no'xat bilan qozonda pishirilgan saffranli guruch.",
       food2_p: "Qo'zi go'shti yoki qovoq bilan to'ldirilgan, loy tandirda pishirilgan uchburchak pishiriq.",
       food3_p: "Ko'mirda qovurilgan qo'zi shashlik, piyoz va non bilan beriladi.",
       food4_p: "Sabzavot va mol go'shti bilan boy qo'shimchada qo'lda tortilgan noodle — Ipak yo'li merosi.",
       food5_p: "An'anaviy tandirning devorlarida pishirilgan oltin rang non — O'zbekistonning muqaddas noni.",
       food6_p: "Quritilgan o'rik va halva bilan chiroyli kosa piyolada ko'k choy — har bir o'zbek dasturxonining boshlanishi.",
       rev_eyebrow: "Sayohatchilar sharhlari",
       rev_h2: "Haqiqiy sayohatlardan haqiqiy hikoyalar",
       rev_btn: "Tajribangizni ulashing",
       rev_empty: "Hozircha sharhlar yo'q. Birinchi bo'ling!",
       modal_title: "Tajribangizni ulashing",
       modal_signin_msg: "Sharh qoldirish uchun tizimga kiring.",
       modal_signin_btn: "Kirish",
       modal_signup_btn: "Ro'yxatdan o'tish",
       modal_stay: "Uy / Joylashuv",
       modal_rating: "Baho",
       modal_text: "Sharhingiz",
       modal_text_ph: "Boshqalarga tajribangiz haqida aytib bering…",
       modal_media: "Rasm yoki videolar (Max 5MB)",
       modal_media_hint: "Rasm/video yuklash uchun bosing yoki torting",
       modal_submit: "Sharh joylash",
       cta_eyebrow: "Bugun Safarga qo'shiling",
       cta_h2: "O'zbekiston bo'ylab sayohatingizni boshlang",
       cta_p: "Bepul hisob yarating, uylarni saqlang va Ipak yo'li bo'ylab joyingizni band qiling.",
       cta_signup: "Bepul hisob yaratish",
       cta_login: "Kirish",
       nav_home: "Bosh sahifa",
       nav_places: "Joylar",
       nav_homes: "Uylar",
       nav_foods: "Taomlar",
       nav_crafts: "Buyumlar",
       nav_login: "Kirish",
       nav_signup: "Ro'yxat",
       msg_rev_write: "Iltimos, sharhingizni yozing.",
       msg_rev_success: "Sharhingiz muvaffaqiyatli joylandi!",
       msg_err_server: "Server bilan bog'lanib bo'lmadi.",
       msg_err_file_size: "Fayl hajmi 5MB chegarasidan oshdi.",
       msg_empty_stays: "Sizning so'rovingizga mos keladigan uylar topilmadi.",
       msg_login_required: "Tizimga kirish talab qilinadi."
     },
     ru: {
       hero_tag: "По древнему Шёлковому пути",
       hero_h1a: "Узбекистан:",
       hero_h1b: "великая",
       hero_h1c: " история и культура",
       search_location: "Место",
       search_where: "Куда?",
       search_checkin: "Заезд",
       search_checkout: "Выезд",
       search_guests: "Гости",
       filter_all: "Все",
       filter_courtyard: "Дворик",
       filter_city: "Центр города",
       filter_mountain: "Горный вид",
       filter_historic: "Исторический",
       filter_yurt: "Юрта",
       filter_lake: "Озерный",
       filter_trad: "Традиционный",
       dest_eyebrow: "Популярные направления",
       dest_h2: "Исследуйте легендарные города Шёлкового пути — каждый со своим характером.",
       dest_viewall: "Все города →",
       stays_label: "вариантов",
       homes_eyebrow: "Дома и жильё",
       homes_h2: "Тщательно отобранное жильё в каждом уголке Узбекистана.",
       homes_viewall: "Все дома →",
       why_eyebrow: "Почему Safar?",
       why_h2: "Жильё выбранное взглядом местного, а не алгоритма",
       why1_h: "Проверенные хозяева",
       why1_p: "Каждое объявление проверяется перед публикацией — вы получите именно то, что забронировали.",
       why2_h: "Гибкая отмена",
       why2_p: "Большинство объектов предлагают бесплатную отмену за 48 часов до заезда.",
       why3_h: "Поддержка на вашем языке",
       why3_p: "Наша команда отвечает на узбекском, русском и английском — круглосуточно.",
       foods_eyebrow: "Узбекская кухня",
       foods_h2: "Вкусы Шёлкового пути",
       foods_sub: "Каждое жильё сопровождается рекомендациями по местной кухне. От горячего плова до самсы из тандыра.",
       food1_p: "Жемчужина узбекской кухни — рис с шафраном, тушённый с бараниной, морковью и нутом в казане.",
       food2_p: "Слоёные треугольные пирожки с бараниной или тыквой, запечённые в глиняном тандыре.",
       food3_p: "Нежный маринованный шашлык из баранины, поданный с луком и лепёшкой.",
       food4_p: "Тянутая лапша в томатном бульоне с овощами и говядиной — блюдо Шёлкового пути.",
       food5_p: "Золотые лепёшки, выпеченные на стенках тандыра — священный хлеб Узбекистана.",
       food6_p: "Зелёный чай в расписной косе с сухофруктами и халвой — начало каждой узбекской трапезы.",
       rev_eyebrow: "Отзывы путешественников",
       rev_h2: "Настоящие истории из настоящих путешествий",
       rev_btn: "Поделиться опытом",
       rev_empty: "Отзывов пока нет. Будьте первым!",
       modal_title: "Поделиться опытом",
       modal_signin_msg: "Войдите в аккаунт, чтобы оставить отзыв.",
       modal_signin_btn: "Войти",
       modal_signup_btn: "Создать аккаунт",
       modal_stay: "Жильё / Место",
       modal_rating: "Оценка",
       modal_text: "Ваш отзыв",
       modal_text_ph: "Расскажите другим о своём опыте…",
       modal_media: "Фото или видео (Макс 5МБ)",
       modal_media_hint: "Нажмите или перетащите для загрузки",
       modal_submit: "Опубликовать отзыв",
       cta_eyebrow: "Присоединяйтесь к Safar",
       cta_h2: "Начните своё путешествие по Узбекистану",
       cta_p: "Создайте бесплатный аккаунт, сохраняйте жильё и бронируйте место на Шёлковом пути.",
       cta_signup: "Создать бесплатный аккаунт",
       cta_login: "Войти",
       nav_home: "Главная",
       nav_places: "Места",
       nav_homes: "Дома",
       nav_foods: "Еда",
       nav_crafts: "Изделия",
       nav_login: "Войти",
       nav_signup: "Регистрация",
       msg_rev_write: "Пожалуйста, напишите ваш отзыв.",
       msg_rev_success: "Отзыв успешно опубликован!",
       msg_err_server: "Не удалось связаться с сервером.",
       msg_err_file_size: "Размер файла превышает лимит 5МБ.",
       msg_empty_stays: "По вашему запросу жильё не найдено.",
       msg_login_required: "Пожалуйста, войдите в систему."
     }
   };
 
   const LANG_KEY = "safar_lang";
   let currentLang = localStorage.getItem(LANG_KEY) || "uz";
 
   function t(key) {
     currentLang = localStorage.getItem(LANG_KEY) || "uz";
     return (TRANSLATIONS[currentLang] || TRANSLATIONS.uz)[key] || (TRANSLATIONS.uz[key] || TRANSLATIONS.en[key] || key);
   }
 
   function applyI18n() {
     currentLang = localStorage.getItem(LANG_KEY) || "uz";
     document.documentElement.setAttribute("data-lang", currentLang);
     // text nodes
     document.querySelectorAll("[data-i18n]").forEach(el => {
       const key = el.getAttribute("data-i18n");
       const val = t(key);
       if (val) el.textContent = val;
     });
     // placeholders
     document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
       const key = el.getAttribute("data-i18n-placeholder");
       const val = t(key);
       if (val) el.placeholder = val;
     });
     // update active lang pill
     document.querySelectorAll(".lang-option").forEach(btn => {
       btn.classList.toggle("active", btn.dataset.lang === currentLang);
     });
     // update nav tab labels
     applyNavI18n();
     // expose for dynamic content
     window._safar_t = t;
   }

  function buildLangDropdown() {
    const pill = document.querySelector(".lang-pill");
    if (!pill) return;
    const langs = ["en", "uz", "ru"];
    const labels = { en: "EN", uz: "UZ", ru: "RU" };
    pill.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" stroke="currentColor" stroke-width="1.6"/></svg>
      <span class="lang-current">${labels[currentLang]}</span>
      <div class="lang-dropdown">
        ${langs.map(l => `<button class="lang-option ${l === currentLang ? "lang-active" : ""}" data-lang="${l}">${labels[l]} — ${l === "en" ? "English" : l === "uz" ? "O'zbek" : "Русский"}</button>`).join("")}
      </div>`;
    pill.classList.add("lang-pill-interactive");
    pill.addEventListener("click", e => pill.classList.toggle("open"));
    document.addEventListener("click", e => { if (!pill.contains(e.target)) pill.classList.remove("open"); });
    pill.querySelectorAll(".lang-option").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        currentLang = btn.dataset.lang;
        localStorage.setItem(LANG_KEY, currentLang);
        pill.querySelector(".lang-current").textContent = labels[currentLang];
        pill.classList.remove("open");
        applyI18n();
      });
    });
  }

  // Also update nav tab labels if present
  function applyNavI18n() {
    document.querySelectorAll(".nav-tab").forEach(tab => {
      const key = tab.getAttribute("data-i18n");
      if (key) {
    const span = tab.querySelector("span");
    if (span) span.textContent = t(key);
}
    });
  }

  window.applyI18n = applyI18n;
  window.safar_t = t;

  document.addEventListener("DOMContentLoaded", () => {
    // wait a tick for partials.js to render the header
    setTimeout(() => {
      buildLangDropdown();
      applyI18n();
      applyNavI18n();
    }, 50);
  });
})();
