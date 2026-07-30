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


## Son Güncellemeler

Bu sürümde proje kapsamı genişletilmiş ve aşağıdaki özellikler eklenmiştir:

### Talep Yönetimi
- Talep takip numarası sistemi eklendi.
- Benzersiz takip numarası ile talep sorgulama desteği sağlandı.
- SLA (Hizmet Seviyesi Anlaşması) altyapısı oluşturuldu.
- Kategori bazlı çözüm süreleri tanımlandı.
- Geciken taleplerin tespit edilmesi ve listelenmesi sağlandı.

### Analiz ve Raporlama
- Mahalle bazlı talep analizleri eklendi.
- En çok şikâyet alınan mahalleler raporlanabiliyor.
- Ortalama çözüm süresi hesaplanıyor.
- Kategori dağılımı istatistikleri oluşturuldu.
- Dashboard için JSON tabanlı istatistik endpointleri geliştirildi.

### Personel Performansı
- Personel bazlı çözülen ve bekleyen talep sayıları hesaplanıyor.
- Ortalama çözüm süresi ve tamamlanma oranı hesaplanıyor.
- Performans puanlama sistemi eklendi.
- Admin paneli için performans raporlama endpointleri oluşturuldu.

### Vatandaş Memnuniyeti
- Tamamlanan talepler için 1–5 yıldız puanlama sistemi eklendi.
- Vatandaş yorumları desteklendi.
- Her talebin yalnızca bir kez değerlendirilmesi sağlandı.
- Personel ve kategori bazlı ortalama memnuniyet hesaplanabiliyor.

### Sistem İyileştirmeleri
- Redis tabanlı önbellekleme (Caching) desteği eklendi.
- WebSocket ile gerçek zamanlı bildirim altyapısı geliştirildi.
- Background Tasks kullanılarak e-posta ve dosya işlemleri optimize edildi.
- SlowAPI ile IP ve kullanıcı bazlı Rate Limiting eklendi.
- APScheduler ile zamanlanmış görev altyapısı oluşturuldu.
- API Versioning (`/api/v2`) desteği eklendi.
- Soft Delete desteği ile kategori yönetimi geliştirildi.
- Audit Log sistemi ile yönetici işlemleri kayıt altına alındı.
- Test altyapısı (Pytest) oluşturularak temel API testleri eklendi.
- OpenAPI dokümantasyonu ve uygulama yaşam döngüsü (startup/shutdown) iyileştirildi.

## Yapılacaklar

### Gerçek Zamanlı Bildirim Sistemi
- Bildirimlerde okundu/okunmadı durumu
- Bildirim geçmişi yönetimi

### Zamanlanmış Görevler
- Süresi geçen talepler için otomatik uyarılar
- Cevaplanmayan başvurular için otomatik hatırlatma
- Otomatik rapor oluşturma

### API Dokümantasyonu
- Request/Response örneklerinin genişletilmesi
- Endpoint açıklamalarının detaylandırılması

### Test Altyapısı
- Test kapsamının (Coverage) artırılması
- Daha kapsamlı entegrasyon testleri

### Mahalle Bazlı Analiz
- Isı haritası (Heatmap) desteği
- Bölgesel analiz ekranları

### SLA Sistemi
- SLA ihlal raporları
- Öncelik yönetimi

### AI Destekli Otomatik Yönlendirme
- Şikâyet metninin yapay zekâ ile analiz edilmesi
- Otomatik kategori belirleme
- Öncelik seviyesinin belirlenmesi
- İlgili müdürlüğe otomatik yönlendirme

## 📄 Lisans

Bu proje Kapaklı Belediyesi için özel olarak geliştirilmektedir.
