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
## Güvenlik Listesi:

1. Rate Limit              ✅

2. Brute Force             ✅
   
3. Account Lock             ✅
  
4. Password Reset Security  ✅

5. Şifre sıfırlama rate limit  ⭐
  
6. Email doğrulama             ⭐
   
7. Refresh token database       ⭐
    
8. Login audit log             ⭐
  
9. Admin 2FA                   ⭐
    
10. Dosya güvenliği            ⭐
    
11. HTTPS + production config  ⭐

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
