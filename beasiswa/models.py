from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from datetime import datetime
from database import Base


class RekomendasiModel(Base):
    __tablename__ = "rekomendasi_beasiswa"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    mahasiswa_id = Column(String, index=True, nullable=False)
    ipk = Column(Float, nullable=False)
    penghasilan_ortu = Column(Float, nullable=False)
    skor_kelayakan = Column(Float, nullable=False)
    status = Column(String, nullable=False)
    rekomendasi = Column(String, nullable=False)

    # --- KOLOM BARU UNTUK EXPLAINABILITY ---
    detail_fuzzy = Column(Text, nullable=True)   # JSON string
    rules_aktif = Column(Text, nullable=True)    # JSON string
    kesimpulan = Column(Text, nullable=True)     # Narasi teks

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)