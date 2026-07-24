"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles, X, Loader2, MessageSquarePlus, UserCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";

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
    "Merhaba! Ben Kapaklı Belediyesi Yapay Zekâ Asistanıyım. Belediye hizmetleri, başvuru süreçleri veya etkinlikler hakkında size nasıl yardımcı olabilirim?",
};

const HIZLI_SORULAR = [
  "Başvuru/Şikayet nasıl oluşturabilirim?",
  "E-Belediye hizmetleri nelerdir?",
  "En yakın belediye tesisi nerede?",
];

export function YuzenAsistan() {
  const { kullanici } = useKimlik();
  const [acikMi, setAcikMi] = useState(false);
  const [mesajlar, setMesajlar] = useState<SohbetMesaji[]>([KARSILAMA_MESAJI]);
  const [girdiMetni, setGirdiMetni] = useState("");
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const sohbetAlaniRef = useRef<HTMLDivElement>(null);

  // Yeni mesaj eklendiğinde otomatik alta kaydır
  useEffect(() => {
    if (acikMi) {
      sohbetAlaniRef.current?.scrollTo({
        top: sohbetAlaniRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [mesajlar, gonderiliyor, acikMi]);

  async function mesajGonder(metinGonder?: string) {
    const metin = (metinGonder || girdiMetni).trim();
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
        {
          rol: "asistan",
          metin: apiHataMesaji(hata, "Şu anda bağlantı kurulamadı. Lütfen daha sonra tekrar deneyin."),
        },
      ]);
    } finally {
      setGonderiliyor(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mesajGonder();
  }

  return (
    <>
      {/* Yüzen Açma/Kapama Butonu */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Dugme
            varyant="birincil"
            boyut="simge"
            className="h-14 w-14 rounded-full bg-gradient-to-r from-birincil-600 to-ikincil-600 shadow-2xl hover:shadow-birincil-500/25 border-2 border-beyaz/20"
            onClick={() => setAcikMi((v) => !v)}
            aria-label="Yapay Zekâ Asistanını Aç/Kapat"
          >
            <AnimatePresence mode="wait" initial={false}>
              {acikMi ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X size={24} className="text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="bot"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="relative"
                >
                  <Bot size={26} className="text-white" />
                  {/* Canlılık Bildirimi / Işık */}
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-basari-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-basari-500 border-2 border-white"></span>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </Dugme>
        </motion.div>
      </div>

      {/* Sohbet Penceresi */}
      <AnimatePresence>
        {acikMi && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 flex h-[32rem] w-[23rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-3xl border border-border/60 bg-beyaz/95 shadow-2xl backdrop-blur-md dark:bg-arkaplan/95"
          >
            {/* Header / Üst Bilgi */}
            <div className="flex items-center justify-between border-b border-border/50 bg-gradient-to-r from-birincil-600 via-birincil-700 to-ikincil-600 px-5 py-4 text-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md border border-white/20">
                  <Sparkles className="text-uyari-300 animate-pulse" size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold leading-none">Kent Asistanı</h3>
                    <span className="inline-flex items-center rounded-full bg-basari-500/20 px-2 py-0.5 text-[10px] font-medium text-basari-200 border border-basari-400/30">
                      Çevrimiçi
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-white/80 font-medium">Kapaklı Belediyesi AI Hizmeti</p>
                </div>
              </div>
            </div>

            {/* İçerik Alanı */}
            {!kullanici ? (
              /* Giriş Yapılmamış Durum */
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center bg-arkaplan-ikincil/20">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-birincil-50 text-birincil-600 border border-birincil-100 shadow-sm">
                  <UserCheck size={28} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-metin-birincil">Giriş Yapılması Gerekiyor</h4>
                  <p className="mt-1 text-xs text-metin-ikincil leading-relaxed">
                    Yapay zekâ asistanıyla sohbet etmek ve kişiselleştirilmiş hizmet almak için lütfen hesabınıza giriş yapın.
                  </p>
                </div>
                <Link href="/giris" className="w-full">
                  <Dugme varyant="birincil" className="w-full mt-2 bg-birincil-600 hover:bg-ikincil-600 transition-colors shadow-md">
                    Giriş Yap
                  </Dugme>
                </Link>
              </div>
            ) : (
              /* Sohbet Alanı */
              <>
                <div ref={sohbetAlaniRef} className="flex-1 space-y-3.5 overflow-y-auto p-4 scrollbar-thin">
                  {mesajlar.map((mesaj, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${mesaj.rol === "kullanici" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                          mesaj.rol === "kullanici"
                            ? "bg-birincil-600 text-white rounded-br-none"
                            : "bg-arkaplan-ikincil text-metin-birincil border border-border/50 rounded-bl-none"
                        }`}
                      >
                        {mesaj.metin}
                      </div>
                    </motion.div>
                  ))}

                  {/* Yazıyor Animasyonu */}
                  {gonderiliyor && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-none bg-arkaplan-ikincil border border-border/50 px-4 py-3 text-metin-ikincil">
                        <span className="h-2 w-2 rounded-full bg-birincil-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-2 w-2 rounded-full bg-birincil-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-2 w-2 rounded-full bg-birincil-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Hızlı Sorular (Öneriler) */}
                {mesajlar.length === 1 && !gonderiliyor && (
                  <div className="px-4 pb-2">
                    <p className="text-[11px] font-semibold text-metin-ikincil mb-1.5 flex items-center gap-1">
                      <MessageSquarePlus size={12} /> Hızlı Sorular:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {HIZLI_SORULAR.map((soru, idx) => (
                        <button
                          key={idx}
                          onClick={() => mesajGonder(soru)}
                          className="text-left text-xs bg-birincil-50 text-birincil-700 hover:bg-birincil-100 hover:text-birincil-800 transition-colors border border-birincil-200/60 rounded-xl px-2.5 py-1.5 font-medium"
                        >
                          {soru}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Girdi Formu */}
                <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border/60 bg-beyaz/50 p-3 backdrop-blur-sm">
                  <Girdi
                    value={girdiMetni}
                    onChange={(e) => setGirdiMetni(e.target.value)}
                    placeholder="Soru veya talebinizi yazın..."
                    disabled={gonderiliyor}
                    className="border-border focus:border-uyari-400 focus:ring-uyari-100 text-sm"
                  />
                  <Dugme
                    type="submit"
                    varyant="birincil"
                    boyut="simge"
                    disabled={gonderiliyor || !girdiMetni.trim()}
                    className="bg-birincil-600 hover:bg-ikincil-600 transition-colors shrink-0"
                  >
                    {gonderiliyor ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
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