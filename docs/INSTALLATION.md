# Kurulum Rehberi

## Gereksinimler

- Docker ve Docker Compose (v2+)
- (Docker kullanılmayacaksa) Python 3.12+, Node.js 20+, PostgreSQL 16

## 1. Depoyu Alın

```bash
git clone <depo-adresi> kapakli-belediye
cd kapakli-belediye
```

## 2. Ortam Değişkenlerini Ayarlayın

```bash
cp .env .env
```

`.env` dosyasını açın ve en azından şu alanları doldurun:

- `SECRET_KEY` — Rastgele üretilmiş uzun bir gizli anahtar
  ```bash
  python -c "import secrets; print(secrets.token_urlsafe(64))"
  ```
- `GEMINI_API_KEY` — [Google AI Studio](https://aistudio.google.com/) üzerinden alınan Gemini API anahtarı
- `POSTGRES_PASSWORD` — Güçlü bir veritabanı şifresi

## 3. Docker ile Çalıştırın (Önerilen)

```bash
docker compose up --build
```

Bu komut:
1. PostgreSQL veritabanını başlatır
2. Backend konteynerini oluşturur, Alembic migration'larını uygular ve FastAPI'yi başlatır
3. Frontend konteynerini oluşturur ve Next.js geliştirme sunucusunu başlatır
4. Nginx'i ters vekil (reverse proxy) olarak başlatır

Erişim adresleri:

| Servis | Adres |
|---|---|
| Web Arayüzü (Nginx üzerinden) | http://localhost |
| Frontend (doğrudan) | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Swagger Dokümantasyonu | http://localhost:8000/docs |
| PostgreSQL | localhost:5432 |

## 4. Docker Olmadan Manuel Kurulum

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 5. Veritabanı Migration'ları

Yeni bir model eklediğinizde veya mevcut bir modeli değiştirdiğinizde:

```bash
cd backend
alembic revision --autogenerate -m "aciklama_yazin"
alembic upgrade head
```

## 6. Sorun Giderme

| Belirti | Olası Neden | Çözüm |
|---|---|---|
| Backend `veritabani` servisine bağlanamıyor | PostgreSQL henüz hazır değil | `docker compose logs veritabani` ile kontrol edin; `healthcheck` bekleyin |
| `GEMINI_API_KEY` hatası | API anahtarı boş veya geçersiz | `.env` dosyasını kontrol edin, Google AI Studio'dan yeni anahtar alın |
| Frontend `localhost:8000`'e erişemiyor | CORS ayarı eksik | `.env` içindeki `CORS_ORIGINS` değerini kontrol edin |
| Dosya yükleme başarısız | `uploads` klasörü izinleri | `backend/uploads` klasörünün yazılabilir olduğundan emin olun |
