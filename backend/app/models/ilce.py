import uuid

from sqlalchemy import Float, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Ilce(Base):
    """İlçe tanımları (Kapaklı için tek ilçe olsa da genişletilebilir yapı)."""

    __tablename__ = "ilceler"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ad: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    il: Mapped[str] = mapped_column(String(100), default="Tekirdağ", nullable=False)
    merkez_enlem: Mapped[float] = mapped_column(Float, nullable=False)
    merkez_boylam: Mapped[float] = mapped_column(Float, nullable=False)

    mahalleler = relationship("Mahalle", back_populates="ilce")

    def __repr__(self) -> str:
        return f"<Ilce {self.ad}>"
