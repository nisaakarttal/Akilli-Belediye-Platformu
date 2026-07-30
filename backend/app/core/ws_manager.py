"""
Gerçek zamanlı bildirim gönderimi için WebSocket bağlantı yöneticisi.

Her kullanıcının bir veya birden fazla açık WebSocket bağlantısı olabilir
(ör. birden fazla sekme/cihaz). Bağlantılar kullanıcı id'sine göre gruplanır
(kullanıcı bazlı bildirim kanalı).

Bildirimler çoğunlukla senkron (sync) FastAPI endpoint'lerinden (ör. talep
durumu güncellendiğinde) tetiklendiği için, ana asyncio olay döngüsüne
(event loop) iş parçacığı güvenli (thread-safe) şekilde erişmek gerekir.
"""

import asyncio
import logging
import uuid

from fastapi import WebSocket

logger = logging.getLogger("ws_manager")


class BildirimBaglantiYoneticisi:
    def __init__(self) -> None:
        self._baglantilar: dict[uuid.UUID, list[WebSocket]] = {}
        self._ana_dongu: asyncio.AbstractEventLoop | None = None

    def ana_donguyu_ayarla(self, dongu: asyncio.AbstractEventLoop) -> None:
        """Uygulama başlangıcında (main.py) çalışan olay döngüsünü kaydeder."""
        self._ana_dongu = dongu

    async def baglan(self, kullanici_id: uuid.UUID, websocket: WebSocket) -> None:
        await websocket.accept()
        self._baglantilar.setdefault(kullanici_id, []).append(websocket)

    def baglantiyi_kes(self, kullanici_id: uuid.UUID, websocket: WebSocket) -> None:
        baglantilar = self._baglantilar.get(kullanici_id)
        if baglantilar and websocket in baglantilar:
            baglantilar.remove(websocket)
        if baglantilar is not None and not baglantilar:
            self._baglantilar.pop(kullanici_id, None)

    async def _kullaniciya_gonder_async(self, kullanici_id: uuid.UUID, veri: dict) -> None:
        for websocket in list(self._baglantilar.get(kullanici_id, [])):
            try:
                await websocket.send_json(veri)
            except Exception:  # noqa: BLE001 — kopuk bağlantı bildirim akışını bozmamalı
                self.baglantiyi_kes(kullanici_id, websocket)

    def kullaniciya_gonder(self, kullanici_id: uuid.UUID, veri: dict) -> None:
        """
        Senkron (sync) kod içinden (FastAPI'nin threadpool'unda çalışan `def`
        endpoint'lerinden) güvenle çağrılabilir; gönderim işini ana olay
        döngüsüne planlar (schedule).
        """
        if self._ana_dongu is None:
            return
        try:
            asyncio.run_coroutine_threadsafe(
                self._kullaniciya_gonder_async(kullanici_id, veri), self._ana_dongu
            )
        except Exception:  # noqa: BLE001
            logger.warning("Bildirim WebSocket üzerinden gönderilemedi.")


baglanti_yoneticisi = BildirimBaglantiYoneticisi()
