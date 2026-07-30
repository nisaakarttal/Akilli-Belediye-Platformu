import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class AktiviteKaydi(Base):
    """
    Sistemdeki önemli işlemlerin denetim (audit) kaydı.
    Örnek: 'Ahmet Yılmaz, KAP-2026-00042 talebini Fen İşleri personeline atadı.'
    """

    __tablename__ = "aktivite_kayitlari"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # Sistem tarafından (zamanlanmış görev vb.) oluşturulan kayıtlarda kullanici_id NULL olabilir.
    kullanici_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("kullanicilar.id"), nullable=True)

    eylem: Mapped[str] = mapped_column(String(100), nullable=False)  # ör. "talep_olusturuldu", "kullanici_guncellendi"
    hedef_tablo: Mapped[str] = mapped_column(String(100), nullable=False)
    hedef_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True)
    detay: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    ip_adresi: Mapped[str | None] = mapped_column(String(45), nullable=True)

    olusturulma_tarihi: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self) -> str:
        return f"<AktiviteKaydi {self.eylem}>"
