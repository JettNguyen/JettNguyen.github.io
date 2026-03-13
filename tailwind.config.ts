import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.css"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#09090b",
        panel: "#101014",
        line: "#1f1f25",
        text: "#e6e6eb",
        muted: "#9ea0ad",
        accent: "#ef4444",
        "accent-soft": "#f87171"
      },
      backgroundImage: {
        "lab-grid": "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
        "lab-glow": "radial-gradient(circle at 20% 20%, rgba(239,68,68,0.16), transparent 38%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.08), transparent 35%)"
      },
      boxShadow: {
        "accent-sm": "0 0 0 1px rgba(239,68,68,0.35), 0 6px 30px rgba(239,68,68,0.13)"
      }
    }
  },
  plugins: []
};

export default config;
