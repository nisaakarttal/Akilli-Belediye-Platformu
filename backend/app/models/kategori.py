import uuid

from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Kategori(Base):
    """
    Şikâyet/talep kategorileri.
    Örnekler: Yol, Asfalt, Park ve Bahçe, Çöp Toplama, Gürültü, Kaçak Yapılaşma,
    Sokak Hayvanı, Aydınlatma, Su, Kanalizasyon.
    """

    __tablename__ = "kategoriler"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ad: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)
    aciklama: Mapped[str | None] = mapped_column(String(500), nullable=True)
    ikon: Mapped[str | None] = mapped_column(String(100), nullable=True)  # Lucide ikon adı
    sorumlu_departman: Mapped[str] = mapped_column(String(150), nullable=False)  # ör. Fen İşleri Müdürlüğü
    renk: Mapped[str] = mapped_column(String(20), default="#2563EB", nullable=False)

    # SLA: bu kategorideki bir talebin çözülmesi beklenen azami süre (saat)
    sla_saat: Mapped[int] = mapped_column(Integer, default=72, nullable=False)

    # Soft delete: kayıt fiziksel olarak silinmez, pasif duruma alınır.
    silindi_mi: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    silinme_tarihi: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Asıl kategori ilişkisi (1-n)
    talepler = relationship(
        "Talep",
        back_populates="kategori",
        foreign_keys="Talep.kategori_id"
    )

    # AI tarafından önerilen kategori ilişkisi (1-n)
    ai_onerilen_talepler = relationship(
        "Talep",
        back_populates="ai_onerilen_kategori",
        foreign_keys="Talep.ai_onerilen_kategori_id"
    )

    def __repr__(self) -> str:
        return f"<Kategori {self.ad}>"