# Kapaklı Akıllı Belediye Platformu

Kapaklı Belediyesi (Tekirdağ) için geliştirilen, yapay zekâ destekli ve vatandaş odaklı dijital belediye yönetim platformudur.

Platform; vatandaşların belediyeye ilettiği talep ve şikâyetlerin oluşturulması, konumlandırılması, ilgili personele atanması, süreç boyunca takip edilmesi ve sonuçlandırılması işlemlerini merkezi bir sistem üzerinden yönetmeyi amaçlamaktadır.

Vatandaş, personel ve yönetici olmak üzere üç farklı kullanıcı rolü bulunan sistem; rol bazlı yetkilendirme, harita tabanlı talep yönetimi, SLA takibi, bildirimler, vatandaş memnuniyeti, personel performansı, analiz ve yapay zekâ destekli belediye asistanı gibi özellikler sunmaktadır.

---

## Hedef Kitle

Platform üç temel kullanıcı grubuna yönelik geliştirilmiştir:

* **Vatandaşlar:** Belediyeye talep ve şikâyet iletmek, başvurularını takip etmek ve belediye hizmetlerine daha kolay erişmek isteyen kullanıcılar.
* **Belediye Personeli:** Kendisine atanan talepleri yönetmek, durum ve işlem bilgilerini güncellemek ve vatandaşları süreç hakkında bilgilendirmek isteyen çalışanlar.
* **Belediye Yöneticileri:** Talepleri, personel performansını, SLA süreçlerini ve belediye hizmetlerine ilişkin istatistikleri merkezi olarak takip etmek isteyen yöneticiler.

---

## Problem & Çözüm

### Problem

* Vatandaş taleplerinin farklı kanallardan alınması takip süreçlerini zorlaştırır.
* Vatandaşların başvurularındaki süreç şeffaflığı azalır.
* Taleplerin doğru personele yönlendirilmesi gecikebilir.
* SLA sürelerini aşan taleplerin tespit edilmesi zorlaşabilir.
* Belediye hizmetlerine ilişkin verilerin merkezi olarak analiz edilmesi güçleşir.

### Çözüm

**Kapaklı Akıllı Belediye Platformu**, tüm talep yönetim sürecini tek bir dijital sistem altında toplar.

* **Vatandaş:** Talep oluşturur, konumlandırır ve süreci takip eder.
* **Personel:** Kendisine atanan talepleri yönetir, durum günceller ve vatandaşı bilgilendirir.
* **Yönetici:** Talepleri personele yönlendirir, sistemi yönetir ve hizmet süreçlerini analiz eder.
* **Sonuç:** Daha hızlı, şeffaf, takip edilebilir ve ölçülebilir belediye hizmetleri sunulur.

---

# Temel Özellikler

## Vatandaş İşlemleri

* Talep ve şikâyet oluşturma
* Talebe kategori ve konum ekleme
* Harita üzerinden konum seçme
* Talebe dosya/fotoğraf ekleme
* Benzersiz takip numarası oluşturma
* Kendi taleplerini görüntüleme
* Talep durumunu takip etme
* Bildirimleri görüntüleme
* Okundu/okunmadı bildirim yönetimi
* Çözülen taleplere 1–5 puan arasında memnuniyet değerlendirmesi yapma
* Vatandaş yorumu ekleme
* Yapay zekâ destekli belediye asistanını kullanma

## Personel İşlemleri

* Kendisine atanmış talepleri görüntüleme
* Talep detaylarını inceleme
* Talep durumunu güncelleme
* İşlem notu ekleme
* Çözüm notu ekleme
* Vatandaşı talep süreci hakkında bilgilendirme
* Kendisine ait geciken talepleri görüntüleme
* Kendi talep ve performans istatistiklerini görüntüleme
* Vatandaş memnuniyet istatistiklerini görüntüleme

## Yönetici İşlemleri

* Tüm talepleri görüntüleme ve yönetme
* Talepleri belediye personeline atama
* Kullanıcı yönetimi
* Kategori yönetimi
* Soft Delete ile kategori silme ve geri yükleme
* İlçe ve mahalle verilerini yönetme
* Geciken talepleri takip etme
* Personel performansını görüntüleme
* Vatandaş memnuniyet verilerini analiz etme
* Mahalle ve kategori bazlı istatistikleri görüntüleme
* Yönetici işlemlerinin Audit Log ile kayıt altına alınması

---

# Kullanıcı Rolleri

Platform üç temel kullanıcı rolüne sahiptir.

| Rol                               | Yetki                                                                                                                  |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Vatandaş (****`vatandas`****)** | Talep oluşturur, kendi taleplerini takip eder, bildirimlerini görüntüler ve memnuniyet değerlendirmesi yapar.          |
| **Personel (****`personel`****)** | Kendisine atanmış talepleri yönetir, durum günceller, işlem/çözüm notları ekler ve vatandaşı bilgilendirir.            |
| **Yönetici (****`admin`****)**    | Sistemin tamamını yönetir, talepleri personele atar, kullanıcı/kategori yönetimi ve analiz işlemlerini gerçekleştirir. |

Rol bazlı erişim kontrolü backend tarafında uygulanmaktadır. Kullanıcılar yetkileri dışında kalan kaynaklara erişemez.

---

# Teknoloji Yığını

## Frontend

* Next.js 15
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion
* React Hook Form
* Zod
* TanStack Query
* Leaflet
* Chart.js
* Lucide Icons

## Backend

* FastAPI
* Python
* SQLAlchemy 2.0
* Alembic
* PostgreSQL 16
* Pydantic v2
* JWT / python-jose
* Passlib / BCrypt
* Pytest

## Yapay Zekâ

* Google Gemini API
* AI servis katmanı
* Yapay zekâ destekli belediye asistanı

## Harita

* Leaflet
* OpenStreetMap

## DevOps

* Docker
* Docker Compose
* Nginx

---

# Sistem Mimarisi

Platform, frontend ve backend katmanlarının birbirinden ayrıldığı katmanlı bir mimari kullanmaktadır.

```text
                    ┌─────────────────────┐
                    │      Kullanıcı      │
                    │ Vatandaş/Personel/  │
                    │       Admin         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Frontend       │
                    │ Next.js + React     │
                    │ TypeScript          │
                    └──────────┬──────────┘
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │      Backend        │
                    │      FastAPI        │
                    │ JWT + RBAC          │
                    └─────┬────────┬──────┘
                          │        │
                 ┌────────┘        └─────────┐
                 ▼                           ▼
        ┌─────────────────┐         ┌─────────────────┐
        │   PostgreSQL    │         │   Gemini API    │
        │   Veritabanı    │         │  AI Servisleri  │
        └─────────────────┘         └─────────────────┘
                 │
                 ▼
        ┌─────────────────┐
        │     Uploads     │
        │  Dosya Sistemi  │
        └─────────────────┘
```

Frontend kullanıcı arayüzünü yönetirken FastAPI tabanlı backend; iş kuralları, kimlik doğrulama, yetkilendirme, veri erişimi ve servis işlemlerini gerçekleştirir.

PostgreSQL kalıcı verilerin saklanmasında, Google Gemini API ise yapay zekâ destekli işlemlerde kullanılmaktadır.

---

# Proje Klasör Yapısı

```text
kapakli-belediye/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   └── v2/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── main.py
│   │   └── seed.py
│   │
│   ├── alembic/
│   ├── tests/
│   ├── uploads/
│   ├── requirements.txt
│   └── pytest.ini
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── providers/
│   │   └── types/
│   │
│   ├── package.json
│   └── next.config.ts
│
├── nginx/
├── docker-compose.yml
└── README.md
```

---

# Güvenlik

Platformda aşağıdaki güvenlik mekanizmaları uygulanmaktadır:

* JWT tabanlı kimlik doğrulama
* Access Token ve Refresh Token yönetimi
* BCrypt ile şifre hashleme
* Rol bazlı erişim kontrolü (RBAC)
* E-posta doğrulama
* Güvenli şifre sıfırlama
* Rate Limiting
* Brute Force koruması
* Başarısız girişlerde geçici hesap kilitleme
* User Enumeration koruması
* Login Audit Log
* CORS yapılandırması
* Dosya uzantısı kontrolü
* MIME Type doğrulaması
* Maksimum dosya boyutu kontrolü
* Kaynak sahipliği ve yetki kontrolleri

---

# Talep ve SLA Yönetimi

Her talep için benzersiz bir takip numarası oluşturulur.

```text
BLD-2026-000001
```

Kategorilere göre farklı SLA süreleri tanımlanabilir. Talebin oluşturulma tarihi ve kategori SLA süresi kullanılarak hedef çözüm tarihi hesaplanır.

Sistem bu süreyi aşan ve henüz tamamlanmamış talepleri geciken talep olarak belirleyebilir.

Talep yaşam döngüsü:

```text
Bekliyor
   ↓
İnceleniyor
   ↓
Atandı
   ↓
Çözüldü
   ↓
Kapatıldı
```

---

# Bildirim Sistemi

Platformda kullanıcı bazlı bildirim altyapısı bulunmaktadır.

* Talep atama bildirimleri
* Talep durum değişikliği bildirimleri
* Personel bilgilendirmeleri
* Okundu/okunmadı yönetimi
* Bildirim geçmişi
* WebSocket tabanlı gerçek zamanlı bildirim altyapısı

---

# Yapay Zekâ Entegrasyonu

Platform Google Gemini API ile çalışan bir yapay zekâ servis katmanına sahiptir.

Yapay zekâ destekli belediye asistanı, kullanıcıların belediye ve sistem hakkındaki sorularına yardımcı olmak amacıyla kullanılmaktadır.

AI işlemleri doğrudan endpoint içerisinde gerçekleştirilmek yerine ayrı servis katmanında yönetilerek uygulama mimarisinden ayrıştırılmıştır.

---

# Test Altyapısı

Backend testleri **Pytest** kullanılarak geliştirilmiştir.

Testler üretim veritabanından bağımsız ayrı bir PostgreSQL test veritabanında çalıştırılmaktadır.

Test kapsamında:

* Authentication ve Authorization
* JWT
* RBAC
* Kullanıcı işlemleri
* Talep yönetimi
* Personel ve Admin yetkilendirmesi
* Bildirim sistemi
* Kategori yönetimi
* Dosya yükleme güvenliği
* SLA ve takip numarası
* Memnuniyet sistemi
* API sağlık kontrolleri

test edilmektedir.

### Güncel Test Sonucu

```text
64 passed
0 failed
0 skipped
```

### Backend Test Coverage

```text
69%
```

Testleri çalıştırmak için:

```powershell
cd backend

$env:TEST_DATABASE_URL="postgresql+psycopg2://KULLANICI:SIFRE@localhost:5432/kapakli_belediye_test"

pytest -vv
```

> Test veritabanı üretim/geliştirme veritabanından ayrı olmalıdır.

---

# Docker ile Çalıştırma

## Gereksinimler

* Docker
* Docker Compose

Projeyi klonlayın:

```bash
git clone <repository-url>
cd kapakli-belediye
```

Gerekli `.env` dosyalarını oluşturun ve veritabanı, JWT ve Gemini API yapılandırmalarını tanımlayın.

```bash
docker compose up --build
```

Arka planda çalıştırmak için:

```bash
docker compose up -d --build
```

Durdurmak için:

```bash
docker compose down
```

---

# Docker Olmadan Çalıştırma

## Backend

```powershell
cd backend

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt
alembic upgrade head

uvicorn app.main:app --reload
```

Backend:

```text
http://localhost:8000
```

Swagger:

```text
http://localhost:8000/docs
```

## Frontend

Yeni terminal açın:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

# Ortam Değişkenleri

Örnek backend yapılandırması:

```env
DATABASE_URL=postgresql+psycopg2://kullanici:sifre@localhost:5432/kapakli_belediye
SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
```

Frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

> Gerçek API anahtarları, veritabanı şifreleri ve JWT secret değerleri GitHub repository'sine gönderilmemelidir.

---

# API Dokümantasyonu

Backend çalıştırıldıktan sonra FastAPI tarafından otomatik oluşturulan Swagger dokümantasyonuna aşağıdaki adresten erişilebilir:

```text
http://localhost:8000/docs
```

API versioning altyapısı kapsamında endpointler `/api/v1` ve geliştirilen yeni sürümler için `/api/v2` altında yönetilebilmektedir.

---

# Geliştirme Durumu

Platformun temel backend altyapısı, rol bazlı yetkilendirme sistemi, vatandaş/personel/admin talep süreçleri, bildirim sistemi, SLA yönetimi, vatandaş memnuniyeti ve test altyapısı uygulanmıştır.

Planlanan geliştirmeler:

* Admin kullanıcıları için 2FA
* Test coverage oranının artırılması
* Daha kapsamlı entegrasyon testleri
* Mahalle bazlı ısı haritası
* Gelişmiş SLA ihlal raporları
* Otomatik rapor oluşturma
* AI ile otomatik kategori tahmini
* AI ile öncelik seviyesi belirleme
* AI ile ilgili belediye birimine otomatik yönlendirme

# Lisans
Bu proje **Kapaklı Belediyesi** için geliştirilmektedir.