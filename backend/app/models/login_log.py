import uuid
from datetime import datetime

from sqlalchemy import String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class LoginLog(Base):
    __tablename__ = "login_logs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    kullanici_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("kullanicilar.id"),
        nullable=True
    )

    email: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    basarili_mi: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False
    )

    ip_adresi: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True
    )

    kullanici_aracisi: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    zaman: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )


    kullanici = relationship(
        "Kullanici",
        back_populates="login_loglari"
    )