"""Kategori public erişim, admin CRUD ve soft-delete testleri."""

from tests.conftest import veritabani_gerekli


@veritabani_gerekli
def test_kategorileri_listele_herkese_acik(istemci):
    yanit = istemci.get("/api/v1/kategoriler/")
    assert yanit.status_code == 200
    assert isinstance(yanit.json(), list)


@veritabani_gerekli
def test_kategori_olustur_yetkisiz_reddedilir(istemci):
    yanit = istemci.post(
        "/api/v1/kategoriler/",
        json={"ad": "Test Kategori", "sorumlu_departman": "Test Müdürlüğü"},
    )
    assert yanit.status_code in (401, 403)


@veritabani_gerekli
def test_vatandas_kategori_olusturamaz(istemci, temel_veriler, auth_basligi):
    yanit = istemci.post(
        "/api/v1/kategoriler/",
        headers=auth_basligi(temel_veriler["vatandas"]),
        json={"ad": "Park", "sorumlu_departman": "Park ve Bahçeler", "sla_saat": 24},
    )
    assert yanit.status_code == 403


@veritabani_gerekli
def test_admin_kategori_olusturup_guncelleyebilir(istemci, temel_veriler, auth_basligi):
    olustur = istemci.post(
        "/api/v1/kategoriler/",
        headers=auth_basligi(temel_veriler["admin"]),
        json={"ad": "Park", "sorumlu_departman": "Park ve Bahçeler", "sla_saat": 24},
    )
    assert olustur.status_code == 201
    kategori_id = olustur.json()["id"]

    guncelle = istemci.put(
        f"/api/v1/kategoriler/{kategori_id}",
        headers=auth_basligi(temel_veriler["admin"]),
        json={"sla_saat": 36, "renk": "#00AA00"},
    )
    assert guncelle.status_code == 200
    assert guncelle.json()["sla_saat"] == 36


@veritabani_gerekli
def test_kategori_soft_delete_ve_geri_yukleme(istemci, temel_veriler, auth_basligi):
    kategori_id = temel_veriler["kategori"].id
    pasif = istemci.put(
        f"/api/v1/kategoriler/{kategori_id}/pasif-yap",
        headers=auth_basligi(temel_veriler["admin"]),
    )
    assert pasif.status_code == 200

    liste = istemci.get("/api/v1/kategoriler/")
    assert all(x["id"] != str(kategori_id) for x in liste.json())

    geri = istemci.put(
        f"/api/v1/kategoriler/{kategori_id}/geri-yukle",
        headers=auth_basligi(temel_veriler["admin"]),
    )
    assert geri.status_code == 200
    assert geri.json()["silindi_mi"] is False


@veritabani_gerekli
def test_v2_kategorileri_listele(istemci):
    yanit = istemci.get("/api/v2/kategoriler/")
    assert yanit.status_code == 200
    assert isinstance(yanit.json(), list)
