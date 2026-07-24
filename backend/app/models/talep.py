import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, Float, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class TalepDurumu(str, enum.Enum):
    BEKLIYOR = "bekliyor"
    INCELENIYOR = "inceleniyor"
    ATANDI = "atandi"
    COZULDU = "cozuldu"
    KAPATILDI = "kapatildi"


class TalepOnceligi(str, enum.Enum):
    DUSUK = "dusuk"
    ORTA = "orta"
    YUKSEK = "yuksek"
    ACIL = "acil"


class Talep(Base):
    """
    Vatandaşların oluşturduğu şikâyet/talep kayıtları.
    Sistemin merkezindeki tablo.
    """

    __tablename__ = "talepler"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    takip_no: Mapped[str] = mapped_column(
        String(20), unique=True, nullable=False, index=True
    )

    baslik: Mapped[str] = mapped_column(String(200), nullable=False)
    aciklama: Mapped[str] = mapped_column(Text, nullable=False)

    kategori_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("kategoriler.id"), nullable=False
    )

    mahalle_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("mahalleler.id"), nullable=False
    )

    adres_detay: Mapped[str | None] = mapped_column(String(500), nullable=True)

    enlem: Mapped[float] = mapped_column(Float, nullable=False)
    boylam: Mapped[float] = mapped_column(Float, nullable=False)

    oncelik: Mapped[TalepOnceligi] = mapped_column(
        Enum(
            TalepOnceligi,
            name="talep_onceligi",
            values_callable=lambda enum_cls: [e.value for e in enum_cls],
        ),
        default=TalepOnceligi.ORTA,
        nullable=False,
    )

    durum: Mapped[TalepDurumu] = mapped_column(
        Enum(
            TalepDurumu,
            name="talep_durumu",
            values_callable=lambda enum_cls: [e.value for e in enum_cls],
        ),
        default=TalepDurumu.BEKLIYOR,
        nullable=False,
    )

    # AI tarafından önerilen kategori / öncelik
    ai_onerilen_kategori_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("kategoriler.id"), nullable=True
    )

    ai_onerilen_oncelik: Mapped[TalepOnceligi | None] = mapped_column(
        Enum(
            TalepOnceligi,
            name="ai_onerilen_oncelik",
            values_callable=lambda enum_cls: [e.value for e in enum_cls],
        ),
        nullable=True,
    )

    ai_guven_skoru: Mapped[float | None] = mapped_column(Float, nullable=True)

    olusturan_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("kullanicilar.id"), nullable=False
    )

    cozum_notu: Mapped[str | None] = mapped_column(Text, nullable=True)

    cozulme_tarihi: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    olusturulma_tarihi: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    guncellenme_tarihi: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # --- İLİŞKİLER (RELATIONSHIPS) ---

    kategori = relationship(
        "Kategori",
        back_populates="talepler",
        foreign_keys=[kategori_id]
    )

    # AI ilişkisini buraya ekliyoruz
    ai_onerilen_kategori = relationship(
        "Kategori",
        back_populates="ai_onerilen_talepler",
        foreign_keys=[ai_onerilen_kategori_id]
    )

    mahalle = relationship("Mahalle", back_populates="talepler")

    olusturan = relationship(
        "Kullanici", back_populates="talepler", foreign_keys=[olusturan_id]
    )

    dosyalar = relationship(
        "TalepDosyasi", back_populates="talep", cascade="all, delete-orphan"
    )

    durum_gecmisi = relationship(
        "DurumGecmisi",
        back_populates="talep",
        cascade="all, delete-orphan",
        order_by="DurumGecmisi.olusturulma_tarihi",
    )

    atamalar = relationship(
        "Atama", back_populates="talep", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Talep {self.takip_no} - {self.baslik}>"