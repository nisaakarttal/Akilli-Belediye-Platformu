"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, Loader2, MessageSquarePlus, Send, Sparkles, UserCheck, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { Dugme } from "@/components/ui/button";
import { Girdi } from "@/components/ui/input";
import { useKimlik } from "@/hooks/use-kimlik";
import { apiHataMesaji } from "@/lib/api";
import { aiApi } from "@/lib/api/ai";
import { cn } from "@/lib/utils";

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

const YAZIYOR_NOKTASI_GECIKMELERI_MS = [0, 150, 300];

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
    const metin = (metinGonder ?? girdiMetni).trim();
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
      {/* Yüzen açma/kapama düğmesi */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Dugme
            varyant="birincil"
            boyut="simge"
            className="h-14 w-14 rounded-full border-2 border-white/20 bg-gradient-to-r from-birincil-600 to-ikincil-500 shadow-2xl hover:shadow-birincil-500/25"
            onClick={() => setAcikMi((v) => !v)}
            aria-label="Yapay Zekâ Asistanını Aç/Kapat"
            aria-expanded={acikMi}
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
                  <span className="absolute -right-1 -top-1 flex h-3 w-3" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-basarili opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-basarili" />
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </Dugme>
        </motion.div>
      </div>

      {/* Sohbet penceresi */}
      <AnimatePresence>
        {acikMi && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ transformOrigin: "bottom right" }}
            role="dialog"
            aria-label="Yapay Zekâ Asistanı sohbet penceresi"
            className="fixed bottom-24 right-6 z-50 flex h-[32rem] w-[23rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-3xl border border-kenarlik bg-white/95 shadow-2xl backdrop-blur-md dark:bg-slate-900/95"
          >
            {/* Üst bilgi */}
            <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-birincil-600 via-birincil-700 to-ikincil-500 px-5 py-4 text-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur-md">
                  <Sparkles className="animate-pulse text-amber-300" size={20} aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold leading-none">Kent Asistanı</h3>
                    <span className="inline-flex items-center rounded-full border border-green-400/30 bg-green-500/20 px-2 py-0.5 text-[10px] font-medium text-green-100">
                      Çevrimiçi
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-white/80">Kapaklı Belediyesi AI Hizmeti</p>
                </div>
              </div>
            </div>

            {/* İçerik alanı */}
            {!kullanici ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-black/5 px-6 text-center dark:bg-white/5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-birincil-500/20 bg-birincil-500/10 text-birincil-600 shadow-sm">
                  <UserCheck size={28} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-metin">Giriş Yapılması Gerekiyor</h4>
                  <p className="mt-1 text-xs leading-relaxed text-metin-ikincil">
                    Yapay zekâ asistanıyla sohbet etmek ve kişiselleştirilmiş hizmet almak için lütfen
                    hesabınıza giriş yapın.
                  </p>
                </div>
                <Link href="/giris" className="w-full">
                  <Dugme varyant="birincil" className="mt-2 w-full">
                    Giriş Yap
                  </Dugme>
                </Link>
              </div>
            ) : (
              <>
                <div ref={sohbetAlaniRef} className="flex-1 space-y-3.5 overflow-y-auto p-4">
                  {mesajlar.map((mesaj, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={cn("flex", mesaj.rol === "kullanici" ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                          mesaj.rol === "kullanici"
                            ? "rounded-br-none bg-birincil-600 text-white"
                            : "rounded-bl-none border border-kenarlik bg-black/5 text-metin dark:bg-white/5"
                        )}
                      >
                        {mesaj.metin}
                      </div>
                    </motion.div>
                  ))}

                  {gonderiliyor && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                      role="status"
                      aria-label="Asistan yazıyor"
                    >
                      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-none border border-kenarlik bg-black/5 px-4 py-3 text-metin-ikincil dark:bg-white/5">
                        {YAZIYOR_NOKTASI_GECIKMELERI_MS.map((gecikme) => (
                          <span
                            key={gecikme}
                            className="h-2 w-2 animate-bounce rounded-full bg-birincil-500"
                            style={{ animationDelay: `${gecikme}ms` }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {mesajlar.length === 1 && !gonderiliyor && (
                  <div className="px-4 pb-2">
                    <p className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold text-metin-ikincil">
                      <MessageSquarePlus size={12} aria-hidden="true" /> Hızlı Sorular:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {HIZLI_SORULAR.map((soru) => (
                        <button
                          key={soru}
                          type="button"
                          onClick={() => mesajGonder(soru)}
                          className="rounded-xl border border-birincil-500/20 bg-birincil-500/10 px-2.5 py-1.5 text-left text-xs font-medium text-birincil-700 transition-colors hover:bg-birincil-500/20 dark:text-birincil-300"
                        >
                          {soru}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="flex items-center gap-2 border-t border-kenarlik bg-white/50 p-3 backdrop-blur-sm dark:bg-white/5"
                >
                  <Girdi
                    value={girdiMetni}
                    onChange={(e) => setGirdiMetni(e.target.value)}
                    placeholder="Soru veya talebinizi yazın..."
                    disabled={gonderiliyor}
                    aria-label="Asistana mesaj yazın"
                    className="text-sm"
                  />
                  <Dugme
                    type="submit"
                    varyant="birincil"
                    boyut="simge"
                    disabled={gonderiliyor || !girdiMetni.trim()}
                    className="shrink-0"
                    aria-label="Gönder"
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
