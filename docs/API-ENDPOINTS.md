# API Uç Noktaları

> Güncel ve interaktif dokümantasyona her zaman `http://localhost:8000/docs` adresinden (Swagger UI) ulaşılabilir. Tüm bölümler çalışır durumdadır (✅).

## ✅ Kimlik Doğrulama — `/api/v1/auth`

| Metod | Yol | Açıklama |
|---|---|---|
| POST | `/kayit` | Yeni vatandaş kaydı oluşturur |
| POST | `/giris` | E-posta + şifre ile giriş yapar, erişim/yenileme tokeni döner |
| POST | `/yenile` | Yenileme tokeni ile yeni erişim tokeni üretir |
| POST | `/sifremi-unuttum` | Şifre sıfırlama e-postası gönderir |
| POST | `/sifre-sifirla` | Sıfırlama tokeni ile yeni şifre belirler |
| GET | `/ben` | Giriş yapmış kullanıcının bilgilerini döner |

## ✅ Kullanıcılar — `/api/v1/kullanicilar`

| Metod | Yol | Açıklama |
|---|---|---|
| GET | `/` | Kullanıcı listesi (yalnızca admin) |
| GET | `/{id}` | Kullanıcı detayı |
| PUT | `/{id}` | Profil güncelleme |
| PUT | `/{id}/rol` | Rol değiştirme (yalnızca admin) |
| PUT | `/{id}/durum` | Hesabı aktif/pasif yapma (yalnızca admin) |
| POST | `/{id}/profil-fotografi` | Profil fotoğrafı yükleme *(Aşama 3'te dosya yükleme altyapısıyla birlikte eklenecek)* |

## ✅ Kategoriler — `/api/v1/kategoriler`

| Metod | Yol | Açıklama |
|---|---|---|
| GET | `/` | Tüm kategorileri listeler |
| POST | `/` | Yeni kategori oluşturur (yalnızca admin) |
| PUT | `/{id}` | Kategori günceller (yalnızca admin) |
| DELETE | `/{id}` | Kategori siler (yalnızca admin) |

## ✅ İlçeler / Mahalleler — `/api/v1/ilceler`, `/api/v1/mahalleler`

| Metod | Yol | Açıklama |
|---|---|---|
| GET | `/ilceler` | İlçe listesi |
| GET | `/mahalleler?ilce_id=` | Bir ilçeye ait mahalleler |
| POST | `/mahalleler` | Yeni mahalle ekler (yalnızca admin) |

## ✅ Talepler — `/api/v1/talepler`

| Metod | Yol | Açıklama |
|---|---|---|
| GET | `/` | Talep listesi (filtreler: durum, kategori, mahalle, öncelik, tarih aralığı) |
| POST | `/` | Yeni talep oluşturur, otomatik takip numarası üretir |
| GET | `/{id}` | Talep detayı + durum geçmişi + dosyalar |
| GET | `/takip/{takip_no}` | Takip numarasıyla sorgulama (girişsiz erişilebilir) |
| POST | `/{id}/dosya` | Fotoğraf/video/ses/belge yükleme |
| PUT | `/{id}/durum` | Durum günceller, `durum_gecmisi` kaydı oluşturur |
| POST | `/{id}/ata` | Personele atama yapar (yalnızca admin/personel) |
| POST | `/{id}/coz` | Talebi çözüldü olarak işaretler, sonuç fotoğrafı ve not ekler |
| GET | `/harita` | Harita için GeoJSON formatında talep konumları |

## ✅ Yapay Zekâ — `/api/v1/ai`

| Metod | Yol | Açıklama |
|---|---|---|
| POST | `/analiz-et` | Şikâyet metnini analiz eder; kategori, öncelik, departman ve eksik bilgi önerir |
| POST | `/sohbet` | AI asistan ile sohbet mesajı gönderir/yanıt alır |
| GET | `/sohbet-gecmisi` | Kullanıcının önceki sohbet kayıtlarını döner |

## ✅ Yönetici — `/api/v1/admin`

| Metod | Yol | Açıklama |
|---|---|---|
| GET | `/istatistikler` | Genel istatistikler (toplam, bugünkü/haftalık/aylık talep sayıları, tamamlanma oranı) |
| GET | `/istatistikler/kategori-dagilimi` | Kategoriye göre talep dağılımı |
| GET | `/istatistikler/mahalle-dagilimi` | Mahalleye göre talep dağılımı |
| GET | `/istatistikler/gunluk-talepler` | Son N gün için günlük talep sayısı (varsayılan 30 gün) |

## ✅ Personel — `/api/v1/personel` (yalnızca atanan-talepler; durum güncelleme ve sonuç fotoğrafı `/api/v1/talepler` uç noktaları üzerinden yapılır)

| Metod | Yol | Açıklama |
|---|---|---|
| GET | `/atanan-talepler` | Giriş yapmış personele atanan talepler |
| PUT | `/{talep_id}/durum` | Atanan talebin durumunu günceller |
| POST | `/{talep_id}/sonuc-fotografi` | Çözüm sonrası fotoğraf yükler |

## ✅ Bildirimler — `/api/v1/bildirimler`

| Metod | Yol | Açıklama |
|---|---|---|
| GET | `/` | Kullanıcının bildirimlerini listeler |
| PUT | `/{id}/okundu` | Bildirimi okundu olarak işaretler |
| PUT | `/tumunu-okundu-yap` | Tüm bildirimleri okundu yapar |

---

Tüm uç noktalar (kimlik doğrulama hariç) `Authorization: Bearer <token>` başlığı ile korunur. Rol bazlı yetkilendirme FastAPI `Depends` bağımlılıkları ile Aşama 2'de uygulanacaktır.
