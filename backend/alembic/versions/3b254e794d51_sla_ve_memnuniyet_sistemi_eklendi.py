"""sla_ve_memnuniyet_sistemi_eklendi

Revision ID: 3b254e794d51
Revises: 44f2a46ca888
Create Date: 2026-07-30 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '3b254e794d51'
down_revision: Union[str, None] = '44f2a46ca888'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # SLA: kategori bazlı çözüm süresi (saat)
    op.add_column(
        'kategoriler',
        sa.Column('sla_saat', sa.Integer(), nullable=False, server_default='72'),
    )
    op.alter_column('kategoriler', 'sla_saat', server_default=None)

    # SLA: talep bazlı azami çözüm tarihi
    op.add_column(
        'talepler',
        sa.Column('son_cozum_tarihi', sa.DateTime(timezone=True), nullable=True),
    )

    # Vatandaş memnuniyet değerlendirmeleri
    op.create_table(
        'memnuniyetler',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('talep_id', sa.UUID(), nullable=False),
        sa.Column('puan', sa.Integer(), nullable=False),
        sa.Column('yorum', sa.String(length=1000), nullable=True),
        sa.Column('olusturan_id', sa.UUID(), nullable=False),
        sa.Column('olusturulma_tarihi', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.CheckConstraint('puan >= 1 AND puan <= 5', name='ck_memnuniyet_puan_araligi'),
        sa.ForeignKeyConstraint(['talep_id'], ['talepler.id']),
        sa.ForeignKeyConstraint(['olusturan_id'], ['kullanicilar.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('talep_id'),
    )


def downgrade() -> None:
    op.drop_table('memnuniyetler')
    op.drop_column('talepler', 'son_cozum_tarihi')
    op.drop_column('kategoriler', 'sla_saat')
