# 🎓 Sistem Rekomendasi Beasiswa Berbasis Fuzzy Logic AI

Sistem rekomendasi penerima beasiswa menggunakan **Fuzzy Logic** + **AI** untuk menilai kelayakan mahasiswa berdasarkan IPK, penghasilan orang tua, dan kriteria lain. Dibangun dengan arsitektur modern: **FastAPI** (backend) + **React + Vite + Tailwind** (frontend) + **SQLite** (database).

Git Workflow

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
│   ├── fuzzy_engine.py               # Fuzzy logic engine
│   ├── index.html                    # (Legacy UI, opsional)
│   └── beasiswa.db                   # SQLite database (auto-generated)
│  
│   
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

