/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      borderRadius: {
        0: 0, // 0px
        1: "0.25rem", // 4px
        2: "0.5rem", // 8px
        3: "0.75rem", // 12px
        4: "1rem", // 16px
        5: "1.25rem", // 20px
        6: "1.5rem", // 24px
        7: "1.75rem", // 28px
        8: "2rem", // 32px
        9: "2.25rem", // 36px
        10: "2.5rem", // 40px
        11: "2.75rem", // 44px
        12: "3rem", // 48px
        13: "3.25rem", // 52px
        14: "3.5rem", // 56px
        15: "3.75rem", // 60px
        16: "4rem", // 64px
        17: "4.25rem", // 68px
        18: "4.5rem", // 72px
        19: "4.75rem", // 76px
        20: "5rem", // 80px
      },
    },
  },
  plugins: [
    plugin(({ addBase, theme }) => {
      addBase({
        html: { color: theme("colors.slate.800") },
      });
    }),
  ],
};
