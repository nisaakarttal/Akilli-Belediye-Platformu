import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Belediye kimlik renkleri
        birincil: {
          DEFAULT: "#2563EB",
          50: "#EFF6FF",
          100: "#DBEAFE",
          500: "#2563EB",
          600: "#1D4ED8",
          700: "#1E40AF",
        },
        ikincil: {
          DEFAULT: "#0EA5E9",
          500: "#0EA5E9",
        },
        basarili: "#22C55E",
        uyari: "#F59E0B",
        tehlike: "#EF4444",
        "zemin-acik": "#F8FAFC",
        "zemin-koyu": "#0F172A",
        // CSS değişkeni tabanlı, karanlık/aydınlık moda göre otomatik değişen renkler
        // (bkz. src/styles/globals.css içindeki :root ve .dark tanımları)
        zemin: "rgb(var(--zemin) / <alpha-value>)",
        "zemin-ikincil": "rgb(var(--zemin-ikincil) / <alpha-value>)",
        metin: "rgb(var(--metin) / <alpha-value>)",
        "metin-ikincil": "rgb(var(--metin-ikincil) / <alpha-value>)",
        kenarlik: "rgb(var(--kenarlik) / <alpha-value>)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        cam: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        "cam-koyu": "0 8px 32px 0 rgba(0, 0, 0, 0.35)",
      },
      keyframes: {
        "bulut-kaydir": {
          "0%": { transform: "translateX(-10%)" },
          "100%": { transform: "translateX(110%)" },
        },
        "yumusak-yukari": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "bulut-kaydir-yavas": "bulut-kaydir 60s linear infinite",
        "bulut-kaydir-hizli": "bulut-kaydir 35s linear infinite",
        "arac-kaydir-yavas": "bulut-kaydir 22s linear infinite",
        "arac-kaydir-hizli": "bulut-kaydir 16s linear infinite",
        "yumusak-yukari": "yumusak-yukari 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
