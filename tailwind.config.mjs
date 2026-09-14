/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#06060a",
          soft: "#0a0a14",
          card: "#0f0f1a",
          elevated: "#14142a",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.07)",
          hover: "rgba(255,255,255,0.14)",
          accent: "rgba(139,92,246,0.4)",
        },
        text: {
          DEFAULT: "#f1f0fa",
          muted: "#908eb0",
          dim: "#5d5b7a",
        },
        accent: {
          violet: "#8b5cf6",
          cyan: "#06b6d4",
          pink: "#ec4899",
          amber: "#f59e0b",
        },
        glow: {
          violet: "rgba(139,92,246,0.35)",
          cyan: "rgba(6,182,212,0.3)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        full: "9999px",
      },
      boxShadow: {
        "glow-violet":
          "0 0 40px rgba(139,92,246,0.3), 0 0 80px rgba(139,92,246,0.1)",
        "glow-cyan": "0 0 40px rgba(6,182,212,0.3)",
        "glow-pink": "0 0 40px rgba(236,72,153,0.3)",
        card: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)",
        "card-hover":
          "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out both",
        "fade-up": "fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "fade-down": "fadeDown 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "scale-in": "scaleIn 0.4s cubic-bezier(0.22,1,0.36,1) both",
        "slide-up": "slideUp 0.5s cubic-bezier(0.22,1,0.36,1) both",
        shimmer: "shimmer 1.8s infinite linear",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "orb-drift-a": "orbDriftA 20s ease-in-out infinite alternate",
        "orb-drift-b": "orbDriftB 25s ease-in-out infinite alternate",
        aurora: "aurora 12s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeDown: {
          from: { opacity: "0", transform: "translateY(-16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.92)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        slideUp: {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSoft: {
          "0%,100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        orbDriftA: {
          from: { transform: "translate(0,0) scale(1)" },
          to: { transform: "translate(80px,50px) scale(1.12)" },
        },
        orbDriftB: {
          from: { transform: "translate(0,0) scale(1.05)" },
          to: { transform: "translate(-60px,-40px) scale(0.92)" },
        },
        aurora: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      backgroundImage: {
        "grad-primary": "linear-gradient(135deg, #8b5cf6, #06b6d4)",
        "grad-warm": "linear-gradient(135deg, #ec4899, #f59e0b)",
        "grad-cool": "linear-gradient(135deg, #06b6d4, #8b5cf6)",
        "grad-aurora":
          "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 25%, #8b5cf6 50%, #06b6d4 75%, #8b5cf6 100%)",
        noise:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22,1,0.36,1)",
        spring: "cubic-bezier(0.34,1.4,0.64,1)",
      },
      spacing: {
        "nav-h": "64px",
      },
      zIndex: {
        nav: "90",
        modal: "200",
        toast: "300",
        cursor: "1",
      },
    },
  },
  plugins: [],
};
