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

---

## 📁 Klasör Yapısı

```
kapakli-belediye/
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── alembic.ini
│   ├── alembic/
│   │   ├── env.py
│   │   ├── script.py.mako
│   │   └── versions/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── config.py          # Ortam değişkenleri, ayarlar
│   │   │   ├── database.py        # SQLAlchemy engine/session
│   │   │   └── security.py        # JWT, şifre hashleme
│   │   ├── models/                # SQLAlchemy modelleri (veritabanı tabloları)
│   │   ├── schemas/                # Pydantic şemaları (istek/yanıt)
│   │   ├── api/v1/                 # API uç noktaları
│   │   ├── services/                # İş mantığı (AI servisi, bildirim servisi vb.)
│   │   └── utils/                   # Yardımcı fonksiyonlar
│   └── uploads/
│       ├── sikayetler/              # Şikâyet fotoğraf/video/ses dosyaları
│       ├── profil/                  # Profil fotoğrafları
│       └── belgeler/                # Belge yüklemeleri
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── postcss.config.js
│   ├── public/
│   │   ├── pixel-art/               # Piksel sanat SVG/PNG varlıkları
│   │   └── icons/
│   └── src/
│       ├── app/                      # Next.js App Router sayfaları
│       ├── components/
│       │   ├── ui/                   # shadcn/ui tabanlı temel bileşenler
│       │   ├── layout/               # Header, Footer, Sidebar
│       │   ├── home/                 # Ana sayfa bileşenleri
│       │   ├── sikayet/              # Şikâyet/talep bileşenleri
│       │   ├── harita/               # Harita bileşenleri
│       │   ├── ai/                   # AI sohbet bileşenleri
│       │   ├── admin/                # Yönetici paneli bileşenleri
│       │   └── personel/             # Personel paneli bileşenleri
│       ├── lib/                      # API istemcisi, yardımcılar
│       ├── hooks/                    # Özel React hook'ları
│       ├── types/                    # TypeScript tip tanımları
│       └── styles/                   # Global stiller, tasarım tokenları
├── nginx/
│   └── nginx.conf
└── docs/
    ├── ER-DIAGRAM.md
    ├── API-ENDPOINTS.md
    └── INSTALLATION.md
```

---

## 🗄️ Veritabanı

Toplam **12 tablo** planlanmıştır: `kullanicilar`, `roller`, `talepler`, `talep_dosyalari`, `durum_gecmisi`, `bildirimler`, `kategoriler`, `ilceler`, `mahalleler`, `atamalar`, `ai_kayitlari`, `aktivite_kayitlari`.




## 👥 Kullanıcı Rolleri

- **Vatandaş (`vatandas`)** — Şikâyet/talep oluşturur, takip eder, AI asistan ile konuşur.
- **Personel (`personel`)** — Kendisine atanan talepleri yönetir, durum günceller.
- **Yönetici (`admin`)** — Tüm sistemi yönetir, istatistikleri görür, kullanıcı/kategori/ilçe tanımlar.

---

## 📄 Lisans

Bu proje Kapaklı Belediyesi için özel olarak geliştirilmektedir.
