"""kullanici_giris_guvenligi_eklendi

Revision ID: 40cf0e7790f7
Revises: 84702315e08b
Create Date: 2026-07-27 14:45:11.765034

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "40cf0e7790f7"
down_revision: Union[str, None] = "84702315e08b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    Kullanıcı giriş güvenliği için gerekli kolonları ekler.

    basarisiz_giris_sayisi:
        Yanlış şifre denemelerini takip eder.
        Mevcut kullanıcılar için başlangıç değeri 0 atanır.

    hesap_kilit_bitis:
        Hesabın geçici olarak kilitli kalacağı zamanı tutar.
    """

    op.add_column(
        "kullanicilar",
        sa.Column(
            "basarisiz_giris_sayisi",
            sa.Integer(),
            nullable=False,
            server_default="0",
        ),
    )

    op.add_column(
        "kullanicilar",
        sa.Column(
            "hesap_kilit_bitis",
            sa.DateTime(timezone=True),
            nullable=True,
        ),
    )

    # Migration sonrası yeni kayıtlar için zorunlu default kaldırılır.
    # Default sadece mevcut kayıtları doldurmak için kullanıldı.
    op.alter_column(
        "kullanicilar",
        "basarisiz_giris_sayisi",
        server_default=None,
    )


def downgrade() -> None:
    """
    Eklenen kolonları geri alır.
    """

    op.drop_column(
        "kullanicilar",
        "hesap_kilit_bitis",
    )

    op.drop_column(
        "kullanicilar",
        "basarisiz_giris_sayisi",
    )