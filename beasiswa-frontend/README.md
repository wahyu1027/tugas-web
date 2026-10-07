Sistem Rekomendasi Beasiswa (Fuzzy Logic AI)

Sistem penilaian kelayakan beasiswa berbasis Fuzzy Logic (Mamdani) + AI, menilai IPK, penghasilan orang tua, dll.

Stack: FastAPI + React (Vite + Tailwind) + SQLite

FITUR:

Fuzzy Logic Engine (Mamdani)
Form pengajuan + validasi
Dashboard statistik (Recharts)
Dark mode
Riwayat pengajuan
Explainability rules fuzzy
UI modern & responsive

Arsitektur:

frontend :	React 18, Vite, Tailwind v4, Axios, Recharts
Backend	 :  Python 3.10+, FastAPI, SQLAlchemy, Pydantic
Fuzzy    :	scikit-fuzzy
DB	     :  SQLite (dev), PostgreSQL (prod)

Prasyarat:
Node.js v18+, npm v9+
Python 3.10+, pip 22+
Git 2.30+


Struktur:
beasiswa-project/
├── backend/          # main.py, models.py, fuzzy_engine.py, dll
├── beasiswa-frontend/# src/components, hooks, services
└── README.md

Setup Backend:
cd backend
python3 -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy pydantic scikit-fuzzy numpy
uvicorn main:app --reload
http://127.0.0.1:8000/docs

Setup Frontend:
cd beasiswa-frontend
npm install
npm run dev
http://localhost:5173

Menjalankan:

Buka 2 terminal

Backend: uvicorn main:app --reload
Frontend: npm run dev
Buka http://localhost:5173

Testing:
curl http://127.0.0.1:8000/api/v1/riwayat

curl -X POST http://127.0.0.1:8000/api/v1/rekomendasi \
  -H "Content-Type: application/json" \
  -d '{"mahasiswa_id":"Test","ipk":3.5,"penghasilan_ortu":2}'

Troubleshooting Umum:

rontend blank:	          Cek Console, pastikan backend jalan
Failed to resolve import:	Cek typo nama folder (case-sensitive)
bg-gradient-to-* error: 	Ganti ke bg-linear-to-* (Tailwind v4)
=@import error:         	Hapus = di index.css
CORS error:             	Tambah origin 5173 di main.py
Network Error:           	Backend mati → jalankan uvicorn
Dark mode gagal:        	Tambah @custom-variant dark di CSS
Chart kosong:           	Install recharts, kirim data dulu


Kontribusi:
git checkout -b feature/nama-fitur
git commit -m "feat: tambah fitur X"
git push origin feature/nama-fitur




