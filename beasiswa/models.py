from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from database import Base

class RekomendasiModel(Base):
    __tablename__ = "rekomendasi_beasiswa"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    mahasiswa_id = Column(String, index=True)
    ipk = Column(Float)
    penghasilan_ortu = Column(Float)
    skor_kelayakan = Column(Float)
    status = Column(String)
    rekomendasi = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)