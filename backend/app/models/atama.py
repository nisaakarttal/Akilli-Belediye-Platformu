import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Atama(Base):
    """Bir talebin hangi personele, kim tarafından ve ne zaman atandığını tutar."""

    __tablename__ = "atamalar"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    talep_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("talepler.id"), nullable=False)
    personel_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("kullanicilar.id"), nullable=False)
    atayan_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("kullanicilar.id"), nullable=False)

    not_: Mapped[str | None] = mapped_column("not", String(500), nullable=True)
    olusturulma_tarihi: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    talep = relationship("Talep", back_populates="atamalar")
    personel = relationship("Kullanici", back_populates="atamalar", foreign_keys=[personel_id])

    def __repr__(self) -> str:
        return f"<Atama talep={self.talep_id} personel={self.personel_id}>"
