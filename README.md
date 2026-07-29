# Kapaklı Akıllı Belediye Platformu

Kapaklı Belediyesi (Tekirdağ) için geliştirilen, yapay zekâ destekli, vatandaş odaklı dijital belediye yönetim platformu.

Vatandaşlar; şikâyet/talep oluşturabilir, taleplerini haritadan takip edebilir, yapay zekâ asistanı ile sohbet edebilir, duyuru ve haberlere ulaşabilir. Belediye personeli kendisine atanan talepleri yönetir, yöneticiler ise tüm sistemi tek bir kontrol panelinden izler.

---



## 🧱 Teknoloji Yığını

**Frontend:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · React Hook Form · Zod · TanStack Query · Leaflet · Chart.js · Lucide Icons

**Backend:** FastAPI · SQLAlchemy 2.0 · Alembic · PostgreSQL 16 · JWT (python-jose) · Pydantic v2 · Passlib (bcrypt)

**Yapay Zekâ:** Google Gemini API (`google-generativeai`)

**Harita:** Leaflet + OpenStreetMap

**Depolama:** Yerel dosya sistemi (`/backend/uploads`)

**Konteynerleştirme:** Docker · Docker Compose · Nginx (reverse proxy)

**Security:** JWT Authentication, Password Hashing, Account Lockout

---

##  Veritabanı

Toplam **12 tablo** planlanmıştır: `kullanicilar`, `roller`, `talepler`, `talep_dosyalari`, `durum_gecmisi`, `bildirimler`, `kategoriler`, `ilceler`, `mahalleler`, `atamalar`, `ai_kayitlari`, `aktivite_kayitlari`.




##  Kullanıcı Rolleri

- **Vatandaş (`vatandas`)** — Şikâyet/talep oluşturur, takip eder, AI asistan ile konuşur.
- **Personel (`personel`)** — Kendisine atanan talepleri yönetir, durum günceller.
- **Yönetici (`admin`)** — Tüm sistemi yönetir, istatistikleri görür, kullanıcı/kategori/ilçe tanımlar.

---
## 🔐 Mevcut Güvenlik Seviyesi

Proje kapsamında aşağıdaki güvenlik önlemleri uygulanmıştır:

### Kimlik Doğrulama ve Yetkilendirme
✔ BCrypt ile güvenli şifre hashleme  
✔ JWT Authentication altyapısı  
✔ Access Token yönetimi  
✔ Refresh Token mekanizması  
✔ Refresh Token'ların veritabanında saklanması ve iptal edilebilir oturum yönetimi  
✔ Password Reset Token ile güvenli şifre sıfırlama akışı  
✔ E-posta doğrulama (Email Verification) sistemi  

### Hesap Güvenliği
✔ Rate Limiting (istek sınırlandırma)  
✔ Brute Force saldırılarına karşı koruma  
✔ Başarısız girişlerde geçici hesap kilitleme mekanizması  
✔ User Enumeration saldırılarına karşı koruma  
✔ Dummy BCrypt Hash kullanımı ile kullanıcı varlığı bilgisinin gizlenmesi  
✔ Şifre sıfırlama spam koruması  

### API ve Uygulama Güvenliği
✔ Swagger OAuth uyumluluğu  
✔ CORS güvenlik yapılandırması  
✔ Güvenli HTTP Status Code kullanımı  
✔ Login Audit Log (giriş kayıtları)  
✔ Dosya yükleme güvenliği:
- İzin verilen dosya uzantısı kontrolü
- MIME Type doğrulaması
- Maksimum dosya boyutu kontrolü

---

## 🚀 Sıradaki Güvenlik Geliştirmeleri

⭐ Admin kullanıcıları için 2FA (Two-Factor Authentication) desteği eklenmesi  

## Planlanan Geliştirmeler

### Gerçek Zamanlı Bildirim Sistemi
- WebSocket tabanlı anlık bildirim altyapısı
- Kullanıcı bazlı bildirim kanalları
- Okundu/okunmadı durumu
- Gerçek zamanlı bildirim gönderimi
- Bildirim geçmişi

### Zamanlanmış Görevler (Scheduler)
- APScheduler/Celery entegrasyonu
- Süresi geçen taleplerin otomatik kontrolü
- Cevaplanmayan başvurular için hatırlatma
- Periyodik sistem görevleri
- Otomatik rapor oluşturma

### Audit Log Sistemi
- Yönetici işlemlerinin kayıt altına alınması
- Kullanıcı ve kategori değişikliklerinin loglanması
- İşlem geçmişi görüntüleme
- Detaylı sistem kayıtları

### API Rate Limiting
- API istek sınırlandırması
- IP ve kullanıcı bazlı rate limit
- Hassas endpointler için özel limitler
- Rate limit ihlali kayıtları

### Soft Delete Desteği
- Silinen kayıtların pasif duruma alınması
- Geri yükleme desteği
- Kalıcı silme işlemleri
- Veri bütünlüğünün korunması

### Redis Cache
- Dashboard verilerinin önbelleğe alınması
- Kategori ve mahalle bilgilerinin cachelenmesi
- Performans optimizasyonu
- Cache yönetimi

### Background Task Sistemi
- Arka planda AI analizleri
- Dosya işleme görevleri
- E-posta gönderimleri
- Uzun süren işlemlerin asenkron yürütülmesi

### API Versioning
- `/api/v1` ve `/api/v2` desteği
- Geriye dönük uyumluluk
- Sürüm bazlı endpoint yönetimi

### API Dokümantasyonu
- Gelişmiş OpenAPI/Swagger dokümantasyonu
- Request/Response örnekleri
- HTTP durum kodları
- Endpoint açıklamaları

### Test Altyapısı
- Pytest ile birim testleri
- Entegrasyon testleri
- API testleri
- Test kapsamı (Coverage) raporları

---

## Planlanan Belediye Modülleri

### Talep Takip Numarası
- Otomatik benzersiz başvuru numarası oluşturma
- Takip numarası ile sorgulama desteği

### SLA (Service Level Agreement) Sistemi
- Kategori bazlı çözüm süreleri
- Süresi geçen talepler için otomatik uyarılar
- SLA ihlal raporları
- Öncelik yönetimi

### Mahalle Bazlı Analiz
- Mahalle bazlı talep istatistikleri
- Isı haritası (Heatmap)
- Ortalama çözüm süreleri
- Bölgesel analiz ekranları

### Personel Performans Sistemi
- Çözülen talep sayısı
- Ortalama çözüm süresi
- Bekleyen talepler
- Performans puanlaması

### Vatandaş Memnuniyet Sistemi
- Talep sonrası puanlama
- Kullanıcı geri bildirimleri
- Ortalama memnuniyet analizi
- Personel değerlendirme raporları

### AI Destekli Otomatik Yönlendirme
- Şikayet metninin yapay zekâ ile analiz edilmesi
- Otomatik kategori belirleme
- Öncelik seviyesinin tespiti
- İlgili müdürlüğe otomatik yönlendirme


## Güvenlik mimari

Kullanıcı
   |
   |
Login isteği
   |
   |
Rate Limit
(5/dk IP)
   |
   |
Kullanıcı kontrolü
   |
   |
Şifre kontrolü
   |
   |
Başarısız mı?
   |
   |
Sayaç artır
   |
   |
5 kere oldu mu?
   |
   |
15 dk hesap kilidi

## 📄 Lisans

Bu proje Kapaklı Belediyesi için özel olarak geliştirilmektedir.
