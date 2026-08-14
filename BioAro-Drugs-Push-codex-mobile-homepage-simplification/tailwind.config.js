/** @type {import('tailwindcss').Config} */

/*
 * Migration note: the legacy token NAMES (cream / ink / forest / gold / sand) are
 * deliberately kept and REMAPPED to the new palette rather than deleted. Tailwind
 * silently drops unknown classes, so removing a token turns every call site into a
 * no-op with no build error — that bug is already live (ContactSupport referenced
 * forest-50/100/900, which never existed, so those elements rendered invisible).
 * Remapping flips ~140 existing usages to the new system with zero call-site edits,
 * and the names get cleaned up progressively.
 */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Ground. Was #F8F6F4; now the homepage ivory.
        cream: { DEFAULT: "#F7F4EF", 50: "#FBF9F6", 100: "#F7F4EF", 200: "#F0EBE3" },
        ivory: { DEFAULT: "#F7F4EF", 50: "#FBF9F6", 200: "#F0EBE3" },

        // Ink. Was #1B1A17; now the homepage warm charcoal, plus the muted steps
        // the homepage actually uses for secondary and tertiary copy.
        ink: {
          DEFAULT: "#1C1917",
          900: "#141210",
          800: "#1C1917",
          700: "#4A4F57",
          600: "#545961",
          400: "#6B7078",
        },

        // Accent. `forest` is remapped to ember so all 121 existing usages become
        // the new accent in one step. The real forest green survives as `longevity`.
        forest: {
          DEFAULT: "#C1462A",
          400: "#D4674C",
          600: "#C1462A",
          700: "#A63A21",
          // These three never existed and were being used anyway — see note above.
          50: "rgba(193,70,42,0.08)",
          100: "rgba(193,70,42,0.14)",
          900: "#8E3019",
        },
        ember: { DEFAULT: "#C1462A", 600: "#A63A21", 700: "#8E3019" },

        // Hairlines. `sand` was #E2DED2.
        sand: { DEFAULT: "#E1DED8" },
        line: { DEFAULT: "#E1DED8", strong: "#D6D1C8" },

        // The four health domains from the homepage.
        clarity: { DEFAULT: "#3B54C4" },
        strength: { DEFAULT: "#C1462A" },
        recovery: { DEFAULT: "#0E767A" },
        longevity: { DEFAULT: "#2A6347" },

        gold: { DEFAULT: "#B08A4E", 400: "#C7923A", 600: "#8E6A35" },
      },
      fontFamily: {
        // Two faces, both self-hosted (see the CSP note in src/index.css).
        // `display` drives h1-h6 via the base rule plus the 17 explicit
        // `font-display` call sites; `body` is everything else.
        display: ["Plus Jakarta Sans", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        body: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        // Declared, deliberately NOT loaded as a webfont: the app contains zero
        // <code>/<pre>/<kbd>/font-mono usage, so shipping JetBrains Mono would fetch
        // bytes nothing renders. The explicit stack avoids Chrome's bare `monospace`
        // default, a 13px Courier-class face that looks broken beside the rest.
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontWeight: {
        // Plus Jakarta Sans stops at 800; there is no 900. `font-black` is remapped
        // rather than removed so the 15 existing call sites keep working and land on
        // the heaviest weight that actually exists instead of synthesizing one.
        black: "800",
      },
      backdropBlur: { xs: "2px" },
      boxShadow: {
        // Warm-tinted to match the page ground rather than a neutral black.
        glass: "0 18px 44px -26px rgba(28,25,23,0.26)",
        "glass-lg": "0 28px 60px -46px rgba(28,25,23,0.45)",
      },
      borderRadius: { "4xl": "2rem" },
    },
  },
  plugins: [],
};
