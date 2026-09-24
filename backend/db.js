/**
 * saffar Platform - Unified Cloud Database Adapter
 * Supports MongoDB Atlas (via MONGODB_URI) and local JSON storage fallback.
 */

const fs = require("fs");
const path = require("path");
let mongoose = null;

try {
  mongoose = require("mongoose");
} catch (e) {
  console.warn("[DB] mongoose package not installed, running in local file mode.");
}

const DATA_DIR = __dirname;
const USERS_FILE = path.join(DATA_DIR, "users.json");
const LISTINGS_FILE = path.join(DATA_DIR, "listings.json");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

let isMongoConnected = false;

// Mongoose Schemas for MongoDB Atlas
let UserModel = null;
let ListingModel = null;
let ReviewModel = null;
let MessageModel = null;

if (mongoose) {
  const UserSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "tourist" },
    avatarUrl: { type: String, default: null },
    bio: { type: String, default: "" },
    createdAt: { type: String, default: () => new Date().toISOString() },
    lastListingCreatedAtByCategory: { type: Object, default: {} }
  }, { timestamps: true, strict: false });

  const ListingSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    categoryType: { type: String, required: true }, // 'stays', 'places', 'foods', 'crafts'
    ownerId: { type: String, default: null },
    userId: { type: String, default: null },
    ownerEmail: { type: String, default: null },
    userEmail: { type: String, default: null },
    ownerName: { type: String, default: "" },
    title: { type: String, required: true },
    city: { type: String, default: "O'zbekiston" },
    price: { type: String, default: "" },
    tag: { type: String, default: "" },
    desc: { type: String, default: "" },
    image: { type: String, default: "" },
    images: { type: [String], default: [] },
    coordinates: { type: [Number], default: [41.311081, 69.240562] },
    googleMapsUrl: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    amenities: { type: [String], default: [] },
    rating: { type: Number, default: 5.0 },
    reviews: { type: Number, default: 0 }
  }, { timestamps: true, strict: false });

  const ReviewSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, default: "" },
    userAvatar: { type: String, default: null },
    targetType: { type: String, required: true },
    targetId: { type: Number, required: true },
    stayId: { type: Number, default: null },
    stayTitle: { type: String, default: "" },
    location: { type: String, default: "" },
    text: { type: String, required: true },
    rating: { type: Number, default: 5 },
    mediaBase64List: { type: [String], default: [] },
    createdAt: { type: String, default: () => new Date().toISOString() }
  }, { timestamps: true, strict: false });

  const MessageSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, default: "" },
    message: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() }
  }, { timestamps: true, strict: false });

  UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
  ListingModel = mongoose.models.Listing || mongoose.model("Listing", ListingSchema);
  ReviewModel = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
  MessageModel = mongoose.models.Message || mongoose.model("Message", MessageSchema);
}

// Local file helper utilities
function localReadJSON(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[DB] Error reading ${filePath}:`, err.message);
    return fallback;
  }
}

function localWriteJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error(`[DB] Error writing ${filePath}:`, err.message);
  }
}

// Initial Database Connection & Auto-Migration
async function initDatabase() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (mongoUri && mongoose) {
    try {
      console.log("[DB] Connecting to MongoDB Atlas...");
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000
      });
      isMongoConnected = true;
      console.log("✅ [DB] Successfully connected to MongoDB Atlas Cloud Database!");

      // Check and migrate data if cloud collections are empty
      await autoMigrateLocalDataToMongo();
    } catch (err) {
      console.warn("⚠️ [DB] MongoDB Atlas connection failed, falling back to local JSON storage:", err.message);
      isMongoConnected = false;
    }
  } else {
    console.log("ℹ️ [DB] MONGODB_URI not provided. Running in local JSON storage mode.");
  }
}

// Migrate initial users and listings to MongoDB Atlas if empty
async function autoMigrateLocalDataToMongo() {
  try {
    if (!isMongoConnected) return;

    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      const localUsers = localReadJSON(USERS_FILE, []);
      if (localUsers.length > 0) {
        console.log(`[DB] Migrating ${localUsers.length} local users to MongoDB Atlas...`);
        for (const u of localUsers) {
          await UserModel.updateOne({ id: u.id }, { $set: u }, { upsert: true });
        }
        console.log("✅ [DB] Users migrated to MongoDB Atlas!");
      }
    }

    const listingCount = await ListingModel.countDocuments();
    if (listingCount === 0) {
      const localListings = localReadJSON(LISTINGS_FILE, { stays: [], places: [], foods: [], crafts: [] });
      let allItems = [];
      for (const cat of ["stays", "places", "foods", "crafts"]) {
        const items = localListings[cat] || [];
        for (const item of items) {
          allItems.push({ ...item, categoryType: cat });
        }
      }
      if (allItems.length > 0) {
        console.log(`[DB] Migrating ${allItems.length} local listings to MongoDB Atlas...`);
        for (const item of allItems) {
          await ListingModel.updateOne({ id: item.id }, { $set: item }, { upsert: true });
        }
        console.log("✅ [DB] Listings migrated to MongoDB Atlas!");
      }
    }

    const reviewCount = await ReviewModel.countDocuments();
    if (reviewCount === 0) {
      const localReviews = localReadJSON(REVIEWS_FILE, []);
      if (localReviews.length > 0) {
        console.log(`[DB] Migrating ${localReviews.length} local reviews to MongoDB Atlas...`);
        for (const r of localReviews) {
          await ReviewModel.updateOne({ id: r.id }, { $set: r }, { upsert: true });
        }
        console.log("✅ [DB] Reviews migrated to MongoDB Atlas!");
      }
    }
  } catch (err) {
    console.error("[DB] Migration error:", err.message);
  }
}

// Asynchronous Data Access Layer with Dual Storage (Mongo + Local Backup)
async function getUsers() {
  if (isMongoConnected) {
    try {
      const users = await UserModel.find({}).lean();
      return users;
    } catch (e) {
      console.warn("[DB] Error reading users from Mongo, using local:", e.message);
    }
  }
  return localReadJSON(USERS_FILE, []);
}

async function saveUsers(users) {
  localWriteJSON(USERS_FILE, users);
  if (isMongoConnected) {
    try {
      for (const u of users) {
        await UserModel.updateOne({ id: u.id }, { $set: u }, { upsert: true });
      }
    } catch (e) {
      console.error("[DB] Error writing users to Mongo:", e.message);
    }
  }
}

async function getListings() {
  if (isMongoConnected) {
    try {
      const items = await ListingModel.find({}).lean();
      const result = { stays: [], places: [], foods: [], crafts: [] };
      items.forEach(it => {
        const cat = it.categoryType || "stays";
        if (!result[cat]) result[cat] = [];
        result[cat].push(it);
      });
      return result;
    } catch (e) {
      console.warn("[DB] Error reading listings from Mongo, using local:", e.message);
    }
  }
  return localReadJSON(LISTINGS_FILE, { stays: [], places: [], foods: [], crafts: [] });
}

async function saveListings(listings) {
  localWriteJSON(LISTINGS_FILE, listings);
  if (isMongoConnected) {
    try {
      for (const cat of ["stays", "places", "foods", "crafts"]) {
        const items = listings[cat] || [];
        for (const it of items) {
          await ListingModel.updateOne({ id: it.id }, { $set: { ...it, categoryType: cat } }, { upsert: true });
        }
      }
    } catch (e) {
      console.error("[DB] Error writing listings to Mongo:", e.message);
    }
  }
}

async function deleteListingById(id) {
  if (isMongoConnected) {
    try {
      await ListingModel.deleteOne({ id: Number(id) });
    } catch (e) {
      console.error("[DB] Error deleting listing from Mongo:", e.message);
    }
  }
}

async function getReviews() {
  if (isMongoConnected) {
    try {
      return await ReviewModel.find({}).lean();
    } catch (e) {
      console.warn("[DB] Error reading reviews from Mongo:", e.message);
    }
  }
  return localReadJSON(REVIEWS_FILE, []);
}

async function saveReviews(reviews) {
  localWriteJSON(REVIEWS_FILE, reviews);
  if (isMongoConnected) {
    try {
      for (const r of reviews) {
        await ReviewModel.updateOne({ id: r.id }, { $set: r }, { upsert: true });
      }
    } catch (e) {
      console.error("[DB] Error writing reviews to Mongo:", e.message);
    }
  }
}

async function deleteReviewById(id) {
  if (isMongoConnected) {
    try {
      await ReviewModel.deleteOne({ id: String(id) });
    } catch (e) {
      console.error("[DB] Error deleting review from Mongo:", e.message);
    }
  }
}

async function saveMessage(msg) {
  const localMsgs = localReadJSON(MESSAGES_FILE, []);
  localMsgs.push(msg);
  localWriteJSON(MESSAGES_FILE, localMsgs);

  if (isMongoConnected) {
    try {
      await MessageModel.create(msg);
    } catch (e) {
      console.error("[DB] Error saving message to Mongo:", e.message);
    }
  }
}

module.exports = {
  initDatabase,
  getUsers,
  saveUsers,
  getListings,
  saveListings,
  deleteListingById,
  getReviews,
  saveReviews,
  deleteReviewById,
  saveMessage,
  isCloudActive: () => isMongoConnected,
  localReadJSON,
  localWriteJSON,
  USERS_FILE,
  LISTINGS_FILE,
  REVIEWS_FILE,
  MESSAGES_FILE
};
