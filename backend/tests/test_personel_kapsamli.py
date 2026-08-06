"""Personel dashboard ve atanmış talep iş akışları."""

from app.models.talep import TalepDurumu, TalepOnceligi
from tests.conftest import veritabani_gerekli


@veritabani_gerekli
def test_personel_dashboard_sadece_kendi_taleplerini_sayar(
    istemci, temel_veriler, auth_basligi, talep_olusturucu, atama_olusturucu
):
    acil = talep_olusturucu(oncelik=TalepOnceligi.ACIL, gecikmis=True)
    normal = talep_olusturucu(durum=TalepDurumu.INCELENIYOR)
    baskasi = talep_olusturucu()
    atama_olusturucu(acil, temel_veriler["personel"])
    atama_olusturucu(normal, temel_veriler["personel"])
    atama_olusturucu(baskasi, temel_veriler["personel2"])

    yanit = istemci.get("/api/v1/personel/dashboard", headers=auth_basligi(temel_veriler["personel"]))
    assert yanit.status_code == 200
    istatistik = yanit.json()["istatistikler"]
    assert istatistik["toplam"] == 2
    assert istatistik["acil"] == 1
    assert istatistik["geciken"] == 1
    assert istatistik["inceleniyor"] == 1


@veritabani_gerekli
def test_personel_atanan_talep_detayini_gorebilir(
    istemci, temel_veriler, auth_basligi, talep_olusturucu, atama_olusturucu
):
    talep = talep_olusturucu()
    atama_olusturucu(talep)
    yanit = istemci.get(
        f"/api/v1/personel/atanan-talepler/{talep.id}",
        headers=auth_basligi(temel_veriler["personel"]),
    )
    assert yanit.status_code == 200
    assert yanit.json()["id"] == str(talep.id)


@veritabani_gerekli
def test_personel_baska_personelin_atanan_talebini_acamaz(
    istemci, temel_veriler, auth_basligi, talep_olusturucu, atama_olusturucu
):
    talep = talep_olusturucu()
    atama_olusturucu(talep, temel_veriler["personel2"])
    yanit = istemci.get(
        f"/api/v1/personel/atanan-talepler/{talep.id}",
        headers=auth_basligi(temel_veriler["personel"]),
    )
    assert yanit.status_code == 403


@veritabani_gerekli
def test_personel_talebe_islem_notu_ekler_ve_vatandasa_ic_not_sizmaz(
    istemci, temel_veriler, auth_basligi, talep_olusturucu, atama_olusturucu
):
    talep = talep_olusturucu()
    atama_olusturucu(talep)
    personel_cevap = istemci.post(
        f"/api/v1/personel/atanan-talepler/{talep.id}/not",
        headers=auth_basligi(temel_veriler["personel"]),
        json={"not": "Saha ekibi kontrol edecek"},
    )
    assert personel_cevap.status_code == 200
    assert any("Saha ekibi" in (x["aciklama"] or "") for x in personel_cevap.json()["durum_gecmisi"])

    vatandas_cevap = istemci.get(
        f"/api/v1/talepler/{talep.id}",
        headers=auth_basligi(temel_veriler["vatandas"]),
    )
    assert vatandas_cevap.status_code == 200
    assert all("Saha ekibi" not in (x["aciklama"] or "") for x in vatandas_cevap.json()["durum_gecmisi"])


@veritabani_gerekli
def test_personel_bilgilendirme_vatandasa_bildirim_olusturur(
    istemci, temel_veriler, auth_basligi, talep_olusturucu, atama_olusturucu
):
    talep = talep_olusturucu()
    atama_olusturucu(talep)
    yanit = istemci.post(
        f"/api/v1/personel/atanan-talepler/{talep.id}/bilgilendir",
        headers=auth_basligi(temel_veriler["personel"]),
        json={"mesaj": "Ekip bugün inceleme yapacaktır."},
    )
    assert yanit.status_code == 200

    bildirimler = istemci.get(
        "/api/v1/bildirimler/",
        headers=auth_basligi(temel_veriler["vatandas"]),
    )
    assert bildirimler.status_code == 200
    assert any("Ekip bugün" in b["mesaj"] for b in bildirimler.json())


@veritabani_gerekli
def test_personel_talebi_cozdugunde_cozum_notu_ve_bildirim_olur(
    istemci, temel_veriler, auth_basligi, talep_olusturucu, atama_olusturucu
):
    talep = talep_olusturucu(durum=TalepDurumu.INCELENIYOR)
    atama_olusturucu(talep)
    yanit = istemci.post(
        f"/api/v1/personel/atanan-talepler/{talep.id}/coz",
        headers=auth_basligi(temel_veriler["personel"]),
        json={"cozum_notu": "Arızalı lamba değiştirildi."},
    )
    assert yanit.status_code == 200
    veri = yanit.json()
    assert veri["durum"] == "cozuldu"
    assert veri["cozum_notu"] == "Arızalı lamba değiştirildi."
    assert veri["cozulme_tarihi"] is not None


@veritabani_gerekli
def test_personel_memnuniyet_istatistikleri_sadece_kendi_atamalarindan_hesaplanir(
    istemci,
    temel_veriler,
    auth_basligi,
    talep_olusturucu,
    atama_olusturucu,
    memnuniyet_olusturucu,
):
    kendi = talep_olusturucu(durum=TalepDurumu.COZULDU)
    diger = talep_olusturucu(durum=TalepDurumu.COZULDU)
    atama_olusturucu(kendi, temel_veriler["personel"])
    atama_olusturucu(diger, temel_veriler["personel2"])
    memnuniyet_olusturucu(kendi, temel_veriler["vatandas"], puan=5)
    memnuniyet_olusturucu(diger, temel_veriler["vatandas"], puan=1)

    yanit = istemci.get(
        "/api/v1/personel/memnuniyet-istatistikleri",
        headers=auth_basligi(temel_veriler["personel"]),
    )
    assert yanit.status_code == 200
    veri = yanit.json()
    assert veri["toplam_degerlendirme"] == 1
    assert veri["ortalama_puan"] == 5.0
    assert veri["dagilim"]["5"] == 1
