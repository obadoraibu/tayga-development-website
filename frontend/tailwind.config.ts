import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        taiga: {
          dark: '#143828',   /* Темный лесной (основа) */
          base: '#1F523D',   /* Базовый зеленый */
          light: '#E6F0EB',  /* Светлый фон */
          accent: '#D4F238', /* Лаймовый акцент (кнопки, ховеры) */
          gray: '#F3F4F6',   /* Подложки */
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],     // Текст
        heading: ['var(--font-montserrat)', 'sans-serif'], // Заголовки
      },
      container: {
        center: true,
        padding: '1.5rem',
        screens: {
          '2xl': '1400px',
        }
      }
    },
  },
  plugins: [],
};
export default config;

