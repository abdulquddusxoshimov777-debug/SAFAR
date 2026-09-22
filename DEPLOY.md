# 🚀 Safar App — Render.com ga Deploy Qilish Yo'riqnomasi

> **Render.com** — eng qulay va bepul hosting. Kredit karta SHART EMAS.
> Sizning app 10–15 daqiqada internetga chiqadi!

---

## 📋 Kerak bo'ladigan narsalar
- ✅ GitHub akkaunt (bepul): https://github.com
- ✅ Render.com akkaunt (bepul): https://render.com
- ✅ Shu loyiha fayllari (allaqachon tayyor)

---

## 1-QADAM: Git O'rnatish

1. https://git-scm.com/download/win saytiga o'ting
2. `Git-2.x.x-64-bit.exe` ni yuklab oling va o'rnating
3. O'rnatish tugagach, `Windows Terminal` yoki `PowerShell` ni qayta oching

---

## 2-QADAM: GitHub ga Kod Yuklash

PowerShell da quyidagi buyruqlarni bir-bir bajaring:

```powershell
# 1. Git ni sozlash (bir marta)
git config --global user.name "Abdulquddus"
git config --global user.email "abdulquddusxoshimov777@gmail.com"

# 2. Loyiha papkasiga o'tish
cd "D:/Safar Cloude"

# 3. Git repositoriyasini boshlash
git init

# 4. Hamma fayllarni qo'shish
git add .

# 5. Birinchi commit
git commit -m "Safar app - initial commit"
```

Keyin GitHub.com ga kiring va yangi repository yarating:
1. GitHub.com → "+" → "New repository"
2. Nom: `safar-app`
3. `Private` tanlang (xavfsizlik uchun)
4. "Create repository" bosing

Keyin quyidagi buyruqlarni bajaring (GitHub sizga ko'rsatadi):
```powershell
git remote add origin https://github.com/SIZNING_GITHUB_ISMINGIZ/safar-app.git
git branch -M main
git push -u origin main
```

---

## 3-QADAM: Render.com ga Deploy

1. **render.com** saytiga kiring
2. **"New +"** → **"Web Service"** bosing
3. **"Connect GitHub"** bosib GitHub akkauntingizni ulang
4. **`safar-app`** repositoryni tanlang → **"Connect"**

### Sozlamalar (muhim!):

| Parametr | Qiymat |
|----------|--------|
| **Name** | `safar-app` |
| **Region** | `Frankfurt (EU Central)` |
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Plan** | `Free` |

### Environment Variables (muhim!):

"Environment" bo'limida quyidagilarni qo'shing:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | (Render "Generate" tugmasini bosing — avtomatik yaratiladi) |
| `ADMIN_EMAIL` | `abdulquddusxoshimov777@gmail.com` |

5. **"Create Web Service"** bosing
6. 5–10 daqiqa kuting — Render app ni quradi

### ✅ Muvaffaqiyat!
Deploy tugagach, Render sizga bunday URL beradi:
```
https://safar-app.onrender.com
```

---

## ⚠️ Muhim Eslatmalar

### Bepul Plan Cheklovi:
- Bepul planda app **15 daqiqa foydalanilmasa "uyquga" ketadi**
- Birinchi so'rovda **30–60 soniya** kutish mumkin
- Har oy **750 soat** bepul (1 app uchun yetarli)

### Ma'lumotlar (JSON fayllar):
- Bepul planda JSON fayldagi ma'lumotlar **redeploy bo'lganda o'chishi mumkin**
- Doimiy saqlash uchun keyinroq **MongoDB Atlas** (bepul) ga o'tish mumkin
- Hozircha test uchun yetarli

### Listings.json yuklash:
Render ga listings.json ni yuklash uchun:
1. GitHub repoda `backend/listings.json` faylini qo'shing (`.gitignore` dan o'chirib)
2. Yoki Render dashboard dan "Shell" orqali qo'lda yuklang

---

## 🔒 Xavfsizlik (Allaqachon Tayyor!)

- ✅ Helmet.js (XSS, clickjacking himoyasi)
- ✅ Rate limiting (brute force himoyasi)  
- ✅ Input sanitization (injection himoyasi)
- ✅ HTTPS enforcement (production)
- ✅ JWT authentication
- ✅ 0 npm zaiflik (npm audit clean)

---

## 📞 Muammo bo'lsa

Render logs ni ko'rish uchun:
Dashboard → `safar-app` → "Logs" bo'limi

Agar xatolik ko'rsangiz, log'ni nusxalab yuboring — men yordam beraman!
