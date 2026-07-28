"""email dogrulama duzenleme

Revision ID: 6f5d2fd5486a
Revises: c8cfaf38d80f
Create Date: 2026-07-28 12:03:07.099348

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '6f5d2fd5486a'
down_revision: Union[str, None] = 'c8cfaf38d80f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:

    # Önce geçici nullable kolon ekle
    op.add_column(
        'kullanicilar',
        sa.Column(
            'email_dogrulandi',
            sa.Boolean(),
            nullable=True
        )
    )

    # Mevcut kullanıcıları false yap
    op.execute(
        """
        UPDATE kullanicilar
        SET email_dogrulandi = false
        WHERE email_dogrulandi IS NULL
        """
    )

    # Artık null kabul etme
    op.alter_column(
        'kullanicilar',
        'email_dogrulandi',
        nullable=False
    )

    # Eski alanı kaldır
    op.drop_column(
        'kullanicilar',
        'e_posta_dogrulandi_mi'
    )


def downgrade() -> None:

    op.add_column(
        'kullanicilar',
        sa.Column(
            'e_posta_dogrulandi_mi',
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false")
        )
    )

    op.drop_column(
        'kullanicilar',
        'email_dogrulandi'
    )