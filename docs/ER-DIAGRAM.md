# Varlık-İlişki (ER) Diyagramı

Aşağıdaki diyagram, Kapaklı Akıllı Belediye Platformu veritabanının tüm tablolarını ve aralarındaki ilişkileri gösterir. GitHub ve çoğu Markdown görüntüleyici Mermaid diyagramlarını otomatik olarak çizer.

```mermaid
erDiagram
    KULLANICILAR ||--o{ TALEPLER : "olusturur"
    KULLANICILAR ||--o{ ATAMALAR : "personel_olarak_atanir"
    KULLANICILAR ||--o{ BILDIRIMLER : "alir"
    KULLANICILAR ||--o{ TALEP_DOSYALARI : "yukler"
    KULLANICILAR ||--o{ DURUM_GECMISI : "degistirir"
    KULLANICILAR ||--o{ AKTIVITE_KAYITLARI : "gerceklestirir"

    ILCELER ||--o{ MAHALLELER : "icerir"
    MAHALLELER ||--o{ TALEPLER : "konumlanir"

    KATEGORILER ||--o{ TALEPLER : "siniflandirir"

    TALEPLER ||--o{ TALEP_DOSYALARI : "icerir"
    TALEPLER ||--o{ DURUM_GECMISI : "sahiptir"
    TALEPLER ||--o{ ATAMALAR : "atanir"
    TALEPLER ||--o{ BILDIRIMLER : "tetikler"
    TALEPLER ||--o{ AI_KAYITLARI : "analiz_edilir"

    KULLANICILAR {
        uuid id PK
        string ad
        string soyad
        string tc_kimlik_no
        string e_posta UK
        string telefon
        string sifre_hash
        enum rol "vatandas | personel | admin"
        string profil_fotografi
        string adres
        string departman
        boolean aktif_mi
        boolean e_posta_dogrulandi_mi
        datetime olusturulma_tarihi
        datetime son_giris_tarihi
    }

    ILCELER {
        uuid id PK
        string ad UK
        string il
        float merkez_enlem
        float merkez_boylam
    }

    MAHALLELER {
        uuid id PK
        string ad
        uuid ilce_id FK
        float merkez_enlem
        float merkez_boylam
    }

    KATEGORILER {
        uuid id PK
        string ad UK
        string aciklama
        string ikon
        string sorumlu_departman
        string renk
    }

    TALEPLER {
        uuid id PK
        string takip_no UK
        string baslik
        text aciklama
        uuid kategori_id FK
        uuid mahalle_id FK
        string adres_detay
        float enlem
        float boylam
        enum oncelik "dusuk | orta | yuksek | acil"
        enum durum "bekliyor | inceleniyor | atandi | cozuldu | kapatildi"
        uuid ai_onerilen_kategori_id FK
        enum ai_onerilen_oncelik
        float ai_guven_skoru
        uuid olusturan_id FK
        text cozum_notu
        datetime cozulme_tarihi
        datetime olusturulma_tarihi
    }

    TALEP_DOSYALARI {
        uuid id PK
        uuid talep_id FK
        enum dosya_turu "fotograf | video | ses | belge | sonuc_fotografi"
        string dosya_yolu
        string orijinal_ad
        bigint boyut_bayt
        uuid yukleyen_id FK
        datetime olusturulma_tarihi
    }

    DURUM_GECMISI {
        uuid id PK
        uuid talep_id FK
        enum onceki_durum
        enum yeni_durum
        string aciklama
        uuid degistiren_id FK
        datetime olusturulma_tarihi
    }

    ATAMALAR {
        uuid id PK
        uuid talep_id FK
        uuid personel_id FK
        uuid atayan_id FK
        string not
        datetime olusturulma_tarihi
    }

    BILDIRIMLER {
        uuid id PK
        uuid kullanici_id FK
        enum tur "yeni_talep | durum_degisti | talep_atandi | talep_cozuldu | sistem"
        string baslik
        string mesaj
        uuid ilgili_talep_id FK
        boolean okundu_mu
        datetime olusturulma_tarihi
    }

    AI_KAYITLARI {
        uuid id PK
        uuid kullanici_id FK
        uuid ilgili_talep_id FK
        string islem_turu "sohbet | talep_analizi"
        text girdi_metni
        text cikti_metni
        string model_adi
        int yanit_suresi_ms
        float guven_skoru
        datetime olusturulma_tarihi
    }

    AKTIVITE_KAYITLARI {
        uuid id PK
        uuid kullanici_id FK
        string eylem
        string hedef_tablo
        uuid hedef_id
        string detay
        string ip_adresi
        datetime olusturulma_tarihi
    }
```

## Tasarım Notları

- **Birincil anahtarlar (PK):** Tüm tablolarda `UUID` kullanılır — dağıtık sistemlerde çakışma riskini ortadan kaldırır ve talep takip numaralarının tahmin edilmesini zorlaştırır.
- **`talepler.takip_no`:** Vatandaşa gösterilen okunabilir kod, örn. `KAP-2026-00042`. Uygulama katmanında üretilir, veritabanında `UNIQUE` olarak tutulur.
- **`durum_gecmisi`:** Bir talebin tüm yaşam döngüsü bu tablo üzerinden yeniden oluşturulabilir; `talepler.durum` alanı her zaman en güncel durumu, bu tablo ise tam geçmişi tutar.
- **`ai_kayitlari`:** Hem sohbet asistanı hem de otomatik kategori/öncelik önerisi işlemleri buraya loglanır; `ilgili_talep_id` boş olabilir (sohbet talebe bağlı olmayabilir).
- **Soft-delete yerine `aktif_mi`:** Kullanıcılar hiçbir zaman veritabanından silinmez; hesap `aktif_mi = false` yapılarak devre dışı bırakılır.
