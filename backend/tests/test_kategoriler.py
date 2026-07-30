"""Kategori uç noktaları için entegrasyon testleri."""

from tests.conftest import veritabani_gerekli


@veritabani_gerekli
def test_kategorileri_listele_herkese_acik(istemci):
    """Kategori listesi kimlik doğrulaması olmadan da erişilebilir olmalıdır."""
    yanit = istemci.get("/api/v1/kategoriler/")
    assert yanit.status_code == 200
    assert isinstance(yanit.json(), list)


@veritabani_gerekli
def test_kategori_olustur_yetkisiz_reddedilir(istemci):
    """Kimlik doğrulaması olmadan kategori oluşturma reddedilmelidir."""
    yanit = istemci.post(
        "/api/v1/kategoriler/",
        json={
            "ad": "Test Kategori",
            "sorumlu_departman": "Test Müdürlüğü",
        },
    )
    assert yanit.status_code in (401, 403)


@veritabani_gerekli
def test_v2_kategorileri_listele(istemci):
    """v2 uç noktası da v1 ile aynı şekilde erişilebilir olmalıdır (geriye dönük uyumluluk)."""
    yanit = istemci.get("/api/v2/kategoriler/")
    assert yanit.status_code == 200
    assert isinstance(yanit.json(), list)
