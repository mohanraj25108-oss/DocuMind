/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#08080D',
          secondary: '#0D0D14',
          elevated: '#12121B',
          card: '#15151F',
          input: '#101018',
        },
        border: {
          dark: '#272733',
          subtle: '#20202B',
          hover: '#514078',
        },
        violet: {
          primary: '#8B5CF6',
          bright: '#A78BFA',
          electric: '#A855F7',
          deep: '#6D28D9',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#B8B8C8',
          muted: '#85859A',
          disabled: '#5E5E70',
        },
        semantic: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#8B5CF6',
        },
        brand: {
          blue: '#8B5CF6',
          'blue-hover': '#7C3AED',
          'blue-light': '#1E1B4B',
          secondary: '#A855F7',
          purple: '#8B5CF6',
          green: '#10B981',
          yellow: '#F59E0B',
          red: '#EF4444',
          dark: '#08080D',
          light: '#F8FAFC',
          sidebar: '#0D0D14',
          'sidebar-active': '#8B5CF6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 10px 25px -5px rgba(139, 92, 246, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 25px rgba(139, 92, 246, 0.15)',
        'violet-glow': '0 0 20px rgba(139, 92, 246, 0.25)',
        'violet-glow-lg': '0 0 35px rgba(168, 85, 247, 0.35)',
        'input-focus': '0 0 0 2px rgba(139, 92, 246, 0.35)',
      }
    },
  },
  plugins: [],
}
