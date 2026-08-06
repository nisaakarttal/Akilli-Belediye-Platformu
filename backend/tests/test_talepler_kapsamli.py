"""Talep oluşturma, listeleme, IDOR, SLA, atama ve memnuniyet testleri."""

from datetime import datetime

from app.models.talep import TalepDurumu, TalepOnceligi
from tests.conftest import veritabani_gerekli


@veritabani_gerekli
def test_vatandas_talep_olusturabilir_ve_sla_hesaplanir(istemci, temel_veriler, auth_basligi):
    yanit = istemci.post(
        "/api/v1/talepler/",
        headers=auth_basligi(temel_veriler["vatandas"]),
        json={
            "baslik": "Sokak lambası çalışmıyor",
            "aciklama": "Sokağımızdaki aydınlatma lambası birkaç gündür çalışmıyor.",
            "kategori_id": str(temel_veriler["kategori"].id),
            "mahalle_id": str(temel_veriler["mahalle"].id),
            "adres_detay": "Test Sokak No: 10",
            "enlem": 41.331,
            "boylam": 27.980,
            "oncelik": "orta",
        },
    )
    assert yanit.status_code == 201
    veri = yanit.json()
    assert veri["durum"] == "bekliyor"
    assert veri["takip_no"].startswith("BLD-")
    assert veri["son_cozum_tarihi"] is not None
    datetime.fromisoformat(veri["son_cozum_tarihi"].replace("Z", "+00:00"))
    assert len(veri["durum_gecmisi"]) == 1


@veritabani_gerekli
def test_talep_olusturma_gecersiz_koordinati_reddeder(istemci, temel_veriler, auth_basligi):
    yanit = istemci.post(
        "/api/v1/talepler/",
        headers=auth_basligi(temel_veriler["vatandas"]),
        json={
            "baslik": "Geçersiz koordinat testi",
            "aciklama": "Koordinat doğrulaması için yeterince uzun test açıklaması.",
            "kategori_id": str(temel_veriler["kategori"].id),
            "mahalle_id": str(temel_veriler["mahalle"].id),
            "enlem": 190,
            "boylam": 27.980,
        },
    )
    assert yanit.status_code == 422


@veritabani_gerekli
def test_vatandas_listede_yalnizca_kendi_taleplerini_gorur(
    istemci, temel_veriler, auth_basligi, talep_olusturucu
):
    kendi = talep_olusturucu(olusturan=temel_veriler["vatandas"], baslik="Benim talebim")
    talep_olusturucu(olusturan=temel_veriler["vatandas2"], baslik="Başkasının talebi")

    yanit = istemci.get("/api/v1/talepler/", headers=auth_basligi(temel_veriler["vatandas"]))
    assert yanit.status_code == 200
    veriler = yanit.json()["veriler"]
    assert [kayit["id"] for kayit in veriler] == [str(kendi.id)]


@veritabani_gerekli
def test_vatandas_baska_vatandasin_talep_detayini_goremez(
    istemci, temel_veriler, auth_basligi, talep_olusturucu
):
    baskasinin = talep_olusturucu(olusturan=temel_veriler["vatandas2"])
    yanit = istemci.get(
        f"/api/v1/talepler/{baskasinin.id}",
        headers=auth_basligi(temel_veriler["vatandas"]),
    )
    assert yanit.status_code == 403


@veritabani_gerekli
def test_vatandas_haritada_yalnizca_kendi_taleplerini_gorur(
    istemci, temel_veriler, auth_basligi, talep_olusturucu
):
    kendi = talep_olusturucu(olusturan=temel_veriler["vatandas"])
    talep_olusturucu(olusturan=temel_veriler["vatandas2"])
    yanit = istemci.get("/api/v1/talepler/harita", headers=auth_basligi(temel_veriler["vatandas"]))
    assert yanit.status_code == 200
    assert [x["id"] for x in yanit.json()] == [str(kendi.id)]


@veritabani_gerekli
def test_personel_listede_yalnizca_guncel_atamasini_gorur(
    istemci, temel_veriler, auth_basligi, talep_olusturucu, atama_olusturucu
):
    benim = talep_olusturucu(baslik="Personelin talebi")
    diger = talep_olusturucu(baslik="Diğer personelin talebi")
    atama_olusturucu(benim, temel_veriler["personel"])
    atama_olusturucu(diger, temel_veriler["personel2"])

    yanit = istemci.get("/api/v1/talepler/", headers=auth_basligi(temel_veriler["personel"]))
    assert yanit.status_code == 200
    ids = {x["id"] for x in yanit.json()["veriler"]}
    assert ids == {str(benim.id)}


@veritabani_gerekli
def test_personel_baska_personele_atanmis_talebi_goremez(
    istemci, temel_veriler, auth_basligi, talep_olusturucu, atama_olusturucu
):
    talep = talep_olusturucu()
    atama_olusturucu(talep, temel_veriler["personel2"])
    yanit = istemci.get(f"/api/v1/talepler/{talep.id}", headers=auth_basligi(temel_veriler["personel"]))
    assert yanit.status_code == 403


@veritabani_gerekli
def test_admin_talebi_personel_atayabilir_ve_bildirim_olusur(
    istemci, temel_veriler, auth_basligi, talep_olusturucu, db_oturumu
):
    from app.models.bildirim import Bildirim
    from app.models.atama import Atama

    talep = talep_olusturucu()
    yanit = istemci.post(
        f"/api/v1/talepler/{talep.id}/ata",
        headers=auth_basligi(temel_veriler["admin"]),
        json={"personel_id": str(temel_veriler["personel"].id), "not": "Fen İşleri ilgilensin"},
    )
    assert yanit.status_code == 200
    assert yanit.json()["durum"] == "atandi"
    assert db_oturumu.query(Atama).filter(Atama.talep_id == talep.id).count() == 1
    assert db_oturumu.query(Bildirim).filter(Bildirim.ilgili_talep_id == talep.id).count() == 2


@veritabani_gerekli
def test_vatandas_talep_atayamaz(istemci, temel_veriler, auth_basligi, talep_olusturucu):
    talep = talep_olusturucu()
    yanit = istemci.post(
        f"/api/v1/talepler/{talep.id}/ata",
        headers=auth_basligi(temel_veriler["vatandas"]),
        json={"personel_id": str(temel_veriler["personel"].id)},
    )
    assert yanit.status_code == 403


@veritabani_gerekli
def test_geciken_talepleri_vatandas_goremez(istemci, temel_veriler, auth_basligi):
    yanit = istemci.get("/api/v1/talepler/gecikenler", headers=auth_basligi(temel_veriler["vatandas"]))
    assert yanit.status_code == 403


@veritabani_gerekli
def test_personel_gecikenlerde_yalnizca_kendi_atamasini_gorur(
    istemci, temel_veriler, auth_basligi, talep_olusturucu, atama_olusturucu
):
    kendi = talep_olusturucu(gecikmis=True)
    diger = talep_olusturucu(gecikmis=True)
    atama_olusturucu(kendi, temel_veriler["personel"])
    atama_olusturucu(diger, temel_veriler["personel2"])
    yanit = istemci.get("/api/v1/talepler/gecikenler", headers=auth_basligi(temel_veriler["personel"]))
    assert yanit.status_code == 200
    assert {x["id"] for x in yanit.json()} == {str(kendi.id)}


@veritabani_gerekli
def test_memnuniyet_cozulmemis_talebe_verilemez(istemci, temel_veriler, auth_basligi, talep_olusturucu):
    talep = talep_olusturucu(durum=TalepDurumu.BEKLIYOR)
    yanit = istemci.post(
        f"/api/v1/talepler/{talep.id}/memnuniyet",
        headers=auth_basligi(temel_veriler["vatandas"]),
        json={"puan": 5, "yorum": "Test"},
    )
    assert yanit.status_code == 400


@veritabani_gerekli
def test_vatandas_cozulen_kendi_talebine_memnuniyet_birakabilir(
    istemci, temel_veriler, auth_basligi, talep_olusturucu
):
    talep = talep_olusturucu(durum=TalepDurumu.COZULDU)
    yanit = istemci.post(
        f"/api/v1/talepler/{talep.id}/memnuniyet",
        headers=auth_basligi(temel_veriler["vatandas"]),
        json={"puan": 5, "yorum": "Sorun çözüldü"},
    )
    assert yanit.status_code == 201
    assert yanit.json()["puan"] == 5


@veritabani_gerekli
def test_ayni_talebe_iki_kez_memnuniyet_birakilamaz(
    istemci, temel_veriler, auth_basligi, talep_olusturucu
):
    talep = talep_olusturucu(durum=TalepDurumu.COZULDU)
    payload = {"puan": 4, "yorum": "İyi"}
    ilk = istemci.post(
        f"/api/v1/talepler/{talep.id}/memnuniyet",
        headers=auth_basligi(temel_veriler["vatandas"]),
        json=payload,
    )
    ikinci = istemci.post(
        f"/api/v1/talepler/{talep.id}/memnuniyet",
        headers=auth_basligi(temel_veriler["vatandas"]),
        json=payload,
    )
    assert ilk.status_code == 201
    assert ikinci.status_code == 409


def test_merkezi_durum_gecis_kurallari():
    from app.services.talep_yetki_servisi import durum_gecisi_gecerli_mi

    assert durum_gecisi_gecerli_mi(TalepDurumu.BEKLIYOR, TalepDurumu.ATANDI)
    assert durum_gecisi_gecerli_mi(TalepDurumu.ATANDI, TalepDurumu.INCELENIYOR)
    assert durum_gecisi_gecerli_mi(TalepDurumu.INCELENIYOR, TalepDurumu.COZULDU)
    assert durum_gecisi_gecerli_mi(TalepDurumu.COZULDU, TalepDurumu.KAPATILDI)
    assert not durum_gecisi_gecerli_mi(TalepDurumu.BEKLIYOR, TalepDurumu.KAPATILDI)
    assert not durum_gecisi_gecerli_mi(TalepDurumu.KAPATILDI, TalepDurumu.BEKLIYOR)
