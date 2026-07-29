import type {
  AcilNumaraOgesi,
  DuyuruOgesi,
  EtkinlikOgesi,
  HaberOgesi,
  NobetciEczaneOgesi,
} from "@/types/anasayfa";

/**
 * Ana sayfa bölümlerinin statik/örnek verileri.
 *
 * Not: `HABERLER`, `DUYURULAR` ve `ETKINLIKLER` şu an sabit veridir; ileride bir
 * içerik yönetim API'sine bağlanırken yalnızca bu dosyanın (veya karşılık gelen
 * `@/lib/api` çağrısının) değişmesi yeterli olacaktır — bileşenler tip
 * sözleşmesi (`@/types/anasayfa`) sayesinde etkilenmez.
 */

export const HABERLER: HaberOgesi[] = [
  {
    baslik: "Dere Islah Çalışmaları Başladı",
    ozet:
      "Karaağaç Mahallesi'nden geçen dere yatağında taşkın riskini azaltmak amacıyla ıslah çalışmaları başlatıldı. Çalışmaların 2 ay içinde tamamlanması planlanıyor.",
    tarih: "18 Temmuz 2026",
    kategori: "Altyapı",
  },
  {
    baslik: "Yeni Çocuk Parkı Hizmete Açıldı",
    ozet:
      "Bahçelievler Mahallesi'nde yapımı tamamlanan çocuk parkı, düzenlenen açılış töreniyle vatandaşların hizmetine sunuldu.",
    tarih: "12 Temmuz 2026",
    kategori: "Park ve Bahçe",
  },
  {
    baslik: "Kapaklı Yaz Festivali Başlıyor",
    ozet:
      "Bu yıl üçüncüsü düzenlenecek Kapaklı Yaz Festivali, konserler, çocuk etkinlikleri ve yöresel lezzet standlarıyla Cumhuriyet Meydanı'nda vatandaşları ağırlayacak.",
    tarih: "9 Temmuz 2026",
    kategori: "Etkinlik",
  },
  {
    baslik: "Sokak Hayvanları için Yeni Bakım Merkezi",
    ozet:
      "Pınarça Mahallesi'nde inşa edilen sokak hayvanları bakım ve rehabilitasyon merkezi, kapasitesini artırarak hizmet vermeye başladı.",
    tarih: "3 Temmuz 2026",
    kategori: "Hayvan Refahı",
  },
];

export const DUYURULAR: DuyuruOgesi[] = [
  {
    baslik: "29 Ekim Cumhuriyet Bayramı Kutlama Programı",
    aciklama:
      "Cumhuriyetimizin kuruluş yıl dönümü kapsamında düzenlenecek tören ve etkinlik programı açıklandı.",
    tarih: "20 Temmuz 2026",
  },
  {
    baslik: "Su Kesintisi Bilgilendirmesi",
    aciklama:
      "Altyapı yenileme çalışmaları nedeniyle 24 Temmuz Cuma günü 09:00-17:00 saatleri arasında Fatih ve Yeni Mahalle'de su kesintisi yaşanacaktır.",
    tarih: "19 Temmuz 2026",
    onemli: true,
  },
  {
    baslik: "Fen İşleri Müdürlüğü Yol Bakım Çalışması",
    aciklama:
      "Namık Kemal Mahallesi ana cadde üzerinde asfalt yenileme çalışması nedeniyle geçici trafik düzenlemesi uygulanacaktır.",
    tarih: "15 Temmuz 2026",
  },
  {
    baslik: "Emlak Vergisi 2. Taksit Ödeme Süresi",
    aciklama:
      "2026 yılı emlak vergisi ikinci taksit son ödeme tarihi 30 Kasım 2026'dır. Ödemeler belediye veznelerinden veya online tahsilat sisteminden yapılabilir.",
    tarih: "10 Temmuz 2026",
  },
];

export const ETKINLIKLER: EtkinlikOgesi[] = [
  {
    baslik: "Çocuk Şenliği",
    tarih: "26 Temmuz 2026, 10:00",
    yer: "Cumhuriyet Meydanı",
    aciklama: "Oyunlar, tiyatro gösterisi ve atölyelerle dolu bir gün çocuklarımızı bekliyor.",
  },
  {
    baslik: "Yaz Konseri",
    tarih: "2 Ağustos 2026, 20:30",
    yer: "Kapaklı Kültür Merkezi Açık Hava Sahnesi",
    aciklama: "Yerel sanatçıların sahne alacağı yaz konseri tüm vatandaşlarımıza açıktır.",
  },
  {
    baslik: "Ağaç Dikme Etkinliği",
    tarih: "9 Ağustos 2026, 08:30",
    yer: "Pınarça Mahallesi Fidanlık Alanı",
    aciklama:
      "Belediyemizin yeşillendirme kampanyası kapsamında gönüllü ağaç dikim etkinliği düzenlenecektir.",
  },
  {
    baslik: "Sokak Hayvanları Sahiplendirme Günü",
    tarih: "16 Ağustos 2026, 11:00",
    yer: "Veteriner İşleri Müdürlüğü Bakım Merkezi",
    aciklama: "Bakım merkezimizdeki dostlarımız yeni yuvalarına kavuşmayı bekliyor.",
  },
  {
    baslik: "Gençlik Festivali",
    tarih: "23 Ağustos 2026, 14:00",
    yer: "Kapaklı Gençlik Merkezi",
    aciklama: "Spor turnuvaları, müzik dinletileri ve kariyer atölyeleriyle gençlere özel bir festival.",
  },
  {
    baslik: "Kadın Girişimciler Pazarı",
    tarih: "30 Ağustos 2026, 09:00",
    yer: "Atatürk Mahallesi Pazar Yeri",
    aciklama: "Kapaklılı kadın girişimcilerin ürünlerini sergileyeceği pazar etkinliği.",
  },
];

export const ACIL_NUMARALAR: AcilNumaraOgesi[] = [
  { ad: "Acil Çağrı Merkezi", numara: "112" },
  { ad: "Polis İmdat", numara: "155" },
  { ad: "İtfaiye", numara: "110" },
  { ad: "Su Arıza", numara: "185" },
  { ad: "Doğalgaz Arıza", numara: "187" },
  { ad: "AFAD", numara: "122" },
];

/**
 * Not: Aşağıdaki liste örnek/temsili veridir. Güncel nöbetçi eczane bilgisi
 * üretim ortamında Tekirdağ Eczacılar Odası'nın günlük nöbet listesinden
 * otomatik olarak çekilecektir.
 */
export const NOBETCI_ECZANELER: NobetciEczaneOgesi[] = [
  {
    ad: "Kapaklı Eczanesi",
    mahalle: "Atatürk Mahallesi",
    adres: "Atatürk Mah. Cumhuriyet Cad. No: 24",
    telefon: "0282 891 12 34",
  },
  {
    ad: "Yeni Nesil Eczanesi",
    mahalle: "Cumhuriyet Mahallesi",
    adres: "Cumhuriyet Mah. Belediye Cad. No: 7",
    telefon: "0282 891 56 78",
  },
];
