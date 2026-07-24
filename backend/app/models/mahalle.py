import uuid

from sqlalchemy import Float, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Mahalle(Base):
    """Mahalle tanımları (ör. Atatürk Mahallesi, Cumhuriyet Mahallesi)."""

    __tablename__ = "mahalleler"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ad: Mapped[str] = mapped_column(String(150), nullable=False)
    ilce_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("ilceler.id"), nullable=False)
    merkez_enlem: Mapped[float] = mapped_column(Float, nullable=False)
    merkez_boylam: Mapped[float] = mapped_column(Float, nullable=False)

    ilce = relationship("Ilce", back_populates="mahalleler")
    talepler = relationship("Talep", back_populates="mahalle")

    def __repr__(self) -> str:
        return f"<Mahalle {self.ad}>"
