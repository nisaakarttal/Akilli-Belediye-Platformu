import uuid
from datetime import datetime

from sqlalchemy import (
    DateTime,
    ForeignKey,
    String,
    Boolean,
    func,
)

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class EmailVerification(Base):

    __tablename__ = "email_dogrulamalar"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    kullanici_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "kullanicilar.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True,
    )


    token_hash: Mapped[str] = mapped_column(
        String(64),
        nullable=False,
        unique=True,
        index=True,
    )


    son_kullanma_tarihi: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )


    kullanildi_mi: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )


    olusturulma_tarihi: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )