import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class AiKaydi(Base):
    """
    Gemini API ile yapılan her etkileşimin kaydı.
    Hem AI sohbet asistanı hem de otomatik kategori/öncelik önerisi burada loglanır.
    Şeffaflık ve hata ayıklama (debugging) için tutulur.
    """

    __tablename__ = "ai_kayitlari"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    kullanici_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("kullanicilar.id"), nullable=True)
    ilgili_talep_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("talepler.id"), nullable=True)

    islem_turu: Mapped[str] = mapped_column(String(50), nullable=False)  # "sohbet" | "talep_analizi"
    girdi_metni: Mapped[str] = mapped_column(Text, nullable=False)
    cikti_metni: Mapped[str] = mapped_column(Text, nullable=False)
    model_adi: Mapped[str] = mapped_column(String(100), nullable=False)
    yanit_suresi_ms: Mapped[int | None] = mapped_column(nullable=True)
    guven_skoru: Mapped[float | None] = mapped_column(Float, nullable=True)

    olusturulma_tarihi: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self) -> str:
        return f"<AiKaydi {self.islem_turu} - {self.olusturulma_tarihi}>"
