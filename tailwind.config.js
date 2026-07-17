/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette derived from the Purebreed leaf mark.
        forest: {
          DEFAULT: "#0B3D22", // deep leaf shadow — dark backgrounds, footer
          50: "#EAF3EC",
          100: "#CFE4D5",
          400: "#1E7A45",
          700: "#123A22",
          900: "#08240F",
        },
        leaf: {
          DEFAULT: "#178A4C", // primary brand green (buttons, links, price)
          light: "#3FBE73",
        },
        mint: {
          DEFAULT: "#4ADE80", // bright gradient highlight from the logo
          soft: "#B7F3D0",
        },
        turmeric: {
          DEFAULT: "#E8A33D", // spice-inspired accent — sale badges, ratings
          soft: "#FBEAD0",
        },
        sage: {
          50: "#F6F8F4", // app background — cool, natural off-white
          100: "#EFF3EC",
        },
        ink: "#0A0A0A",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "ui-serif", "Georgia", "serif"],
        body: ["var(--font-manrope)", "ui-sans-serif", "system-ui", "sans-serif"],
        bangla: ["var(--font-hind-siliguri)", "ui-sans-serif", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,61,34,0.06), 0 8px 24px -12px rgba(11,61,34,0.18)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        riseIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        riseIn: "riseIn 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
