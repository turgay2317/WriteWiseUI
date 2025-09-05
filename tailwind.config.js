/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{html,ts}", "./src/**/*.html", "./src/**/*.ts"],
  theme: {
    extend: {
      colors: {
        // Ana renkler - Landing page ile uyumlu
        sage: '#a0bfb9',          // Ana yeşil-gri rengi
        'sage-hover': '#8fa9a3',
        'sage-pressed': '#7e9892',
        coolGray: '#c0cfd0',      // Soğuk gri
        warmGreen: '#80b48c',     // Sıcak yeşil accent
        'warmGreen-hover': '#6fa278',
        
        // Primary renkleri warm green yapıyoruz
        primary: '#80b48c',
        'primary-hover': '#6fa278',
        'primary-pressed': '#5e9167',
        'primary-disabled': 'rgba(128,180,140,0.4)',
        
        // Text ve background renkleri
        espresso: '#1a1a1a',       // Koyu metin
        mediumText: '#4a4a4a',
        lightText: '#666666',
        infoSurface: '#e8f3f0',    // Sage-based açık yüzey
        baseBg: '#f5f5f5',         // Açık gri arka plan
        borderGray: '#d1ddd9',     // Sage-based border
        
        // Status renkleri
        success: '#80b48c',
        error: '#e23b3b',
        info: '#7aa5f9',
        
        // Dark scheme (opsiyonel)
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
        'soft-card': '0 4px 20px rgba(160,191,185,0.08)',
        'soft-card-lg': '0 8px 30px rgba(160,191,185,0.15)',
        'soft-card-hover': '0 12px 40px rgba(160,191,185,0.18)'
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
