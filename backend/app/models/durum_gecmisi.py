import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.talep import TalepDurumu


class DurumGecmisi(Base):
    """
    Bir talebin zaman içindeki durum değişikliklerini tutar.
    Vatandaşa gösterilen "Zaman Tüneli" (Timeline) bu tablodan oluşturulur:
    Oluşturuldu → Atandı → İnceleniyor → Çözüldü → Kapatıldı
    """

    __tablename__ = "durum_gecmisi"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    talep_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("talepler.id"), nullable=False)

    onceki_durum: Mapped[TalepDurumu | None] = mapped_column(
        Enum(
            TalepDurumu,
            name="onceki_durum",
            values_callable=lambda enum_cls: [e.value for e in enum_cls],
        ),
        nullable=True,
    )

    yeni_durum: Mapped[TalepDurumu] = mapped_column(
        Enum(
            TalepDurumu,
            name="yeni_durum",
            values_callable=lambda enum_cls: [e.value for e in enum_cls],
        ),
        nullable=False,
    )

    aciklama: Mapped[str | None] = mapped_column(String(500), nullable=True)
    degistiren_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("kullanicilar.id"), nullable=False)

    olusturulma_tarihi: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    talep = relationship("Talep", back_populates="durum_gecmisi")

    def __repr__(self) -> str:
        return f"<DurumGecmisi {self.onceki_durum} -> {self.yeni_durum}>"
