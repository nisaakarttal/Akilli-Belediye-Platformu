"""Bildirim izolasyonu ve okundu/okunmadı akışları."""

from tests.conftest import veritabani_gerekli


@veritabani_gerekli
def test_kullanici_yalnizca_kendi_bildirimlerini_gorur(
    istemci, temel_veriler, auth_basligi, bildirim_olusturucu
):
    benim = bildirim_olusturucu(temel_veriler["vatandas"])
    bildirim_olusturucu(temel_veriler["vatandas2"])
    yanit = istemci.get("/api/v1/bildirimler/", headers=auth_basligi(temel_veriler["vatandas"]))
    assert yanit.status_code == 200
    assert [x["id"] for x in yanit.json()] == [str(benim.id)]


@veritabani_gerekli
def test_sadece_okunmamis_filtresi(istemci, temel_veriler, auth_basligi, bildirim_olusturucu):
    okunmamis = bildirim_olusturucu(temel_veriler["vatandas"], okundu_mu=False)
    bildirim_olusturucu(temel_veriler["vatandas"], okundu_mu=True)
    yanit = istemci.get(
        "/api/v1/bildirimler/?sadece_okunmamis=true",
        headers=auth_basligi(temel_veriler["vatandas"]),
    )
    assert yanit.status_code == 200
    assert [x["id"] for x in yanit.json()] == [str(okunmamis.id)]


@veritabani_gerekli
def test_bildirim_okundu_yapilabilir(istemci, temel_veriler, auth_basligi, bildirim_olusturucu, db_oturumu):
    bildirim = bildirim_olusturucu(temel_veriler["vatandas"])
    yanit = istemci.put(
        f"/api/v1/bildirimler/{bildirim.id}/okundu",
        headers=auth_basligi(temel_veriler["vatandas"]),
    )
    assert yanit.status_code == 200
    db_oturumu.refresh(bildirim)
    assert bildirim.okundu_mu is True


@veritabani_gerekli
def test_baska_kullanicinin_bildirimi_okundu_yapilamaz(
    istemci, temel_veriler, auth_basligi, bildirim_olusturucu
):
    bildirim = bildirim_olusturucu(temel_veriler["vatandas2"])
    yanit = istemci.put(
        f"/api/v1/bildirimler/{bildirim.id}/okundu",
        headers=auth_basligi(temel_veriler["vatandas"]),
    )
    assert yanit.status_code == 404


@veritabani_gerekli
def test_tum_bildirimler_okundu_yapilir(istemci, temel_veriler, auth_basligi, bildirim_olusturucu, db_oturumu):
    b1 = bildirim_olusturucu(temel_veriler["vatandas"])
    b2 = bildirim_olusturucu(temel_veriler["vatandas"])
    yanit = istemci.put(
        "/api/v1/bildirimler/tumunu-okundu-yap",
        headers=auth_basligi(temel_veriler["vatandas"]),
    )
    assert yanit.status_code == 200
    db_oturumu.refresh(b1)
    db_oturumu.refresh(b2)
    assert b1.okundu_mu is True and b2.okundu_mu is True
