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
