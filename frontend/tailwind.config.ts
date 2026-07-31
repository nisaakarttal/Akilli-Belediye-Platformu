import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1360px" }
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "system-ui", "sans-serif"]
      },
      colors: {
        background: "hsl(var(--background))",
        surface: "hsl(var(--surface))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        border: "hsl(var(--border))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#eef4fb",
          100: "#d7e6f5",
          200: "#aecceb",
          300: "#7fb0df",
          400: "#4a8ecd",
          500: "#1f6cb3",
          600: "#125294",
          700: "#0f4c81",
          800: "#0c3a63",
          900: "#0a2c4a",
          950: "#071d31"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        success: { DEFAULT: "#2e7d32", bg: "#e7f5e8" },
        warning: { DEFAULT: "#c77700", bg: "#fdf1de" },
        danger: { DEFAULT: "#c62839", bg: "#fbe7e9" },
        info: { DEFAULT: "#1e88d5", bg: "#e6f2fb" },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          active: "hsl(var(--sidebar-active))"
        }
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem"
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 30, 60, 0.04), 0 8px 24px -8px rgba(15, 30, 60, 0.10)",
        "card-hover": "0 4px 10px rgba(15, 30, 60, 0.06), 0 16px 32px -12px rgba(15, 30, 60, 0.16)",
        nav: "0 1px 0 rgba(15, 30, 60, 0.06)"
      },
      keyframes: {
        "fade-up": { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "scale-in": { "0%": { opacity: "0", transform: "scale(0.97)" }, "100%": { opacity: "1", transform: "scale(1)" } }
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both",
        "scale-in": "scale-in 0.3s cubic-bezier(0.16,1,0.3,1) both"
      }
    }
  },
  plugins: []
};

export default config;
