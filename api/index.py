from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from typing import List

import models
from database import engine, get_db
from fuzzy_engine import BeasiswaFuzzyEngine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Scholarship AI Recommendation API", version="2.0.0")

# Izinkan Akses CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ai_engine = BeasiswaFuzzyEngine()

class PermohonanBeasiswa(BaseModel):
    mahasiswa_id: str
    ipk: float = Field(..., ge=0.0, le=4.0)
    penghasilan_ortu: float = Field(..., ge=0.0)

class HasilRekomendasi(BaseModel):
    id: int
    mahasiswa_id: str
    ipk: float
    penghasilan_ortu: float
    skor_kelayakan: float
    status: str
    rekomendasi: str

    class Config:
        from_attributes = True

# Endpoint untuk Melayani Halaman Utama UI
@app.get("/", response_class=FileResponse)
def index():
    return FileResponse("index.html")

@app.post("/api/v1/rekomendasi", response_model=HasilRekomendasi)
def proses_rekomendasi(data: PermohonanBeasiswa, db: Session = Depends(get_db)):
    try:
        skor = ai_engine.hitung_kelayakan(
            val_ipk=data.ipk,
            val_penghasilan=data.penghasilan_ortu
        )
        
        if skor >= 70.0:
            status = "Sangat Layak"
            pesan = "Diprioritaskan untuk menerima beasiswa."
        elif skor >= 45.0:
            status = "Dipertimbangkan"
            pesan = "Masuk ke daftar cadangan / evaluasi manual."
        else:
            status = "Tidak Layak"
            pesan = "Belum memenuhi kriteria minimum beasiswa."

        db_record = models.RekomendasiModel(
            mahasiswa_id=data.mahasiswa_id,
            ipk=data.ipk,
            penghasilan_ortu=data.penghasilan_ortu,
            skor_kelayakan=round(skor, 2),
            status=status,
            rekomendasi=pesan
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)

        return db_record

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memproses data: {str(e)}")

@app.get("/api/v1/riwayat", response_model=List[HasilRekomendasi])
def ambil_semua_riwayat(db: Session = Depends(get_db)):
    return db.query(models.RekomendasiModel).order_by(models.RekomendasiModel.id.desc()).all()