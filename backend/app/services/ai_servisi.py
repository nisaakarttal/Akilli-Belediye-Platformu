"""
Yapay zekâ (Google Gemini) entegrasyon servisi.

İki temel işlev sağlar:
1. `sikayet_analiz_et` — Şikâyet metnini okuyup uygun kategori, öncelik ve
   eksik bilgileri önerir (talep oluşturma formunda kullanılır).
2. `sohbet_yaniti_uret` — Vatandaşın belediye hizmetleriyle ilgili sorularına
   bir belediye görevlisi üslubuyla yanıt veren sohbet asistanı.

Her iki işlev de her etkileşimi `ai_kayitlari` tablosuna loglar.

`GEMINI_API_KEY` tanımlı değilse (örn. henüz yapılandırılmamış bir geliştirme
ortamı), servisler hata fırlatmak yerine güvenli, bilgilendirici bir
varsayılan yanıt döner — böylece anahtar eklenene kadar uygulamanın geri
kalanı sorunsuz çalışmaya devam eder.
"""

import json
import time
import uuid

import google.generativeai as genai
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models.ai_kaydi import AiKaydi
from app.models.kategori import Kategori

ayarlar = get_settings()

_yapilandirildi = False


def _hazirla() -> None:
    global _yapilandirildi
    if not _yapilandirildi and ayarlar.GEMINI_API_KEY:
        genai.configure(api_key=ayarlar.GEMINI_API_KEY)
        _yapilandirildi = True


SISTEM_TALIMATI_ANALIZ = (
    "Sen Kapaklı Belediyesi'nin şikâyet/talep sistemi için çalışan bir analiz "
    "asistanısın. Görevin, vatandaşın yazdığı şikâyet metnini okuyup en uygun "
    "kategoriyi, öncelik seviyesini belirlemek ve eksik olabilecek bilgileri "
    "(ör. konum detayı, fotoğraf) tespit etmektir. Her zaman kibar, kısa ve "
    "anlaşılır bir Türkçe kullan."
)

SISTEM_TALIMATI_SOHBET = (
    "Sen Kapaklı Belediyesi'nin resmî yapay zekâ asistanısın. Bir belediye "
    "çalışanı gibi, kibar ve yardımsever bir üslupla Türkçe yanıt ver. "
    "Emlak vergisi ödeme, nikâh işlemleri için gerekli belgeler, ruhsat "
    "başvuruları gibi belediye hizmetleri hakkındaki sorulara doğru ve öz "
    "bilgi ver. Eğer vatandaş bir sorun bildiriyorsa (ör. 'çöp konteyneri "
    "dolu', 'sokak lambası yanmıyor'), bunun bir şikâyet/talep kaydı "
    "oluşturularak çözülebileceğini belirt ve talep oluşturma sayfasına "
    "yönlendir. Emin olmadığın konularda vatandaşı Kapaklı Belediyesi çağrı "
    "merkezine veya ilgili müdürlüğe yönlendir; asla uydurma bilgi verme."
)


def sikayet_analiz_et(db: Session, baslik: str, aciklama: str, kullanici_id: uuid.UUID | None = None) -> dict:
    """Şikâyet metnini analiz eder ve önerilen kategori/öncelik/eksik bilgileri döner."""
    _hazirla()

    kategoriler = db.query(Kategori).all()
    kategori_listesi = "\n".join(f"- {k.ad} (Sorumlu: {k.sorumlu_departman})" for k in kategoriler)

    istem = f"""{SISTEM_TALIMATI_ANALIZ}

Mevcut kategoriler:
{kategori_listesi}

Şikâyet Başlığı: {baslik}
Şikâyet Açıklaması: {aciklama}

Yalnızca aşağıdaki JSON formatında yanıt ver, başka hiçbir açıklama veya markdown ekleme:
{{
  "kategori_adi": "<yukarıdaki listeden birebir bir kategori adı>",
  "oncelik": "dusuk" | "orta" | "yuksek" | "acil",
  "guven_skoru": <0.0 ile 1.0 arasında bir sayı>,
  "eksik_bilgiler": ["<varsa eksik bilgi>", ...],
  "ai_mesaji": "<vatandaşa gösterilecek, önerini kısaca açıklayan bir cümle>"
}}"""

    baslangic = time.time()

    if not ayarlar.GEMINI_API_KEY:
        sonuc = {
            "kategori_adi": None,
            "oncelik": "orta",
            "guven_skoru": 0.0,
            "eksik_bilgiler": [],
            "ai_mesaji": (
                "Yapay zekâ servisi şu anda yapılandırılmamış (GEMINI_API_KEY eksik). "
                "Lütfen kategoriyi listeden manuel olarak seçiniz."
            ),
        }
    else:
        try:
            model = genai.GenerativeModel(ayarlar.GEMINI_MODEL)
            yanit = model.generate_content(istem)
            sonuc = _json_ayikla(yanit.text)
        except Exception as hata:  # noqa: BLE001 — dış servis hatası kullanıcıyı bloklamamalı
            sonuc = {
                "kategori_adi": None,
                "oncelik": "orta",
                "guven_skoru": 0.0,
                "eksik_bilgiler": [],
                "ai_mesaji": f"Yapay zekâ analizi şu anda yapılamadı ({hata}). Lütfen kategoriyi manuel seçiniz.",
            }

    sure_ms = int((time.time() - baslangic) * 1000)

    db.add(
        AiKaydi(
            kullanici_id=kullanici_id,
            islem_turu="talep_analizi",
            girdi_metni=f"{baslik}\n{aciklama}",
            cikti_metni=json.dumps(sonuc, ensure_ascii=False),
            model_adi=ayarlar.GEMINI_MODEL,
            yanit_suresi_ms=sure_ms,
            guven_skoru=sonuc.get("guven_skoru"),
        )
    )
    db.commit()

    onerilen_kategori = None
    if sonuc.get("kategori_adi"):
        onerilen_kategori = db.query(Kategori).filter(Kategori.ad == sonuc["kategori_adi"]).first()

    return {
        "onerilen_kategori": onerilen_kategori,
        "onerilen_oncelik": sonuc.get("oncelik") or "orta",
        "guven_skoru": sonuc.get("guven_skoru") or 0.0,
        "eksik_bilgiler": sonuc.get("eksik_bilgiler") or [],
        "ai_mesaji": sonuc.get("ai_mesaji") or "",
    }


def sohbet_yaniti_uret(db: Session, mesaj: str, kullanici_id: uuid.UUID | None = None) -> str:
    """Vatandaşın sohbet mesajına belediye asistanı üslubuyla yanıt üretir."""
    _hazirla()

    baslangic = time.time()

    if not ayarlar.GEMINI_API_KEY:
        yanit_metni = (
            "Yapay zekâ asistanı şu anda yapılandırılmamış (GEMINI_API_KEY eksik). "
            "Lütfen Kapaklı Belediyesi çağrı merkezini arayın veya sistem yöneticisiyle iletişime geçin."
        )
    else:
        try:
            model = genai.GenerativeModel(ayarlar.GEMINI_MODEL, system_instruction=SISTEM_TALIMATI_SOHBET)
            yanit = model.generate_content(mesaj)
            yanit_metni = yanit.text
        except Exception as hata:  # noqa: BLE001
            yanit_metni = f"Şu anda yanıt üretemiyorum ({hata}). Lütfen daha sonra tekrar deneyin."

    sure_ms = int((time.time() - baslangic) * 1000)

    db.add(
        AiKaydi(
            kullanici_id=kullanici_id,
            islem_turu="sohbet",
            girdi_metni=mesaj,
            cikti_metni=yanit_metni,
            model_adi=ayarlar.GEMINI_MODEL,
            yanit_suresi_ms=sure_ms,
        )
    )
    db.commit()

    return yanit_metni


def _json_ayikla(metin: str) -> dict:
    """Gemini yanıtından (olası markdown kod bloğu içeren) JSON'ı güvenli şekilde ayıklar."""
    temiz = metin.strip()
    if temiz.startswith("```"):
        parcalar = temiz.split("```")
        if len(parcalar) >= 2:
            temiz = parcalar[1]
            if temiz.startswith("json"):
                temiz = temiz[4:]

    try:
        return json.loads(temiz.strip())
    except json.JSONDecodeError:
        return {
            "kategori_adi": None,
            "oncelik": "orta",
            "guven_skoru": 0.0,
            "eksik_bilgiler": [],
            "ai_mesaji": temiz[:500],
        }
