import enum
import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class BildirimTuru(str, enum.Enum):
    YENI_TALEP = "yeni_talep"
    DURUM_DEGISTI = "durum_degisti"
    TALEP_ATANDI = "talep_atandi"
    TALEP_COZULDU = "talep_cozuldu"
    SISTEM = "sistem"


class Bildirim(Base):
    """Kullanıcılara gönderilen bildirimler (uygulama içi)."""

    __tablename__ = "bildirimler"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    kullanici_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("kullanicilar.id"), nullable=False)

    tur: Mapped[BildirimTuru] = mapped_column(
        Enum(
            BildirimTuru,
            name="bildirim_turu",
            values_callable=lambda enum_cls: [e.value for e in enum_cls],
        ),
        nullable=False,
    )
    baslik: Mapped[str] = mapped_column(String(200), nullable=False)
    mesaj: Mapped[str] = mapped_column(String(500), nullable=False)
    ilgili_talep_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("talepler.id"), nullable=True)

    okundu_mu: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    olusturulma_tarihi: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    kullanici = relationship("Kullanici", back_populates="bildirimler")

    def __repr__(self) -> str:
        return f"<Bildirim {self.baslik}>"
