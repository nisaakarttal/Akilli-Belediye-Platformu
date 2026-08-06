"""Dosya yükleme yetki, uzantı ve MIME doğrulama testleri."""

from tests.conftest import veritabani_gerekli


@veritabani_gerekli
def test_vatandas_baska_kullanicinin_talebine_dosya_yukleyemez(
    istemci, temel_veriler, auth_basligi, talep_olusturucu
):
    talep = talep_olusturucu(olusturan=temel_veriler["vatandas2"])
    yanit = istemci.post(
        f"/api/v1/talepler/{talep.id}/dosya?dosya_turu=fotograf",
        headers=auth_basligi(temel_veriler["vatandas"]),
        files={"dosya": ("foto.jpg", b"sahte-jpeg", "image/jpeg")},
    )
    assert yanit.status_code == 403


@veritabani_gerekli
def test_yasak_uzanti_reddedilir(istemci, temel_veriler, auth_basligi, talep_olusturucu):
    talep = talep_olusturucu()
    yanit = istemci.post(
        f"/api/v1/talepler/{talep.id}/dosya?dosya_turu=fotograf",
        headers=auth_basligi(temel_veriler["vatandas"]),
        files={"dosya": ("zararli.exe", b"MZ", "application/octet-stream")},
    )
    assert yanit.status_code == 400


@veritabani_gerekli
def test_uzanti_dogru_ama_mime_yanlissa_reddedilir(
    istemci, temel_veriler, auth_basligi, talep_olusturucu
):
    talep = talep_olusturucu()
    yanit = istemci.post(
        f"/api/v1/talepler/{talep.id}/dosya?dosya_turu=fotograf",
        headers=auth_basligi(temel_veriler["vatandas"]),
        files={"dosya": ("foto.jpg", b"metin", "text/plain")},
    )
    assert yanit.status_code == 400


@veritabani_gerekli
def test_vatandas_sonuc_fotografi_yukleyemez(istemci, temel_veriler, auth_basligi, talep_olusturucu):
    talep = talep_olusturucu()
    yanit = istemci.post(
        f"/api/v1/talepler/{talep.id}/dosya?dosya_turu=sonuc_fotografi",
        headers=auth_basligi(temel_veriler["vatandas"]),
        files={"dosya": ("sonuc.jpg", b"sahte-jpeg", "image/jpeg")},
    )
    assert yanit.status_code == 403
