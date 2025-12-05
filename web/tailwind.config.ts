import type { Config } from 'tailwindcss';
import tailwindcss_safe_area from 'tailwindcss-safe-area';

const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  prefix: '',
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '900px', // Custom: Two-column layout for device frame + promotional points
      xl: '1280px',
      '2xl': '1536px',
    },
    fontFamily: {
      sans: ['Plus Jakarta Sans', 'Manrope', 'sans-serif'],
    },

    extend: {
      boxShadow: {
        buttonShadow: '0px 3px 4px 0px rgba(188, 187, 187, 0.35)',
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },

      colors: {
        secondary: '#F5F5F5',
        accent: '#2C4156',
        accentElevated: '#41526a',
        primary: '#1E2E3F',
        primaryElevated: '#2C4156',
        primaryDark: '#1A2632',
        warn: '#FF2929',
        highlight: '#e6de4d',
        clickHighLight: '#e6de4d',
        cardBorder: '#415970',
      },

      animation: {
        'accordion-left': 'accordion-down 0.3s ease-out',
        fadeInTranslateY: 'fadeInTranslateY 0.22s ease-out',
        myAnim: 'myAnim 0.3s ease-in-out forwards',
        slideInRight: 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInTranslateY: {
          '0%': { opacity: '0', transform: 'translateY(120px)' },
          '70%': { opacity: '0.4', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        myAnim: {
          '0%': {
            'animation-timing-function': 'ease-in',
            opacity: '1',
            transform: 'translateY(45px)',
          },
          '50%': {
            'animation-timing-function': 'ease-out',
            transform: 'translateY(-20px)', // Moves back to the original position once
          },
          '75%': {
            'animation-timing-function': 'ease-in',
            transform: 'translateY(10px)', // Slight bounce upward
          },
          '100%': {
            'animation-timing-function': 'ease-out',
            opacity: '1',
            transform: 'translateY(0px)', // Final stop after bounce
          },
        },
      },
    },
  },
  plugins: [tailwindcss_safe_area],
} satisfies Config;

export default config;
