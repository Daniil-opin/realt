import { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        blue: "var(--blue)",
        greyblue: "var(--grey-blue)",
        lightblue: "var(--light-blue)",
        smooth: "var(--smooth-blue)",
      },
      container: {
        padding: "1.5rem",
        center: true,
      },
      screens: {
        "3xl": "1760px",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
