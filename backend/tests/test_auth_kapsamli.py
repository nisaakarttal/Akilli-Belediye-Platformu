"""Authentication, profil ve token güvenliği testleri."""

from tests.conftest import veritabani_gerekli


@veritabani_gerekli
def test_ben_endpointi_gecerli_tokenla_kullaniciyi_dondurur(istemci, temel_veriler, auth_basligi):
    kullanici = temel_veriler["vatandas"]
    yanit = istemci.get("/api/v1/auth/ben", headers=auth_basligi(kullanici))
    assert yanit.status_code == 200
    veri = yanit.json()
    assert veri["id"] == str(kullanici.id)
    assert veri["rol"] == "vatandas"
    assert "sifre_hash" not in veri


@veritabani_gerekli
def test_ben_endpointi_tokensiz_401(istemci):
    yanit = istemci.get("/api/v1/auth/ben")
    assert yanit.status_code == 401


@veritabani_gerekli
def test_ben_endpointi_gecersiz_tokenla_401(istemci):
    yanit = istemci.get(
        "/api/v1/auth/ben",
        headers={"Authorization": "Bearer gecersiz.token.degeri"},
    )
    assert yanit.status_code == 401


@veritabani_gerekli
def test_pasif_kullanici_tokeni_403(istemci, temel_veriler, auth_basligi, db_oturumu):
    kullanici = temel_veriler["vatandas"]
    kullanici.aktif_mi = False
    db_oturumu.commit()
    yanit = istemci.get("/api/v1/auth/ben", headers=auth_basligi(kullanici))
    assert yanit.status_code == 403


@veritabani_gerekli
def test_profil_sahibi_kendi_bilgisini_guncelleyebilir(istemci, temel_veriler, auth_basligi):
    kullanici = temel_veriler["vatandas"]
    yanit = istemci.put(
        f"/api/v1/kullanicilar/{kullanici.id}",
        headers=auth_basligi(kullanici),
        json={"ad": "Ayşegül", "telefon": "05559876543", "adres": "Yeni adres"},
    )
    assert yanit.status_code == 200
    assert yanit.json()["ad"] == "Ayşegül"
    assert yanit.json()["telefon"] == "05559876543"


@veritabani_gerekli
def test_vatandas_baska_kullanicinin_profilini_guncelleyemez(istemci, temel_veriler, auth_basligi):
    yanit = istemci.put(
        f"/api/v1/kullanicilar/{temel_veriler['vatandas2'].id}",
        headers=auth_basligi(temel_veriler["vatandas"]),
        json={"ad": "Yetkisiz"},
    )
    assert yanit.status_code == 403


@veritabani_gerekli
def test_sifre_degistirme_mevcut_sifre_hatalıysa_reddedilir(istemci, temel_veriler, auth_basligi):
    yanit = istemci.post(
        "/api/v1/auth/sifre-degistir",
        headers=auth_basligi(temel_veriler["personel"]),
        json={"mevcut_sifre": "Yanlis123", "yeni_sifre": "YeniSifre456"},
    )
    assert yanit.status_code == 400


@veritabani_gerekli
def test_sifre_degistirme_basarili(istemci, temel_veriler, auth_basligi):
    yanit = istemci.post(
        "/api/v1/auth/sifre-degistir",
        headers=auth_basligi(temel_veriler["personel"]),
        json={"mevcut_sifre": "TestSifre123", "yeni_sifre": "YeniSifre456"},
    )
    assert yanit.status_code == 200
