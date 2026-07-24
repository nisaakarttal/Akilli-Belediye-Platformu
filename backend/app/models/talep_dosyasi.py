import enum
import uuid
from datetime import datetime

from sqlalchemy import BigInteger, DateTime, Enum, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class DosyaTuru(str, enum.Enum):
    FOTOGRAF = "fotograf"
    VIDEO = "video"
    SES = "ses"
    BELGE = "belge"
    SONUC_FOTOGRAFI = "sonuc_fotografi"


class TalepDosyasi(Base):
    """Bir talebe eklenen fotoğraf, video, ses veya belge dosyaları."""

    __tablename__ = "talep_dosyalari"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    talep_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("talepler.id"),
        nullable=False
    )

    dosya_turu: Mapped[DosyaTuru] = mapped_column(
        Enum(
            DosyaTuru,
            name="dosya_turu",
            values_callable=lambda enum_cls: [e.value for e in enum_cls],
        ),
        nullable=False,
    )

    dosya_yolu: Mapped[str] = mapped_column(String(500), nullable=False)
    orijinal_ad: Mapped[str] = mapped_column(String(255), nullable=False)
    boyut_bayt: Mapped[int] = mapped_column(BigInteger, nullable=False)

    yukleyen_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("kullanicilar.id"),
        nullable=False
    )

    olusturulma_tarihi: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    talep = relationship("Talep", back_populates="dosyalar")

    def __repr__(self) -> str:
        return f"<TalepDosyasi {self.orijinal_ad}>"