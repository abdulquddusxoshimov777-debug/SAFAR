// Default seed data for saffar app — Stays, Places, Foods, Crafts
// Used when listings.json is empty or missing on first deployment

const DEFAULT_SEED_STAYS = [
  {
    id: 1789668216925,
    title: "Hilton Tashkent City",
    city: "Toshkent",
    tag: "Official Hotel",
    price: "$350",
    rating: 5.0,
    reviews: 14,
    superhost: true,
    guests: 2,
    beds: 1,
    baths: 1,
    amenities: ["Free Wi-Fi", "Nonushta", "Free parking", "Accessible", "Indoor pool", "SPA"],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80"
    ],
    coordinates: [41.3113, 69.2497],
    googleMapsUrl: "https://maps.google.com/?q=41.3113,69.2497",
    ownerName: "Hilton Tashkent",
    ownerEmail: "abdulquddusxoshimov777@gmail.com",
    phone: "+998 71 210 88 88",
    address: "Toshkent shahri, Islom Karimov ko'chasi 2",
    desc: "Toshkent City markazidagi zamonaviy va hashamatli 5 yulduzli mehmonxona. Ajoyib ko'rinish va yuqori darajadagi servis.",
    reviewsList: []
  },
  {
    id: 1789500000001,
    title: "Registon Boutique Hotel",
    city: "Samarqand",
    tag: "Boutique Hotel",
    price: "$65",
    rating: 4.9,
    reviews: 28,
    superhost: true,
    guests: 2,
    beds: 1,
    baths: 1,
    amenities: ["Free Wi-Fi", "Nonushta", "Konditsioner", "Shahar markazi", "Milliy choyxona"],
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80"
    ],
    coordinates: [39.6542, 66.9758],
    googleMapsUrl: "https://maps.google.com/?q=39.6542,66.9758",
    ownerName: "Samarkand Hospitality",
    ownerEmail: "abdulquddusxoshimov777@gmail.com",
    phone: "+998 66 233 44 55",
    address: "Samarqand shahri, Registon ko'chasi 15",
    desc: "Registon maydoniga 5 daqiqalik piyoda masofada joylashgan qulay va shinam milliy uslubdagi butik mehmonxona.",
    reviewsList: []
  },
  {
    id: 1789500000002,
    title: "Bukhara Silk Road Heritage",
    city: "Buxoro",
    tag: "Tarixiy Hovli",
    price: "$55",
    rating: 4.8,
    reviews: 19,
    superhost: true,
    guests: 3,
    beds: 2,
    baths: 1,
    amenities: ["Free Wi-Fi", "Nonushta", "Konditsioner", "Ichki hovli", "Ekskursiya xizmati"],
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"
    ],
    coordinates: [39.7747, 64.4286],
    googleMapsUrl: "https://maps.google.com/?q=39.7747,64.4286",
    ownerName: "Bukhara Heritage",
    ownerEmail: "abdulquddusxoshimov777@gmail.com",
    phone: "+998 65 224 11 22",
    address: "Buxoro shahri, Labi Hovuz majmuasi yaqinida",
    desc: "XIX asr oxirida qurilgan an'anaviy Buxoro hovlisida joylashgan mehmondo'st va sokin maskan.",
    reviewsList: []
  },
  {
    id: 1789500000003,
    title: "Khiva Orient Star Madrassah",
    city: "Xorazm",
    tag: "Tarixiy Mehmonxona",
    price: "$70",
    rating: 4.9,
    reviews: 32,
    superhost: true,
    guests: 2,
    beds: 1,
    baths: 1,
    amenities: ["Free Wi-Fi", "Nonushta", "Konditsioner", "Ichan Qal'a ichida", "Restoran"],
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"
    ],
    coordinates: [41.3783, 60.3639],
    googleMapsUrl: "https://maps.google.com/?q=41.3783,60.3639",
    ownerName: "Khiva Tourism",
    ownerEmail: "abdulquddusxoshimov777@gmail.com",
    phone: "+998 62 375 25 35",
    address: "Xiva shahri, Ichan Qal'a, Muhammad Aminxon madrasasi",
    desc: "Qadimiy Ichan Qal'a qalbi ichidagi tarixiy madrasada joylashgan betakror mehmonxona.",
    reviewsList: []
  }
];

const DEFAULT_SEED_PLACES = [
  {
    id: 1789663305251,
    title: "Chorsu Bozori",
    city: "Toshkent",
    tag: "Tarixiy bozor",
    category: "Tarixiy bozor",
    price: "Bepul",
    rating: 4.9,
    reviews: 42,
    superhost: true,
    amenities: ["Ochiq bozor", "Milliy taomlar", "Metro yaqinida", "Hunarmandchilik do'konlari"],
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1609873963595-c89b7b91361c?auto=format&fit=crop&w=1000&q=80"
    ],
    coordinates: [41.3268, 69.2364],
    googleMapsUrl: "https://maps.google.com/?q=41.3268,69.2364",
    ownerName: "saffar Guide",
    ownerEmail: "abdulquddusxoshimov777@gmail.com",
    phone: "+998 71 242 00 00",
    address: "Toshkent shahri, Zarkaynar ko'chasi",
    desc: "Toshkentning eng mashhur va qadimiy gumbazli sharq bozori. Bu yerda yangi mevalar, quruq mevalar va milliy taomlar muhiti mavjud.",
    reviewsList: []
  },
  {
    id: 1789581187096,
    title: "Anhor Park",
    city: "Toshkent",
    tag: "Ko'ngilochar maskan",
    category: "Ko'ngilochar maskan",
    price: "Bepul",
    rating: 4.7,
    reviews: 21,
    superhost: false,
    amenities: ["Attraksionlar", "Karting", "Kafelar", "Sayr yo'laklari"],
    image: "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=1000&q=80"
    ],
    coordinates: [41.3245, 69.2612],
    googleMapsUrl: "https://maps.google.com/?q=41.3245,69.2612",
    ownerName: "saffar Guide",
    ownerEmail: "abdulquddusxoshimov777@gmail.com",
    phone: "+998 71 200 00 00",
    address: "Toshkent shahri, Shayxontohur tumani",
    desc: "Oila va do'stlar bilan sayr qilish uchun qulay va katta ko'ngilochar hiyobon.",
    reviewsList: []
  },
  {
    id: 1789580404394,
    title: "Magic City",
    city: "Toshkent",
    tag: "Zamonaviy park",
    category: "Zamonaviy park",
    price: "Bepul",
    rating: 4.8,
    reviews: 35,
    superhost: true,
    amenities: ["Okeanarium", "Favvoralar shousi", "Restoranlar", "Foto zonalar"],
    image: "https://images.unsplash.com/photo-1609873963595-c89b7b91361c?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1609873963595-c89b7b91361c?auto=format&fit=crop&w=1000&q=80"
    ],
    coordinates: [41.3039, 69.2482],
    googleMapsUrl: "https://maps.google.com/?q=41.3039,69.2482",
    ownerName: "saffar Guide",
    ownerEmail: "abdulquddusxoshimov777@gmail.com",
    phone: "+998 71 200 11 22",
    address: "Toshkent shahri, Bobur ko'chasi",
    desc: "Jahon shaharlari me'morchiligi asosida barpo etilgan sehrli oilaviy ko'ngilochar bog'.",
    reviewsList: []
  },
  {
    id: 1789500000010,
    title: "Registon Maydoni",
    city: "Samarqand",
    tag: "Tarixiy obida",
    category: "Tarixiy obida",
    price: "50,000 so'm",
    rating: 5.0,
    reviews: 89,
    superhost: true,
    amenities: ["Gid xizmati", "Yoritish shousi", "Muzey", "Foto maydoncha"],
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1000&q=80"
    ],
    coordinates: [39.6548, 66.9758],
    googleMapsUrl: "https://maps.google.com/?q=39.6548,66.9758",
    ownerName: "saffar Guide",
    ownerEmail: "abdulquddusxoshimov777@gmail.com",
    phone: "+998 66 235 00 00",
    address: "Samarqand shahri, Registon ko'chasi",
    desc: "Samarqandning va butun O'zbekistonning eng mashhur ramzi — Ulug'bek, Tillakori va Sherdor madrasalari ansambli.",
    reviewsList: []
  }
];

const DEFAULT_SEED_FOODS = [
  {
    id: 1789839212457,
    title: "Gumma Xonim",
    city: "Toshkent",
    tag: "Xamir taomlari",
    price: "30,000 so'm",
    rating: 4.8,
    reviews: 12,
    superhost: true,
    amenities: ["Qulay joylashuv", "Tez servis", "Choy tekin", "Milliy uslub"],
    image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=1000&q=80"
    ],
    coordinates: [41.3113, 69.2797],
    googleMapsUrl: "https://maps.google.com/?q=41.3113,69.2797",
    ownerName: "Abdulquddus Xashimov",
    ownerEmail: "abdulquddusxoshimov777@gmail.com",
    phone: "+998 90 123 45 67",
    address: "Toshkent shahri, Chorsu yaqinida",
    desc: "Mazali, issiq va qarsildoq milliy gumma va xonim. Choyxona sharoitida tayyorlanadi.",
    reviewsList: []
  },
  {
    id: 1789500000020,
    title: "Samarqand To'y Oshi",
    city: "Samarqand",
    tag: "Milliy palov",
    price: "45,000 so'm",
    rating: 5.0,
    reviews: 45,
    superhost: true,
    amenities: ["Zira bilan damlangan", "Bedana tuxumi", "Qozi bilan", "Achichuk salat"],
    image: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=1000&q=80"
    ],
    coordinates: [39.6542, 66.9758],
    googleMapsUrl: "https://maps.google.com/?q=39.6542,66.9758",
    ownerName: "Osh Markazi",
    ownerEmail: "abdulquddusxoshimov777@gmail.com",
    phone: "+998 66 231 22 33",
    address: "Samarqand shahri, Dagbitskaya ko'chasi",
    desc: "Haqiqiy devzira guruch va sariq sabzidan qatlamlab pishirilgan betakror Samarqandcha to'y oshi.",
    reviewsList: []
  },
  {
    id: 1789500000021,
    title: "Toshkent Choyxona Palovi",
    city: "Toshkent",
    tag: "Milliy palov",
    price: "40,000 so'm",
    rating: 4.9,
    reviews: 38,
    superhost: true,
    amenities: ["Mol go'shti", "Qo'y yog'i", "Katta porsiya", "Kokchoy"],
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80"
    ],
    coordinates: [41.3268, 69.2364],
    googleMapsUrl: "https://maps.google.com/?q=41.3268,69.2364",
    ownerName: "Toshkent Oshxona",
    ownerEmail: "abdulquddusxoshimov777@gmail.com",
    phone: "+998 71 240 55 66",
    address: "Toshkent shahri, Labzak ko'chasi",
    desc: "Toshkentning mashhur choyxona palovi, to'yimli va nihoyatda lazzatli.",
    reviewsList: []
  },
  {
    id: 1789500000022,
    title: "Jizzax Somsa",
    city: "Jizzax",
    tag: "Somsa va pishiriqlar",
    price: "28,000 so'm",
    rating: 4.9,
    reviews: 29,
    superhost: true,
    amenities: ["Katta hajmli somsa", "Tandirda pishirilgan", "Qo'y go'shti", "Pomidor sousi"],
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80"
    ],
    coordinates: [40.1158, 67.8422],
    googleMapsUrl: "https://maps.google.com/?q=40.1158,67.8422",
    ownerName: "Jizzax Somsa Uyi",
    ownerEmail: "abdulquddusxoshimov777@gmail.com",
    phone: "+998 72 226 00 11",
    address: "Jizzax shahri, Toshkent-Samarqand trassasi yoqasida",
    desc: "O'zbekistonda eng mashhur bo'lgan bahaybat tandir somsasi. Go'shti shirali va mazali.",
    reviewsList: []
  }
];

const DEFAULT_SEED_CRAFTS = [
  {
    id: 1789500000030,
    title: "Rishton Kulolchilik Lagani",
    city: "Farg'ona",
    tag: "Kulolchilik",
    price: "150,000 so'm",
    rating: 5.0,
    reviews: 16,
    superhost: true,
    amenities: ["Qo'lda chizilgan", "Tabiiy ishqor siri", "Eksport sertifikati", "Yetkazib berish"],
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80"
    ],
    coordinates: [40.3582, 71.2828],
    googleMapsUrl: "https://maps.google.com/?q=40.3582,71.2828",
    ownerName: "Rishton Ustaxonasi",
    ownerEmail: "abdulquddusxoshimov777@gmail.com",
    phone: "+998 73 452 11 00",
    address: "Farg'ona viloyati, Rishton shahri, Kulollar mahallasi",
    desc: "Ming yillik an'anaga ega Rishton moviy sirlangan milliy palov lagani. 100% qo'l mehnati.",
    reviewsList: []
  },
  {
    id: 1789500000031,
    title: "Buxoro Zardo'zlik To'ni",
    city: "Buxoro",
    tag: "Zardo'zlik",
    price: "850,000 so'm",
    rating: 4.9,
    reviews: 11,
    superhost: true,
    amenities: ["Zar ip bilan tikilgan", "Baxmal mato", "Esdalik sovg'a", "Eksklyuziv nusxa"],
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80"
    ],
    coordinates: [39.7747, 64.4286],
    googleMapsUrl: "https://maps.google.com/?q=39.7747,64.4286",
    ownerName: "Buxoro Zardo'zlik Markazi",
    ownerEmail: "abdulquddusxoshimov777@gmail.com",
    phone: "+998 65 221 44 88",
    address: "Buxoro shahri, Zardo'zlar ko'chasi 8",
    desc: "Oltin va kumush iplar bilan baxmal matoga naqsh solib tikilgan hashamatli milliy to'n.",
    reviewsList: []
  },
  {
    id: 1789500000032,
    title: "Chust Milliy Pichog'i",
    city: "Namangan",
    tag: "Temirchilik",
    price: "250,000 so'm",
    rating: 5.0,
    reviews: 24,
    superhost: true,
    amenities: ["Damashq po'lati", "Sadaf sop", "Teri g'ilof", "Usta muhri"],
    image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1000&q=80"
    ],
    coordinates: [41.0089, 71.2294],
    googleMapsUrl: "https://maps.google.com/?q=41.0089,71.2294",
    ownerName: "Chust Pichog'i Ustasi",
    ownerEmail: "abdulquddusxoshimov777@gmail.com",
    phone: "+998 69 421 33 22",
    address: "Namangan viloyati, Chust shahri, Hunarmandlar ko'chasi",
    desc: "Mashhur Chust pichoqlarining eng sara namunasi. O'tkir, chidamli va betakror naqshli.",
    reviewsList: []
  }
];

module.exports = {
  DEFAULT_SEED_STAYS,
  DEFAULT_SEED_PLACES,
  DEFAULT_SEED_FOODS,
  DEFAULT_SEED_CRAFTS
};
