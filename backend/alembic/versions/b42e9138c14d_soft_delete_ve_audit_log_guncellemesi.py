"""soft_delete_ve_audit_log_guncellemesi

Revision ID: b42e9138c14d
Revises: 3b254e794d51
Create Date: 2026-07-30 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'b42e9138c14d'
down_revision: Union[str, None] = '3b254e794d51'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Soft delete: kategoriler kalıcı olarak silinmez, pasif duruma alınır.
    op.add_column(
        'kategoriler',
        sa.Column('silindi_mi', sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    op.alter_column('kategoriler', 'silindi_mi', server_default=None)
    op.add_column(
        'kategoriler',
        sa.Column('silinme_tarihi', sa.DateTime(timezone=True), nullable=True),
    )

    # Audit log: sistem tarafından (zamanlanmış görevler, rate limit ihlalleri
    # vb.) oluşturulan kayıtlarda kullanici_id NULL olabilmeli.
    op.alter_column('aktivite_kayitlari', 'kullanici_id', nullable=True)


def downgrade() -> None:
    op.alter_column('aktivite_kayitlari', 'kullanici_id', nullable=False)
    op.drop_column('kategoriler', 'silinme_tarihi')
    op.drop_column('kategoriler', 'silindi_mi')
