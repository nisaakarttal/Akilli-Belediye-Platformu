"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";

import { Dugme } from "@/components/ui/button";
import { Girdi } from "@/components/ui/input";
import { useKimlik } from "@/hooks/use-kimlik";
import { apiHataMesaji } from "@/lib/api";
import { aiApi } from "@/lib/api/ai";

interface SohbetMesaji {
  rol: "kullanici" | "asistan";
  metin: string;
}

const KARSILAMA_MESAJI: SohbetMesaji = {
  rol: "asistan",
  metin:
    "Merhaba! Ben Kapaklı Belediyesi yapay zekâ asistanıyım. Belediye hizmetleri hakkında sorularınızı yanıtlayabilir, şikâyet/talep oluşturma konusunda size yol gösterebilirim.",
};

export function YuzenAsistan() {
  const { kullanici } = useKimlik();
  const [acikMi, setAcikMi] = useState(false);
  const [mesajlar, setMesajlar] = useState<SohbetMesaji[]>([KARSILAMA_MESAJI]);
  const [girdiMetni, setGirdiMetni] = useState("");
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const sonElemanRef = useRef<HTMLDivElement>(null);

  async function mesajGonder(e: FormEvent) {
    e.preventDefault();
    const metin = girdiMetni.trim();
    if (!metin || gonderiliyor) return;

    setMesajlar((onceki) => [...onceki, { rol: "kullanici", metin }]);
    setGirdiMetni("");
    setGonderiliyor(true);

    try {
      const yanit = await aiApi.sohbetEt(metin);
      setMesajlar((onceki) => [...onceki, { rol: "asistan", metin: yanit }]);
    } catch (hata) {
      setMesajlar((onceki) => [
        ...onceki,
        { rol: "asistan", metin: apiHataMesaji(hata, "Şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.") },
      ]);
    } finally {
      setGonderiliyor(false);
      setTimeout(() => sonElemanRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }

  return (
    <>
      <div className="fixed bottom-5 right-5 z-40">
        <Dugme
          varyant="birincil"
          boyut="simge"
          className="h-14 w-14 rounded-full shadow-xl"
          onClick={() => setAcikMi((v) => !v)}
          aria-label="Yapay Zekâ Asistanını Aç/Kapat"
        >
          {acikMi ? <X size={22} /> : <Bot size={22} />}
        </Dugme>
      </div>

      <AnimatePresence>
        {acikMi && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 z-40 flex h-[28rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl cam-kart shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b border-kenarlik px-4 py-3">
              <Sparkles className="text-birincil-500" size={18} />
              <div>
                <p className="text-sm font-semibold text-metin">Belediye Asistanı</p>
                <p className="text-xs text-metin-ikincil">Kapaklı Belediyesi Yapay Zekâ Desteği</p>
              </div>
            </div>

            {!kullanici ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <p className="text-sm text-metin-ikincil">
                  Asistanla sohbet etmek için giriş yapmanız gerekiyor.
                </p>
                <Link href="/giris">
                  <Dugme varyant="birincil">Giriş Yap</Dugme>
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
                  {mesajlar.map((mesaj, i) => (
                    <div
                      key={i}
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                        mesaj.rol === "kullanici"
                          ? "ml-auto bg-birincil-600 text-white"
                          : "bg-black/5 text-metin dark:bg-white/10"
                      }`}
                    >
                      {mesaj.metin}
                    </div>
                  ))}
                  {gonderiliyor && (
                    <div className="w-fit rounded-2xl bg-black/5 px-3 py-2 text-sm text-metin-ikincil dark:bg-white/10">
                      Yazıyor...
                    </div>
                  )}
                  <div ref={sonElemanRef} />
                </div>

                <form onSubmit={mesajGonder} className="flex items-center gap-2 border-t border-kenarlik p-3">
                  <Girdi
                    value={girdiMetni}
                    onChange={(e) => setGirdiMetni(e.target.value)}
                    placeholder="Bir soru sorun..."
                    disabled={gonderiliyor}
                  />
                  <Dugme type="submit" varyant="birincil" boyut="simge" disabled={gonderiliyor}>
                    <Send size={16} />
                  </Dugme>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
