import type { Config } from 'tailwindcss';
import tailwindcss_safe_area from 'tailwindcss-safe-area';

const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  prefix: '',
  theme: {
    fontFamily: {
      sans: [
        'Plus Jakarta Sans',
        'Manrope',
        'Inter',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'sans-serif',
      ],
    },

    extend: {
      boxShadow: {
        buttonShadow: '0px 3px 4px 0px rgba(188, 187, 187, 0.35)',
      },

      colors: {
        secondary: '#E0FDDCFF',
        // accent: '#376E4EE6',
        accent: '#2C4156',
        accentElevated: '#41526a',
        primary: '#1E2E3F',
        primaryElevated: '#2C4156',
        primaryDark: '#1A2632',
        warn: '#FF2929',
        highlight: '#e6de4d',
        clickHighLight: '#e6de4d',
      },

      animation: {
        'accordion-left': 'accordion-down 0.3s ease-out',
        fadeInTranslateY: 'fadeInTranslateY 0.22s ease-out',
        premiumModal: 'premiumModal 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        myAnim: 'myAnim 0.3s ease-in-out forwards',
        ripple: 'ripple 0.6s ease-out',
      },
      keyframes: {
        ripple: {
          '0%': {
            transform: 'scale(0)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '0',
          },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        fadeInTranslateY: {
          '0%': { opacity: '0', transform: 'translateY(120px)' },
          '70%': { opacity: '0.4', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        premiumModal: {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
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
