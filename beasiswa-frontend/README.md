# 🎓 Sistem Rekomendasi Beasiswa Berbasis Fuzzy Logic AI

Sistem rekomendasi penerima beasiswa menggunakan **Fuzzy Logic** + **AI** untuk menilai kelayakan mahasiswa berdasarkan IPK, penghasilan orang tua, dan kriteria lain. Dibangun dengan arsitektur modern: **FastAPI** (backend) + **React + Vite + Tailwind** (frontend) + **SQLite** (database).

---

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Prasyarat](#-prasyarat)
- [Struktur Proyek](#-struktur-proyek)
- [Setup Backend](#-setup-backend)
- [Setup Frontend](#-setup-frontend)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Kontribusi](#-kontribusi)

---

## ✨ Fitur Utama

- 🧠 **Fuzzy Logic Engine** — Penilaian kelayakan dengan Mamdani inference
- 📝 **Form Pengajuan** — Input data mahasiswa dengan validasi
- 📊 **Dashboard Statistik** — Visualisasi data dengan Recharts (Pie, Line, Bar)
- 🌙 **Dark Mode** — Toggle tema gelap/terang, tersimpan di localStorage
- 📋 **Riwayat Pengajuan** — Tabel lengkap semua pengajuan
- 🔍 **Explainability** — Rules fuzzy yang ter-trigger bisa dilacak
- 🎨 **UI Modern** — React + Tailwind CSS, responsive design
- ⚡ **Fast API** — Backend async dengan FastAPI + SQLAlchemy

---

## 🏗 Arsitektur Sistem

```
┌─────────────────────┐         ┌─────────────────────┐
│   React Frontend    │ ──HTTP─▶│   FastAPI Backend   │
│   localhost:5173    │         │   127.0.0.1:8000    │
│   Vite + Tailwind   │         │   + Fuzzy Engine    │
└─────────────────────┘         └──────────┬──────────┘
                                            │
                                            ▼
                                  ┌──────────────────┐
                                  │  SQLite Database │
                                  │   beasiswa.db    │
                                  └──────────────────┘
```

**Tech Stack:**

| Layer | Teknologi |
|---|---|
| Frontend | React 18, Vite 8, Tailwind CSS v4, Axios, Recharts |
| Backend | Python 3.10+, FastAPI, SQLAlchemy, Pydantic |
| Fuzzy | scikit-fuzzy (Mamdani) |
| Database | SQLite (dev), PostgreSQL (production) |
| Tools | Git, VS Code, npm, pip |

---

## 📦 Prasyarat

Sebelum mulai, pastikan sudah terinstal:

| Tool | Versi Minimum | Cek dengan | Download |
|---|---|---|---|
| **Node.js** | v18.0.0 | `node -v` | [nodejs.org](https://nodejs.org) |
| **npm** | v9.0.0 | `npm -v` | (bundled dengan Node) |
| **Python** | 3.10 | `python3 --version` | [python.org](https://python.org) |
| **pip** | 22.0 | `pip --version` | (bundled dengan Python) |
| **Git** | 2.30 | `git --version` | [git-scm.com](https://git-scm.com) |
| **VS Code** (opsional) | Latest | — | [code.visualstudio.com](https://code.visualstudio.com) |

**Extension VS Code yang disarankan:**
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Python
- Pylance
- SQLite Viewer

---

## 📁 Struktur Proyek

```
beasiswa-project/
├── backend/                          # FastAPI Backend
│   ├── main.py                       # Entry point + routes
│   ├── models.py                     # SQLAlchemy models
│   ├── database.py                   # DB config
│   ├── schemas.py                    # Pydantic schemas
│   ├── fuzzy_engine.py               # Fuzzy logic engine
│   ├── index.html                    # (Legacy UI, opsional)
│   ├── beasiswa.db                   # SQLite database (auto-generated)
│   └── requirements.txt              # Python dependencies
│
├── beasiswa-frontend/                # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── FormPengajuan.jsx
│   │   │   ├── CardHasil.jsx
│   │   │   ├── TabelRiwayat.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Badge.jsx
│   │   ├── hooks/
│   │   │   └── useDarkMode.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🔧 Setup Backend

### 1. Masuk ke Folder Backend

```bash
cd backend
```

### 2. Buat Virtual Environment

**macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows (Command Prompt):**
```bash
python -m venv venv
venv\Scripts\activate
```

**Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

> 💡 Kalau muncul error `Execution Policy` di PowerShell, jalankan dulu:
> `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`

### 3. Install Dependencies

Cara cepat:
```bash
pip install fastapi uvicorn sqlalchemy pydantic scikit-fuzzy numpy
```

Atau pakai `requirements.txt`:
```bash
pip install -r requirements.txt
```

**Isi `requirements.txt` (untuk tim):**
```txt
fastapi==0.115.0
uvicorn[standard]==0.32.0
sqlalchemy==2.0.36
pydantic==2.9.2
scikit-fuzzy==0.5.0
numpy==2.1.3
python-multipart==0.0.12
```

### 4. Verifikasi Instalasi

```bash
python -c "import fastapi, sqlalchemy, skfuzzy; print('✅ Semua library OK')"
```

### 5. Jalankan Backend

```bash
uvicorn main:app --reload
```

Harus muncul:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

**Test backend hidup:**
- Buka http://127.0.0.1:8000/docs → Swagger UI muncul
- Buka http://127.0.0.1:8000/api/v1/riwayat → return `[]` atau array JSON

---

## 🎨 Setup Frontend

### 1. Masuk ke Folder Frontend

```bash
# Dari root project
cd beasiswa-frontend
```

### 2. Install Dependencies

```bash
npm install
```

**Dependencies yang akan terinstal:**

| Package | Fungsi | Versi |
|---|---|---|
| `react` | Library UI | ^19.0.0 |
| `react-dom` | React DOM renderer | ^19.0.0 |
| `vite` | Build tool & dev server | ^8.0.0 |
| `tailwindcss` | Utility-first CSS | ^4.0.0 |
| `@tailwindcss/vite` | Plugin Tailwind untuk Vite | ^4.0.0 |
| `axios` | HTTP client | ^1.7.0 |
| `recharts` | Chart library | ^2.13.0 |

### 3. Install Manual (Kalau `npm install` Gagal)

```bash
# Base
npm install react react-dom
npm install -D vite @vitejs/plugin-react

# Tailwind v4
npm install tailwindcss @tailwindcss/vite

# HTTP & Chart
npm install axios recharts
```

### 4. Konfigurasi `vite.config.js`

Pastikan file ini berisi:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### 5. Konfigurasi `src/index.css`

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

/* ... animasi ... */
```

### 6. Jalankan Frontend

```bash
npm run dev
```

Harus muncul:
```
VITE v8.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

## 🚀 Menjalankan Aplikasi

Aplikasi butuh **2 terminal** yang jalan bersamaan.

### Terminal 1 — Backend

```bash
cd backend
source venv/bin/activate       # Windows: venv\Scripts\activate
uvicorn main:app --reload
```
→ Berjalan di http://127.0.0.1:8000

### Terminal 2 — Frontend

```bash
cd beasiswa-frontend
npm run dev
```
→ Berjalan di http://localhost:5173

### Buka Browser

```
http://localhost:5173
```

**Checklist aplikasi jalan:**

- [ ] Backend: http://127.0.0.1:8000/docs → Swagger UI muncul
- [ ] Frontend: http://localhost:5173 → Form muncul
- [ ] Submit form → hasil muncul & masuk tabel
- [ ] Klik 📊 Dashboard → chart muncul
- [ ] Klik 🌙 → dark mode aktif

---

## 🧪 Testing

### Test Manual Backend

```bash
# Test GET
curl http://127.0.0.1:8000/api/v1/riwayat

# Test POST
curl -X POST http://127.0.0.1:8000/api/v1/rekomendasi \
  -H "Content-Type: application/json" \
  -d '{"mahasiswa_id": "Test", "ipk": 3.5, "penghasilan_ortu": 2}'
```

### Test Manual Frontend

1. Buka `http://localhost:5173`
2. Tekan `F12` → tab **Console** (pastikan tidak ada error merah)
3. Isi form → klik **Proses AI**
4. Cek **Network tab** → POST `/api/v1/rekomendasi` → status 200
5. Cek tabel riwayat → data baru muncul

### Test Database

```bash
cd backend
sqlite3 beasiswa.db "SELECT * FROM rekomendasi_beasiswa;"
```

---

## 🐛 Troubleshooting

### ❌ Frontend Blank / Halaman Kosong

**Diagnosis:**
1. Buka **Console browser (F12)** → cari error merah
2. Cek **backend jalan?** → http://127.0.0.1:8000/docs
3. Cek **semua file ada?** → `ls -R src/`

**Fix umum:**
- Backend mati → jalankan `uvicorn main:app --reload`
- Typo di komponen → cek error di Console, fix file yang disebutkan
- File kurang → buat file yang hilang

### ❌ Error `Failed to resolve import`

**Penyebab:** Nama file/folder salah (typo, case-sensitive).

**Fix:**
```bash
# Cek nama folder
ls src/
# Pastikan: components (jamak), services (jamak)
```

### ❌ Error `bg-gradient-to-*` di Tailwind v4

**Penyebab:** Tailwind v4 ganti nama class.

**Fix:** Ganti semua:
```
bg-gradient-to-r  →  bg-linear-to-r
bg-gradient-to-br →  bg-linear-to-br
```

### ❌ Error `Invalid declaration: =@import`

**Penyebab:** Ada karakter `=` di depan `@import`.

**Fix:** Buka `src/index.css`, hapus `=`, jadi:
```css
@import "tailwindcss";
```

### ❌ Error `Cannot find variable: xxx`

**Penyebab:** Typo di kode komponen.

**Fix:**
1. Buka Console browser → lihat nama file & baris error
2. Buka file tersebut di baris yang disebut
3. Perbaiki typo

### ❌ Error CORS

**Penyebab:** Frontend port 5173 tidak diizinkan backend.

**Fix di `backend/main.py`:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### ❌ Error `Network Error` / `ERR_CONNECTION_REFUSED`

**Penyebab:** Backend tidak jalan.

**Fix:**
```bash
# Cek backend hidup
curl http://127.0.0.1:8000/docs

# Kalau mati, jalankan:
cd backend
uvicorn main:app --reload
```

### ❌ Dark Mode Tidak Berubah

**Penyebab:** `@custom-variant dark` belum ada di CSS.

**Fix di `src/index.css`:**
```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

### ❌ Chart Tidak Muncul

**Penyebab:** `recharts` belum di-install, atau data kosong.

**Fix:**
```bash
npm install recharts
```

Cek juga: kirim 1-2 data dulu via form agar chart punya data.

---

## 🤝 Kontribusi

### Git Workflow

```bash
# 1. Clone
git clone <repo-url>
cd beasiswa-project

# 2. Buat branch baru
git checkout -b feature/nama-fitur

# 3. Commit
git add .
git commit -m "feat: tambah fitur X"

# 4. Push
git push origin feature/nama-fitur

# 5. Buat Pull Request
```

### Konvensi Commit

| Prefix | Untuk |
|---|---|
| `feat:` | Fitur baru |
| `fix:` | Bug fix |
| `docs:` | Dokumentasi |
| `style:` | Format, tidak ubah logic |
| `refactor:` | Refactor kode |
| `test:` | Testing |
| `chore:` | Maintenance |

### Before Push — Checklist

- [ ] Backend jalan tanpa error
- [ ] Frontend jalan tanpa error di Console
- [ ] Fitur baru sudah ditest manual
- [ ] Tidak ada `console.log` yang tertinggal
- [ ] Tidak ada file `.env` atau `node_modules` yang di-commit

---

## 📞 Kontak Tim

| Nama | Role | Kontak |
|---|---|---|
| _[Nama Anda]_ | Backend + Fuzzy | _email/github_ |
| _[Nama Teman]_ | Frontend | _email/github_ |
| _[Nama Teman]_ | UI/UX | _email/github_ |

---

## 📜 Lisensi

_[MIT / Apache 2.0 / lainnya]_

---

**Dibuat dengan ❤️ untuk membantu mahasiswa berprestasi**