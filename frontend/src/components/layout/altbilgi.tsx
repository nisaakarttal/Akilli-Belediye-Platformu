import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export function Altbilgi() {
  return (
    <footer className="mt-24 border-t border-kenarlik bg-white/40 dark:bg-white/[0.02]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2 font-bold text-birincil-600">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-birincil-500 to-ikincil-500 text-white">
              K
            </span>
            Kapaklı Belediyesi
          </div>
          <p className="text-sm text-metin-ikincil">
            Kapaklı Akıllı Belediye Platformu — vatandaşlarımıza daha hızlı ve şeffaf hizmet sunmak
            için geliştirilmiştir.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-metin">Hızlı Bağlantılar</h4>
          <ul className="space-y-2 text-sm text-metin-ikincil">
            <li><Link href="/panel/talep-olustur" className="hover:text-birincil-600">Şikâyet Oluştur</Link></li>
            <li><Link href="/panel/taleplerim" className="hover:text-birincil-600">Taleplerimi Takip Et</Link></li>
            <li><Link href="/panel/harita" className="hover:text-birincil-600">Belediye Haritası</Link></li>
            <li><Link href="/duyurular" className="hover:text-birincil-600">Duyurular ve Haberler</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-metin">Kurumsal</h4>
          <ul className="space-y-2 text-sm text-metin-ikincil">
            <li><Link href="/hakkimizda" className="hover:text-birincil-600">Belediyemiz Hakkında</Link></li>
            <li><Link href="/gizlilik" className="hover:text-birincil-600">Gizlilik Politikası</Link></li>
            <li><Link href="/kvkk" className="hover:text-birincil-600">KVKK Aydınlatma Metni</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-metin">İletişim</h4>
          <ul className="space-y-2 text-sm text-metin-ikincil">
            <li className="flex items-center gap-2"><MapPin size={16} /> Kapaklı, Tekirdağ</li>
            <li className="flex items-center gap-2"><Phone size={16} /> 0282 999 00 00</li>
            <li className="flex items-center gap-2"><Mail size={16} /> bilgi@kapakli.bel.tr</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-kenarlik py-4 text-center text-xs text-metin-ikincil">
        © {new Date().getFullYear()} Kapaklı Belediyesi. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
