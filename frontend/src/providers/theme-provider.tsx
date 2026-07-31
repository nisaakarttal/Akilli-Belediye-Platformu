"use client";

import * as React from "react";

type Tema = "light" | "dark";

interface ThemeContextValue {
  tema: Tema;
  temayiDegistir: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

const TEMA_ANAHTARI = "kb_tema";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [tema, setTema] = React.useState<Tema>("light");

  React.useEffect(() => {
    const kayitli = window.localStorage.getItem(TEMA_ANAHTARI) as Tema | null;
    const sistemKoyu = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTema(kayitli ?? (sistemKoyu ? "dark" : "light"));
  }, []);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", tema === "dark");
  }, [tema]);

  const temayiDegistir = React.useCallback(() => {
    setTema((onceki) => {
      const yeni = onceki === "dark" ? "light" : "dark";
      window.localStorage.setItem(TEMA_ANAHTARI, yeni);
      return yeni;
    });
  }, []);

  return <ThemeContext.Provider value={{ tema, temayiDegistir }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme, ThemeProvider içinde kullanılmalıdır.");
  return ctx;
}

/**
 * Hidrasyon öncesi tema flaşını önlemek için `<head>`'e eklenecek script.
 * Bkz. app/layout.tsx — <ThemeScript /> ilk render'dan önce çalışır.
 */
export function ThemeScript() {
  const kod = `
    try {
      var kayitli = localStorage.getItem("${TEMA_ANAHTARI}");
      var koyu = kayitli ? kayitli === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (koyu) document.documentElement.classList.add("dark");
    } catch (e) {}
  `;
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: kod }} />;
}
