import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pine: "#12302A",
        mist: "#F0F6F1",
        sage: "#B4CABC",
        lime: "#DCF5A4",
        coral: "#FFB09E",
        amber: "#F6CF7F",
      },
    },
  },
  plugins: [],
};

export default config;
