import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#123C2E",
        leaf: "#2E9F64",
        mint: "#EAF7EF",
        canvas: "#F7F8F5",
        ink: "#17231E",
      },
      boxShadow: {
        card: "0 12px 35px rgba(18, 60, 46, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
