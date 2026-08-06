"""Rol bazlı erişim kontrolü (RBAC) ve IDOR regresyon testleri."""

from tests.conftest import veritabani_gerekli


@veritabani_gerekli
def test_vatandas_admin_istatistiklerine_giremez(istemci, temel_veriler, auth_basligi):
    yanit = istemci.get("/api/v1/admin/istatistikler", headers=auth_basligi(temel_veriler["vatandas"]))
    assert yanit.status_code == 403


@veritabani_gerekli
def test_personel_admin_istatistiklerine_giremez(istemci, temel_veriler, auth_basligi):
    yanit = istemci.get("/api/v1/admin/istatistikler", headers=auth_basligi(temel_veriler["personel"]))
    assert yanit.status_code == 403


@veritabani_gerekli
def test_admin_admin_istatistiklerine_girebilir(istemci, temel_veriler, auth_basligi):
    yanit = istemci.get("/api/v1/admin/istatistikler", headers=auth_basligi(temel_veriler["admin"]))
    assert yanit.status_code == 200


@veritabani_gerekli
def test_vatandas_personel_dashboarduna_giremez(istemci, temel_veriler, auth_basligi):
    yanit = istemci.get("/api/v1/personel/dashboard", headers=auth_basligi(temel_veriler["vatandas"]))
    assert yanit.status_code == 403


@veritabani_gerekli
def test_admin_kullanici_listesini_gorebilir(istemci, temel_veriler, auth_basligi):
    yanit = istemci.get("/api/v1/kullanicilar/", headers=auth_basligi(temel_veriler["admin"]))
    assert yanit.status_code == 200
    assert yanit.json()["toplam"] >= 5


@veritabani_gerekli
def test_vatandas_kullanici_listesini_goremez(istemci, temel_veriler, auth_basligi):
    yanit = istemci.get("/api/v1/kullanicilar/", headers=auth_basligi(temel_veriler["vatandas"]))
    assert yanit.status_code == 403


@veritabani_gerekli
def test_vatandas_baska_vatandasin_detayini_goremez(istemci, temel_veriler, auth_basligi):
    yanit = istemci.get(
        f"/api/v1/kullanicilar/{temel_veriler['vatandas2'].id}",
        headers=auth_basligi(temel_veriler["vatandas"]),
    )
    assert yanit.status_code == 403
