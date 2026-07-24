"""
Başlangıç verisi (seed) betiği.

Kapaklı Belediyesi'nin gerçek mahalle listesi, standart şikâyet kategorileri
ve ilk yönetici hesabını veritabanına ekler. Migration'lar uygulandıktan
sonra bir kez çalıştırılması yeterlidir; kayıt zaten varsa tekrar eklemez.

Çalıştırma:
    cd backend
    python -m app.seed
"""

from app.core.database import OturumYerel
from app.core.security import sifre_hashle
from app.models.ilce import Ilce
from app.models.kategori import Kategori
from app.models.kullanici import Kullanici, KullaniciRolu
from app.models.mahalle import Mahalle

KAPAKLI_MERKEZ = {"enlem": 41.3706, "boylam": 27.9917}

# Kapaklı Belediyesi'nin gerçek mahalle listesi
MAHALLE_LISTESI = [
    ("Atatürk Mahallesi", 41.3689, 27.9902),
    ("Cumhuriyet Mahallesi", 41.3721, 27.9935),
    ("İnönü Mahallesi", 41.3654, 27.9881),
    ("Bahçelievler Mahallesi", 41.3745, 27.9860),
    ("Karaağaç Mahallesi", 41.3598, 27.9944),
    ("Yanıkağıl Mahallesi", 41.3812, 28.0012),
    ("Pınarça Mahallesi", 41.3567, 27.9779),
    ("Fatih Mahallesi", 41.3702, 27.9968),
    ("Yeni Mahalle", 41.3675, 27.9825),
    ("Namık Kemal Mahallesi", 41.3733, 27.9891),
]

KATEGORI_LISTESI = [
    ("Yol", "Yol bozuklukları, çukur ve bakım talepleri", "road", "Fen İşleri Müdürlüğü", "#64748B"),
    ("Asfalt", "Asfalt serimi ve onarım talepleri", "construction", "Fen İşleri Müdürlüğü", "#78716C"),
    ("Park ve Bahçe", "Park, yeşil alan ve bahçe bakım talepleri", "trees", "Park ve Bahçeler Müdürlüğü", "#22C55E"),
    ("Çöp Toplama", "Çöp konteyneri ve atık toplama talepleri", "trash-2", "Temizlik İşleri Müdürlüğü", "#F59E0B"),
    ("Gürültü", "Gürültü kirliliği şikâyetleri", "volume-2", "Zabıta Müdürlüğü", "#EF4444"),
    ("Kaçak Yapılaşma", "İzinsiz yapı ve kaçak inşaat bildirimleri", "hammer", "İmar ve Şehircilik Müdürlüğü", "#DC2626"),
    ("Sokak Hayvanı", "Sokak hayvanlarıyla ilgili bildirimler", "dog", "Veteriner İşleri Müdürlüğü", "#0EA5E9"),
    ("Aydınlatma", "Sokak lambası ve aydınlatma arızaları", "lightbulb", "Elektrik İşleri Müdürlüğü", "#EAB308"),
    ("Su", "Su kesintisi ve altyapı arızaları", "droplet", "Su ve Kanalizasyon Müdürlüğü", "#2563EB"),
    ("Kanalizasyon", "Kanalizasyon ve fosseptik arızaları", "waves", "Su ve Kanalizasyon Müdürlüğü", "#0891B2"),
]


def calistir() -> None:
    db = OturumYerel()
    try:
        ilce = db.query(Ilce).filter(Ilce.ad == "Kapaklı").first()
        if ilce is None:
            ilce = Ilce(
                ad="Kapaklı",
                il="Tekirdağ",
                merkez_enlem=KAPAKLI_MERKEZ["enlem"],
                merkez_boylam=KAPAKLI_MERKEZ["boylam"],
            )
            db.add(ilce)
            db.commit()
            db.refresh(ilce)
            print(f"✓ İlçe eklendi: {ilce.ad}")
        else:
            print(f"• İlçe zaten mevcut: {ilce.ad}")

        for ad, enlem, boylam in MAHALLE_LISTESI:
            mevcut = db.query(Mahalle).filter(Mahalle.ad == ad, Mahalle.ilce_id == ilce.id).first()
            if mevcut is None:
                db.add(Mahalle(ad=ad, ilce_id=ilce.id, merkez_enlem=enlem, merkez_boylam=boylam))
                print(f"✓ Mahalle eklendi: {ad}")
        db.commit()

        for ad, aciklama, ikon, departman, renk in KATEGORI_LISTESI:
            mevcut = db.query(Kategori).filter(Kategori.ad == ad).first()
            if mevcut is None:
                db.add(
                    Kategori(
                        ad=ad, aciklama=aciklama, ikon=ikon, sorumlu_departman=departman, renk=renk
                    )
                )
                print(f"✓ Kategori eklendi: {ad}")
        db.commit()

        admin_eposta = "yonetici@kapakli.bel.tr"
        admin = db.query(Kullanici).filter(Kullanici.e_posta == admin_eposta).first()
        if admin is None:
            admin = Kullanici(
                ad="Sistem",
                soyad="Yöneticisi",
                e_posta=admin_eposta,
                telefon="05001234567",
                sifre_hash=sifre_hashle("KapakliAdmin2026!"),
                rol=KullaniciRolu.ADMIN,
                departman="Bilgi İşlem Müdürlüğü",
                e_posta_dogrulandi_mi=True,
            )
            db.add(admin)
            db.commit()
            print(f"✓ Yönetici hesabı oluşturuldu: {admin_eposta} (şifre: KapakliAdmin2026! — ilk girişten sonra değiştirin)")
        else:
            print(f"• Yönetici hesabı zaten mevcut: {admin_eposta}")

        print("\nBaşlangıç verisi başarıyla yüklendi.")
    finally:
        db.close()


if __name__ == "__main__":
    calistir()
