import uuid
from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Memnuniyet(Base):
    """
    Vatandaşların çözülen/kapatılan talepler için bıraktığı memnuniyet
    değerlendirmesi (1-5 yıldız + isteğe bağlı yorum).
    Bir talep yalnızca bir kez değerlendirilebilir (talep_id benzersizdir).
    """

    __tablename__ = "memnuniyetler"
    __table_args__ = (
        CheckConstraint("puan >= 1 AND puan <= 5", name="ck_memnuniyet_puan_araligi"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    talep_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("talepler.id"), unique=True, nullable=False
    )

    puan: Mapped[int] = mapped_column(Integer, nullable=False)
    yorum: Mapped[str | None] = mapped_column(String(1000), nullable=True)

    olusturan_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("kullanicilar.id"), nullable=False
    )

    olusturulma_tarihi: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    talep = relationship("Talep", back_populates="memnuniyet")

    def __repr__(self) -> str:
        return f"<Memnuniyet talep={self.talep_id} puan={self.puan}>"
