/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{html,ts}", "./src/**/*.html", "./src/**/*.ts"],
  theme: {
    extend: {
      colors: {
        primary: '#ea940c',
        'primary-hover': '#c57a06',
        'primary-pressed': '#a76404',
        'primary-disabled': 'rgba(234,148,12,0.4)',
        espresso: '#1f0104',
        infoSurface: '#c8d7f6',
        baseBg: '#f8f9fa',
        borderGray: '#b9bdc7',
        success: '#1faa52',
        error: '#e23b3b',
        info: '#7aa5f9',
        // Dark scheme
        darkBg: '#101214',
        darkCard: '#15181d',
        darkText: '#eef2f6',
        darkSecondary: '#aeb7c2',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'soft-card': '0 6px 18px rgba(31,1,4,0.06)',
        'soft-card-lg': '0 10px 30px rgba(31,1,4,0.08)'
      },
      borderRadius: {
        card: '18px',
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(-8px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.4' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-700px 0' },
          '100%': { backgroundPosition: '700px 0' },
        }
      },
      animation: {
        'slide-in': 'slide-in 180ms ease-out both',
        ripple: 'ripple 500ms ease-out',
        shimmer: 'shimmer 1.2s linear infinite',
      }
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
