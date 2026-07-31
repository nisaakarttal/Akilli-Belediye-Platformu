"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, Loader2, Send, Sparkles, User, X, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiHataMesaji } from "@/lib/api";
import { aiApi } from "@/lib/api/ai";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

interface SohbetMesaji {
  rol: "kullanici" | "asistan";
  metin: string;
}

const KARSILAMA_MESAJI: SohbetMesaji = {
  rol: "asistan",
  metin: "Merhaba! Ben Kapaklı Belediyesi Yapay Zekâ Asistanıyım. Belediye hizmetleri, başvuru süreçleri veya etkinlikler hakkında size nasıl yardımcı olabilirim?",
};

const HIZLI_SORULAR = [
  "Talep oluştur",
  "Su faturası",
  "E-Belediye",
  "Kültür etkinlikleri",
];

export function YuzenAsistan() {
  const { kullanici } = useAuth();
  const [acikMi, setAcikMi] = useState(false);
  const [mesajlar, setMesajlar] = useState<SohbetMesaji[]>([KARSILAMA_MESAJI]);
  const [girdiMetni, setGirdiMetni] = useState("");
  const [gonderiliyor, setGonderiliyor] = useState(false);

  const sohbetAlaniRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (acikMi) {
      sohbetAlaniRef.current?.scrollTo({
        top: sohbetAlaniRef.current.scrollHeight,
        behavior: "smooth",
      });
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [mesajlar, gonderiliyor, acikMi]);

  const mesajGonder = useCallback(
    async (metinGonder?: string) => {
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
            metin: apiHataMesaji(
              hata,
              "Şu anda bağlantı kurulamadı. Lütfen daha sonra tekrar deneyin."
            ),
          },
        ]);
      } finally {
        setGonderiliyor(false);
      }
    },
    [girdiMetni, gonderiliyor]
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mesajGonder();
  }

  return (
    <>
      {/* Premium Floating Trigger Button with Pulsing Glow */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}>
          <Button
            variant="primary"
            size="icon"
            className="relative h-16 w-16 rounded-full shadow-[0_10px_30px_rgba(79,70,229,0.4)] bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 border border-white/30 text-white transition-all duration-300 hover:shadow-[0_15px_40px_rgba(79,70,229,0.6)] group"
            onClick={() => setAcikMi((v) => !v)}
            aria-label="Yapay Zekâ Asistanını Aç/Kapat"
            aria-expanded={acikMi}
          >
            <span className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-25 pointer-events-none" />
            <Bot size={28} className="transition-transform duration-300 group-hover:rotate-12" />
          </Button>
        </motion.div>
      </div>

      {/* Master Glassmorphism Chat Window */}
      <AnimatePresence>
        {acikMi && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.90 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.90 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            style={{ transformOrigin: "bottom right" }}
            role="dialog"
            aria-label="Yapay Zekâ Asistanı sohbet penceresi"
            className="fixed bottom-24 right-6 z-50 flex h-[36rem] w-[25rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-[2rem] border border-white/20 bg-slate-950/85 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          >
            {/* Elite Header */}
            <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-4 bg-gradient-to-r from-indigo-900/50 via-slate-900/50 to-purple-900/50 text-white">
              <div className="absolute inset-0 bg-white/[0.02] pointer-events-none" />
              <div className="relative flex items-center gap-3">
                <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-inner">
                  <Bot size={22} className="text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold flex items-center gap-1.5 text-sm tracking-wide text-white">
                    Kapaklı AI <Sparkles size={14} className="text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                  </h3>
                  <p className="text-[11px] text-indigo-200/70 font-medium">Yeni Nesil Belediye Asistanı</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => setMesajlar([KARSILAMA_MESAJI])}
                  title="Sohbeti Sıfırla"
                  aria-label="Sohbeti sıfırla"
                >
                  <RefreshCw size={15} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => setAcikMi(false)}
                  aria-label="Sohbet penceresini kapat"
                >
                  <X size={18} />
                </Button>
              </div>
            </div>

            {/* Content Area */}
            {!kullanici ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center bg-gradient-to-b from-transparent via-slate-900/40 to-slate-950">
                <div className="rounded-3xl bg-indigo-500/10 p-5 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                  <Bot size={36} />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-base font-bold text-white tracking-wide">
                    Giriş Yapılması Gerekiyor
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-400 max-w-[260px]">
                    Size özel kapıdan geçmek, akıllı asistanla kişiselleştirilmiş işlemler yapmak için giriş yapın.
                  </p>
                </div>
                <Link href="/giris" className="w-full">
                  <Button variant="primary" className="w-full rounded-2xl h-11 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium shadow-lg shadow-indigo-600/30 transition-all">
                    Giriş Yap
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {/* Chat Message Stream */}
                <div
                  ref={sohbetAlaniRef}
                  className="flex-1 overflow-y-auto space-y-4 p-5 relative scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
                >
                  {/* Subtle Background Aurora Glows */}
                  <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

                  {mesajlar.length === 1 && (
                    <div className="flex flex-col items-center justify-center h-full text-center py-4 relative z-10">
                      <div className="rounded-3xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 p-4 text-indigo-300 mb-3 border border-indigo-500/30 shadow-xl backdrop-blur-md">
                        <Bot size={30} />
                      </div>
                      <h4 className="font-bold text-sm mb-1 text-white tracking-wide">
                        Nasıl Yardımcı Olabilirim?
                      </h4>
                      <p className="text-xs text-slate-400 mb-5 max-w-[240px] leading-relaxed">
                        Hızlı konulardan seçim yapın veya merak ettiğinizi sorun.
                      </p>

                      <div className="flex flex-wrap gap-2 justify-center max-w-[280px]">
                        {HIZLI_SORULAR.map((soru) => (
                          <motion.button
                            key={soru}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            type="button"
                            onClick={() => mesajGonder(soru)}
                            className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-slate-300 transition-all hover:bg-indigo-600 hover:text-white hover:border-indigo-500 shadow-sm backdrop-blur-sm"
                          >
                            {soru}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {mesajlar.length > 1 &&
                    mesajlar.map((mesaj, i) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i}
                        className={cn(
                          "flex items-end gap-2.5 relative z-10",
                          mesaj.rol === "kullanici"
                            ? "justify-end"
                            : "justify-start"
                        )}
                      >
                        {mesaj.rol === "asistan" && (
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-white/10 text-indigo-400 shadow-sm">
                            <Bot size={15} />
                          </div>
                        )}
                        <div
                          className={cn(
                            "max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg backdrop-blur-md",
                            mesaj.rol === "kullanici"
                              ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-br-xs shadow-indigo-500/20"
                              : "bg-slate-900/90 border border-white/10 text-slate-200 rounded-bl-xs shadow-black/40"
                          )}
                        >
                          {mesaj.metin}
                        </div>
                        {mesaj.rol === "kullanici" && (
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
                            <User size={15} />
                          </div>
                        )}
                      </motion.div>
                    ))}

                  {gonderiliyor && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-end gap-2.5 justify-start relative z-10"
                      role="status"
                      aria-label="Asistan yazıyor"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-white/10 text-indigo-400">
                        <Bot size={15} />
                      </div>
                      <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-sm text-slate-400 shadow-lg backdrop-blur-md">
                        <Loader2 className="animate-spin text-indigo-400" size={15} />
                        <span className="text-xs font-medium tracking-wide">Yapay zekâ yanıt hazırlıyor...</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Master Input Control Panel */}
                <form
                  onSubmit={handleSubmit}
                  className="relative flex items-center gap-2.5 border-t border-white/10 bg-slate-950/90 p-3.5 backdrop-blur-xl"
                >
                  <Input
                    ref={inputRef}
                    value={girdiMetni}
                    onChange={(e) => setGirdiMetni(e.target.value)}
                    placeholder="Soru veya talebinizi yazın..."
                    disabled={gonderiliyor}
                    aria-label="Asistana mesaj yazın"
                    className="h-12 rounded-2xl border-white/10 bg-slate-900/80 text-white placeholder:text-slate-500 text-sm focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent transition-all shadow-inner"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="icon"
                    disabled={gonderiliyor || !girdiMetni.trim()}
                    className="h-12 w-12 rounded-2xl shrink-0 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-40 disabled:shadow-none"
                    aria-label="Gönder"
                  >
                    <Send size={18} />
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}