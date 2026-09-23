// Safar backend — authentication + stays, places, foods & crafts API
// Load environment variables from .env file if present
try { require("dotenv").config(); } catch(e) { /* dotenv optional */ }

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "safar-dev-secret-change-me";
const USERS_FILE = path.join(__dirname, "users.json");
const REVIEWS_FILE = path.join(__dirname, "reviews.json");
const LISTINGS_FILE = path.join(__dirname, "listings.json");
const MESSAGES_FILE = path.join(__dirname, "messages.json");

// Normalized Admin email (case-insensitive & trimmed)
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "abdulquddusxoshimov777@gmail.com").trim().toLowerCase();

function isUserAdmin(user) {
  if (!user) return false;
  if (user.role === "admin") return true;
  const email = (user.email || "").trim().toLowerCase();
  return email === ADMIN_EMAIL || email === "abdulquddusxoshimov777@gmail.com";
}

// Import default seed listings
const {
  DEFAULT_SEED_STAYS,
  DEFAULT_SEED_PLACES,
  DEFAULT_SEED_FOODS,
  DEFAULT_SEED_CRAFTS
} = require("./seeds");

// Security: Trust reverse proxy (Cloudflare, Google Cloud, Nginx)
app.set("trust proxy", 1);

// Security: Enforce HTTPS in production
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.secure || req.headers["x-forwarded-proto"] === "https") {
      return next();
    }
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  });
}

// Security: Helmet headers (with customized CSP for Leaflet, Google Fonts, CDN assets)
app.use(helmet({ contentSecurityPolicy: false }));

// Security: CORS configuration
app.use(cors({
  origin: true,
  credentials: true
}));

// Security: Body parser limit reduced to 15mb to prevent Memory Exhaustion DoS
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Security: Input Sanitization & Prototype Pollution Guard
function sanitizeInput(req, res, next) {
  function clean(obj) {
    if (!obj || typeof obj !== "object") return;
    for (const key of Object.keys(obj)) {
      if (key === "__proto__" || key === "constructor" || key === "prototype") {
        delete obj[key];
        continue;
      }
      if (typeof obj[key] === "string") {
        obj[key] = obj[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
          .replace(/javascript:/gi, "")
          .replace(/on\w+\s*=/gi, "");
      } else if (typeof obj[key] === "object") {
        clean(obj[key]);
      }
    }
  }
  if (req.body) clean(req.body);
  if (req.query) clean(req.query);
  if (req.params) clean(req.params);
  next();
}
app.use(sanitizeInput);

// Security: Rate Limiters to prevent brute force & DoS
const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: "Juda ko'p so'rov yuborildi. Iltimos, 15 daqiqadan so'ng qayta urinib ko'ring." }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: "Kirish bo'yicha juda ko'p urinishlar qilindi. Xavfsizlik yuzasidan 15 daqiqaga bloklandingiz." }
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: "Bir soat ichida juda ko'p ro'yxatdan o'tish amalga oshirildi. Keyinroq urinib ko'ring." }
});

const postActionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: "Amallarni juda tez bajaryapsiz. Biroz kuting." }
});

app.use("/api/", generalApiLimiter);
app.use(express.static(path.join(__dirname, "..", "public")));

// const db = require("./db");

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
    // Ensure admin user role is always set to admin
    users.forEach(u => {
      if (u.email && u.email.toLowerCase() === ADMIN_EMAIL) {
        u.role = "admin";
      }
    });
    return users;
  } catch {
    return [];
  }
}
function writeUsers(users) {
  // db.saveUsers(users);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Automatically ensure default Admin user exists with correct password and role
function ensureAdminUser() {
  try {
    const users = readUsers();
    let admin = users.find(u => u.email && u.email.toLowerCase() === ADMIN_EMAIL);
    let changed = false;

    if (!admin) {
      admin = {
        id: "admin_" + Date.now().toString(36),
        name: "Abdulquddus Xoshimov",
        email: ADMIN_EMAIL,
        role: "admin",
        passwordHash: bcrypt.hashSync("Abdulquddus1", 10),
        lastListingCreatedAt: null,
        lastListingCreatedAtByCategory: {},
        createdAt: new Date().toISOString()
      };
      users.unshift(admin);
      changed = true;
    } else {
      if (admin.role !== "admin") {
        admin.role = "admin";
        changed = true;
      }
      const matches = bcrypt.compareSync("Abdulquddus1", admin.passwordHash || "");
      if (!matches) {
        admin.passwordHash = bcrypt.hashSync("Abdulquddus1", 10);
        changed = true;
      }
    }
    if (changed) {
      writeUsers(users);
      console.log("Admin account verified & updated: " + ADMIN_EMAIL);
    }
  } catch(e) {
    console.error("Failed to ensure admin user:", e.message);
  }
}
ensureAdminUser();

function readReviews() {
  if (!fs.existsSync(REVIEWS_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(REVIEWS_FILE, "utf-8")); }
  catch { return []; }
}
function writeReviews(reviews) {
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
  db.saveReviews(reviews);
}

function readMessages() {
  if (!fs.existsSync(MESSAGES_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf-8")); }
  catch { return []; }
}
function writeMessages(messages) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}

function readListings() {
  let existing = { stays: [], places: [], foods: [], crafts: [] };
  if (fs.existsSync(LISTINGS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(LISTINGS_FILE, "utf-8"));
      existing.stays = Array.isArray(data.stays) ? data.stays : [];
      existing.places = Array.isArray(data.places) ? data.places : [];
      existing.foods = Array.isArray(data.foods) ? data.foods : [];
      existing.crafts = Array.isArray(data.crafts) ? data.crafts : [];
    } catch (e) {
      console.error("Error reading listings.json:", e.message);
    }
  }

  // Ensure default seeds exist if any category is empty so site is never blank
  if (!existing.stays || existing.stays.length === 0) existing.stays = [...DEFAULT_SEED_STAYS];
  if (!existing.places || existing.places.length === 0) existing.places = [...DEFAULT_SEED_PLACES];
  if (!existing.foods || existing.foods.length === 0) existing.foods = [...DEFAULT_SEED_FOODS];
  if (!existing.crafts || existing.crafts.length === 0) existing.crafts = [...DEFAULT_SEED_CRAFTS];

  return existing;
}

function writeListings(listings) {
  try {
    fs.writeFileSync(LISTINGS_FILE, JSON.stringify(listings, null, 2), "utf-8");
    db.saveListings(listings);
  } catch (err) {
    console.error("Failed to write listings.json:", err);
  }
}

// Helper to extract coordinates from Google Maps / Yandex Maps link or coordinate text
function extractCoordinates(str, defaultCityCoords = [41.3113, 69.2797]) {
  if (!str) return defaultCityCoords;
  const text = String(str);

  // 1. Google Maps @lat,lng format
  const atMatch = text.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) return [parseFloat(atMatch[1]), parseFloat(atMatch[2])];

  // 2. Google Maps q=lat,lng or ll=lat,lng or destination=lat,lng
  const qMatch = text.match(/(?:q|ll|destination)=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (qMatch) return [parseFloat(qMatch[1]), parseFloat(qMatch[2])];

  // 3. Yandex Maps ll=lng%2Clat or ll=lng,lat or pt=lng,lat
  const yandexMatch = text.match(/(?:ll|pt)=(-?\d+\.\d+)(?:%2C|,)(-?\d+\.\d+)/);
  if (yandexMatch) {
    // Yandex puts longitude first, then latitude
    return [parseFloat(yandexMatch[2]), parseFloat(yandexMatch[1])];
  }

  // 4. Raw coordinate pattern: 41.3113, 69.2797
  const rawMatch = text.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
  if (rawMatch) return [parseFloat(rawMatch[1]), parseFloat(rawMatch[2])];

  return defaultCityCoords;
}

// ---------- validation helpers ----------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function badRequest(res, message) { return res.status(400).json({ ok: false, message }); }

// ---------- auth middleware ----------
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ ok: false, message: "Sign in required." });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (isUserAdmin(payload)) {
      payload.role = "admin";
    }
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ ok: false, message: "Session expired. Please sign in again." });
  }
}


// ---------- DATA STORAGE ----------
const _initialListings = readListings();
const STAYS_DATA = _initialListings.stays;
const PLACES_DATA = _initialListings.places;
const FOODS_DATA = _initialListings.foods;
const CRAFTS_DATA = _initialListings.crafts;

function saveAllListings() {
  writeListings({
    stays: STAYS_DATA,
    places: PLACES_DATA,
    foods: FOODS_DATA,
    crafts: CRAFTS_DATA
  });
}

// Dynamic Rating & Reviews Counter helper
function attachCalculatedRating(item, targetType) {
  if (!item) return item;
  const reviews = readReviews();
  const itemType = targetType || (item.category ? "place" : "stay");
  const matchingReviews = reviews.filter(r => (r.targetType === itemType || r.targetType === targetType) && String(r.targetId || r.stayId) === String(item.id));
  
  const staticReviewsList = item.reviewsList || [];
  let totalRatings = 0;
  let count = 0;

  matchingReviews.forEach(r => {
    if (r.rating) {
      totalRatings += Number(r.rating);
      count++;
    }
  });

  staticReviewsList.forEach(sr => {
    if (sr.rating && !matchingReviews.some(mr => mr.text === sr.text && mr.userName === sr.name)) {
      totalRatings += Number(sr.rating);
      count++;
    }
  });

  if (count > 0) {
    const avg = totalRatings / count;
    item.rating = Number(avg.toFixed(2));
    item.reviews = count;
  } else {
    item.rating = item.rating || 5.0;
    item.reviews = item.reviews || 0;
  }

  return item;
}

// ---------- AUTH ROUTES ----------

// Create account (Protected against bot registrations)
app.post("/api/signup", signupLimiter, (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body || {};
  if (!name || !name.trim()) return badRequest(res, "Please enter your full name.");
  if (!email || !EMAIL_RE.test(email)) return badRequest(res, "Please enter a valid email address.");
  if (!password || password.length < 6) return badRequest(res, "Password must be at least 6 characters.");
  if (password !== confirmPassword) return badRequest(res, "Passwords do not match.");

  const userRole = isUserAdmin({ email }) ? "admin" : ((role === "host" || role === "owner") ? "host" : "tourist");

  const users = readUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return badRequest(res, "An account with this email already exists.");
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const user = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    role: userRole,
    lastListingCreatedAt: null,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeUsers(users);

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ ok: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl || null, lastListingCreatedAt: user.lastListingCreatedAt, lastListingCreatedAtByCategory: user.lastListingCreatedAtByCategory || {}, createdAt: user.createdAt } });
});

// Sign in (Protected against brute-force attacks)
app.post("/api/login", authLimiter, (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return badRequest(res, "Please enter your email and password.");
  const users = readUsers();
  const user = users.find((u) => u.email.toLowerCase() === String(email).toLowerCase().trim());
  if (!user) return res.status(401).json({ ok: false, message: "No account found with this email." });
  const valid = bcrypt.compareSync(password, user.passwordHash);
  if (!valid) return res.status(401).json({ ok: false, message: "Incorrect password." });

  if (isUserAdmin(user)) {
    user.role = "admin";
  }

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role || "tourist" }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ ok: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role || "tourist", avatarUrl: user.avatarUrl || null, lastListingCreatedAt: user.lastListingCreatedAt || null, lastListingCreatedAtByCategory: user.lastListingCreatedAtByCategory || {}, createdAt: user.createdAt } });
});

// Current signed-in user
// Update user bio
app.put("/api/me/bio", requireAuth, (req, res) => {
  const { bio } = req.body || {};
  const users = readUsers();
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ ok: false, message: "Foydalanuvchi topilmadi." });
  
  user.bio = typeof bio === "string" ? bio.trim().slice(0, 500) : "";
  writeUsers(users);
  
  const publicUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: isUserAdmin(user) ? "admin" : (user.role || "tourist"),
    avatarUrl: user.avatarUrl || null,
    bio: user.bio || "",
    createdAt: user.createdAt
  };
  res.json({ ok: true, message: "Bio muvaffaqiyatli saqlandi!", user: publicUser });
});

app.get("/api/me", requireAuth, (req, res) => {
  const users = readUsers();
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ ok: false, message: "Account not found." });
  if (isUserAdmin(user)) user.role = "admin";
  res.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role || "tourist", avatarUrl: user.avatarUrl || null, lastListingCreatedAt: user.lastListingCreatedAt || null, lastListingCreatedAtByCategory: user.lastListingCreatedAtByCategory || {}, createdAt: user.createdAt } });
});

// Category posting cooldowns checker for current user (15 days per category)
app.get("/api/me/cooldowns", requireAuth, (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ ok: false, message: "Foydalanuvchi topilmadi." });
  
  const isAdmin = isUserAdmin(user) || isUserAdmin(req.user);
  const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;
  const cats = ["homes", "places", "foods", "crafts"];
  const cooldowns = {};

  cats.forEach(cat => {
    if (isAdmin) {
      cooldowns[cat] = { canPost: true, remainingDays: 0, remainingMs: 0 };
    } else {
      const lastTimeIso = (user.lastListingCreatedAtByCategory || {})[cat];
      if (!lastTimeIso) {
        cooldowns[cat] = { canPost: true, remainingDays: 0, remainingMs: 0 };
      } else {
        const elapsed = Date.now() - new Date(lastTimeIso).getTime();
        if (elapsed < FIFTEEN_DAYS_MS) {
          const remainingMs = FIFTEEN_DAYS_MS - elapsed;
          const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
          cooldowns[cat] = { canPost: false, remainingDays, remainingMs, lastDate: lastTimeIso };
        } else {
          cooldowns[cat] = { canPost: true, remainingDays: 0, remainingMs: 0 };
        }
      }
    }
  });

  res.json({ ok: true, isAdmin, cooldowns });
});

// Update user role (Host ↔ Tourist)
app.put("/api/me/role", requireAuth, (req, res) => {
  const { role } = req.body || {};
  const newRole = (role === "host" || role === "owner") ? "host" : "tourist";
  
  const users = readUsers();
  const userIndex = users.findIndex(u => u.id === req.user.id);
  if (userIndex === -1) return res.status(404).json({ ok: false, message: "Foydalanuvchi topilmadi." });

  const user = users[userIndex];
  if (isUserAdmin(user)) {
    user.role = "admin";
  } else {
    user.role = newRole;
  }

  users[userIndex] = user;
  writeUsers(users);

  res.json({ ok: true, message: `Akkaunt turi muvaffaqiyatli ${user.role === "host" ? "Mezbon (Host)" : "Sayohatchi (Tourist)"}ga o'zgartirildi!`, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl || null, lastListingCreatedAt: user.lastListingCreatedAt || null, lastListingCreatedAtByCategory: user.lastListingCreatedAtByCategory || {}, createdAt: user.createdAt } });
});

// Update user profile picture (avatar)
app.put("/api/me/avatar", requireAuth, (req, res) => {
  const { avatarUrl } = req.body || {};
  if (!avatarUrl) return badRequest(res, "Rasm havolasi yoki fayli kiritilmadi.");

  const users = readUsers();
  const userIndex = users.findIndex(u => u.id === req.user.id);
  if (userIndex === -1) return res.status(404).json({ ok: false, message: "Foydalanuvchi topilmadi." });

  const user = users[userIndex];
  user.avatarUrl = avatarUrl;
  users[userIndex] = user;
  writeUsers(users);

  res.json({ ok: true, message: "Profil rasmi muvaffaqiyatli yangilandi!", user: { id: user.id, name: user.name, email: user.email, role: user.role || "tourist", avatarUrl: user.avatarUrl, lastListingCreatedAt: user.lastListingCreatedAt || null, lastListingCreatedAtByCategory: user.lastListingCreatedAtByCategory || {}, createdAt: user.createdAt } });
});

// DELETE ACCOUNT
app.delete("/api/me", requireAuth, (req, res) => {
  let users = readUsers();
  const index = users.findIndex((u) => u.id === req.user.id);
  if (index === -1) return res.status(404).json({ ok: false, message: "Account not found." });

  users.splice(index, 1);
  writeUsers(users);
  res.json({ ok: true, message: "Akkauntingiz muvaffaqiyatli o'chirildi." });
});

// Current user's posted listings across all categories (or ALL listings for Admin)
app.get("/api/me/listings", requireAuth, (req, res) => {
  const userId = String(req.user.id || "");
  const userName = (req.user.name || "").trim().toLowerCase();
  const userEmail = (req.user.email || "").trim().toLowerCase();
  const isAdmin = isUserAdmin(req.user);

  const allStays = STAYS_DATA.map(x => ({ ...x, categoryType: "stays" }));
  const allPlaces = PLACES_DATA.map(x => ({ ...x, categoryType: "places" }));
  const allFoods = FOODS_DATA.map(x => ({ ...x, categoryType: "foods" }));
  const allCrafts = CRAFTS_DATA.map(x => ({ ...x, categoryType: "crafts" }));
  const allItems = [...allStays, ...allPlaces, ...allFoods, ...allCrafts];

  let myListings;
  if (isAdmin) {
    // Admin gets all listings across the entire site to manage/delete/edit!
    myListings = allItems;
  } else {
    myListings = allItems.filter(x => {
      const oId = String(x.ownerId || "");
      const oName = (x.ownerName || "").trim().toLowerCase();
      const oEmail = (x.ownerEmail || "").trim().toLowerCase();
      return (oId && oId === userId) || (oEmail && oEmail === userEmail) || (oName && oName === userName);
    });
  }

  myListings.sort((a, b) => (b.id || 0) - (a.id || 0));
  res.json({ ok: true, listings: myListings, isAdmin });
});

// ---- PUBLIC USER PROFILE ----
app.get("/api/users/:id/profile", (req, res) => {
  const param = String(req.params.id || "").trim();
  if (!param) return res.status(400).json({ ok: false, message: "User ID kerak." });

  const users = readUsers();
  const user = users.find(u => String(u.id) === param || (u.email && u.email.toLowerCase() === param.toLowerCase()) || (u.name && u.name.toLowerCase() === param.toLowerCase()));

  const publicUser = user ? {
    id: user.id,
    name: user.name,
    role: isUserAdmin(user) ? "admin" : (user.role || "tourist"),
    avatarUrl: user.avatarUrl || null,
    createdAt: user.createdAt || null
  } : {
    id: param,
    name: param,
    role: "tourist",
    avatarUrl: null,
    createdAt: null
  };

  const allStays = STAYS_DATA.map(x => ({ ...x, categoryType: "stays" }));
  const allPlaces = PLACES_DATA.map(x => ({ ...x, categoryType: "places" }));
  const allFoods = FOODS_DATA.map(x => ({ ...x, categoryType: "foods" }));
  const allCrafts = CRAFTS_DATA.map(x => ({ ...x, categoryType: "crafts" }));
  const allItems = [...allStays, ...allPlaces, ...allFoods, ...allCrafts];

  const searchId = String(publicUser.id || "");
  const searchEmail = (user ? user.email : (param.includes("@") ? param : "")).toLowerCase();
  const searchName = (publicUser.name || "").trim().toLowerCase();

  const userListings = allItems.filter(x => {
    const oId = String(x.ownerId || "");
    const oName = (x.ownerName || "").trim().toLowerCase();
    const oEmail = (x.ownerEmail || "").trim().toLowerCase();
    return (oId && oId === searchId) || (searchEmail && oEmail === searchEmail) || (searchName && oName === searchName);
  });

  userListings.sort((a, b) => (b.id || 0) - (a.id || 0));

  const reviews = readReviews();
  const userReviews = reviews.filter(r => (r.userId && String(r.userId) === searchId) || (searchEmail && r.userEmail && r.userEmail.toLowerCase() === searchEmail));

  res.json({
    ok: true,
    user: publicUser,
    listings: userListings,
    reviewsCount: userReviews.length
  });
});


// ---- REVIEWS ROUTES ----
app.get("/api/reviews", (req, res) => {
  let reviews = readReviews();
  const { targetType, targetId } = req.query;
  if (targetType && targetId) {
    reviews = reviews.filter(r => r.targetType === targetType && String(r.targetId) === String(targetId));
  }
  // Sort reviews: 5/5 stars FIRST (descending rating), then newest date first
  reviews.sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  res.json({ ok: true, reviews });
});

app.post("/api/reviews", requireAuth, postActionLimiter, (req, res) => {
  const { text, rating, mediaBase64, mediaType, mediaBase64List, images, stayId, stayTitle, location, targetType, targetId } = req.body || {};
  if (!text || !text.trim()) return badRequest(res, "Please write your review.");
  if (!rating || rating < 1 || rating > 5) return badRequest(res, "Please give a rating (1-5).");

  const fullMediaList = Array.isArray(mediaBase64List) ? mediaBase64List.filter(Boolean) : (Array.isArray(images) ? images.filter(Boolean) : (mediaBase64 ? [mediaBase64] : []));

  const reviews = readReviews();
  const newReview = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    userId: req.user.id,
    userName: req.user.name,
    userEmail: req.user.email,
    text: text.trim(),
    rating: Number(rating),
    stayId: stayId || null,
    stayTitle: stayTitle || null,
    location: location || null,
    targetType: targetType || (stayId ? "stay" : null),
    targetId: targetId || stayId || null,
    mediaBase64: fullMediaList[0] || mediaBase64 || null,
    mediaBase64List: fullMediaList,
    mediaType: mediaType || null,
    createdAt: new Date().toISOString(),
  };
  reviews.unshift(newReview);
  writeReviews(reviews);

  // Recalculate item rating and reviews count
  const tType = targetType || (stayId ? "stay" : null);
  const tId = targetId || stayId;
  let dataset = STAYS_DATA;
  if (tType === "place") dataset = PLACES_DATA;
  else if (tType === "food") dataset = FOODS_DATA;
  else if (tType === "craft") dataset = CRAFTS_DATA;

  const targetItem = dataset.find(x => String(x.id) === String(tId));
  if (targetItem) {
    attachCalculatedRating(targetItem, tType);
  }

  res.json({ ok: true, review: newReview });
});

// EDIT REVIEW (Owner or Admin can edit review)
app.put("/api/reviews/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  let reviews = readReviews();
  const index = reviews.findIndex(r => String(r.id) === String(id));
  if (index === -1) return res.status(404).json({ ok: false, message: "Sharh topilmadi." });

  const review = reviews[index];
  const userEmail = (req.user.email || "").trim().toLowerCase();
  const revEmail = (review.userEmail || "").trim().toLowerCase();
  const isAdmin = isUserAdmin(req.user);
  const isOwner = (review.userId && String(review.userId) === String(req.user.id)) || (revEmail && revEmail === userEmail);

  if (!isAdmin && !isOwner) {
    return res.status(403).json({ ok: false, message: "Faqat o'zingiz yozgan sharhni (yoki Admin) tahrirlay olasiz." });
  }

  const { text, rating } = req.body || {};
  if (!text || !text.trim()) {
    return badRequest(res, "Sharh matnini kiritishingiz shart.");
  }

  review.text = text.trim();
  if (rating !== undefined && rating !== null) {
    const numRating = Number(rating);
    if (!isNaN(numRating) && numRating >= 1 && numRating <= 5) {
      review.rating = numRating;
    }
  }
  review.updatedAt = new Date().toISOString();
  reviews[index] = review;
  writeReviews(reviews);

  // Recalculate item rating and reviews count if target item exists
  const tType = review.targetType || (review.stayId ? "stay" : null);
  const tId = review.targetId || review.stayId;
  if (tType && tId) {
    let dataset = STAYS_DATA;
    if (tType === "place") dataset = PLACES_DATA;
    else if (tType === "food") dataset = FOODS_DATA;
    else if (tType === "craft") dataset = CRAFTS_DATA;
    const targetItem = dataset.find(x => String(x.id) === String(tId));
    if (targetItem) {
      attachCalculatedRating(targetItem, tType);
      saveAllListings();
    }
  }

  res.json({ ok: true, message: "Sharh muvaffaqiyatli tahrirlandi!", review });
});

// DELETE REVIEW (Owner or Admin can delete any review)
app.delete("/api/reviews/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  let reviews = readReviews();
  const index = reviews.findIndex(r => String(r.id) === String(id));
  if (index === -1) return res.status(404).json({ ok: false, message: "Sharh topilmadi." });
  
  const review = reviews[index];
  const userEmail = (req.user.email || "").trim().toLowerCase();
  const revEmail = (review.userEmail || "").trim().toLowerCase();
  const isAdmin = isUserAdmin(req.user);
  const isOwner = (review.userId && String(review.userId) === String(req.user.id)) || (revEmail && revEmail === userEmail);

  if (!isAdmin && !isOwner) {
    return res.status(403).json({ ok: false, message: "Faqat o'zingiz yozgan sharhni (yoki Admin) o'chira olasiz." });
  }

  reviews.splice(index, 1);
  writeReviews(reviews);

  // Recalculate item rating
  const tType = review.targetType || (review.stayId ? "stay" : null);
  const tId = review.targetId || review.stayId;
  if (tType && tId) {
    let dataset = STAYS_DATA;
    if (tType === "place") dataset = PLACES_DATA;
    else if (tType === "food") dataset = FOODS_DATA;
    else if (tType === "craft") dataset = CRAFTS_DATA;
    const targetItem = dataset.find(x => String(x.id) === String(tId));
    if (targetItem) {
      attachCalculatedRating(targetItem, tType);
      saveAllListings();
    }
  }

  res.json({ ok: true, message: "Sharh muvaffaqiyatli o'chirildi." });
});

// ---- HOST LISTINGS (30-DAY LIMIT PER CATEGORY & VALIDATIONS) ----
app.post("/api/listings/add", requireAuth, postActionLimiter, (req, res) => {
  const users = readUsers();
  const userIndex = users.findIndex(u => u.id === req.user.id);
  if (userIndex === -1) return res.status(404).json({ ok: false, message: "Foydalanuvchi topilmadi." });
  
  const user = users[userIndex];
  const isAdmin = isUserAdmin(user) || isUserAdmin(req.user);
  if (user.role !== "host" && user.role !== "admin" && !isAdmin) {
    return res.status(403).json({ ok: false, message: "Faqat Joy beruvchi / Mezbon (Host) akkaunti joy qo'shishi mumkin." });
  }

  const { category, title, city, price, tag, desc, images, image, address, phone, googleMapsUrl, amenities, priceCurrency, coordinates } = req.body || {};
  
  const targetCategory = (category || "homes").toLowerCase();
  let normCat = "homes";
  let catLabel = "Uylar (Homes)";
  if (targetCategory.includes("place")) { normCat = "places"; catLabel = "Diqqatga sazovor joylar (Places)"; }
  else if (targetCategory.includes("food")) { normCat = "foods"; catLabel = "Milliy taomlar (Foods)"; }
  else if (targetCategory.includes("craft")) { normCat = "crafts"; catLabel = "Buyumlar va Hunarmandchilik (Crafts)"; }
  else { normCat = "homes"; catLabel = "Uylar (Homes)"; }

  const isFoodOrCraft = normCat === "foods" || normCat === "crafts";
  const finalCity = (city || "").trim() || (isFoodOrCraft ? "O'zbekiston" : "");

  if (!title || !title.trim()) {
    return badRequest(res, "Sarlavha (Nomi) kiritilishi shart.");
  }

  // Viloyat faqat Uylar va Joylar uchun majburiy (Foods va Crafts uchun ixtiyoriy)
  if (!isFoodOrCraft && !finalCity) {
    return badRequest(res, "Viloyat / Shaharni tanlashingiz shart.");
  }

  // Location faqat Uylar va Joylar uchun majburiy (Foods va Crafts uchun ixtiyoriy)
  if (!isFoodOrCraft && (!googleMapsUrl || !googleMapsUrl.trim())) {
    return badRequest(res, "Google Maps / Yandex Maps havola yoki lokatsiyani kiritish majburiy!");
  }

  // 15 days limit check per category (Skip for admin)
  if (!isAdmin) {
    const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;
    user.lastListingCreatedAtByCategory = user.lastListingCreatedAtByCategory || {};
    const lastTimeIso = user.lastListingCreatedAtByCategory[normCat];

    if (lastTimeIso) {
      const lastTime = new Date(lastTimeIso).getTime();
      const now = Date.now();
      const elapsed = now - lastTime;
      if (elapsed < FIFTEEN_DAYS_MS) {
        const remainingMs = FIFTEEN_DAYS_MS - elapsed;
        const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
        return res.status(400).json({
          ok: false,
          message: `Siz ${catLabel} bo'limiga har 15 kunda faqat 1 ta yangi e'lon qo'shishingiz mumkin. Ushbu bo'limga navbatdagi e'lonni ${remainingDays} kundan keyin qo'shishingiz mumkin.`
        });
      }
    }
  }

  // Description check: flexible
  const words = (desc || "").trim().split(/\s+/).filter(Boolean);
  const finalDesc = (desc || "").trim() || "Ma'lumot berilmagan.";

  // Validate at least 2 images provided
  let imgList = Array.isArray(images) ? images.filter(Boolean) : [];
  if (!imgList.length && image) imgList.push(image);
  if (imgList.length < 2) {
    return badRequest(res, "Kamida 2 ta rasm kiritishingiz (yoki yuklashingiz) shart.");
  }

  // Parse exact coordinates: use passed coordinates if valid, else extract from URL
  let extractedCoords = null;
  if (Array.isArray(coordinates) && coordinates.length === 2 && !isNaN(coordinates[0]) && !isNaN(coordinates[1])) {
    extractedCoords = [parseFloat(coordinates[0]), parseFloat(coordinates[1])];
  } else {
    extractedCoords = extractCoordinates(googleMapsUrl);
  }

  // Format price with currency (supports Free / Bepul)
  let formattedPrice = String(price || "").trim();
  if (priceCurrency === "free" || formattedPrice.toLowerCase() === "free" || formattedPrice.toLowerCase() === "bepul" || formattedPrice === "0") {
    formattedPrice = "Bepul (Free)";
  } else if (priceCurrency === "so'm" || priceCurrency === "UZS" || formattedPrice.toLowerCase().includes("so'm")) {
    if (!formattedPrice.toLowerCase().includes("so'm")) formattedPrice = `${formattedPrice} so'm`;
  } else {
    if (!formattedPrice.startsWith("$") && !formattedPrice.toLowerCase().includes("so'm")) formattedPrice = `${formattedPrice}`;
  }

  // Format amenities array
  let amenitiesList = [];
  if (Array.isArray(amenities)) {
    amenitiesList = amenities.map(x => String(x).trim()).filter(Boolean);
  } else if (typeof amenities === "string" && amenities.trim()) {
    amenitiesList = amenities.split(",").map(x => x.trim()).filter(Boolean);
  }
  if (!amenitiesList.length) {
    amenitiesList = ["Qulay joylashuv", "Servis"];
  }

  const newItem = {
    id: Date.now(),
    ownerId: user.id,
    userId: user.id,
    ownerEmail: (user.email || req.user.email || "").trim().toLowerCase(),
    userEmail: (user.email || req.user.email || "").trim().toLowerCase(),
    ownerName: user.name || req.user.name || "Mezbon",
    title: title.trim(),
    city: finalCity,
    tag: tag || "Yangi Joy",
    price: formattedPrice,
    rating: 5.0,
    reviews: 0,
    superhost: true,
    guests: 2, beds: 1, baths: 1,
    amenities: amenitiesList,
    image: imgList[0],
    images: imgList,
    coordinates: extractedCoords,
    googleMapsUrl: (googleMapsUrl || "").trim(),
    phone: phone || "+998 90 123 45 67",
    address: address || `${city}, O'zbekiston`,
    desc: desc.trim(),
    reviewsList: []
  };

  if (targetCategory.includes("place")) {
    newItem.category = tag || "Diqqatga sazovor joy";
    PLACES_DATA.unshift(newItem);
  } else if (targetCategory.includes("food")) {
    FOODS_DATA.unshift(newItem);
  } else if (targetCategory.includes("craft")) {
    CRAFTS_DATA.unshift(newItem);
  } else {
    STAYS_DATA.unshift(newItem);
  }

  // Save listings to listings.json
  saveAllListings();

  // Update user last listing date PER CATEGORY
  user.lastListingCreatedAtByCategory = user.lastListingCreatedAtByCategory || {};
  user.lastListingCreatedAtByCategory[normCat] = new Date().toISOString();
  user.lastListingCreatedAt = new Date().toISOString();
  users[userIndex] = user;
  writeUsers(users);

  res.json({ ok: true, message: "Yangi joy muvaffaqiyatli qo'shildi!", item: newItem });
});

// Helper to find listing item across all categories
function findListingAcrossAll(category, id) {
  const numId = Number(id);
  const cat = (category || "").toLowerCase();

  let targetDataset = STAYS_DATA;
  let targetName = "stays";
  if (cat.includes("place")) { targetDataset = PLACES_DATA; targetName = "places"; }
  else if (cat.includes("food")) { targetDataset = FOODS_DATA; targetName = "foods"; }
  else if (cat.includes("craft")) { targetDataset = CRAFTS_DATA; targetName = "crafts"; }
  else { targetDataset = STAYS_DATA; targetName = "stays"; }

  let index = targetDataset.findIndex(x => x.id === numId || String(x.id) === String(id));
  if (index !== -1) {
    return { dataset: targetDataset, index, item: targetDataset[index], category: targetName };
  }

  // Fallback: search in all other datasets
  const allSets = [
    { name: "stays", data: STAYS_DATA },
    { name: "places", data: PLACES_DATA },
    { name: "foods", data: FOODS_DATA },
    { name: "crafts", data: CRAFTS_DATA }
  ];
  for (const s of allSets) {
    const idx = s.data.findIndex(x => x.id === numId || String(x.id) === String(id));
    if (idx !== -1) {
      return { dataset: s.data, index: idx, item: s.data[idx], category: s.name };
    }
  }

  return null;
}

// EDIT LISTING (Author or Admin)
app.put("/api/listings/:category/:id", requireAuth, (req, res) => {
  const found = findListingAcrossAll(req.params.category, req.params.id);
  if (!found) return res.status(404).json({ ok: false, message: "E'lon topilmadi." });

  const { dataset, index, item } = found;

  const userEmail = (req.user.email || "").trim().toLowerCase();
  const userName = (req.user.name || "").trim().toLowerCase();
  const itemOwnerEmail = (item.ownerEmail || "").trim().toLowerCase();
  const itemOwnerName = (item.ownerName || "").trim().toLowerCase();

  const isAdmin = isUserAdmin(req.user);
  const isAuthor = (item.ownerId && String(item.ownerId) === String(req.user.id)) ||
                   (item.userId && String(item.userId) === String(req.user.id)) ||
                   (itemOwnerEmail && itemOwnerEmail === userEmail) ||
                   (itemOwnerName && itemOwnerName === userName);

  if (!isAdmin && !isAuthor) {
    return res.status(403).json({ ok: false, message: "Faqat o'zingiz qo'shgan e'lonni (yoki Admin) tahrirlay olasiz." });
  }

  const { title, city, price, priceCurrency, tag, desc, images, image, address, phone, googleMapsUrl, amenities } = req.body || {};

  // Word count check (flexible)
  // No strict 10 words limit required

  // Format price
  let formattedPrice = item.price;
  if (price) {
    formattedPrice = String(price).trim();
    if (priceCurrency === "free" || formattedPrice.toLowerCase() === "free" || formattedPrice.toLowerCase() === "bepul" || formattedPrice === "0") {
      formattedPrice = "Bepul (Free)";
    } else if (priceCurrency === "so'm" || priceCurrency === "UZS" || formattedPrice.toLowerCase().includes("so'm")) {
      if (!formattedPrice.toLowerCase().includes("so'm")) formattedPrice = `${formattedPrice} so'm`;
    } else if (priceCurrency === "$") {
      if (!formattedPrice.startsWith("$")) formattedPrice = `$${formattedPrice}`;
    }
  }

  // Format amenities
  let amenitiesList = item.amenities || [];
  if (amenities !== undefined) {
    if (Array.isArray(amenities)) {
      amenitiesList = amenities.map(x => String(x).trim()).filter(Boolean);
    } else if (typeof amenities === "string" && amenities.trim()) {
      amenitiesList = amenities.split(",").map(x => x.trim()).filter(Boolean);
    }
  }

  // Parse images
  let imgList = item.images || [item.image];
  if (images && Array.isArray(images) && images.filter(Boolean).length >= 2) {
    imgList = images.filter(Boolean);
  }

  // Parse coordinates
  let coords = item.coordinates;
  if (googleMapsUrl && googleMapsUrl.trim()) {
    coords = extractCoordinates(googleMapsUrl.trim(), item.coordinates);
  }

  // Apply changes
  if (title) item.title = title.trim();
  if (city) item.city = city.trim();
  if (price) item.price = formattedPrice;
  if (tag) item.tag = tag.trim();
  if (desc) item.desc = desc.trim();
  if (phone) item.phone = phone.trim();
  if (address) item.address = address.trim();
  if (googleMapsUrl) { item.googleMapsUrl = googleMapsUrl.trim(); item.coordinates = coords; }
  item.amenities = amenitiesList;
  item.image = imgList[0];
  item.images = imgList;

  dataset[index] = item;
  saveAllListings();

  res.json({ ok: true, message: "E'lon muvaffaqiyatli tahrirlandi!", item });
});

// DELETE LISTING (Author or Admin)
app.delete("/api/listings/:category/:id", requireAuth, (req, res) => {
  const found = findListingAcrossAll(req.params.category, req.params.id);
  if (!found) return res.status(404).json({ ok: false, message: "E'lon topilmadi." });

  const { dataset, index, item } = found;

  const userEmail = (req.user.email || "").trim().toLowerCase();
  const userName = (req.user.name || "").trim().toLowerCase();
  const itemOwnerEmail = (item.ownerEmail || "").trim().toLowerCase();
  const itemOwnerName = (item.ownerName || "").trim().toLowerCase();

  const isAdmin = isUserAdmin(req.user);
  const isAuthor = (item.ownerId && String(item.ownerId) === String(req.user.id)) ||
                   (itemOwnerEmail && itemOwnerEmail === userEmail) ||
                   (itemOwnerName && itemOwnerName === userName);

  if (!isAdmin && !isAuthor) {
    return res.status(403).json({ ok: false, message: "Faqat o'zingiz qo'shgan e'lonni (yoki Admin) o'chira olasiz." });
  }

  dataset.splice(index, 1);
  saveAllListings();
  res.json({ ok: true, message: "E'lon muvaffaqiyatli o'chirildi." });
});


// ---- STAYS API ----
app.get("/api/stays", (req, res) => {
  const stays = STAYS_DATA.map(s => attachCalculatedRating({ ...s }, "stay"));
  res.json({ ok: true, stays });
});
app.get("/api/stays/:id", (req, res) => {
  const stay = STAYS_DATA.find(s => s.id === Number(req.params.id));
  if (!stay) return res.status(404).json({ ok: false, message: "Stay not found" });
  res.json({ ok: true, stay: attachCalculatedRating({ ...stay }, "stay") });
});

// ---- FOODS API ----
app.get("/api/foods", (req, res) => {
  const foods = FOODS_DATA.map(f => attachCalculatedRating({ ...f }, "food"));
  res.json({ ok: true, foods });
});
app.get("/api/foods/:id", (req, res) => {
  const food = FOODS_DATA.find(f => f.id === Number(req.params.id));
  if (!food) return res.status(404).json({ ok: false, message: "Food not found" });
  res.json({ ok: true, food: attachCalculatedRating({ ...food }, "food") });
});

// ---- PLACES API ----
app.get("/api/places", (req, res) => {
  const places = PLACES_DATA.map(p => attachCalculatedRating({ ...p }, "place"));
  res.json({ ok: true, places });
});
app.get("/api/places/:id", (req, res) => {
  const place = PLACES_DATA.find(p => p.id === Number(req.params.id));
  if (!place) return res.status(404).json({ ok: false, message: "Place not found" });
  res.json({ ok: true, place: attachCalculatedRating({ ...place }, "place") });
});

// ---- CRAFTS API ----
app.get("/api/crafts", (req, res) => {
  const crafts = CRAFTS_DATA.map(c => attachCalculatedRating({ ...c }, "craft"));
  res.json({ ok: true, crafts });
});
app.get("/api/crafts/:id", (req, res) => {
  const craft = CRAFTS_DATA.find(c => c.id === Number(req.params.id));
  if (!craft) return res.status(404).json({ ok: false, message: "Craft item not found" });
  res.json({ ok: true, craft: attachCalculatedRating({ ...craft }, "craft") });
});

// ---- CONTACT FORM API (Protected by Rate Limiter) ----
app.post("/api/contact", postActionLimiter, (req, res) => {
  const { name, email, phone, subject, message } = req.body || {};
  if (!name || !name.trim() || !email || !email.trim() || !message || !message.trim()) {
    return badRequest(res, "Ism, email va xabar matnini kiritish majburiy.");
  }
  if (!EMAIL_RE.test(email.trim())) {
    return badRequest(res, "Noto'g'ri email formati kiritildi.");
  }
  const msgs = readMessages();
  const newMsg = {
    id: Date.now(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: (phone || "").trim(),
    subject: (subject || "Umumiy murojaat").trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
    isRead: false
  };
  msgs.push(newMsg);
  writeMessages(msgs);
  res.json({ ok: true, message: "Xabaringiz qabul qilindi! Tez orada siz bilan bog'lanamiz." });
});

// Admin view received contact messages
app.get("/api/contact/messages", requireAuth, (req, res) => {
  const isAdmin = req.user.role === "admin" || (req.user.email && req.user.email.toLowerCase() === ADMIN_EMAIL);
  if (!isAdmin) {
    return res.status(403).json({ ok: false, message: "Faqat Admin xabarlarni ko'ra oladi." });
  }
  const msgs = readMessages();
  res.json({ ok: true, messages: msgs.slice().reverse() });
});

// ---- SYSTEM HEALTH & SSL CHECK ENDPOINT ----
app.get("/api/health", (req, res) => {
  const isHttps = req.secure || req.headers["x-forwarded-proto"] === "https";
  res.json({
    ok: true,
    status: "online",
    sslActive: isHttps,
    protocol: isHttps ? "https" : "http",
    timestamp: new Date().toISOString()
  });
});

// ---- GLOBAL ERROR HANDLER (Hides stack traces from hackers) ----
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ ok: false, message: "Noto'g'ri JSON formati yuborildi." });
  }
  console.error("Server error:", err.message);
  res.status(err.status || 500).json({
    ok: false,
    message: "Serverda kutilmagan xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring."
  });
});


// ---- SERVE FRONTEND STATIC FILES ----
// Works in local dev (../public) and in Docker/production (/public)
const localPublic = path.join(__dirname, "..", "public");
const dockerPublic = "/public";
const publicDir = fs.existsSync(localPublic) ? localPublic : dockerPublic;
app.use(express.static(publicDir));

// Serve index.html for root route
app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(PORT, async () => {
  console.log(`Safar backend running on http://localhost:${PORT}`);
  try {
    await db.initDatabase();
  } catch (err) {
    console.error("Database initialization error:", err.message);
  }
});

