"""
API sürümleme (versioning) — `/api/v2`.

Strateji: `/api/v1`, üretimde kullanılan ve geriye dönük uyumluluğu daima
korunan kararlı sürümdür ve asla bu paket üzerinden değiştirilmez. `/api/v2`
bugün itibarıyla aynı uç noktaları barındırır (aynı router nesneleri farklı
bir önek altında yeniden bağlanır); ileride yalnızca v2'de yayınlanacak
değişiklikler (kırıcı şema güncellemeleri, kaldırılan alanlar vb.) doğrudan
bu pakete (gerekirse yeni router dosyaları eklenerek) yapılır — v1 etkilenmez.

`app/main.py`, aşağıdaki `V2_ROUTER_LISTESI` listesini kullanarak tüm v2
router'larını `/api/v2` altına bağlar.
"""

from app.api.v1 import (
    admin,
    ai,
    auth,
    bildirimler,
    kategoriler,
    konum,
    kullanicilar,
    personel,
    talepler,
)

V2_ROUTER_LISTESI = [
    (auth.router, "/api/v2/auth", ["Kimlik Doğrulama"]),
    (kullanicilar.router, "/api/v2/kullanicilar", ["Kullanıcılar"]),
    (kategoriler.router, "/api/v2/kategoriler", ["Kategoriler"]),
    (konum.router, "/api/v2", ["İlçeler ve Mahalleler"]),
    (talepler.router, "/api/v2/talepler", ["Talepler"]),
    (ai.router, "/api/v2/ai", ["Yapay Zekâ"]),
    (bildirimler.router, "/api/v2/bildirimler", ["Bildirimler"]),
    (personel.router, "/api/v2/personel", ["Personel"]),
    (admin.router, "/api/v2/admin", ["Yönetici"]),
]
