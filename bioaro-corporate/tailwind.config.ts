import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        bioaro: {
          bg: "#030712",
          surface: "#071322",
          card: "#0B1627",
          elevated: "#0E1B30",
          alt: "#091526",
          shell: "#0A101A",
          graphite: "#131C28",
          steel: "#334357",
          blue: "#00B7FF",
          cyan: "#2FD3FF",
          glow: "#5CCEFF",
          soft: "#75E3FF",
          text: "#C9D5E6",
          muted: "#92A7C2",
          disabled: "#6B7C92",
        },
      },
      boxShadow: {
        ambient: "0 18px 60px rgba(0, 0, 0, 0.34)",
        ambientHover: "0 28px 90px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0,183,255,0.06)",
        edge: "inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 1px rgba(0,183,255,0.08)",
        lift: "0 30px 80px rgba(0,0,0,0.55), 0 4px 24px rgba(0,183,255,0.08), inset 0 1px 0 rgba(255,255,255,0.07)",
        core: "0 0 80px rgba(0,183,255,0.22), 0 0 160px rgba(0,183,255,0.1)",
        button: "0 8px 30px rgba(0,183,255,0.28), inset 0 1px 0 rgba(255,255,255,0.35)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(ellipse 90% 60% at 72% 30%, rgba(0, 183, 255, 0.12), transparent 55%), radial-gradient(ellipse 60% 45% at 12% 18%, rgba(47, 211, 255, 0.07), transparent 60%), linear-gradient(165deg, #081524 0%, #071322 30%, #050c17 62%, #030712 100%)",
        "section-radial":
          "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(0, 183, 255, 0.07), transparent 60%), linear-gradient(180deg, #091526 0%, #050c17 55%, #030712 100%)",
        "section-deep":
          "radial-gradient(ellipse 80% 55% at 50% 42%, rgba(0, 183, 255, 0.1), transparent 62%), linear-gradient(180deg, #030712 0%, #081524 45%, #030712 100%)",
        "grid-fade":
          "linear-gradient(rgba(117, 227, 255, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(117, 227, 255, 0.06) 1px, transparent 1px)",
        "scanline-fade":
          "linear-gradient(180deg, rgba(255,255,255,0.045) 0, rgba(255,255,255,0) 1px)",
        "card-sheen":
          "linear-gradient(180deg, rgba(21,37,62,0.92) 0%, rgba(11,22,39,0.94) 40%, rgba(7,13,24,0.98) 100%)",
        "card-lit":
          "radial-gradient(ellipse 120% 70% at 50% -20%, rgba(0,183,255,0.14), transparent 60%), linear-gradient(180deg, rgba(21,37,62,0.92) 0%, rgba(9,17,31,0.97) 100%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        floatSoft: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseLine: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.8" },
        },
        drift: {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(8px, -6px, 0)" },
          "100%": { transform: "translate3d(0, 0, 0)" },
        },
        beam: {
          "0%, 100%": { opacity: "0.25" },
          "50%": { opacity: "0.65" },
        },
        dashFlow: {
          to: { strokeDashoffset: "-120" },
        },
        orbitSlow: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        coreBreath: {
          "0%, 100%": { opacity: "0.75", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.04)" },
        },
        riseParticle: {
          "0%": { transform: "translateY(0)", opacity: "0" },
          "12%": { opacity: "0.7" },
          "85%": { opacity: "0.4" },
          "100%": { transform: "translateY(-140px)", opacity: "0" },
        },
      },
      animation: {
        float: "float 14s ease-in-out infinite",
        floatSoft: "floatSoft 9s ease-in-out infinite",
        pulseLine: "pulseLine 7s ease-in-out infinite",
        drift: "drift 18s ease-in-out infinite",
        beam: "beam 8s ease-in-out infinite",
        dashFlow: "dashFlow 9s linear infinite",
        orbitSlow: "orbitSlow 60s linear infinite",
        orbitSlower: "orbitSlow 90s linear infinite reverse",
        coreBreath: "coreBreath 8s ease-in-out infinite",
        riseParticle: "riseParticle 11s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
