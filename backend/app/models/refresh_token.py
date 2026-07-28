import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class RefreshToken(Base):
    __tablename__ = "refresh_tokenlar"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    kullanici_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("kullanicilar.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    token_hash: Mapped[str] = mapped_column(
        String,
        nullable=False,
        unique=True,
        index=True,
    )

    olusturulma_tarihi: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    son_kullanma_tarihi: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    iptal_edildi: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    ip_adresi: Mapped[str | None] = mapped_column(
        String(45),
        nullable=True,
    )

    kullanici_aracisi: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
    )