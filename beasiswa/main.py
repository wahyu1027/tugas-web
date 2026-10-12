from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from typing import List, Optional
import json

import models
from database import engine, get_db
from fuzzy_engine import BeasiswaFuzzyEngine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Scholarship AI Recommendation API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ai_engine = BeasiswaFuzzyEngine()


# ============================================================
# SCHEMAS
# ============================================================
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
    detail_fuzzy: Optional[str] = None
    rules_aktif: Optional[str] = None
    kesimpulan: Optional[str] = None

    class Config:
        from_attributes = True


# ============================================================
# ENDPOINTS
# ============================================================
@app.get("/", response_class=dict)
def root():
    return {"message": "Scholarship AI API", "version": "2.0.0"}


@app.post("/api/v1/rekomendasi", response_model=HasilRekomendasi)
def proses_rekomendasi(data: PermohonanBeasiswa, db: Session = Depends(get_db)):
    try:
        # Hitung fuzzy + detail
        hasil = ai_engine.hitung_kelayakan(
            val_ipk=data.ipk,
            val_penghasilan=data.penghasilan_ortu,
        )

        skor = hasil['skor']
        kategori = hasil['kategori']

        # Pesan singkat
        pesan_map = {
            'Sangat Layak': 'Diprioritaskan untuk menerima beasiswa.',
            'Layak': 'Memenuhi kriteria, siap diverifikasi.',
            'Dipertimbangkan': 'Masuk daftar cadangan / evaluasi manual.',
            'Tidak Layak': 'Belum memenuhi kriteria minimum.',
        }
        pesan = pesan_map.get(kategori, '-')

        # Simpan ke DB
        db_record = models.RekomendasiModel(
            mahasiswa_id=data.mahasiswa_id,
            ipk=data.ipk,
            penghasilan_ortu=data.penghasilan_ortu,
            skor_kelayakan=skor,
            status=kategori,
            rekomendasi=pesan,
            detail_fuzzy=json.dumps(hasil['fuzzifikasi']),
            rules_aktif=json.dumps(hasil['rules_aktif']),
            kesimpulan=hasil['kesimpulan'],
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)

        return db_record

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Gagal memproses: {str(e)}")


@app.get("/api/v1/riwayat", response_model=List[HasilRekomendasi])
def ambil_riwayat(db: Session = Depends(get_db)):
    return (
        db.query(models.RekomendasiModel)
        .order_by(models.RekomendasiModel.id.desc())
        .all()
    )